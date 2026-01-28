'use client'

import Script from 'next/script'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { YoucamCameraViewport } from '@/components/analysis/youcam/camera-viewport'
import { YoucamCaptureResults } from '@/components/analysis/youcam/capture-results'
import { YOUCAM_SDK_SRC } from '@/components/analysis/youcam/types'
import { useYoucamCameraKit } from '@/components/analysis/youcam/use-youcam-camera-kit'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  Dialog,
} from '../ui/dialog'
import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { Spinner } from '../ui/spinner'

export function YoucamCameraKit({ children }: { children: React.ReactNode }) {
  const {
    sdkLoaded,
    isSdkReady,
    status,
    error,
    capturedImages,
    isOpen,
    viewportRef,
    moduleRef,
    handleOpen,
    handleClose,
    onScriptLoad,
    onScriptError,
  } = useYoucamCameraKit()

  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const handleOpenChangeDialog = (open: boolean) => {
    console.log('openChangeDialog', open)
    setIsOpenDialog(open)
    if (open) {
      handleOpen()
    } else {
      handleClose()
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={handleOpenChangeDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Capture your scan</DialogTitle>
        </DialogHeader>
        <Script
          src={YOUCAM_SDK_SRC}
          strategy="afterInteractive"
          onLoad={onScriptLoad}
          onError={onScriptError}
        />
        {!isSdkReady && (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        )}
        <YoucamCameraViewport isOpen={isOpen} viewportRef={viewportRef} moduleRef={moduleRef} />
        <YoucamCaptureResults images={capturedImages} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <IconX size={16} />
              Болих
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
