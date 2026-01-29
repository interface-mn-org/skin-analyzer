/**
 * YouCam JS Camera Kit SDK (YMK) global types.
 * SDK: https://plugins-media.makeupar.com/v2.2-camera-kit/sdk.js
 */

export type YMKFaceDetectionMode =
  | 'makeup'
  | 'skincare'
  | 'hdskincare'
  | 'shadefinder'
  | 'facereshape'
  | 'hairlength'
  | 'hairfrizziness'
  | 'hairtype'
  | 'ring'
  | 'wrist'
  | 'necklace'
  | 'earring'

export type YMKImageFormat = 'base64' | 'blob'

export type YMKLanguage =
  | 'chs'
  | 'cht'
  | 'deu'
  | 'enu'
  | 'esp'
  | 'fra'
  | 'jpn'
  | 'kor'
  | 'ptb'
  | 'ita'

export interface YMKInitOptions {
  faceDetectionMode?: YMKFaceDetectionMode
  width?: number
  height?: number
  language?: YMKLanguage
  imageFormat?: YMKImageFormat
  disableCameraResolutionCheck?: boolean
}

export interface YMKFaceQualityChangedPayload {
  hasFace: boolean
  /**
   * Some SDK versions/docs emit `area` instead of `position`.
   * Treat them as aliases for UI purposes.
   */
  area?: 'good' | 'notgood' | 'toosmall' | 'outofboundary'
  position?: 'good' | 'notgood' | 'toosmall' | 'outofboundary'
  frontal?: 'good' | 'notgood'
  lighting?: 'good' | 'ok' | 'notgood'
  pose?: 'good' | 'notgood'
  size?: 'good' | 'notgood'
}

export interface YMKCapturedImage {
  phase: number
  image: string | Blob
  width: number
  height: number
}

export interface YMKFaceDetectionCapturedResult {
  mode: YMKFaceDetectionMode
  images: YMKCapturedImage[]
}

export interface YMKModuleInfo {
  fps: number
}

export type YMKEventListenerId = number | string

export interface YMKAPI {
  init(args?: YMKInitOptions): void
  openCameraKit(): void
  close(): void
  addEventListener(eventName: string, callback: (...args: unknown[]) => void): YMKEventListenerId
  removeEventListener(id: YMKEventListenerId): void
  isLoaded(): boolean
  pause(): void
  resume(restartWebcam?: boolean): void
  getInfo(): YMKModuleInfo
}

declare global {
  interface Window {
    YMK?: YMKAPI
    ymkAsyncInit?: () => void
  }
}

export { }
