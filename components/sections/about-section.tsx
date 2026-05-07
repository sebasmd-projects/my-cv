"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Mail, Globe, GraduationCap, Loader2 } from "lucide-react"
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("about.title")}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
              {t("about.subtitle")}
            </h3>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="prose prose-invert max-w-none">
                {about.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{profile.email}</span>
                </div>
                {languages.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>
                      {languages.map(l => `${l.name[locale] || l.name.es} ${l.level[locale] || l.level.es}`).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">{t("about.education")}</h4>
                </div>
                {education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <p className="font-medium text-foreground">{edu.field[locale] || edu.field.es}</p>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <p className="text-primary text-xs mt-1">{edu.status[locale] || edu.status.es}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-4">{t("about.certifications")}</h4>
                <ul className="space-y-3">
                  {certifications.map((cert) => (
                    <li key={cert.id} className="text-sm">
                      <p className="font-medium text-foreground">{cert.name}</p>
                      <p className="text-muted-foreground text-xs">{cert.issuer} - {cert.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
