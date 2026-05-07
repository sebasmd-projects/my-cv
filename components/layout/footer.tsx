"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Mail, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { profileService } from "@/lib/api/profile-service"

export function Footer() {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()
  const [profile, setProfile] = useState<{ githubUrl: string; linkedinUrl: string; email: string } | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      const data = await profileService.getProfile()
      setProfile({ githubUrl: data.githubUrl, linkedinUrl: data.linkedinUrl, email: data.email })
    }
    loadProfile()
  }, [])

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {"<"}QA<span className="text-primary">/</span>Dev{">"}
              </span>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                href="#about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.about")}
              </Link>
              <Link
                href="#skills"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.skills")}
              </Link>
              <Link
                href="#experience"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.experience")}
              </Link>
              <Link
                href="#contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </nav>

            {profile && (
              <div className="flex items-center gap-4">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {currentYear} QA/Dev Portfolio. {t("footer.madeWith")}{" "}
              <Heart className="w-4 h-4 inline text-primary" /> {locale === "es" ? "usando" : "using"} Next.js {locale === "es" ? "y" : "and"} Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
