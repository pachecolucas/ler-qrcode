// hooks/useQRCodeReader.ts

"use client";

import { RefObject, useEffect } from "react";
import jsQR from "jsqr";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onRead?: (value: string) => void;
};

export function useQRCodeReader({ videoRef, canvasRef, onRead }: Props) {
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    async function startCamera() {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
      });

      const video = videoRef.current;

      if (!video) return;

      video.srcObject = stream;

      await video.play();

      scanQRCode();
    }

    function scanQRCode() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const context = canvas.getContext("2d");

      if (!context) return;

      const scan = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

          if (qrCode?.data) {
            onRead?.(qrCode.data);
          }
        }

        animationFrameId = requestAnimationFrame(scan);
      };

      scan();
    }

    startCamera();

    return () => {
      cancelAnimationFrame(animationFrameId);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [canvasRef, onRead, videoRef]);
}
