import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    const shopId = formData.get('shopId') as string
    const photoType = formData.get('photoType') as 'before' | 'after'
    const serviceId = formData.get('serviceId') as string | null
    const notes = formData.get('notes') as string | null

    if (!file || !clientId || !shopId || !photoType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upload to Vercel Blob (private)
    const timestamp = Date.now()
    const filename = `photos/${shopId}/${clientId}/${photoType}-${timestamp}-${file.name}`
    
    const blob = await put(filename, file, {
      access: 'private',
    })

    // Save to database
    const { data: photo, error } = await supabase
      .from('client_photos')
      .insert({
        shop_id: shopId,
        client_id: clientId,
        photo_type: photoType,
        blob_pathname: blob.pathname, // Store pathname for private blob retrieval
        service_performed: serviceId || null,
        notes: notes || null
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 })
    }

    return NextResponse.json({ photo, pathname: blob.pathname })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
