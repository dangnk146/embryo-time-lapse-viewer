"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import TimelineBar from "./timeline-bar"
import PlaybackControls from "./playback-controls"
import AppHeader from "./app-header"
import type { MorphokineticDataset, MorphokineticStage } from "@/lib/morphokinetic-data"
import { useLanguage } from "./language-provider"

import { Info } from "lucide-react"

export default function EmbryoViewer() {
  const { t } = useLanguage()
  const [showInfo, setShowInfo] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [stages, setStages] = useState<MorphokineticStage[]>([])
  const [currentDataset, setCurrentDataset] = useState<MorphokineticDataset | null>(null)
  const [timestamps, setTimestamps] = useState<number[]>([])
  const [viewerSize, setViewerSize] = useState<"sm" | "md" | "lg">("sm")
  const animationFrameId = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(Date.now())
  const containerRef = useRef<HTMLDivElement>(null)

  // Use currentDataset.maxFrames as the primary source of truth if images haven't been uploaded
  const totalFrames = images.length > 0 && !images[0].includes("/placeholder.svg")
    ? images.length
    : (currentDataset?.maxFrames || 400)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or similar
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      switch (e.code) {
        case "Space":
          e.preventDefault()
          setIsPlaying((prev) => !prev)
          lastTimeRef.current = Date.now()
          break
        case "KeyA":
          setCurrentFrame((prev) => Math.max(prev - 1, 0))
          setIsPlaying(false)
          break
        case "KeyD":
          setCurrentFrame((prev) => Math.min(prev + 1, totalFrames - 1))
          setIsPlaying(false)
          break
        case "Home":
          e.preventDefault()
          setCurrentFrame(0)
          setIsPlaying(false)
          break
        case "End":
          e.preventDefault()
          setCurrentFrame(totalFrames - 1)
          setIsPlaying(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [totalFrames])

  useEffect(() => {
    const maxFrames = currentDataset?.maxFrames || 400
    // Check if current images are placeholders or empty to decide whether to resize/reset
    const isPlaceholder = images.length === 0 || images.some(img => img.includes("/placeholder.svg"))

    if (isPlaceholder) {
      const placeholderImages = Array.from(
        { length: maxFrames },
        (_, i) => `/placeholder.svg?height=500&width=500&query=embryo-frame-${i}`,
      )
      setImages(placeholderImages)
    }
    setCurrentFrame(0)
    setTimestamps([])
  }, [currentDataset])

  // Preload upcoming images
  useEffect(() => {
    if (images.length === 0) return

    const preloadCount = 10 // Preload next 10 frames
    const start = Math.floor(currentFrame)
    const end = Math.min(start + preloadCount, images.length)

    for (let i = start; i < end; i++) {
      const img = new Image()
      img.src = images[i]
    }
  }, [currentFrame, images])

  // Animation loop
  useEffect(() => {
    if (!isPlaying || images.length === 0) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      return
    }

    const animate = () => {
      const now = Date.now()
      const elapsed = now - lastTimeRef.current
      // Changed from 50 to 100 to slow down base speed (approx 10fps at 1x)
      // This helps with loading issues and visual tracking
      const frameAdvance = (elapsed / 100) * playbackSpeed

      setCurrentFrame((prev) => {
        const next = prev + frameAdvance
        if (next >= images.length) {
          setIsPlaying(false)
          return images.length - 1
        }
        return next
      })

      lastTimeRef.current = now
      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isPlaying, playbackSpeed, images.length])

  const currentStage = stages.find(
    (stage) => Math.floor(currentFrame) >= stage.startFrame && Math.floor(currentFrame) <= stage.endFrame,
  )

  const handleFrameChange = (frame: number) => {
    setCurrentFrame(frame)
    setIsPlaying(false)
    lastTimeRef.current = Date.now()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file))
      setImages(imageUrls)
      setCurrentFrame(0)
      setTimestamps([])
    }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const csv = event.target?.result as string
      const lines = csv.trim().split("\n")

      const parsedStages = lines
        .map((line) => {
          const parts = line.split(",").map((p) => p.trim())
          if (parts.length >= 3) {
            return {
              name: parts[0],
              startFrame: Number.parseInt(parts[1]) || 0,
              endFrame: Number.parseInt(parts[2]) || 0,
              timestamp: parts.length > 3 ? parts[3] : undefined,
              color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            }
          }
          return null
        })
        .filter(Boolean) as MorphokineticStage[]

      parsedStages.sort((a, b) => a.startFrame - b.startFrame)

      if (parsedStages.length > 0) {
        const maxFrame = Math.max(...parsedStages.map((s) => s.endFrame))
        setStages(parsedStages)
        setCurrentDataset({
          id: `custom_${Date.now()}`,
          label: `Custom (${file.name})`,
          maxFrames: maxFrame + 1, // maxFrame is an index, so total count is +1
          stages: parsedStages,
        })
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    setImages([])
    setStages([])
    setCurrentFrame(0)
    setCurrentDataset(null)
    setTimestamps([])
    setIsPlaying(false)
  }

  const loadAvailableDataset = (id: string) => {
    setIsPlaying(false)
    const configs: Record<string, { prefix: string; total: number; csv: string }> = {
      "AA83-7": {
        prefix: "/example/AA83-7/D2013.01.28_S0717_I132_WELL7_RUN",
        total: 285,
        csv: "tPB2,5,24\ntPNa,25,88\ntPNf,89,97\nt2,98,171\nt3,172,177\nt4,178,191\nt5,192,241\nt6,242,256\nt7,257,276\nt8,277,284", // Adjusted endFrame from 286 to 284 to match total files
      },
      "AAL839-6": {
        prefix: "/example/AAL839-6/D2013.09.12_S0900_I132_WELL6_RUN",
        total: 432, // Limited to end of t9+ stage (RUN1 to RUN432)
        csv: "tPB2,14,26\ntPNa,27,106\ntPNf,107,119\nt2,120,136\nt4,137,171\nt5,172,186\nt6,187,205\nt7,206,244\nt9+,245,431", // Removed stages after t9+
      },
      "AB028-6": {
        prefix: "/example/AB028-6/D2014.01.20_S0991_I132_WELL6_RUN",
        total: 291,
        csv: "tPB2,16,33\ntPNa,34,117\ntPNf,118,127\nt2,128,177\nt4,178,237\nt5,238,245\nt6,246,290", // Adjusted endFrame from 292 to 290
      },
    }

    const config = configs[id]
    if (!config) return

    const imageUrls = Array.from({ length: config.total }, (_, i) => `${config.prefix}${i + 1}.jpeg`)
    const parsedStages = config.csv
      .split("\n")
      .map((line) => {
        const parts = line.split(",").map((p) => p.trim())
        if (parts.length >= 3) {
          return {
            name: parts[0],
            startFrame: Number.parseInt(parts[1]) || 0,
            endFrame: Number.parseInt(parts[2]) || 0,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          }
        }
        return null
      })
      .filter(Boolean) as MorphokineticStage[]

    setImages(imageUrls)
    setStages(parsedStages)
    setCurrentFrame(0)
    setCurrentDataset({
      id,
      label: `Dataset ${id}`,
      maxFrames: config.total,
      stages: parsedStages,
    })
  }

  // Use currentDataset.maxFrames as the primary source of truth if images haven't been uploaded

  const borderColor = currentStage?.color || "rgb(148, 163, 184)"

  const currentImageUrl = images[Math.floor(currentFrame)] || ""
  const currentFileName = currentImageUrl
    ? (currentImageUrl.startsWith("blob:") ? "Uploaded File" : currentImageUrl.split("/").pop() || "")
    : ""

  return (
    <div className="w-full h-full flex flex-col items-center">
      <AppHeader
        viewerSize={viewerSize}
        onSizeChange={setViewerSize}
        onReset={handleReset}
        onFileUpload={handleFileUpload}
        onCSVUpload={handleCSVUpload}
        onDatasetSelect={loadAvailableDataset}
        showInfo={showInfo}
        onToggleInfo={setShowInfo}
      />

      <div className="w-full h-full flex-1 flex flex-col gap-6 sm:gap-8 items-center p-4 sm:p-8 overflow-y-auto" ref={containerRef}>
        <motion.div
          className={`relative rounded-2xl overflow-hidden w-full bg-black flex-shrink-0 shadow-2xl transition-all duration-500 ${viewerSize === "sm" ? "max-w-md" : viewerSize === "lg" ? "max-w-4xl" : "max-w-2xl"
            }`}
          style={{
            borderWidth: "3px",
            borderColor: borderColor,
            aspectRatio: "1",
          }}
          animate={{ borderColor }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {images.length > 0 ? (
              <img
                src={images[Math.floor(currentFrame)] || "/placeholder.svg"}
                alt={`Frame ${Math.floor(currentFrame)}`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="text-muted-foreground text-center text-sm md:text-lg px-8 max-w-md animate-pulse">
                {t('uploadImages')}
              </div>
            )}
          </div>
        </motion.div>

        {/* Wrapper for Timeline and Controls - Expanded width for better visibility */}
        <div className={`w-full flex flex-col gap-6 sm:gap-8 transition-all duration-500 ${viewerSize === "sm" ? "max-w-3xl" : viewerSize === "lg" ? "max-w-full px-4" : "max-w-5xl"
          }`}>
          {/* Timeline Bar */}
          <TimelineBar
            currentFrame={currentFrame}
            totalFrames={totalFrames}
            onFrameChange={handleFrameChange}
            stages={stages}
            currentFileName={currentFileName}
            showInfo={showInfo}
          />

          {/* Playback Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            currentFrame={Math.floor(currentFrame)}
            totalFrames={totalFrames}
            onPlayPause={() => {
              setIsPlaying(!isPlaying)
              lastTimeRef.current = Date.now()
            }}
            onSpeedChange={setPlaybackSpeed}
            onNextFrame={() => {
              setCurrentFrame((prev) => Math.min(prev + 1, totalFrames - 1))
              setIsPlaying(false)
            }}
            onPrevFrame={() => {
              setCurrentFrame((prev) => Math.max(prev - 1, 0))
              setIsPlaying(false)
            }}
          />
        </div>
      </div>
    </div>
  )
}
