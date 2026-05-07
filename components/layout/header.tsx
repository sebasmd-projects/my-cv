"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Github, Linkedin, Mail, User, LogIn, Globe, FileDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"
import { profileService } from "@/lib/api/profile-service"
import { cn } from "@/lib/utils"

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const { user } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<{ githubUrl: string; linkedinUrl: string } | null>(null)

  const navItems = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.experience"), href: "#experience" },
    { label: t("nav.contact"), href: "#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      const data = await profileService.getProfile()
      setProfile({ githubUrl: data.githubUrl, linkedinUrl: data.linkedinUrl })
    }
    loadProfile()
  }, [])

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              {"<"}QA<span className="text-primary">/</span>Dev{">"}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {profile && (
              <>
                <Link
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
              </>
            )}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium">{locale}</span>
            </button>

            <ThemeToggle />

            {/* Auth Button */}
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
              >
                <User className="w-4 h-4" />
                {t("nav.dashboard")}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
              >
                <LogIn className="w-4 h-4" />
                {t("nav.login")}
              </Link>
            )}

            <Link
              href="#contact"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t("hero.contact")}
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Auth Link Mobile */}
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  {t("nav.dashboard")}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  {t("nav.login")}
                </Link>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {profile && (
                  <>
                    <Link
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                    <Link
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Link>
                  </>
                )}
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span className="uppercase text-sm font-medium">{locale}</span>
                </button>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
