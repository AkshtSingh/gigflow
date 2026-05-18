import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import { Lead, leadSources, leadStatuses } from '../models/Lead.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const leadBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  status: z.enum(leadStatuses),
  source: z.enum(leadSources)
});

const leadIdSchema = z.object({
  leadId: z.string().min(1)
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(leadStatuses).optional(),
  source: z.enum(leadSources).optional(),
  search: z.string().trim().optional(),
  sort: z.enum(['latest', 'oldest']).default('latest')
});

const ensureOwner = (req: Request): string => {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401);
  }

  return req.userId;
};

const buildLeadFilter = (ownerId: string | undefined | null, query: z.infer<typeof listQuerySchema>) => {
  const filter: Record<string, unknown> = {};

  if (ownerId) {
    filter.owner = ownerId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } }
    ];
  }

  return filter;
};

const getSortValue = (sort: 'latest' | 'oldest') => (sort === 'latest' ? -1 : 1);

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const owner = ensureOwner(req);
  const payload = leadBodySchema.parse(req.body);

  const lead = await Lead.create({
    ...payload,
    owner
  });

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const owner = ensureOwner(req);
  const { leadId } = leadIdSchema.parse(req.params);
  const payload = leadBodySchema.partial().parse(req.body);

  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError('Invalid lead id', 400);
  }

  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, owner },
    payload,
    { new: true, runValidators: true }
  );

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: lead
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const owner = ensureOwner(req);
  const { leadId } = leadIdSchema.parse(req.params);

  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError('Invalid lead id', 400);
  }

  const lead = await Lead.findOneAndDelete({ _id: leadId, owner });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully'
  });
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const owner = ensureOwner(req);
  const { leadId } = leadIdSchema.parse(req.params);

  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError('Invalid lead id', 400);
  }

  const lead = await Lead.findOne({ _id: leadId, owner });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.status(200).json({
    success: true,
    data: lead
  });
});

export const listLeads = asyncHandler(async (req: Request, res: Response) => {
  const owner = ensureOwner(req);
  const role = (req as Request & { userRole?: string }).userRole ?? 'sales';
  const query = listQuerySchema.parse(req.query);
  const filter = buildLeadFilter(role === 'admin' ? undefined : owner, query);
  const sortOrder = getSortValue(query.sort);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(query.limit).lean(),
    Lead.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: {
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
        hasNextPage: query.page * query.limit < total,
        hasPreviousPage: query.page > 1,
        sort: query.sort,
        filters: {
          status: query.status ?? null,
          source: query.source ?? null,
          search: query.search ?? null
        }
      }
    }
  });
});

export const getLeadSummary = asyncHandler(async (req: Request, res: Response) => {
  const owner = ensureOwner(req);
  const role = (req as Request & { userRole?: string }).userRole ?? 'sales';
  const matchFilter = role === 'admin' ? {} : { owner: new mongoose.Types.ObjectId(owner) };
  const countFilter = role === 'admin' ? {} : { owner };

  const [totalLeads, statusCounts, sourceCounts, recentCount] = await Promise.all([
    Lead.countDocuments(countFilter),
    Lead.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]),
    Lead.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $project: { _id: 0, source: '$_id', count: 1 } }
    ]),
    Lead.countDocuments({
      ...countFilter,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalLeads,
      recentCount,
      statusCounts,
      sourceCounts
    }
  });
});

export const exportLeads = asyncHandler(async (req: Request, res: Response) => {
  const query = listQuerySchema.parse(req.query);
  // admin can export all, sales only their own
  const role = (req as Request & { userRole?: string }).userRole ?? 'sales';
  const owner = ensureOwner(req);

  const filter = buildLeadFilter(role === 'admin' ? undefined : owner, query);

  const items = await Lead.find(filter).sort({ createdAt: getSortValue(query.sort) }).lean();

  // Build CSV
  const headers = ['name', 'email', 'status', 'source', 'owner', 'createdAt', 'updatedAt'];
  const rows = items.map((it) => headers.map((h) => String((it as any)[h] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="leads_export.csv"`);
  res.status(200).send(csv);
});