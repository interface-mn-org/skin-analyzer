'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { getCameraKitDimensions } from '@/lib/ymk-camera-kit'
import type {
  YMKCapturedImage,
  YMKEventListenerId,
  YMKFaceDetectionCapturedResult,
  YMKFaceQualityChangedPayload,
} from '@/types/ymk-camera-kit'
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'
import { Spinner } from '../ui/spinner'

const YMK_SDK_URL = 'https://plugins-media.makeupar.com/v2.2-camera-kit/sdk.js'

const DEFAULT_DIMENSIONS = { width: 360, height: 480 }

function faceQualityValueMeta(value: string | undefined) {
  switch (value) {
    case 'good':
      return { label: 'Сайн', dot: 'bg-emerald-700', text: 'text-emerald-400' }
    case 'ok':
      return { label: 'Дунд', dot: 'bg-amber-700', text: 'text-amber-400' }
    case 'notgood':
      return { label: 'Муу', dot: 'bg-rose-700', text: 'text-rose-400' }
    case 'toosmall':
      return { label: 'Хэт жижиг', dot: 'bg-rose-700', text: 'text-rose-400' }
    case 'outofboundary':
      return { label: 'Хүрээнээс гарсан', dot: 'bg-rose-700', text: 'text-rose-400' }
    default:
      return { label: value ?? '—', dot: 'bg-white/30', text: 'text-white/80' }
  }
}

