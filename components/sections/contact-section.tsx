"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Linkedin, Github, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Profile } from "@/lib/api/profile-service"

export function ContactSection() {
  const { t, locale } = useI18n()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  useEffect(() => {
    const loadData = async () => {
      const data = await profileService.getProfile()
      setProfile(data)
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", company: "", message: "" })
    
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <section id="contact" className="py-20 sm:py-32 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("contact.title")}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("contact.subtitle")}
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("contact.description")}
            </p>
          </motion.div>

          {/* Desktop Layout: lg:grid-cols-5 */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-12">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  {t("contact.info.email")}
                </h4>
                {profile && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <span>{profile.email}</span>
                  </a>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  {locale === "es" ? "Redes Sociales" : "Social Media"}
                </h4>
                <div className="flex gap-3">
                  {profile && (
                    <>
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-2">
                  {locale === "es" ? "Disponibilidad" : "Availability"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {locale === "es" 
                    ? "Actualmente disponible para proyectos de consultoria, posiciones full-time o colaboraciones freelance."
                    : "Currently available for consulting projects, full-time positions, or freelance collaborations."
                  }
                </p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <ContactForm 
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                isSubmitted={isSubmitted}
                handleSubmit={handleSubmit}
                locale={locale}
                t={t}
              />
            </motion.div>
          </div>

          {/* Mobile Layout: Specific Order */}
          <div className="lg:hidden space-y-8">
            {/* 1. Disponibilidad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-card rounded-xl border border-border"
            >
              <h4 className="font-semibold text-foreground mb-2">
                {locale === "es" ? "Disponibilidad" : "Availability"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {locale === "es" 
                  ? "Actualmente disponible para proyectos de consultoria, posiciones full-time o colaboraciones freelance."
                  : "Currently available for consulting projects, full-time positions, or freelance collaborations."
                }
              </p>
            </motion.div>

            {/* 2. Formulario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactForm 
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                isSubmitted={isSubmitted}
                handleSubmit={handleSubmit}
                locale={locale}
                t={t}
              />
            </motion.div>

            {/* 3. Email + 4. Redes Sociales (side by side) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Email */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">
                  {t("contact.info.email")}
                </h4>
                {profile && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs break-all">{profile.email}</span>
                  </a>
                )}
              </div>

              {/* Redes Sociales */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">
                  {locale === "es" ? "Redes Sociales" : "Social Media"}
                </h4>
                <div className="flex gap-2">
                  {profile && (
                    <>
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Extracted Form Component
function ContactForm({
  formData,
  setFormData,
  isSubmitting,
  isSubmitted,
  handleSubmit,
  locale,
  t
}: {
  formData: { name: string; email: string; company: string; message: string }
  setFormData: (data: { name: string; email: string; company: string; message: string }) => void
  isSubmitting: boolean
  isSubmitted: boolean
  handleSubmit: (e: React.FormEvent) => void
  locale: "es" | "en"
  t: (key: string) => string
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            {t("contact.form.name")} *
          </label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={locale === "es" ? "Tu nombre" : "Your name"}
            className="bg-card border-border"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            {t("contact.form.email")} *
          </label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={locale === "es" ? "tu@email.com" : "your@email.com"}
            className="bg-card border-border"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
          {locale === "es" ? "Empresa" : "Company"}
        </label>
        <Input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder={locale === "es" ? "Tu empresa (opcional)" : "Your company (optional)"}
          className="bg-card border-border"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          {t("contact.form.message")} *
        </label>
        <Textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={locale === "es" ? "Cuentame sobre tu proyecto o propuesta..." : "Tell me about your project or proposal..."}
          className="bg-card border-border resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isSubmitted}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("contact.form.sending")}
          </>
        ) : isSubmitted ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            {locale === "es" ? "Mensaje Enviado" : "Message Sent"}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {t("contact.form.submit")}
          </>
        )}
      </Button>
    </form>
  )
}
