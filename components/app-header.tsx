"use client"

import { Button } from "@/components/ui/button"
import {
    FolderOpen,
    ListVideo,
    RotateCcw,
    Settings,
    Monitor,
    Maximize,
    Minimize,
    FileVideo,
    ChevronDown,
    Upload,
    FileText,
    Languages,
    Sun,
    Moon,
    Laptop,
    Info,
    Maximize2,
    Minimize2
} from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "./language-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRef, useState, useEffect } from "react"

interface AppHeaderProps {
    viewerSize: "sm" | "md" | "lg"
    onSizeChange: (size: "sm" | "md" | "lg") => void
    onReset: () => void
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onCSVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onDatasetSelect: (id: string) => void
    showInfo: boolean
    onToggleInfo: (val: boolean) => void
}

export default function AppHeader({
    viewerSize,
    onSizeChange,
    onReset,
    onFileUpload,
    onCSVUpload,
    onDatasetSelect,
    showInfo,
    onToggleInfo
}: AppHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const csvInputRef = useRef<HTMLInputElement>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPageFullscreen, setIsPageFullscreen] = useState(false)

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsPageFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }, [])

    const togglePageFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`)
            })
        } else {
            document.exitFullscreen()
        }
    }
    const { theme, setTheme } = useTheme()
    const { language, setLanguage, t } = useLanguage()

    // Placeholder available timelapses
    const availableTimelapses = [
        { id: "AA83-7", patient: "Patient #1024", date: "2024-01-15" },
        { id: "AAL839-6", patient: "Patient #1025", date: "2024-01-16" },
        { id: "AB028-6", patient: "Patient #1026", date: "2024-01-17" },
    ]

    return (
        <header className="relative w-full flex items-center justify-between bg-card/70 backdrop-blur-xl border-b border-border p-4 sticky top-0 z-50 shadow-sm">
            {/* Hidden inputs */}
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={onFileUpload} className="hidden" />
            <input ref={csvInputRef} type="file" accept=".csv" onChange={onCSVUpload} className="hidden" />

            {/* Left side: Folder and Select */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-border bg-secondary/50 hover:bg-secondary">
                            <FolderOpen className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{t('folder')}</span>
                            <ChevronDown className="h-3 w-3 ml-2 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-card border-border text-foreground">
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="focus:bg-slate-800 cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Tải lên hình ảnh</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => csvInputRef.current?.click()} className="focus:bg-secondary cursor-pointer">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>{t('uploadCSV')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-border bg-secondary/50 hover:bg-secondary">
                            <ListVideo className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{t('availableDatasets')}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card border-border text-foreground">
                        <DialogHeader>
                            <DialogTitle>{t('availableDatasets')}</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                {t('availableDatasetsDesc')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {availableTimelapses.map((tl) => (
                                <div
                                    key={tl.id}
                                    onClick={() => {
                                        onDatasetSelect(tl.id);
                                        setIsDialogOpen(false);
                                    }}
                                    className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-cyan-500/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-cyan-500">{tl.id}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{tl.patient}</div>
                                            <div className="text-[10px] text-muted-foreground/60 mt-2">{tl.date}</div>
                                        </div>
                                        <FileVideo className="h-8 w-8 text-muted-foreground/40 group-hover:text-cyan-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Center: Title */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-[200px] sm:max-w-none hidden lg:block">
                <h1 className="text-xs sm:text-lg font-bold text-foreground uppercase tracking-tighter sm:tracking-wider text-center line-clamp-1">
                    {t('title')}
                </h1>
            </div>

            {/* Right side: Language, Theme, Reset and Size */}
            <div className="flex items-center gap-1 sm:gap-2">
                {/* Language Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Languages className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                            English {language === "en" && "✓"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage("vi")} className={language === "vi" ? "bg-accent" : ""}>
                            Tiếng Việt {language === "vi" && "✓"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" /> <span>{t('light')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" /> <span>{t('dark')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Laptop className="mr-2 h-4 w-4" /> <span>{t('system')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleInfo(!showInfo)}
                    className={`h-8 w-8 p-0 transition-all duration-300 rounded-full ${showInfo
                            ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)] scale-110 active:scale-95'
                            : 'hover:bg-secondary text-muted-foreground'
                        }`}
                    title={t('info')}
                >
                    <Info className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePageFullscreen}
                    className={`h-8 w-8 p-0 transition-all duration-300 rounded-full ${isPageFullscreen
                            ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)] scale-110'
                            : 'hover:bg-secondary text-muted-foreground'
                        }`}
                    title={isPageFullscreen ? t('exitFullScreen') : t('fullScreen')}
                >
                    {isPageFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>

                <div className="w-[1px] h-4 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 sm:h-9 px-2"
                >
                    <RotateCcw className="h-4 w-4 sm:mr-2" />
                    <span className="hidden xl:inline text-xs">{t('reset')}</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border bg-secondary/50 hover:bg-secondary h-8 sm:h-9 px-2"
                        >
                            <Settings className="h-4 w-4 sm:mr-2" />
                            <span className="hidden xl:inline text-xs">{t('size')}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-card border-border text-foreground">
                        <DropdownMenuLabel>{t('viewerSize')}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuRadioGroup value={viewerSize} onValueChange={(value) => onSizeChange(value as "sm" | "md" | "lg")}>
                            <DropdownMenuRadioItem value="sm" className="focus:bg-secondary focus:text-cyan-500">
                                <Minimize className="mr-2 h-4 w-4" />
                                <span>{t('small')}</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="md" className="focus:bg-secondary focus:text-cyan-500">
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>{t('medium')}</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="lg" className="focus:bg-secondary focus:text-cyan-500">
                                <Maximize className="mr-2 h-4 w-4" />
                                <span>{t('large')}</span>
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