function FaceQualityChip({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null

  const meta = faceQualityValueMeta(value)

  return (
    <div className="flex-1 shrink-0 basis-0 whitespace-nowrap flex flex-col gap-1 rounded-lg border border-white/30 bg-white/10 px-2 py-1.5">
      <span className="text-[11px] leading-none text-white/90">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
        <span className={`text-[11px] leading-none font-semibold ${meta.text}`}>{meta.label}</span>
      </div>
    </div>
  )
}

export function CameraKitDialog() {
  const [open, setOpen] = useState(false)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)
  const [capturedImages, setCapturedImages] = useState<YMKCapturedImage[]>([])
  const [faceQuality, setFaceQuality] = useState<YMKFaceQualityChangedPayload | null>(null)
  const captureListenerIdRef = useRef<YMKEventListenerId | null>(null)
  const faceQualityListenerIdRef = useRef<YMKEventListenerId | null>(null)
  const cameraClosedListenerIdRef = useRef<YMKEventListenerId | null>(null)
  const lastFaceQualityUpdateTsRef = useRef(0)
  const openRef = useRef(false)
  const openSessionIdRef = useRef(0)
  const openedSessionIdRef = useRef(0)

  useEffect(() => {
    openRef.current = open
  }, [open])

  const dimensions =
    open && typeof window !== 'undefined' ? getCameraKitDimensions() : DEFAULT_DIMENSIONS

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      openRef.current = false
      if (typeof window !== 'undefined' && window.YMK) {
        try {
          if (captureListenerIdRef.current != null) {
            window.YMK.removeEventListener(captureListenerIdRef.current)
            captureListenerIdRef.current = null
          }
          if (faceQualityListenerIdRef.current != null) {
            window.YMK.removeEventListener(faceQualityListenerIdRef.current)
            faceQualityListenerIdRef.current = null
          }
          if (cameraClosedListenerIdRef.current != null) {
            window.YMK.removeEventListener(cameraClosedListenerIdRef.current)
            cameraClosedListenerIdRef.current = null
          }
          window.YMK.close()
        } catch {
          /* ignore */
        }
      }
      lastFaceQualityUpdateTsRef.current = 0
      setCapturedImages([])
      setFaceQuality(null)
    }
    setOpen(next)
  }

  useEffect(() => {
    if (!open) return

    const dims = getCameraKitDimensions()
    const sessionId = openSessionIdRef.current

    const initAndOpen = () => {
      if (typeof window === 'undefined' || !window.YMK) return
      if (!openRef.current) return
      if (openedSessionIdRef.current === sessionId) return
      if (!document.getElementById('YMK-module')) return

      // Ensure we don't leak listeners across opens.
      if (captureListenerIdRef.current != null) {
        try {
          window.YMK.removeEventListener(captureListenerIdRef.current)
        } catch {
          /* ignore */
        }
        captureListenerIdRef.current = null
      }
      if (faceQualityListenerIdRef.current != null) {
        try {
          window.YMK.removeEventListener(faceQualityListenerIdRef.current)
        } catch {
          /* ignore */
        }
        faceQualityListenerIdRef.current = null
      }
      if (cameraClosedListenerIdRef.current != null) {
        try {
          window.YMK.removeEventListener(cameraClosedListenerIdRef.current)
        } catch {
          /* ignore */
        }
        cameraClosedListenerIdRef.current = null
      }

      window.YMK.init({
        faceDetectionMode: 'skincare',
        imageFormat: 'base64',
        language: 'enu',
        width: dims.width,
        height: dims.height,
      })
      lastFaceQualityUpdateTsRef.current = 0
      captureListenerIdRef.current = window.YMK.addEventListener(
        'faceDetectionCaptured',
        (result: unknown) => {
          const r = result as YMKFaceDetectionCapturedResult
          setCapturedImages(r.images ?? [])
        },
      )
      faceQualityListenerIdRef.current = window.YMK.addEventListener(
        'faceQualityChanged',
        (payload: unknown) => {
          if (!openRef.current) return

          const now = Date.now()
          // `faceQualityChanged` can fire continuously; throttle re-renders.
          if (now - lastFaceQualityUpdateTsRef.current < 150) return
          lastFaceQualityUpdateTsRef.current = now
          setFaceQuality(payload as YMKFaceQualityChangedPayload)
        },
      )
      cameraClosedListenerIdRef.current = window.YMK.addEventListener('cameraClosed', () => {
        if (!openRef.current) return
        handleOpenChange(false)
      })
      window.YMK.openCameraKit()
      openedSessionIdRef.current = sessionId
    }

    const runInit = () => {
      if (!openRef.current) return
      if (window.YMK) {
        requestAnimationFrame(() => {
          if (!openRef.current) return
          initAndOpen()
        })
      } else {
        window.ymkAsyncInit = () => {
          if (!openRef.current) return
          requestAnimationFrame(() => {
            if (!openRef.current) return
            initAndOpen()
          })
        }
      }
    }

    const t = window.setTimeout(runInit, 0)

    return () => {
      window.clearTimeout(t)
      window.ymkAsyncInit = undefined
      if (typeof window !== 'undefined' && window.YMK) {
        if (captureListenerIdRef.current != null) {
          try {
            window.YMK.removeEventListener(captureListenerIdRef.current)
          } catch {
            /* ignore */
          }
          captureListenerIdRef.current = null
        }
        if (faceQualityListenerIdRef.current != null) {
          try {
            window.YMK.removeEventListener(faceQualityListenerIdRef.current)
          } catch {
            /* ignore */
          }
          faceQualityListenerIdRef.current = null
        }
        if (cameraClosedListenerIdRef.current != null) {
          try {
            window.YMK.removeEventListener(cameraClosedListenerIdRef.current)
          } catch {
            /* ignore */
          }
          cameraClosedListenerIdRef.current = null
        }
      }
    }
  }, [open])

  const isFaceQualityGood =
    faceQuality?.frontal === 'good' &&
    faceQuality?.lighting === 'good' &&
    faceQuality?.position === 'good'

  return (
    <>
      <Button
        size="lg"
        onClick={() => {
          setHasOpenedOnce(true)
          openSessionIdRef.current += 1
          setOpen(true)
        }}
      >
        Open camera
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0 bg-transparent border-none outline-none ring-0"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Camera capture</DialogTitle>
          {faceQuality && (
            <div
              className="absolute z-20 h-22 overflow-x-auto rounded-t-lg bg-black px-3 py-2 ring-1 ring-white/10 flex flex-col flex-nowrap justify-between"
              style={{
                width: dimensions.width,
                left: '50%',
                transform: 'translateX(-50%)',
                top: '0',
              }}
            >
              <div className="flex flex-nowrap items-start gap-1.5">
                <FaceQualityChip label="Байрлал" value={faceQuality.position} />
                <FaceQualityChip label="Урд харсан" value={faceQuality.frontal} />
                <FaceQualityChip label="Гэрэлтүүлэг" value={faceQuality.lighting} />
              </div>
              {isFaceQualityGood ? (
                <div className="flex items-center gap-1.5 text-center text-white/90 text-xs justify-center mt-1">
                  <IconCheck className="size-5 text-emerald-400 shrink-0" />
                  <span className="text-center">Толгойгоо тогтвортой байлгана уу</span>
                  <Spinner className="size-5 text-emerald-400 shrink-0" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-center text-white/90 text-xs justify-center mt-1">
                  <IconAlertCircle className="size-5 text-amber-400 shrink-0" />
                  <span className="text-center">Шаардлага хангаагүй байна</span>
                </div>
              )}
            </div>
          )}

          {hasOpenedOnce && (
            <Script id="ymk-camera-kit" src={YMK_SDK_URL} strategy="afterInteractive" />
          )}
          {faceQuality === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10 gap-3">
              <p className="text-sm text-muted-foreground">Түр хүлээнэ үү...</p>
              <Spinner className="size-8" />
            </div>
          )}
          <div
            id="YMK-module"
            className="mx-auto overflow-hidden rounded-lg bg-muted"
            style={{ width: dimensions.width, height: dimensions.height }}
          />
          {faceQuality !== null && (
            <div
              className="absolute bottom-0 left-0 right-0 z-20 bg-black flex-1 shrink-0 basis-0 whitespace-nowrap flex items-center justify-center gap-1 text-center text-white/90 text-xs rounded-b-lg py-2"
              style={{ width: dimensions.width, left: '50%', transform: 'translateX(-50%)' }}
            >
              <IconAlertCircle className="size-5 shrink-0" />
              <span className="text-center">Бүх шалгуур ногоон болсны дараа зураг авна.</span>
            </div>
          )}
          {capturedImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                Captured ({capturedImages.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {capturedImages.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- dynamic base64/blob from camera
                  <img
                    key={i}
                    src={typeof img.image === 'string' ? img.image : URL.createObjectURL(img.image)}
                    alt={`Capture ${i + 1}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
