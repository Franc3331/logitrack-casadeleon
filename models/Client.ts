import mongoose, { Document, Schema } from 'mongoose'

export interface IClient extends Document {
  businessName: string
  cuit_dni: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  isActive: boolean
  createdAt: Date
}

const ClientSchema = new Schema<IClient>(
  {
    businessName: { type: String, required: true, trim: true },
    cuit_dni: { type: String, required: true, unique: true, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema)
export default Client
