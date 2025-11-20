"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ditherImage, FILTERS } from "../utils/dither";

export default function DitherInterface() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<
    "floyd" | "atkinson" | "stucki" | "burkes" | "sierra" | "jarvis" | "none"
  >("floyd");
  const [filter, setFilter] = useState<string>("bw");
  const [pixelSize, setPixelSize] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(async () => {
    if (!imageSrc || !canvasRef.current) return;

    setIsProcessing(true);
    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = Math.max(1, Math.floor(img.width / pixelSize));
    const h = Math.max(1, Math.floor(img.height / pixelSize));

    const offCanvas = document.createElement("canvas");
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return;

    offCtx.drawImage(img, 0, 0, w, h);
    const imageData = offCtx.getImageData(0, 0, w, h);

    setTimeout(() => {
      const dithered = ditherImage(imageData, algorithm, filter, pixelSize);

      offCtx.putImageData(dithered, 0, 0);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offCanvas, 0, 0, img.width, img.height);

      setIsProcessing(false);
    }, 10);
  }, [imageSrc, algorithm, filter, pixelSize]);

  useEffect(() => {
    processImage();
  }, [processImage]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "dithered.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono flex flex-col">
      <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl font-semibold text-neutral-100">DITHER</h1>
          </div>

          <button
            onClick={downloadImage}
            disabled={!imageSrc}
            className="px-6 py-2 bg-neutral-100 text-neutral-950 font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wide"
          >
            DOWNLOAD
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-neutral-800 bg-neutral-900/50">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Source
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-sm text-left transition-colors truncate"
            >
              {imageSrc ? "Change Image" : "Upload Image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 p-2 text-sm focus:outline-none focus:border-neutral-600 appearance-none rounded-none"
            >
              <option value="floyd">Floyd-Steinberg</option>
              <option value="atkinson">Atkinson</option>
              <option value="stucki">Stucki</option>
              <option value="burkes">Burkes</option>
              <option value="sierra">Sierra</option>
              <option value="jarvis">Jarvis</option>
              <option value="none">None (Pixelate)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Filters
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 p-2 text-sm focus:outline-none focus:border-neutral-600 appearance-none rounded-none"
            >
              {Object.keys(FILTERS).map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Pixel Size: {pixelSize}px
            </label>
            <div className="flex items-center h-[34px]">
              <input
                type="range"
                min="1"
                max="5"
                step="0.25"
                value={pixelSize}
                onChange={(e) => setPixelSize(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-neutral-400 hover:[&::-webkit-slider-thumb]:bg-neutral-200"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 border border-neutral-800 bg-neutral-900 flex items-center justify-center min-h-[60vh] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

          {!imageSrc && (
            <div className="text-neutral-700 text-sm uppercase tracking-widest border border-neutral-800 p-8 border-dashed">
              No Image Loaded
            </div>
          )}

          <div
            className={`relative max-w-full max-h-full shadow-2xl transition-transform duration-200 ease-out ${!imageSrc ? "hidden" : ""}`}
            style={{ transform: `scale(${zoom})` }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-80 object-contain block"
              style={{ imageRendering: "pixelated" }}
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-neutral-950/50 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-mono text-sm animate-pulse">
                  PROCESSING...
                </span>
              </div>
            )}
          </div>
          {imageSrc && (
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              <button
                onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-full transition-colors"
              >
                -
              </button>
              <span className="px-2 py-1 bg-neutral-900/80 text-sm font-mono flex items-center rounded border border-neutral-800">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
                className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-full transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
