export type YmkCaptureImage = {
  phase?: number;
  image: string | Blob;
  width?: number;
  height?: number;
};

export type YmkCaptureResult = {
  mode?: string;
  images: YmkCaptureImage[];
};

export type YmkModule = {
  init: (args?: {
    faceDetectionMode?: string;
    imageFormat?: "base64" | "blob";
    language?: string;
    width?: number;
    height?: number;
    disableCameraResolutionCheck?: boolean;
  }) => void;
  openCameraKit: () => void;
  close: () => void;
  isLoaded: () => boolean;
  addEventListener: (event: string, callback: (payload: unknown) => void) => string | number;
  removeEventListener: (id: string | number) => void;
};

export const YOUCAM_SDK_SRC = "https://plugins-media.makeupar.com/v2.1-camera-kit/sdk.js";

declare global {
  interface Window {
    YMK?: YmkModule;
    ymkAsyncInit?: () => void;
  }
}

