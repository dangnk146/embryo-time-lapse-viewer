"use client"

import { useState } from "react"
import type { MorphokineticStage } from "@/lib/morphokinetic-data"
import { STAGE_DETAILS } from "@/lib/morphokinetic-data"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./language-provider"
import { Info, ChevronDown, ChevronUp } from "lucide-react"

interface TimelineBarProps {
  currentFrame: number
  totalFrames: number
  onFrameChange: (frame: number) => void
  stages: MorphokineticStage[]
  currentFileName?: string
  showInfo: boolean
}

export default function TimelineBar({ currentFrame, totalFrames, onFrameChange, stages, currentFileName, showInfo }: TimelineBarProps) {
  const { t } = useLanguage()
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const frame = Math.max(0, Math.min(totalFrames - 1, Math.floor(percent * totalFrames)))
    onFrameChange(frame)
  }

  const totalRange = totalFrames - 1
  const percent = (currentFrame / totalRange) * 100

  // Find current stage
  const currentStage = stages.find((s) => currentFrame >= s.startFrame && currentFrame <= s.endFrame)

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full bg-card/50 backdrop-blur-xl px-4 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative transition-all duration-300">
      <div className="flex flex-col gap-1">
        {/* Stage Labels Above Timeline - Hidden on small mobile to prevent overlap */}
        <div className="relative h-6 w-full mb-1 hidden sm:block">
          {stages.map((stage) => {
            const startPercent = (stage.startFrame / totalRange) * 100
            const midPercent = ((stage.startFrame + stage.endFrame) / 2 / totalRange) * 100
            const isActive = currentFrame >= stage.startFrame && currentFrame <= stage.endFrame
            const details = STAGE_DETAILS[stage.name]

            // Enhanced tooltip alignment logic
            let tooltipAlignClass = "left-1/2 -translate-x-1/2"
            let arrowClass = "left-1/2 -translate-x-1/2"

            if (midPercent < 20) {
              tooltipAlignClass = "left-0 translate-x-0"
              arrowClass = "left-4 translate-x-0"
            } else if (midPercent > 80) {
              tooltipAlignClass = "right-0 translate-x-0"
              arrowClass = "right-4 translate-x-0"
            }

            return (
              <div
                key={stage.name}
                className="absolute transform -translate-x-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none"
                style={{
                  left: `${midPercent}%`,
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1.1 : 0.9,
                  zIndex: isActive ? 40 : 10,
                }}
              >
                <span className="text-[10px] font-bold text-foreground whitespace-nowrap bg-background px-2.5 py-0.5 rounded-full border border-border shadow-sm">
                  {stage.name}
                </span>
                <AnimatePresence>
                  {isActive && showInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className={`absolute bottom-full mb-4 z-50 w-64 bg-card p-3 rounded-xl border border-border shadow-2xl pointer-events-auto ${tooltipAlignClass}`}
                    >
                      <div className={`absolute -bottom-1.5 w-3 h-3 bg-card border-r border-b border-border rotate-45 ${arrowClass}`} />
                      <p className="text-[11px] font-black text-primary mb-0 relative z-10 leading-tight uppercase tracking-tight">
                        {t(stage.name) || (details?.name || stage.name)}
                      </p>
                      <p className="text-[10px] text-muted-foreground relative z-10 leading-snug mt-1.5 font-medium">
                        {t(`${stage.name}_desc`) || details?.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Mobile Stage Label (only show active one) */}
        <div className="sm:hidden flex justify-center mb-1 h-5">
          {currentStage && (
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-tighter">
              {t(currentStage.name) || currentStage.name}
            </span>
          )}
        </div>

        {/* Main Timeline Bar */}
        <div
          className="relative h-8 sm:h-10 bg-secondary/50 rounded-lg sm:rounded-xl cursor-pointer overflow-hidden border border-border w-full group transition-all hover:border-primary/50 shadow-inner"
          onClick={handleTimelineClick}
        >
          {/* Colored Segments */}
          <div className="absolute inset-0 flex">
            {stages.map((stage) => {
              const startPercent = (stage.startFrame / totalRange) * 100
              const endPercent = ((stage.endFrame + 1) / totalRange) * 100
              const width = endPercent - startPercent
              const isActive = currentFrame >= stage.startFrame && currentFrame <= stage.endFrame

              return (
                <div
                  key={stage.name}
                  className="absolute h-full transition-all duration-300"
                  style={{
                    left: `${startPercent}%`,
                    width: `${width}%`,
                    backgroundColor: stage.color,
                    opacity: isActive ? 0.8 : 0.4,
                    filter: isActive ? "brightness(1.2) saturate(1.2)" : "none",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                </div>
              )
            })}
          </div>

          {/* Current Position Indicator */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20"
            animate={{ left: `${percent}%` }}
            transition={{ type: "tween", duration: 0 }}
          />

          {/* Progress Overlay */}
          <div
            className="absolute top-0 left-0 h-full bg-white/10 dark:bg-white/5 pointer-events-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Stats and Current Info */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-secondary/20 rounded-lg sm:rounded-xl border border-border gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-bold truncate">{t('currentStage')}</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-foreground transition-all truncate">
                {currentStage ? (t(currentStage.name) || currentStage.name) : t('noStage')}
              </span>
            </div>
            {currentFileName && (
              <span className="text-[8px] sm:text-[10px] text-cyan-500 font-mono mt-0.5 truncate max-w-[120px] sm:max-w-[300px] opacity-80">
                {currentFileName}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
          <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('progress')}</span>
          <div className="text-sm sm:text-base text-primary font-mono font-bold flex items-center gap-1 sm:gap-1.5">
            <span className="bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-md">{Math.floor(currentFrame)}</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-muted-foreground/60">{totalRange}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
