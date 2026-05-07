"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Skill } from "@/lib/api/profile-service"
import { cn } from "@/lib/utils"

const categoryLabels: Record<string, Record<string, string>> = {
  "QA & Testing": { es: "QA & Testing", en: "QA & Testing" },
  "Backend": { es: "Backend", en: "Backend" },
  "Frontend": { es: "Frontend", en: "Frontend" },
  "DevOps & Tools": { es: "DevOps & Tools", en: "DevOps & Tools" },
}

export function SkillsSection() {
  const { t, locale } = useI18n()
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await profileService.getSkillsByCategory()
      setSkillsByCategory(data)
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <section id="skills" className="py-20 sm:py-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 sm:py-32 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("skills.title")}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("skills.subtitle")}
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-primary/10 rounded-lg">
                    <span className="text-sm font-mono text-primary">
                      {categoryLabels[category]?.[locale] || category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground">{category}</h4>
                </div>

                <div className="space-y-4">
                  {skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: skillIndex * 0.05 }}
                          className={cn(
                            "h-full rounded-full",
                            skill.level >= 90 ? "bg-primary" : skill.level >= 80 ? "bg-primary/80" : "bg-primary/60"
                          )}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 p-6 bg-card rounded-xl border border-border"
          >
            <h4 className="font-semibold text-foreground mb-4">
              {locale === "es" ? "Otras Competencias" : "Other Skills"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Scrum", "Agile", "TDD", "BDD", "SOLID", "Clean Code", "Microservices",
                "REST APIs", "SQL", "NoSQL", "ETL", "Machine Learning", "NLP"
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm bg-secondary rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
