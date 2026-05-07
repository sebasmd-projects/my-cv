"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Heart } from "lucide-react"
import { profileData } from "@/lib/profile-data"

export function Footer() {
  const currentYear = new Date().getFullYear()

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
                Sobre Mi
              </Link>
              <Link
                href="#skills"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Habilidades
              </Link>
              <Link
                href="#experience"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Experiencia
              </Link>
              <Link
                href="#contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contacto
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <a
                href={profileData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={profileData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${profileData.email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {currentYear} QA/Dev Portfolio. Construido con{" "}
              <Heart className="w-4 h-4 inline text-primary" /> usando Next.js y Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
