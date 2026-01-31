"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { useLanguage } from "./language-provider"

interface PlaybackControlsProps {
  isPlaying: boolean
  playbackSpeed: number
  currentFrame: number
  totalFrames: number
  onPlayPause: () => void
  onSpeedChange: (speed: number) => void
  onNextFrame: () => void
  onPrevFrame: () => void
}

export default function PlaybackControls({
  isPlaying,
  playbackSpeed,
  currentFrame,
  totalFrames,
  onPlayPause,
  onSpeedChange,
  onNextFrame,
  onPrevFrame,
}: PlaybackControlsProps) {
  const { t } = useLanguage()
  const speedOptions = [1, 2, 5]

  return (
    <div className="flex flex-col gap-3 sm:gap-4 bg-card/40 backdrop-blur-md p-4 rounded-2xl border border-border w-full mb-8 shadow-xl">
      {/* Top Row: Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Frame Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevFrame}
            disabled={currentFrame === 0}
            className="border-border hover:bg-secondary bg-background/50 h-10 w-10 text-foreground"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={onPlayPause}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 rounded-full shadow-lg"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onNextFrame}
            disabled={currentFrame >= totalFrames - 1}
            className="border-border hover:bg-secondary bg-background/50 h-10 w-10 text-foreground"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: Speed Selector */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('playbackSpeed')}</span>
          <div className="flex p-1 bg-secondary/50 rounded-xl border border-border">
            {speedOptions.map((speed) => (
              <Button
                key={speed}
                variant="ghost"
                size="sm"
                onClick={() => onSpeedChange(speed)}
                className={`h-8 px-4 rounded-lg transition-all ${playbackSpeed === speed
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/80"
                  }`}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
