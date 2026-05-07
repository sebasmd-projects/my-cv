"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Locale = "es" | "en"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Locale, Record<string, string>> = {
  es: {
    // Navigation
    "nav.about": "Sobre Mi",
    "nav.skills": "Habilidades",
    "nav.experience": "Experiencia",
    "nav.contact": "Contacto",
    "nav.login": "Iniciar Sesion",
    "nav.dashboard": "Dashboard",
    
    // Hero
    "hero.available": "Disponible para nuevos proyectos",
    "hero.contact": "Contactar",
    "hero.viewExperience": "Ver Experiencia",
    "hero.downloadCV": "Descargar CV",
    "hero.yearsExperience": "Anos de Experiencia",
    "hero.projectsCompleted": "Proyectos Completados",
    "hero.companies": "Empresas",
    "hero.technologies": "Tecnologias",
    "hero.scroll": "Scroll",
    
    // About
    "about.title": "Sobre Mi",
    "about.subtitle": "Conoceme",
    "about.education": "Educacion",
    "about.certifications": "Certificaciones y Cursos",
    "about.languages": "Idiomas",
    "about.inProgress": "En Curso",
    
    // Skills
    "skills.title": "Habilidades",
    "skills.subtitle": "Stack Tecnologico",
    "skills.qa": "QA & Testing",
    "skills.backend": "Backend",
    "skills.frontend": "Frontend",
    "skills.devops": "DevOps & Tools",
    
    // Experience
    "experience.title": "Experiencia Profesional",
    "experience.subtitle": "Trayectoria Laboral",
    "experience.achievements": "Logros Destacados",
    "experience.present": "Presente",
    
    // Contact
    "contact.title": "Contacto",
    "contact.subtitle": "Trabajemos Juntos",
    "contact.description": "Estoy interesado en oportunidades de trabajo freelance y posiciones permanentes. Si tienes un proyecto en mente o simplemente quieres saludar, no dudes en contactarme.",
    "contact.form.name": "Nombre",
    "contact.form.email": "Email",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar Mensaje",
    "contact.form.sending": "Enviando...",
    "contact.info.email": "Email",
    "contact.info.phone": "Telefono",
    "contact.info.location": "Ubicacion",
    
    // Footer
    "footer.rights": "Todos los derechos reservados",
    "footer.madeWith": "Hecho con",
    
    // Auth
    "auth.login": "Iniciar Sesion",
    "auth.register": "Registrarse",
    "auth.email": "Email",
    "auth.password": "Contrasena",
    "auth.confirmPassword": "Confirmar Contrasena",
    "auth.name": "Nombre",
    "auth.forgotPassword": "Olvidaste tu contrasena?",
    "auth.noAccount": "No tienes cuenta?",
    "auth.hasAccount": "Ya tienes cuenta?",
    "auth.logout": "Cerrar Sesion",
    
    // Dashboard
    "dashboard.title": "Panel de Administracion",
    "dashboard.welcome": "Bienvenido",
    "dashboard.profile": "Perfil",
    "dashboard.skills": "Habilidades",
    "dashboard.experience": "Experiencia",
    "dashboard.stats": "Estadisticas",
    "dashboard.save": "Guardar Cambios",
    "dashboard.saving": "Guardando...",
    "dashboard.saved": "Cambios guardados",
    "dashboard.add": "Agregar",
    "dashboard.edit": "Editar",
    "dashboard.delete": "Eliminar",
    "dashboard.cancel": "Cancelar",
  },
  en: {
    // Navigation
    "nav.about": "About Me",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    
    // Hero
    "hero.available": "Available for new projects",
    "hero.contact": "Contact Me",
    "hero.viewExperience": "View Experience",
    "hero.downloadCV": "Download CV",
    "hero.yearsExperience": "Years of Experience",
    "hero.projectsCompleted": "Projects Completed",
    "hero.companies": "Companies",
    "hero.technologies": "Technologies",
    "hero.scroll": "Scroll",
    
    // About
    "about.title": "About Me",
    "about.subtitle": "Get to Know Me",
    "about.education": "Education",
    "about.certifications": "Certifications & Courses",
    "about.languages": "Languages",
    "about.inProgress": "In Progress",
    
    // Skills
    "skills.title": "Skills",
    "skills.subtitle": "Tech Stack",
    "skills.qa": "QA & Testing",
    "skills.backend": "Backend",
    "skills.frontend": "Frontend",
    "skills.devops": "DevOps & Tools",
    
    // Experience
    "experience.title": "Professional Experience",
    "experience.subtitle": "Work History",
    "experience.achievements": "Key Achievements",
    "experience.present": "Present",
    
    // Contact
    "contact.title": "Contact",
    "contact.subtitle": "Let's Work Together",
    "contact.description": "I'm interested in freelance opportunities and permanent positions. If you have a project in mind or just want to say hi, feel free to reach out.",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.info.email": "Email",
    "contact.info.phone": "Phone",
    "contact.info.location": "Location",
    
    // Footer
    "footer.rights": "All rights reserved",
    "footer.madeWith": "Made with",
    
    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Name",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.logout": "Logout",
    
    // Dashboard
    "dashboard.title": "Admin Panel",
    "dashboard.welcome": "Welcome",
    "dashboard.profile": "Profile",
    "dashboard.skills": "Skills",
    "dashboard.experience": "Experience",
    "dashboard.stats": "Statistics",
    "dashboard.save": "Save Changes",
    "dashboard.saving": "Saving...",
    "dashboard.saved": "Changes saved",
    "dashboard.add": "Add",
    "dashboard.edit": "Edit",
    "dashboard.delete": "Delete",
    "dashboard.cancel": "Cancel",
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-locale") as Locale
    if (saved && (saved === "es" || saved === "en")) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("portfolio-locale", newLocale)
  }

  const t = (key: string): string => {
    return translations[locale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
