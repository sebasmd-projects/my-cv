"use client"

import { motion } from "framer-motion"
import { Building2, Calendar, ChevronRight } from "lucide-react"
import { profileData } from "@/lib/profile-data"

function formatDate(dateString: string): string {
  const [year, month] = dateString.split("-")
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  return `${months[parseInt(month) - 1]} ${year}`
}

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 sm:py-32 scroll-mt-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              Experiencia Profesional
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              Trayectoria Laboral
            </h3>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-12">
              {profileData.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 md:pl-20"
                >
                  <div className="absolute left-0 md:left-8 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background" />

                  <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{exp.position}</h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>{exp.company}</span>
                          {exp.client && (
                            <>
                              <span className="text-border">|</span>
                              <span className="text-primary text-sm">{exp.client}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate!)}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{exp.description}</p>

                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-foreground mb-2">Logros Destacados:</h5>
                      <ul className="space-y-1">
                        {exp.achievements.slice(0, 4).map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs font-mono bg-secondary rounded text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
