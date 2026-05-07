"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MapPin, Mail, Globe, GraduationCap, Award, ChevronDown, ChevronUp, Loader2, ExternalLink, BookOpen } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Profile, type Education, type Certification, type Language } from "@/lib/api/profile-service"

export function AboutSection() {
  const { t, locale } = useI18n()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [profileData, eduData, certData, langData] = await Promise.all([
        profileService.getProfile(),
        profileService.getEducation(),
        profileService.getCertifications(),
        profileService.getLanguages()
      ])
      setProfile(profileData)
      setEducation(eduData)
      setCertifications(certData)
      setLanguages(langData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading || !profile) {
    return (
      <section id="about" className="py-20 sm:py-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  const about = profile.about[locale] || profile.about.es

  return (
    <section id="about" className="py-20 sm:py-32 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("about.title")}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("about.subtitle")}
            </h3>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - About Text & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="prose prose-invert max-w-none mb-8">
                {about.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-col gap-4 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">
                    {profile.email}
                  </a>
                </div>
                {languages.length > 0 && (
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {languages.map((l, i) => (
                        <span key={i} className="px-2 py-1 bg-secondary rounded text-sm">
                          {l.name[locale] || l.name.es}: {l.level[locale] || l.level.es}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Column - Education with Scroll */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ScrollableCard
                title={t("about.education")}
                icon={<GraduationCap className="w-5 h-5 text-primary" />}
                maxHeight="350px"
              >
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-secondary/50 rounded-lg">
                      <p className="font-semibold text-foreground">
                        {edu.field[locale] || edu.field.es}
                      </p>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                          {edu.status[locale] || edu.status.es}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {edu.startDate?.split("-")[0] || ""} - {locale === "es" ? "Presente" : "Present"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollableCard>
            </motion.div>
          </div>

          {/* Certifications - Full Width Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">{t("about.certifications")}</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {certifications.map((cert) => (
                  <div 
                    key={cert.id} 
                    className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                  >
                    <p className="font-medium text-foreground text-sm mb-1">{cert.name}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{cert.issuer}</span>
                      <span className="text-primary">{cert.date}</span>
                    </div>
                    
                    {(cert.courseUrl || cert.certificateUrl) && (
                      <div className="flex gap-2 mt-3 pt-2 border-t border-border/50">
                        {cert.courseUrl && (
                          <a
                            href={cert.courseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                            title={locale === "es" ? "Ver Curso" : "View Course"}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{locale === "es" ? "Curso" : "Course"}</span>
                          </a>
                        )}
                        {cert.certificateUrl && (
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                            title={locale === "es" ? "Ver Certificado" : "View Certificate"}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{locale === "es" ? "Certificado" : "Certificate"}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Scrollable Card Component
function ScrollableCard({
  title,
  icon,
  children,
  maxHeight = "300px"
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  maxHeight?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setCanScrollUp(scrollTop > 5)
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 5)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollRef.current
    if (container) {
      setCanScrollDown(container.scrollHeight > container.clientHeight)
    }
  }, [children])

  const scrollTo = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const amount = 150
      scrollRef.current.scrollBy({
        top: direction === "down" ? amount : -amount,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border relative h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollTo("up")}
          className={`absolute -top-2 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-secondary border border-border shadow-sm transition-all duration-300 ${
            canScrollUp ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll up"
        >
          <ChevronUp className="w-4 h-4 text-foreground" />
        </button>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-y-auto pr-2"
          style={{
            maxHeight,
            scrollbarWidth: "thin",
            scrollbarColor: "hsl(var(--primary) / 0.5) hsl(var(--secondary))"
          }}
        >
          {children}
        </div>

        <button
          onClick={() => scrollTo("down")}
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-secondary border border-border shadow-sm transition-all duration-300 ${
            canScrollDown ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-4 h-4 text-foreground" />
        </button>

        <div
          className={`absolute top-0 left-0 right-2 h-6 bg-gradient-to-b from-card to-transparent pointer-events-none transition-opacity duration-300 ${
            canScrollUp ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none transition-opacity duration-300 ${
            canScrollDown ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  )
}
