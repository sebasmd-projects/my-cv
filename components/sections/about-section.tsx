"use client"

import { motion } from "framer-motion"
import { MapPin, Mail, Phone, GraduationCap, Globe } from "lucide-react"
import { profileData } from "@/lib/profile-data"

export function AboutSection() {
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
              Sobre Mi
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
              Construyendo software de calidad
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
                {profileData.about.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Ingles B2</span>
                </div>
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
                  <h4 className="font-semibold text-foreground">Educacion</h4>
                </div>
                {profileData.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-foreground">{edu.field}</p>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <p className="text-primary text-xs mt-1">{edu.status}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-4">Certificaciones</h4>
                <ul className="space-y-3">
                  {profileData.certifications.map((cert, index) => (
                    <li key={index} className="text-sm">
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
