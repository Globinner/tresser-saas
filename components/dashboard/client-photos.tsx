"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Camera, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ImageIcon,
  ArrowLeftRight,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Photo {
  id: string
  photo_type: "before" | "after"
  blob_pathname: string
  service_performed: string | null
  notes: string | null
  created_at: string
  taken_at: string | null
}

interface Service {
  id: string
  name: string
}

export function ClientPhotos({ clientId, shopId }: { clientId: string; shopId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedBefore, setSelectedBefore] = useState<Photo | null>(null)
  const [selectedAfter, setSelectedAfter] = useState<Photo | null>(null)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  
  const [uploadData, setUploadData] = useState({
    photoType: "before" as "before" | "after",
    serviceId: "",
    notes: ""
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPhotos()
    loadServices()
  }, [clientId])

  async function loadPhotos() {
    const supabase = createClient()
    const { data } = await supabase
      .from("client_photos")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    setPhotos(data || [])
    setLoading(false)
  }

  async function loadServices() {
    const supabase = createClient()
    const { data } = await supabase
      .from("services")
      .select("id, name")
      .eq("shop_id", shopId)
      .eq("is_active", true)

    setServices(data || [])
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("clientId", clientId)
    formData.append("shopId", shopId)
    formData.append("photoType", uploadData.photoType)
    if (uploadData.serviceId) formData.append("serviceId", uploadData.serviceId)
    if (uploadData.notes) formData.append("notes", uploadData.notes)

    try {
      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        await loadPhotos()
        setIsOpen(false)
        setUploadData({ photoType: "before", serviceId: "", notes: "" })
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function deletePhoto(photoId: string) {
    const supabase = createClient()
    await supabase.from("client_photos").delete().eq("id", photoId)
    loadPhotos()
  }

  function getPhotoUrl(pathname: string) {
    return `/api/photos/${encodeURIComponent(pathname)}`
  }

  const beforePhotos = photos.filter(p => p.photo_type === "before")
  const afterPhotos = photos.filter(p => p.photo_type === "after")

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-muted-foreground">Loading photos...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          Before & After Photos
        </h3>
        <div className="flex items-center gap-2">
          {photos.length >= 2 && (
            <Button 
              variant={compareMode ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode)
                setSelectedBefore(null)
                setSelectedAfter(null)
              }}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Compare
            </Button>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="glow-amber-soft">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Add Photo</DialogTitle>
                <DialogDescription>
                  Upload a before or after photo for this client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Photo Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={uploadData.photoType === "before" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setUploadData({ ...uploadData, photoType: "before" })}
                    >
                      Before
                    </Button>
                    <Button
                      variant={uploadData.photoType === "after" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setUploadData({ ...uploadData, photoType: "after" })}
                    >
                      After
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service (Optional)</Label>
                  <Select 
                    value={uploadData.serviceId} 
                    onValueChange={(v) => setUploadData({ ...uploadData, serviceId: v })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={uploadData.notes}
                    onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                    placeholder="Hair condition, color used, etc..."
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Choose Photo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Compare Mode */}
      {compareMode && (
        <Card className="glass border-primary/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2 text-center">Before</p>
                {selectedBefore ? (
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                    <img 
                      src={getPhotoUrl(selectedBefore.blob_pathname)} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80"
                      onClick={() => setSelectedBefore(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Select a before photo</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-center">After</p>
                {selectedAfter ? (
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                    <img 
                      src={getPhotoUrl(selectedAfter.blob_pathname)} 
                      alt="After" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80"
                      onClick={() => setSelectedAfter(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Select an after photo</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No photos yet</p>
            <p className="text-sm text-muted-foreground">Add before and after photos to track transformations</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Before Photos */}
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Before ({beforePhotos.length})</p>
            <div className="grid grid-cols-2 gap-2">
              {beforePhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer group",
                    compareMode && selectedBefore?.id === photo.id && "ring-2 ring-primary"
                  )}
                  onClick={() => {
                    if (compareMode) {
                      setSelectedBefore(photo)
                    } else {
                      setLightboxPhoto(photo)
                    }
                  }}
                >
                  <img 
                    src={getPhotoUrl(photo.blob_pathname)} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePhoto(photo.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                    <p className="text-xs text-white">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After Photos */}
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">After ({afterPhotos.length})</p>
            <div className="grid grid-cols-2 gap-2">
              {afterPhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer group",
                    compareMode && selectedAfter?.id === photo.id && "ring-2 ring-primary"
                  )}
                  onClick={() => {
                    if (compareMode) {
                      setSelectedAfter(photo)
                    } else {
                      setLightboxPhoto(photo)
                    }
                  }}
                >
                  <img 
                    src={getPhotoUrl(photo.blob_pathname)} 
                    alt="After" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePhoto(photo.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                    <p className="text-xs text-white">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setLightboxPhoto(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={getPhotoUrl(lightboxPhoto.blob_pathname)} 
              alt={lightboxPhoto.photo_type} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    lightboxPhoto.photo_type === "before" 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "bg-green-500/20 text-green-400"
                  )}>
                    {lightboxPhoto.photo_type}
                  </span>
                  {lightboxPhoto.service_performed && (
                    <span className="ml-2 text-sm text-white/70">{lightboxPhoto.service_performed}</span>
                  )}
                </div>
                <span className="text-sm text-white/70">
                  {new Date(lightboxPhoto.created_at).toLocaleDateString()}
                </span>
              </div>
              {lightboxPhoto.notes && (
                <p className="text-sm text-white/70 mt-2">{lightboxPhoto.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
