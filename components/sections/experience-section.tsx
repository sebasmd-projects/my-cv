"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
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

  // Calculate total height: 100vh for each card
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
        <div className="absolute top-0 left-0 right-0 z-50 pt-16 pb-8 bg-gradient-to-b from-background via-background to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-2">
                {t("experience.title")}
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t("experience.subtitle")}
              </h3>
            </div>
          </div>
        </div>

        {/* Stacking Cards Container */}
        <div className="absolute inset-0 pt-36 pb-8 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="relative h-[65vh]">
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

  // Each card occupies a portion of the scroll
  const cardStart = index / total
  const cardEnd = (index + 1) / total
  
  // Y position: starts below and moves up as we scroll
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    ["100%", "0%"]
  )

  // Opacity: fades in as it enters
  const opacity = useTransform(
    scrollYProgress,
    [cardStart, cardStart + 0.05, cardEnd - 0.05, cardEnd],
    [0, 1, 1, index === total - 1 ? 1 : 0.3]
  )

  // Scale: slight scale effect for depth
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [0.95, 1]
  )

  // Z-index increases as cards stack
  const zIndex = index + 1

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y: index === 0 ? 0 : y,
        opacity: index === 0 ? 1 : opacity,
        scale: index === 0 ? 1 : scale,
        zIndex,
      }}
    >
      <div 
        className="h-full p-6 bg-card rounded-2xl border border-border shadow-xl overflow-y-auto"
        style={{
          boxShadow: `0 ${4 + index * 2}px ${20 + index * 5}px rgba(0, 0, 0, 0.2)`,
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-foreground">
                {experience.position[locale] || experience.position.es}
              </h4>
              <p className="text-lg text-muted-foreground">{experience.company}</p>
              {experience.client && (
                <p className="text-sm text-primary mt-1">Cliente: {experience.client}</p>
              )}
            </div>
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm text-muted-foreground flex-shrink-0">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(experience.startDate, locale)} -{" "}
              {experience.current
                ? t("experience.present")
                : formatDate(experience.endDate, locale)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {experience.description[locale] || experience.description.es}
        </p>

        {/* Achievements */}
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-3"
          >
            <span>{t("experience.achievements")}</span>
            <span className="text-muted-foreground">({achievements.length})</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-24"}`}>
            <ul className="space-y-2">
              {achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technologies */}
        <div className="pt-4 border-t border-border">
          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {locale === "es" ? "Tecnologías" : "Technologies"}
          </h5>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono bg-secondary rounded-full text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Card indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
