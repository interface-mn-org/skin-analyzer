import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

import type { YmkCaptureResult } from "./types";

export function useYoucamCameraKit() {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [status, setStatus] = useState("Loading…");
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<Record<string, string | boolean> | null>(null);
  const [captured, setCaptured] = useState<YmkCaptureResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isMobile = useMediaQuery("screen and (max-width: 640px)");

  const listenerIdsRef = useRef<Array<string | number>>([]);
  const objectUrlsRef = useRef<string[]>([]);
  const hasSetupRef = useRef(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const moduleRef = useRef<HTMLDivElement | null>(null);

  const resetDomState = useCallback(() => {
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("touch-action");
    document.documentElement.style.removeProperty("overflow");

    if (moduleRef.current) {
      moduleRef.current.innerHTML = "";
    }
  }, []);

  const capturedImages = useMemo(() => {
    if (!captured?.images?.length) return [];

    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];

    return captured.images.map((image) => {
      if (typeof image.image === "string") {
        return { src: image.image, phase: image.phase };
      }

      const url = URL.createObjectURL(image.image);
      objectUrlsRef.current.push(url);
      return { src: url, phase: image.phase };
    });
  }, [captured]);

  const setupListeners = useCallback(() => {
    if (hasSetupRef.current) return;

    const ymk = window.YMK;
    if (!ymk) return;

    setIsSdkReady(true);

    ymk.init({
      faceDetectionMode: "skincare",
      imageFormat: "base64",
      language: "enu",
    });

    const ids: Array<string | number> = [];

    ids.push(
      ymk.addEventListener("loaded", () => {
        setIsSdkReady(true);
        setStatus("Ready");
      })
    );

    ids.push(
      ymk.addEventListener("loading", (progress) => {
        setStatus(`Loading… ${progress as number}%`);
      })
    );

    ids.push(
      ymk.addEventListener("cameraFailed", (reason) => {
        setError(`Camera error: ${String(reason)}`);
        setIsOpen(false);
        resetDomState();
      })
    );

    ids.push(
      ymk.addEventListener("opened", () => {
        setIsOpen(true);
        setStatus("Camera opened");
      })
    );

    ids.push(
      ymk.addEventListener("closed", () => {
        setIsOpen(false);
        setQuality(null);
        setStatus("Camera closed");
        resetDomState();
      })
    );

    ids.push(
      ymk.addEventListener("cameraClosed", () => {
        setIsOpen(false);
        resetDomState();
      })
    );

    ids.push(
      ymk.addEventListener("faceQualityChanged", (payload) => {
        if (typeof payload === "object" && payload) {
          setQuality(payload as Record<string, string | boolean>);
        }
      })
    );

    ids.push(
      ymk.addEventListener("faceDetectionCaptured", (result) => {
        setCaptured(result as YmkCaptureResult);
        setStatus("Captured");
      })
    );

    listenerIdsRef.current = ids;
    hasSetupRef.current = true;
  }, [resetDomState]);

  useEffect(() => {
    window.ymkAsyncInit = setupListeners;

    if (window.YMK) {
      setupListeners();
    }

    return () => {
      listenerIdsRef.current.forEach((id) => window.YMK?.removeEventListener?.(id));
      listenerIdsRef.current = [];
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
      window.YMK?.close?.();
      resetDomState();
      hasSetupRef.current = false;
    };
  }, [resetDomState, setupListeners]);

  const onScriptLoad = useCallback(() => {
    setSdkLoaded(true);
    setIsSdkReady(Boolean(window.YMK));
    setStatus("Ready");
    window.ymkAsyncInit?.();
  }, []);

  const onScriptError = useCallback(() => {
    setError("Failed to load camera SDK.");
    setStatus("Error");
  }, []);

  const handleOpen = useCallback(() => {
    setError(null);
    setStatus("Opening…");

    if (!window.YMK) {
      setError("Camera SDK is not ready yet.");
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    const rect = viewportRef.current?.getBoundingClientRect();
    const fallbackWidth = Math.max(320, window.innerWidth - (isMobile ? 32 : 120));
    const fallbackHeight = Math.max(320, window.innerHeight - (isMobile ? 220 : 260));

    const width = Math.round(Math.min(1280, Math.max(320, rect?.width ?? fallbackWidth)));
    const height = Math.round(Math.min(1280, Math.max(320, rect?.height ?? fallbackHeight)));

    window.YMK.init({
      faceDetectionMode: "skincare",
      imageFormat: "base64",
      language: "kor",
      width,
      height,
    });

    window.YMK.openCameraKit();
  }, [isMobile]);

  const handleClose = useCallback(() => {
    window.YMK?.close?.();
    setIsOpen(false);
    resetDomState();
  }, [resetDomState]);

  return {
    sdkLoaded,
    isSdkReady,
    status,
    error,
    quality,
    capturedImages,
    isOpen,
    viewportRef,
    moduleRef,
    handleOpen,
    handleClose,
    onScriptLoad,
    onScriptError,
  };
}

