'use client'

import { Suspense } from 'react'
import { FormSkeleton } from '@/components/ui/skeleton'
import DocumentsContent from './documents-content'

export default function DocumentsPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <DocumentsContent />
    </Suspense>
  )
}
