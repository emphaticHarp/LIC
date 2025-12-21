'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { FileText, Upload, Download, Trash2, Loader2, File, Image, FileJson } from 'lucide-react'
import { useToast } from '@/components/hooks/use-toast'
import Navbar from '@/components/layout/navbar'
import ProfileSidebar from '@/components/layout/profile-sidebar'
import { BreadcrumbNav } from '@/components/features/breadcrumb-nav'

interface Document {
  _id: string
  fileName: string
  fileType: string
  fileSize: number
  documentType: string
  createdAt: string
  uploadedBy: string
}

interface UploadProgress {
  fileName: string
  progress: number
}

export default function DocumentsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('OTHER')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [showProfileSidebar, setShowProfileSidebar] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isClearingNotifications, setIsClearingNotifications] = useState(false)

  const documentTypes = ['PAN', 'AADHAAR', 'PASSPORT', 'DRIVING_LICENSE', 'BANK_STATEMENT', 'SALARY_SLIP', 'POLICY_DOCUMENT', 'CLAIM_PROOF', 'OTHER']

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch documents',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch documents',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    setUploadProgress({ fileName: selectedFile.name, progress: 0 })

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('documentType', documentType)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (!prev) return null
          const newProgress = Math.min(prev.progress + Math.random() * 30, 90)
          return { ...prev, progress: newProgress }
        })
      }, 200)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress((prev) => (prev ? { ...prev, progress: 100 } : null))

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
        })
        setSelectedFile(null)
        setDocumentType('OTHER')
        setUploadProgress(null)
        await fetchDocuments()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Upload failed',
          variant: 'destructive',
        })
        setUploadProgress(null)
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      })
      setUploadProgress(null)
    } finally {
      setUploading(false)
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
      toast({
        title: 'Success',
        description: 'Document downloaded',
      })
    } catch (error) {
      console.error('Error downloading document:', error)
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Document deleted',
        })
        await fetchDocuments()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Delete failed',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      })
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        email={email}
        currentPage="documents"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'md:mr-80' : ''}`}>
          <div className="p-4 sm:p-6">
            <BreadcrumbNav />

            <div className="max-w-6xl mx-auto space-y-6 mt-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                <p className="text-muted-foreground mt-2">Manage and upload your documents</p>
              </div>

              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                  <CardDescription>Upload images, PDFs, Word documents, and more</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="docType">Document Type</Label>
                      <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
                        <SelectTrigger id="docType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {uploadProgress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{uploadProgress.fileName}</span>
                          <span className="font-medium">{Math.round(uploadProgress.progress)}%</span>
                        </div>
                        <Progress value={uploadProgress.progress} className="h-2" />
                      </div>
                    )}

                    <Button type="submit" disabled={!selectedFile || uploading} className="w-full">
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Documents List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Documents ({filteredDocuments.length})</h2>
                {loading ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </CardContent>
                  </Card>
                ) : filteredDocuments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No documents found</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc._id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="mt-1 text-muted-foreground">{getFileIcon(doc.fileType)}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{doc.fileName}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                                  <span>{doc.documentType}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(doc.fileSize)}</span>
                                  <span>•</span>
                                  <span>{formatDate(doc.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {doc.fileName}? This action cannot be undone.
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sidebar */}
        {showProfileSidebar && (
          <ProfileSidebar
            show={showProfileSidebar}
            email={email}
            onClose={() => setShowProfileSidebar(false)}
          />
        )}
      </div>
    </div>
  )
}
