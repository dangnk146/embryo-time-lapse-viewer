"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "vi"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const translations = {
    en: {
        title: "Embryo Time Lapse Viewer",
        folder: "Folder",
        uploadImages: "Upload Images",
        uploadCSV: "Upload CSV",
        availableDatasets: "Available Time-Lapses",
        availableDatasetsDesc: "Select an embryo from the system to view its time-lapse data.",
        reset: "Reset",
        size: "Size",
        viewerSize: "Viewer Size",
        small: "Small",
        medium: "Medium",
        large: "Large",
        playbackSpeed: "Speed",
        currentStage: "Current Stage",
        progress: "Progress",
        ready: "Ready",
        noStage: "No Stage",
        uploadedFile: "Uploaded File",
        fullScreen: "Fullscreen",
        exitFullScreen: "Exit Fullscreen",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        info: "Info",
        hide: "Hide",
        // Stages
        tPB2: "Second polar body appearance",
        tPB2_desc: "Time of appearance or extrusion of the second polar body",
        tPNa: "Pronuclei appearance",
        tPNa_desc: "Time of appearance of pronuclei",
        tPNf: "Pronuclei disappearance",
        tPNf_desc: "Time of disappearance of pronuclei (pronuclear breakdown)",
        t2: "2-cell stage",
        t2_desc: "Time when the embryo divides into 2 cells",
        t3: "3-cell stage",
        t3_desc: "Time when the embryo divides into 3 cells",
        t4: "4-cell stage",
        t4_desc: "Time when the embryo divides into 4 cells",
        t5: "5-cell stage",
        t5_desc: "Time when the embryo divides into 5 cells",
        t6: "6-cell stage",
        t6_desc: "Time when the embryo divides into 6 cells",
        t7: "7-cell stage",
        t7_desc: "Time when the embryo divides into 7 cells",
        t8: "8-cell stage",
        t8_desc: "Time when the embryo divides into 8 cells",
        "t9+": "9+ cell stage",
        "t9+_desc": "Time when the embryo divides into 9 or more cells",
        tM: "Morula (Compaction)",
        tM_desc: "Time when compaction is complete",
        tSB: "Start of blastulation",
        tSB_desc: "Time when the blastocoel cavity begins to form",
        tB: "Full blastocyst",
        tB_desc: "Time when a full blastocyst has formed",
    },
    vi: {
        title: "Theo dõi Phôi Time-Lapse",
        folder: "Thư mục",
        uploadImages: "Tải lên hình ảnh",
        uploadCSV: "Tải lên file CSV",
        availableDatasets: "Time-Lapse có sẵn",
        availableDatasetsDesc: "Chọn một phôi từ hệ thống để xem dữ liệu Time-Lapse.",
        reset: "Đặt lại",
        size: "Kích thước",
        viewerSize: "Kích thước khung hình",
        small: "Nhỏ (Small)",
        medium: "Vừa (Medium)",
        large: "Lớn (Large)",
        playbackSpeed: "Tốc độ",
        currentStage: "Giai đoạn hiện tại",
        progress: "Tiến triển",
        ready: "Sẵn sàng",
        noStage: "Không có giai đoạn",
        uploadedFile: "Tệp đã tải lên",
        fullScreen: "Toàn màn hình",
        exitFullScreen: "Thoát toàn màn hình",
        theme: "Giao diện",
        light: "Sáng",
        dark: "Tối",
        system: "Hệ thống",
        info: "Chi tiết",
        hide: "Ẩn",
        // Stages
        tPB2: "Xuất hiện thể cực 2",
        tPB2_desc: "Thời điểm xuất hiện hoặc tách ra của thể cực thứ hai",
        tPNa: "Xuất hiện tiền nhân",
        tPNa_desc: "Thời điểm xuất hiện các tiền nhân",
        tPNf: "Biến mất tiền nhân",
        tPNf_desc: "Thời điểm biến mất các tiền nhân (tan biến tiền nhân)",
        t2: "Giai đoạn 2 tế bào",
        t2_desc: "Thời điểm phôi phân chia thành 2 tế bào (phôi bào)",
        t3: "Giai đoạn 3 tế bào",
        t3_desc: "Thời điểm phôi phân chia thành 3 tế bào",
        t4: "Giai đoạn 4 tế bào",
        t4_desc: "Thời điểm phôi phân chia thành 4 tế bào",
        t5: "Giai đoạn 5 tế bào",
        t5_desc: "Thời điểm phôi phân chia thành 5 tế bào",
        t6: "Giai đoạn 6 tế bào",
        t6_desc: "Thời điểm phôi phân chia thành 6 tế bào",
        t7: "Giai đoạn 7 tế bào",
        t7_desc: "Thời điểm phôi phân chia thành 7 tế bào",
        t8: "Giai đoạn 8 tế bào",
        t8_desc: "Thời điểm phôi phân chia thành 8 tế bào",
        "t9+": "Giai đoạn 9+ tế bào",
        "t9+_desc": "Thời điểm phôi phân chia thành 9 tế bào hoặc nhiều hơn",
        tM: "Phôi dâu (Morula)",
        tM_desc: "Thời điểm kết thúc quá trình nén (phôi dâu/morula)",
        tSB: "Bắt đầu tạo nang",
        tSB_desc: "Thời điểm bắt đầu quá trình tạo khoang (tạo nang)",
        tB: "Phôi nang hoàn toàn",
        tB_desc: "Thời điểm hình thành phôi nang đầy đủ",
    },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en")

    useEffect(() => {
        const saved = localStorage.getItem("language") as Language
        if (saved && (saved === "en" || saved === "vi")) {
            setLanguage(saved)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("language", lang)
    }

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations["en"]] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
