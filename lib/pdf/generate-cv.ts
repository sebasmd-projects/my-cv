"use client"

import jsPDF from "jspdf"
import type { Locale } from "@/lib/i18n/context"
import type { Profile, Stats, Experience, Skill, Education, Certification, Language } from "@/lib/api/profile-service"

interface CVData {
  profile: Profile
  stats: Stats
  experiences: Experience[]
  skillsByCategory: Record<string, Skill[]>
  education: Education[]
  certifications: Certification[]
  languages: Language[]
  locale: Locale
}

export async function generateCV(data: CVData): Promise<void> {
  const { profile, stats, experiences, skillsByCategory, education, certifications, languages, locale } = data
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let y = margin

  // Colors
  const primaryColor: [number, number, number] = [0, 150, 136] // Teal
  const darkColor: [number, number, number] = [33, 33, 33]
  const grayColor: [number, number, number] = [100, 100, 100]
  const lightGray: [number, number, number] = [200, 200, 200]

  // Helper functions
  const addSectionTitle = (title: string) => {
    checkPageBreak(15)
    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.setFont("helvetica", "bold")
    doc.text(title.toUpperCase(), margin, y)
    y += 2
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, y, margin + 40, y)
    y += 8
  }

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 45, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text(`${profile.firstName} ${profile.lastName}`, margin, 22)

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text(profile.title[locale] || profile.title.es, margin, 32)

  // Contact Info
  doc.setFontSize(9)
  const contactInfo = [profile.email, profile.phone, profile.location].filter(Boolean).join(" | ")
  doc.text(contactInfo, margin, 40)

  y = 55

  // Summary
  addSectionTitle(locale === "es" ? "PERFIL PROFESIONAL" : "PROFESSIONAL PROFILE")
  doc.setFontSize(10)
  doc.setTextColor(...darkColor)
  doc.setFont("helvetica", "normal")
  
  const summary = profile.summary[locale] || profile.summary.es
  const summaryLines = doc.splitTextToSize(summary, contentWidth)
  summaryLines.forEach((line: string) => {
    checkPageBreak(6)
    doc.text(line, margin, y)
    y += 5
  })
  y += 8

  // Stats
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(margin, y, contentWidth, 15, 2, 2, "F")
  
  const statsItems = [
    { value: `${stats.yearsExperience}+`, label: locale === "es" ? "Anos Exp." : "Years Exp." },
    { value: `${stats.projectsCompleted}+`, label: locale === "es" ? "Proyectos" : "Projects" },
    { value: `${stats.companiesWorked}`, label: locale === "es" ? "Empresas" : "Companies" },
    { value: `${stats.technologiesMastered}+`, label: locale === "es" ? "Tecnologias" : "Technologies" },
  ]

  const statWidth = contentWidth / 4
  statsItems.forEach((stat, index) => {
    const x = margin + statWidth * index + statWidth / 2
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text(stat.value, x, y + 6, { align: "center" })
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...grayColor)
    doc.text(stat.label, x, y + 11, { align: "center" })
  })

  y += 22

  // Experience
  addSectionTitle(locale === "es" ? "EXPERIENCIA PROFESIONAL" : "PROFESSIONAL EXPERIENCE")
  
  experiences.forEach((exp) => {
    checkPageBreak(35)
    
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...darkColor)
    doc.text(exp.position[locale] || exp.position.es, margin, y)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...grayColor)
    const companyText = exp.client ? `${exp.company} | ${exp.client}` : exp.company
    doc.text(companyText, margin, y + 5)
    
    const dateText = formatDateRange(exp.startDate, exp.endDate, exp.current, locale)
    doc.text(dateText, pageWidth - margin, y + 5, { align: "right" })
    
    y += 12
    
    doc.setFontSize(9)
    doc.setTextColor(...darkColor)
    const description = exp.description[locale] || exp.description.es
    const descLines = doc.splitTextToSize(description, contentWidth)
    descLines.slice(0, 2).forEach((line: string) => {
      doc.text(line, margin, y)
      y += 4
    })
    y += 2

    // Achievements (max 3)
    const achievements = exp.achievements[locale] || exp.achievements.es
    achievements.slice(0, 3).forEach((achievement) => {
      checkPageBreak(6)
      doc.setTextColor(...primaryColor)
      doc.text("•", margin, y)
      doc.setTextColor(...darkColor)
      const achLines = doc.splitTextToSize(achievement, contentWidth - 5)
      doc.text(achLines[0], margin + 4, y)
      y += 5
    })

    // Technologies
    y += 2
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    const techText = exp.technologies.slice(0, 6).join(" | ")
    doc.text(techText, margin, y)
    y += 10
  })

  // Skills - Two columns
  addSectionTitle(locale === "es" ? "HABILIDADES TECNICAS" : "TECHNICAL SKILLS")
  
  const categories = Object.entries(skillsByCategory)
  const colWidth = (contentWidth - 10) / 2

  categories.forEach(([category, skills], index) => {
    const col = index % 2
    const baseX = margin + col * (colWidth + 10)
    
    if (col === 0) {
      checkPageBreak(30)
    }

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text(category, baseX, y)
    
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...darkColor)
    
    skills.slice(0, 4).forEach((skill, skillIndex) => {
      const skillY = y + 5 + skillIndex * 5
      doc.text(`${skill.name} (${skill.level}%)`, baseX, skillY)
    })

    if (col === 1) {
      y += 25
    }
  })

  if (categories.length % 2 === 1) {
    y += 25
  }

  // Education & Certifications
  checkPageBreak(40)
  addSectionTitle(locale === "es" ? "EDUCACION Y CERTIFICACIONES" : "EDUCATION & CERTIFICATIONS")

  education.forEach((edu) => {
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...darkColor)
    doc.text(edu.field[locale] || edu.field.es, margin, y)
    
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...grayColor)
    doc.text(edu.institution, margin, y + 4)
    doc.text(edu.status[locale] || edu.status.es, pageWidth - margin, y + 4, { align: "right" })
    y += 10
  })

  if (certifications.length > 0) {
    y += 3
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...darkColor)
    doc.text(locale === "es" ? "Certificaciones:" : "Certifications:", margin, y)
    y += 5
    
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...grayColor)
    const certText = certifications.map(c => `${c.name} (${c.issuer}, ${c.date})`).join(" | ")
    const certLines = doc.splitTextToSize(certText, contentWidth)
    certLines.forEach((line: string) => {
      doc.text(line, margin, y)
      y += 4
    })
  }

  // Languages
  if (languages.length > 0) {
    y += 5
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...darkColor)
    doc.text(locale === "es" ? "Idiomas:" : "Languages:", margin, y)
    
    doc.setFont("helvetica", "normal")
    const langText = languages.map(l => `${l.name[locale] || l.name.es}: ${l.level[locale] || l.level.es}`).join(" | ")
    doc.text(langText, margin + 20, y)
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(...lightGray)
  doc.text(
    locale === "es" ? "CV generado automaticamente" : "CV automatically generated",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  )

  // Download
  const fileName = `CV_${profile.firstName}_${profile.lastName}_${locale.toUpperCase()}.pdf`
  doc.save(fileName)
}

function formatDateRange(startDate: string, endDate: string, current: boolean, locale: Locale): string {
  const formatDate = (date: string) => {
    const [year, month] = date.split("-")
    const monthsEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const months = locale === "es" ? monthsEs : monthsEn
    return `${months[parseInt(month) - 1]} ${year}`
  }

  const start = formatDate(startDate)
  const end = current ? (locale === "es" ? "Presente" : "Present") : formatDate(endDate)
  return `${start} - ${end}`
}
