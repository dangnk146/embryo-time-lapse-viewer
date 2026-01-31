"use client"
import EmbryoViewer from "@/components/embryo-viewer"

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-background flex flex-col items-center">
      <EmbryoViewer />
    </main>
  )
}
