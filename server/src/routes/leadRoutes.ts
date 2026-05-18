import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.js';
import { createLead, deleteLead, getLeadById, getLeadSummary, listLeads, updateLead, exportLeads } from '../controllers/leadsController.js';

export const leadRouter = Router();

leadRouter.use(authMiddleware);
leadRouter.get('/summary', getLeadSummary);
leadRouter.get('/', listLeads);
leadRouter.get('/export', exportLeads);
leadRouter.post('/', createLead);
leadRouter.get('/:leadId', getLeadById);
leadRouter.patch('/:leadId', updateLead);
leadRouter.delete('/:leadId', deleteLead);