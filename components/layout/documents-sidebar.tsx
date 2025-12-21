'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, Upload, Download, Trash2, Loader2, File, Image, FileJson, X, Eye } from 'lucide-react'

interface Document {
  _id: string
  fileName: string
  fileType: string
  fileSize: number
  documentType: string
  createdAt: string
  uploadedBy: string
}

interface DocumentsSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocumentsSidebar({ isOpen, onClose }: DocumentsSidebarProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('OTHER')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [actionType, setActionType] = useState<'view' | 'download'>('view')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const documentTypes = ['PAN', 'AADHAAR', 'PASSPORT', 'DRIVING_LICENSE', 'BANK_STATEMENT', 'SALARY_SLIP', 'POLICY_DOCUMENT', 'CLAIM_PROOF', 'OTHER']

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchDocuments()
      // Get current user email from localStorage or session
      const storedEmail = localStorage.getItem('userEmail')
      console.log('Retrieved userEmail from localStorage:', storedEmail)
      if (storedEmail) {
        setUserEmail(storedEmail)
      } else {
        // Try to get from user object
        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            console.log('Retrieved email from user object:', user.email)
            setUserEmail(user.email)
          } catch (e) {
            console.error('Failed to parse user object:', e)
          }
        }
      }
    }
  }, [isOpen, fetchDocuments])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('documentType', documentType)

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSelectedFile(null)
        const fileInput = document.getElementById('file') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        setDocumentType('OTHER')
        await fetchDocuments()
      }
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setUploading(false)
    }
  }

  const verifyPasswordAndProceed = async () => {
    setPasswordError(null)

    if (!password) {
      setPasswordError('Please enter your password')
      return
    }

    if (!userEmail) {
      console.error('userEmail is not set:', userEmail)
      setPasswordError('User email not found. Please log in again.')
      return
    }

    setPasswordLoading(true)
    console.log('Verifying password for email:', userEmail)

    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email: userEmail }),
      })

      const data = await response.json()
      console.log('Password verification response:', data)

      if (response.ok && data.success) {
        setPasswordModalOpen(false)
        setPassword('')
        setPasswordError(null)

        if (actionType === 'view' && selectedDoc) {
          await handleViewOnline(selectedDoc)
        } else if (actionType === 'download' && selectedDoc) {
          await handleDownload(selectedDoc)
        }
      } else {
        console.log('Password verification failed:', data.message)
        setPasswordError(data.message || 'The password you entered is incorrect')
        setPasswordLoading(false)
        return
      }
    } catch (error) {
      console.error('Error verifying password:', error)
      setPasswordError('Failed to verify password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleViewOnlineClick = (doc: Document) => {
    setSelectedDoc(doc)
    setActionType('view')
    setPasswordModalOpen(true)
  }

  const handleDownloadClick = (doc: Document) => {
    setSelectedDoc(doc)
    setActionType('download')
    setPasswordModalOpen(true)
  }

  const handleViewOnline = async (doc: Document) => {
    try {
      const response = await fetch(`/api/documents/download/${doc._id}`)
      if (!response.ok) throw new Error('View failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setDocumentUrl(url)
      setSelectedDoc(doc)
      setViewModalOpen(true)
    } catch (error) {
      console.error('Error viewing document:', error)
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(`/api/documents/download/${doc._id}`)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        await fetchDocuments()
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'ALL' || doc.documentType === filterType
    return matchesSearch && matchesFilter
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="h-4 w-4" />
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />
    if (fileType.includes('word') || fileType.includes('document')) return <File className="h-4 w-4" />
    return <FileJson className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30 bg-black/50 animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l border-border shadow-lg overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Close Button - Fixed at top */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors bg-background border border-border"
            aria-label="Close documents sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 pt-16">
          {/* Header */}
          <h2 className="text-xl font-semibold">Documents</h2>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload</CardTitle>
              <CardDescription className="text-xs">Add new documents</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docType" className="text-sm">Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
                    <SelectTrigger id="docType" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={!selectedFile || uploading} className="w-full text-xs" size="sm">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-3 w-3" />
                      Upload
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="space-y-2">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-xs">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documents List */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Documents ({filteredDocuments.length})</h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">No documents</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDocuments.map((doc) => (
                  <Card key={doc._id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="mt-0.5 text-muted-foreground flex-shrink-0">{getFileIcon(doc.fileType)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">{doc.fileName}</h4>
                          <div className="flex flex-wrap gap-1 mt-1 text-xs text-muted-foreground">
                            <span>{doc.documentType}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.fileSize)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOnlineClick(doc)}
                          className="h-7 w-7 p-0"
                          title="View online"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadClick(doc)}
                          className="h-7 w-7 p-0"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0" title="Delete">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete {doc.fileName}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(doc._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Verification Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Password</DialogTitle>
            <DialogDescription>
              Enter your password to {actionType === 'view' ? 'view' : 'download'} this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(null)
                }}
                disabled={passwordLoading}
                className={passwordError ? 'border-red-500' : ''}
              />
              {passwordError && (
                <p className="text-sm text-red-600 font-medium">{passwordError}</p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setPasswordModalOpen(false)
                  setPassword('')
                  setPasswordError(null)
                }}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={verifyPasswordAndProceed}
                disabled={passwordLoading || !password}
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Online Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.fileName}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] bg-muted rounded-lg overflow-auto">
            {documentUrl && selectedDoc?.fileType.includes('image') && (
              <img src={documentUrl} alt={selectedDoc.fileName} className="w-full h-full object-contain" />
            )}
            {documentUrl && selectedDoc?.fileType.includes('pdf') && (
              <iframe src={documentUrl} className="w-full h-full border-0" />
            )}
            {documentUrl && !selectedDoc?.fileType.includes('image') && !selectedDoc?.fileType.includes('pdf') && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Preview not available for this file type</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
