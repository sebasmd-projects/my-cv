"use client"

import { motion } from "framer-motion"
import { ArrowDown, FileDown, Mail } from "lucide-react"
import Link from "next/link"
import { profileData } from "@/lib/profile-data"

export function HeroSection() {
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
              Disponible para nuevos proyectos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
          >
            <span className="text-primary">QA Engineer</span> &{" "}
            <span className="text-foreground">Full Stack Developer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            {profileData.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <span className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground">Python/Django</span>
            <span className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground">Java/Spring</span>
            <span className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground">React/Next.js</span>
            <span className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground">Selenium</span>
            <span className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground">Karate</span>
            <span className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground">CI/CD</span>
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
              Contactar
            </Link>
            <Link
              href="#experience"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-border"
            >
              <FileDown className="w-5 h-5" />
              Ver Experiencia
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { value: `${profileData.stats.yearsExperience}+`, label: "Anos de Experiencia" },
              { value: `${profileData.stats.projectsCompleted}+`, label: "Proyectos Completados" },
              { value: `${profileData.stats.companiesWorked}`, label: "Empresas" },
              { value: `${profileData.stats.technologiesMastered}+`, label: "Tecnologias" },
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <Link
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
