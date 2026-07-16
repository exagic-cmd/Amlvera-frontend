import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import { SlidersHorizontal, RotateCcw, RotateCw } from 'lucide-react'
import { Button } from './Button'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })

const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180

const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const rotRad = getRadianAngle(rotation)
  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(image.width * Math.cos(rotRad)) + Math.abs(image.height * Math.sin(rotRad)),
    height: Math.abs(image.width * Math.sin(rotRad)) + Math.abs(image.height * Math.cos(rotRad)),
  }

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const data = ctx.getImageData(0, 0, bBoxWidth, bBoxHeight)
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  ctx.putImageData(data, -pixelCrop.x, -pixelCrop.y)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve('')
      resolve(URL.createObjectURL(blob))
    }, 'image/png')
  })
}

export function ImageEditor({ imageUrl, onSave, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, croppedAreaPixelsValue) => {
    setCroppedAreaPixels(croppedAreaPixelsValue)
  }, [])

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels) return
    const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels, rotation)
    onSave(croppedImage)
  }, [croppedAreaPixels, imageUrl, onSave, rotation])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropSize={{ width: 800, height: 600 }}
          />
        </div>
        <div className="space-y-4 rounded-3xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text">Resize & rotate</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Zoom</label>
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-4 w-4 text-brand-600" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Rotate</label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setRotation((r) => r - 90)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setRotation((r) => r + 90)}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <span className="text-sm text-text-muted">{rotation}°</span>
              </div>
            </div>
          </div>
          <Button type="button" onClick={handleSave} className="w-full">
            Save image
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
