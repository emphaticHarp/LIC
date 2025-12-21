'use client'

import { Suspense } from 'react'
import DocumentsContent from './documents-content'

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentsContent />
    </Suspense>
  )
}
