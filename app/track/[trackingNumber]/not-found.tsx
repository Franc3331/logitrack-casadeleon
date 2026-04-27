import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'

export default function TrackingNotFound() {
  notFound()
  return null
}
