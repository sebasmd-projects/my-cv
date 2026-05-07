"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Calendar, ChevronRight, ChevronLeft } from "lucide-react"
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
  const [activeIndex, setActiveIndex] = useState(0)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const data = await profileService.getExperiences()
      setExperiences(data)
    }
    loadData()
  }, [])

  const scrollToCard = (index: number) => {
    if (cardsRef.current) {
      const card = cardsRef.current.children[index] as HTMLElement
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        setActiveIndex(index)
      }
    }
  }

  if (experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="py-20 sm:py-32 scroll-mt-20 bg-card/50 overflow-hidden">
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

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mb-8">
            {experiences.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? "bg-primary w-8" 
                    : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to experience ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows for Mobile */}
          <div className="flex justify-between items-center mb-4 sm:hidden">
            <button
              onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-2 rounded-lg bg-secondary text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {activeIndex + 1} / {experiences.length}
            </span>
            <button
              onClick={() => scrollToCard(Math.min(experiences.length - 1, activeIndex + 1))}
              disabled={activeIndex === experiences.length - 1}
              className="p-2 rounded-lg bg-secondary text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Scrolling Cards Container */}
          <div 
            ref={cardsRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={(e) => {
              const container = e.currentTarget
              const scrollPosition = container.scrollLeft
              const cardWidth = container.children[0]?.clientWidth || 400
              const newIndex = Math.round(scrollPosition / (cardWidth + 24))
              if (newIndex !== activeIndex && newIndex >= 0 && newIndex < experiences.length) {
                setActiveIndex(newIndex)
              }
            }}
          >
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

          {/* Timeline for larger screens */}
          <div className="hidden lg:block mt-16 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />
            <div className="flex justify-between relative">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={() => scrollToCard(index)}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-primary border-primary scale-125"
                        : "bg-background border-border hover:border-primary"
                    }`}
                  />
                  <span className="mt-3 text-sm font-mono text-muted-foreground">
                    {formatDate(exp.startDate, locale)}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {exp.company}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
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
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-[85vw] sm:w-[400px] lg:w-[450px] snap-center"
    >
      <div className="h-full p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  {experience.position[locale] || experience.position.es}
                </h4>
                <p className="text-muted-foreground">{experience.company}</p>
                {experience.client && (
                  <p className="text-sm text-primary">{experience.client}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(experience.startDate, locale)} -{" "}
              {experience.current 
                ? t("experience.present")
                : formatDate(experience.endDate, locale)
              }
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {experience.description[locale] || experience.description.es}
          </p>

          {/* Achievements */}
          <div className="flex-1 mb-4">
            <h5 className="text-sm font-medium text-foreground mb-2">
              {t("experience.achievements")}:
            </h5>
            <ul className="space-y-1.5">
              {(experience.achievements[locale] || experience.achievements.es).slice(0, 3).map((achievement, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            {experience.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono bg-secondary rounded text-foreground"
              >
                {tech}
              </span>
            ))}
            {experience.technologies.length > 5 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{experience.technologies.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
