"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { profileService } from "@/lib/api/profile-service"
import { generateCV } from "@/lib/pdf/generate-cv"

interface PDFDownloadButtonProps {
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function PDFDownloadButton({ variant = "outline", className }: PDFDownloadButtonProps) {
  const { t, locale } = useI18n()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const data = await profileService.getAllData()
      await generateCV({
        profile: data.profile as Parameters<typeof generateCV>[0]["profile"],
        stats: data.stats,
        experiences: data.experiences as Parameters<typeof generateCV>[0]["experiences"],
        skillsByCategory: data.skillsByCategory,
        education: data.education as Parameters<typeof generateCV>[0]["education"],
        certifications: data.certifications,
        languages: data.languages as Parameters<typeof generateCV>[0]["languages"],
        locale
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant={variant}
      className={className}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      {isGenerating 
        ? (locale === "es" ? "Generando..." : "Generating...") 
        : t("hero.downloadCV")
      }
    </Button>
  )
}
