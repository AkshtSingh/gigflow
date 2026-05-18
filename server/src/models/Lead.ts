import { Schema, model, type InferSchemaType } from 'mongoose';

export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const leadSources = ['Website', 'Instagram', 'Referral'] as const;

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: leadStatuses,
      required: true,
      default: 'New'
    },
    source: {
      type: String,
      enum: leadSources,
      required: true,
      default: 'Website'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({ name: 'text', email: 'text' });

export type LeadDocument = InferSchemaType<typeof leadSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Lead = model('Lead', leadSchema);