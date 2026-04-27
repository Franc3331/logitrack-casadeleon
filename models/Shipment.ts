import mongoose, { Document, Schema, Types } from 'mongoose'

export type ShipmentStatus =
  | 'PREPARANDO'
  | 'RECOGIDO'
  | 'EN_TRANSITO'
  | 'EN_SUCURSAL'
  | 'ENTREGADO'
  | 'DEMORADO'
  | 'CANCELADO'

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
  'PREPARANDO',
  'RECOGIDO',
  'EN_TRANSITO',
  'EN_SUCURSAL',
  'ENTREGADO',
  'DEMORADO',
  'CANCELADO',
]

export interface IShipmentDocument {
  title: string
  fileUrl: string
  uploadedAt: Date
}

export interface IHistoryEntry {
  status: ShipmentStatus
  location?: string
  timestamp: Date
  notes?: string
}

export interface IShipment extends Document {
  trackingNumber: string
  clientId: Types.ObjectId
  originAddress: string
  destinationAddress: string
  currentStatus: ShipmentStatus
  documents: IShipmentDocument[]
  history: IHistoryEntry[]
  createdAt: Date
  updatedAt: Date
}

const ShipmentDocumentSchema = new Schema<IShipmentDocument>(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const HistoryEntrySchema = new Schema<IHistoryEntry>(
  {
    status: {
      type: String,
      enum: SHIPMENT_STATUSES,
      required: true,
    },
    location: { type: String },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { _id: true }
)

const ShipmentSchema = new Schema<IShipment>(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    originAddress: { type: String, required: true, trim: true },
    destinationAddress: { type: String, required: true, trim: true },
    currentStatus: {
      type: String,
      enum: SHIPMENT_STATUSES,
      default: 'PREPARANDO',
      required: true,
    },
    documents: { type: [ShipmentDocumentSchema], default: [] },
    history: { type: [HistoryEntrySchema], default: [] },
  },
  { timestamps: true }
)

const Shipment = mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema)
export default Shipment
