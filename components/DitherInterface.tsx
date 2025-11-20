"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ditherImage, FILTERS } from "../utils/dither";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col">
      <header className="w-full border-b bg-background backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl font-semibold">DITHER</h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={downloadImage}
              disabled={!imageSrc}
              className="font-semibold uppercase tracking-wide"
            >
              DOWNLOAD
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-6 flex flex-col gap-6">
        <Card className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-card">
          <div className="flex flex-col gap-3">
            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Source
            </Label>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full justify-start truncate"
            >
              {imageSrc ? "Change Image" : "Upload Image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Algorithm
            </Label>
            <Select
              value={algorithm}
              onValueChange={(val: any) => setAlgorithm(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floyd">Floyd-Steinberg</SelectItem>
                <SelectItem value="atkinson">Atkinson</SelectItem>
                <SelectItem value="stucki">Stucki</SelectItem>
                <SelectItem value="burkes">Burkes</SelectItem>
                <SelectItem value="sierra">Sierra</SelectItem>
                <SelectItem value="jarvis">Jarvis</SelectItem>
                <SelectItem value="none">None (Pixelate)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Filters
            </Label>
            <Select value={filter} onValueChange={(val) => setFilter(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(FILTERS).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Pixel Size: {pixelSize}px
            </Label>
            <div className="flex items-center h-10">
              <Slider
                min={1}
                max={5}
                step={0.25}
                value={[pixelSize]}
                onValueChange={(vals) => setPixelSize(vals[0])}
                className="cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <div className="flex-1 border rounded-lg bg-muted flex items-center justify-center min-h-[60vh] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

          {!imageSrc && (
            <div className="text-muted-foreground text-sm uppercase tracking-widest border border-dashed p-8 rounded-lg">
              No Image Loaded
            </div>
          )}

          <div
            className={`relative max-w-full max-h-full transition-transform duration-200 ease-out ${!imageSrc ? "hidden" : ""}`}
            style={{ transform: `scale(${zoom})` }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-80 object-contain block rounded-sm"
              style={{ imageRendering: "pixelated" }}
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-background flex items-center justify-center backdrop-blur-sm rounded-sm">
                <span className="font-mono text-sm animate-pulse">
                  PROCESSING...
                </span>
              </div>
            )}
          </div>
          {imageSrc && (
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                className="h-8 w-8 rounded-full"
              >
                -
              </Button>
              <span className="px-2 py-1 bg-background text-sm font-mono flex items-center rounded border shadow-sm">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
                className="h-8 w-8 rounded-full"
              >
                +
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
