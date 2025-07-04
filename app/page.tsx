"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, FileText, Calendar, DollarSign, Package, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SalesSummary {
  id: string
  uploadTimestamp: string
  totalRecords: number
  totalQuantity: number
  totalRevenue: number
  fileName: string
}

export default function SalesDashboard() {
  const [summaries, setSummaries] = useState<SalesSummary[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedSummary, setSelectedSummary] = useState<SalesSummary | null>(null)

  const API_BASE_URL = "http://localhost:8080"

  useEffect(() => {
    fetchSummaries()
  }, [])

  const fetchSummaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales-summaries`)
      if (response.ok) {
        const data = await response.json()
        setSummaries(data)
      }
    } catch (error) {
      console.error("Error fetching summaries:", error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setSelectedFile(file)
      setMessage(null)
    } else {
      setMessage({ type: "error", text: "Please select a valid CSV file." })
      setSelectedFile(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select a file first." })
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch(`${API_BASE_URL}/upload-sales-data`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setMessage({ type: "success", text: "File uploaded and processed successfully!" })
        setSelectedFile(null)
        const fileInput = document.getElementById("file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
        await fetchSummaries()
      } else {
        const errorText = await response.text()
        setMessage({ type: "error", text: `Upload failed: ${errorText}` })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please ensure the backend server is running." })
    } finally {
      setUploading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Sales Data Dashboard</h1>
          <p className="text-gray-600">Upload CSV files and view sales summaries</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Sales Data
            </CardTitle>
            <CardDescription>Upload a CSV file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="min-w-[100px]">
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}

            {message && (
              <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sales Summaries Dashboard
            </CardTitle>
            <CardDescription>All uploaded sales data summaries from the current server session</CardDescription>
          </CardHeader>
          <CardContent>
            {summaries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales data uploaded yet. Upload a CSV file to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total summaries: <Badge variant="secondary">{summaries.length}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchSummaries}>
                    Refresh
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Upload ID</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Upload Timestamp</TableHead>
                        <TableHead className="text-right">Total Revenue</TableHead>
                        <TableHead className="text-right">Records</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaries.map((summary) => (
                        <TableRow key={summary.id}>
                          <TableCell className="font-mono text-sm">{summary.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{summary.fileName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {formatDate(summary.uploadTimestamp)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            <div className="flex items-center justify-end gap-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              {formatCurrency(summary.totalRevenue)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{summary.totalRecords.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{summary.totalQuantity.toLocaleString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedSummary(summary)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Sales Summary Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information for upload ID: {summary.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-500">Upload ID</label>
                                      <p className="font-mono text-sm">{summary.id}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-500">File Name</label>
                                      <p className="text-sm font-medium">{summary.fileName}</p>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                      <label className="text-sm font-medium text-gray-500">Upload Timestamp</label>
                                      <p className="text-sm">{formatDate(summary.uploadTimestamp)}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                          <p className="text-2xl font-bold">{summary.totalRecords.toLocaleString()}</p>
                                          <p className="text-sm text-gray-500">Total Records</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <Package className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                          <p className="text-2xl font-bold">{summary.totalQuantity.toLocaleString()}</p>
                                          <p className="text-sm text-gray-500">Total Quantity</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                          <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
                                          <p className="text-sm text-gray-500">Total Revenue</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
