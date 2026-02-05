/* eslint-disable @next/next/no-img-element */
'use client'

import { CameraKitDialog } from '@/components/analysis/camera-kit-dialog'
import Header from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CAPTURED_IMAGES_KEY } from '@/lib/constants'
import { YMKCapturedImage } from '@/types/ymk-camera-kit'
import { IconArrowRight, IconCamera, IconCheck, IconRefresh, IconShield } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FaceCapture() {
  const [capturedImages, setCapturedImages] = useState<YMKCapturedImage[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const onCapturedImages = (images: YMKCapturedImage[]) => {
    setCapturedImages(images)
  }

  const imageToDataUrl = async (image: YMKCapturedImage) => {
    if (typeof image.image === 'string') {
      return image.image.startsWith('data:') ? image.image : `data:image/jpeg;base64,${image.image}`
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Зургийг уншихад алдаа гарлаа.'))
      reader.readAsDataURL(image.image as Blob)
    })
  }

  const handleContinue = async () => {
    if (!capturedImages.length || isSaving) return
    setIsSaving(true)
    try {
      const serialized = await Promise.all(
        capturedImages.map(async (image) => ({
          phase: image.phase,
          width: image.width,
          height: image.height,
          image: await imageToDataUrl(image),
        })),
      )
      sessionStorage.setItem(CAPTURED_IMAGES_KEY, JSON.stringify(serialized))
      router.push('/flow/auth')
    } catch (error) {
      console.error('Авсан зургуудыг хадгалахад алдаа гарлаа.', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <Header title="Зураг авах" step={1} />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-10 pb-36 md:pb-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-balance">
              Нүүрний зургийг авна уу
            </h1>
            <p className="text-muted-foreground text-balance">
              Шинжилгээний хамгийн сайн үр дүнд хүрэхийн тулд нүүрээ хангалттай гэрэлтэй орчинд
              байрлуулна уу.
            </p>
          </div>

          {/* Camera/Preview Area */}
          <div className="relative">
            <div
              className={cn(
                'relative aspect-4/5 md:aspect-4/3 w-full max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted/30 transition-all',
                capturedImages.length > 0 && 'border-solid border-primary/50',
              )}
            >
              {/* Empty State */}
              {capturedImages.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                  <div className="size-20 rounded-full bg-muted flex items-center justify-center">
                    <IconCamera className="size-10 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">Одоогоор зураг алга</p>
                    <p className="text-sm text-muted-foreground">
                      Селфи авахын тулд камераа нээнэ үү.
                    </p>
                  </div>
                  <CameraKitDialog onCapturedImages={onCapturedImages} />
                </div>
              )}

              {/* Captured Image Preview */}
              {capturedImages.length > 0 && (
                <>
                  <img
                    src={capturedImages[0].image || '/placeholder.svg'}
                    alt={`Авсан нүүрний зураг ${capturedImages[0].phase}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {/* Success Badge */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary">
                      <IconCheck className="size-4 text-primary" />
                      <span className="text-sm font-medium">Зураг амжилттай авлаа</span>
                    </Badge>
                  </div>
                  {/* Retake Button */}
                  <Button
                    onClick={() => setCapturedImages([])}
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm"
                  >
                    <IconRefresh className="size-4" />
                    Дахин авах
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
            <IconShield className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground text-pretty">
              Таны зургийг бид хадгалдаггүй. Арьсны шинжилгээнд нэг удаа ашиглаад дараа нь устгана.
            </p>
          </div>

          {/* Desktop Action */}
          <div className="hidden md:flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={capturedImages.length === 0 || isSaving}
              size="lg"
              className="min-w-48"
            >
              Үргэлжлүүлэх
              <IconArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={capturedImages.length === 0 || isSaving}
            size="lg"
            className="w-full"
          >
            Үргэлжлүүлэх
            <IconArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
