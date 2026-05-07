"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Profile, type Stats } from "@/lib/api/profile-service"
import { PDFDownloadButton } from "@/components/pdf-download-button"

const roles = ["QA", "Dev", "Tester", "Engineer"]

function AnimatedRole() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[currentIndex]}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="text-primary"
        >
          {roles[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function HeroSection() {
  const { t, locale } = useI18n()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [techStack, setTechStack] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [profileData, statsData, techData] = await Promise.all([
        profileService.getProfile(),
        profileService.getStats(),
        profileService.getTechStack()
      ])
      setProfile(profileData)
      setStats(statsData)
      setTechStack(techData)
    }
    loadData()
  }, [])

  if (!profile || !stats) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </section>
    )
  }

  const summary = profile.summary[locale] || profile.summary.es

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              {t("hero.available")}
            </span>
          </motion.div>

          {/* Animated Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {locale === "es" ? "Soy" : "I am"}{" "}
              <span className="text-foreground">{profile.firstName}</span>{" "}
              <span className="text-primary/80">{"{"}</span>
              <AnimatedRole />
              <span className="text-primary/80">{"}"}</span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-6"
          >
            {profile.title[locale] || profile.title.es}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
          >
            {summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {t("hero.contact")}
            </Link>
            <PDFDownloadButton 
              variant="outline" 
              className="px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-border h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { value: `${stats.yearsExperience}+`, label: t("hero.yearsExperience") },
              { value: `${stats.projectsCompleted}+`, label: t("hero.projectsCompleted") },
              { value: `${stats.companiesWorked}`, label: t("hero.companies") },
              { value: `${stats.technologiesMastered}+`, label: t("hero.technologies") },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        
      </div>
    </section>
  )
}
