"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Building2, Calendar, ChevronRight, ChevronDown } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Experience } from "@/lib/api/profile-service"

function formatDate(dateString: string, locale: "es" | "en"): string {
  const [year, month] = dateString.split("-")
  const monthsEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const months = locale === "es" ? monthsEs : monthsEn
  return `${months[parseInt(month) - 1]} ${year}`
}

export function ExperienceSection() {
  const { t, locale } = useI18n()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const loadData = async () => {
      const data = await profileService.getExperiences()
      setExperiences(data)
    }
    loadData()
  }, [])

  if (experiences.length === 0 || !isMounted) {
    return (
      <section id="experience" className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-48 mx-auto" />
            <div className="h-64 bg-secondary rounded" />
          </div>
        </div>
      </section>
    )
  }

  const totalHeight = experiences.length * 100

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="relative bg-background"
      style={{ height: `${totalHeight}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Title - Always visible at top */}
        <div className="absolute top-0 left-0 right-0 z-50 pt-12 sm:pt-16 pb-4 sm:pb-6 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xs sm:text-sm font-mono text-primary uppercase tracking-wider mb-1 sm:mb-2">
                {t("experience.title")}
              </h2>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {t("experience.subtitle")}
              </h3>
            </div>
          </div>
        </div>

        {/* Stacking Cards Container */}
        <div className="absolute inset-0 pt-28 sm:pt-32 pb-4 flex items-start justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl h-full pt-[33px]">
            <div className="relative h-full">
              {experiences.map((exp, index) => (
                <StackingCard
                  key={exp.id}
                  experience={exp}
                  index={index}
                  total={experiences.length}
                  containerRef={containerRef}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StackingCard({
  experience,
  index,
  total,
  containerRef,
  locale,
  t
}: {
  experience: Experience
  index: number
  total: number
  containerRef: React.RefObject<HTMLDivElement | null>
  locale: "es" | "en"
  t: (key: string) => string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const achievements = experience.achievements[locale] || experience.achievements.es

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const cardStart = index / total
  const cardEnd = (index + 1) / total
  
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    ["100%", "0%"]
  )

  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [0.95, 1]
  )

  const zIndex = index + 1

  return (
    <motion.div
      className="absolute inset-x-0 top-0 h-[calc(100vh-8rem)] sm:h-[calc(100vh-9rem)]"
      style={{
        y: index === 0 ? 0 : y,
        scale: index === 0 ? 1 : scale,
        zIndex,
      }}
    >
      <div 
        className="h-full p-4 sm:p-6 bg-card rounded-2xl border border-border flex flex-col"
        style={{
          boxShadow: `0 ${4 + index * 4}px ${20 + index * 10}px rgba(0, 0, 0, 0.3)`,
        }}
      >
        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="text-base sm:text-xl font-semibold text-foreground leading-tight">
                {experience.position[locale] || experience.position.es}
              </h4>
              <p className="text-sm sm:text-lg text-muted-foreground">{experience.company}</p>
              {experience.client && (
                <p className="text-xs sm:text-sm text-primary mt-0.5">Cliente: {experience.client}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-secondary rounded-full text-xs sm:text-sm text-muted-foreground flex-shrink-0 self-start">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>
              {formatDate(experience.startDate, locale)} -{" "}
              {experience.current
                ? t("experience.present")
                : formatDate(experience.endDate, locale)}
            </span>
          </div>
        </div>

        {/* Description - 2-3 lines max */}
        <p className="text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed line-clamp-2 sm:line-clamp-3 flex-shrink-0">
          {experience.description[locale] || experience.description.es}
        </p>

        {/* Achievements - Collapsible */}
        <div className="mb-3 flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-2"
          >
            <span>{t("experience.achievements")}</span>
            <span className="text-muted-foreground">({achievements.length})</span>
            <ChevronDown
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <div 
            className={`transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[30vh] overflow-y-auto" : "max-h-0 overflow-hidden"
            }`}
          >
            <ul className="space-y-1.5 sm:space-y-2 pr-2">
              {achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-tight">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technologies - Fills remaining space */}
        <div className="pt-3 border-t border-border mt-auto">
          <h5 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {locale === "es" ? "Tecnologias" : "Technologies"}
          </h5>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {experience.technologies.slice(0, 10).map((tech) => (
              <span
                key={tech}
                className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono bg-secondary rounded-full text-foreground"
              >
                {tech}
              </span>
            ))}
            {experience.technologies.length > 10 && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono bg-primary/20 rounded-full text-primary">
                +{experience.technologies.length - 10}
              </span>
            )}
          </div>
        </div>

        {/* Card indicator */}
        <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
