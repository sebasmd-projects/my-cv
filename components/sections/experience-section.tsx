"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Building2, Calendar, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await profileService.getExperiences()
      setExperiences(data)
    }
    loadData()
  }, [])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      setCanScrollUp(scrollTop > 10)
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10)
    }
  }

  const scrollToDirection = (direction: "up" | "down") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        top: direction === "down" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="py-20 sm:py-32 scroll-mt-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("experience.title")}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("experience.subtitle")}
            </h3>
          </motion.div>

          {/* Scrolling Container with Fixed Height */}
          <div className="relative">
            {/* Scroll Up Button */}
            <button
              onClick={() => scrollToDirection("up")}
              disabled={!canScrollUp}
              className={`absolute -top-4 left-1/2 -translate-x-1/2 z-10 p-2 rounded-full bg-card border border-border shadow-lg transition-all duration-300 ${
                canScrollUp ? "opacity-100 hover:bg-secondary" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scroll up"
            >
              <ChevronUp className="w-5 h-5 text-foreground" />
            </button>

            {/* Cards Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-secondary scrollbar-thumb-primary/50 hover:scrollbar-thumb-primary pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--primary) / 0.5) hsl(var(--secondary))"
              }}
            >
              <div className="space-y-6 py-4">
                {experiences.map((exp, index) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    index={index}
                    locale={locale}
                    t={t}
                  />
                ))}
              </div>
            </div>

            {/* Scroll Down Button */}
            <button
              onClick={() => scrollToDirection("down")}
              disabled={!canScrollDown}
              className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 p-2 rounded-full bg-card border border-border shadow-lg transition-all duration-300 ${
                canScrollDown ? "opacity-100 hover:bg-secondary" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scroll down"
            >
              <ChevronDown className="w-5 h-5 text-foreground" />
            </button>

            {/* Gradient overlays for scroll indication */}
            <div
              className={`absolute top-0 left-0 right-2 h-12 bg-gradient-to-b from-card/50 to-transparent pointer-events-none transition-opacity duration-300 ${
                canScrollUp ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-card/50 to-transparent pointer-events-none transition-opacity duration-300 ${
                canScrollDown ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({
  experience,
  index,
  locale,
  t
}: {
  experience: Experience
  index: number
  locale: "es" | "en"
  t: (key: string) => string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const achievements = experience.achievements[locale] || experience.achievements.es

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
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
        <p className="text-muted-foreground mb-4 leading-relaxed">
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

          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : "auto" }}
            className="overflow-hidden"
          >
            <ul className="space-y-2">
              {(isExpanded ? achievements : achievements.slice(0, 3)).map((achievement, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
            {!isExpanded && achievements.length > 3 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                +{achievements.length - 3} {locale === "es" ? "más" : "more"}...
              </button>
            )}
          </motion.div>
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
      </div>
    </motion.div>
  )
}
