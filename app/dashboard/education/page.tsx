"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, CheckCircle, Plus, X, GraduationCap, Award } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Education, type Certification, type Language } from "@/lib/api/profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EducationDashboardPage() {
  const { hasPermission } = useAuth()
  const { t } = useI18n()
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const canEdit = hasPermission("edit_education")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [eduData, certData, langData] = await Promise.all([
      profileService.getEducation(),
      profileService.getCertifications(),
      profileService.getLanguages()
    ])
    setEducation(eduData)
    setCertifications(certData)
    setLanguages(langData)
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!canEdit) return
    
    setIsSaving(true)
    await Promise.all([
      profileService.updateEducation(education),
      profileService.updateCertifications(certifications),
      profileService.updateLanguages(languages)
    ])
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: String(Date.now()),
      institution: "",
      degree: { es: "", en: "" },
      field: { es: "", en: "" },
      startDate: "",
      status: { es: "En Curso", en: "In Progress" }
    }
    setEducation([...education, newEdu])
  }

  const updateEducation = (index: number, field: string, value: string | Record<string, string>) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    setEducation(updated)
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    const newCert: Certification = {
      id: String(Date.now()),
      name: "",
      issuer: "",
      date: ""
    }
    setCertifications([...certifications, newCert])
  }

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setCertifications(updated)
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const addLanguage = () => {
    const newLang: Language = {
      name: { es: "", en: "" },
      level: { es: "", en: "" }
    }
    setLanguages([...languages, newLang])
  }

  const updateLanguage = (index: number, field: "name" | "level", lang: "es" | "en", value: string) => {
    const updated = [...languages]
    updated[index] = {
      ...updated[index],
      [field]: { ...updated[index][field], [lang]: value }
    }
    setLanguages(updated)
  }

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Educacion y Certificaciones</h1>
            <p className="text-muted-foreground">Gestiona tu formacion academica</p>
          </div>
          
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? t("dashboard.saving") : saved ? t("dashboard.saved") : t("dashboard.save")}
            </Button>
          )}
        </div>

        {/* Education */}
        <Card className="bg-card border-border mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Educacion
              </CardTitle>
              <CardDescription>Formacion academica</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={addEducation} variant="outline" size="sm" className="border-border">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className="p-4 bg-secondary/50 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Institucion</label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        disabled={!canEdit}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Titulo (ES)</label>
                        <Input
                          value={edu.degree.es}
                          onChange={(e) => updateEducation(index, "degree", { ...edu.degree, es: e.target.value })}
                          disabled={!canEdit}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Degree (EN)</label>
                        <Input
                          value={edu.degree.en}
                          onChange={(e) => updateEducation(index, "degree", { ...edu.degree, en: e.target.value })}
                          disabled={!canEdit}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Campo (ES)</label>
                        <Input
                          value={edu.field.es}
                          onChange={(e) => updateEducation(index, "field", { ...edu.field, es: e.target.value })}
                          disabled={!canEdit}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Field (EN)</label>
                        <Input
                          value={edu.field.en}
                          onChange={(e) => updateEducation(index, "field", { ...edu.field, en: e.target.value })}
                          disabled={!canEdit}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Fecha Inicio</label>
                        <Input
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                          placeholder="2020-01"
                          disabled={!canEdit}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Estado (ES/EN)</label>
                        <div className="flex gap-2">
                          <Input
                            value={edu.status.es}
                            onChange={(e) => updateEducation(index, "status", { ...edu.status, es: e.target.value })}
                            placeholder="En Curso"
                            disabled={!canEdit}
                            className="bg-secondary border-border"
                          />
                          <Input
                            value={edu.status.en}
                            onChange={(e) => updateEducation(index, "status", { ...edu.status, en: e.target.value })}
                            placeholder="In Progress"
                            disabled={!canEdit}
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="ml-4 p-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="bg-card border-border mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Certificaciones
              </CardTitle>
              <CardDescription>Cursos y certificados</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={addCertification} variant="outline" size="sm" className="border-border">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(index, "name", e.target.value)}
                    placeholder="Nombre"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                    placeholder="Emisor"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                  <Input
                    value={cert.date}
                    onChange={(e) => updateCertification(index, "date", e.target.value)}
                    placeholder="Ano"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                </div>
                {canEdit && (
                  <button
                    onClick={() => removeCertification(index)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Idiomas</CardTitle>
              <CardDescription>Competencias linguisticas</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={addLanguage} variant="outline" size="sm" className="border-border">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <Input
                    value={lang.name.es}
                    onChange={(e) => updateLanguage(index, "name", "es", e.target.value)}
                    placeholder="Idioma (ES)"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                  <Input
                    value={lang.name.en}
                    onChange={(e) => updateLanguage(index, "name", "en", e.target.value)}
                    placeholder="Language (EN)"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                  <Input
                    value={lang.level.es}
                    onChange={(e) => updateLanguage(index, "level", "es", e.target.value)}
                    placeholder="Nivel (ES)"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                  <Input
                    value={lang.level.en}
                    onChange={(e) => updateLanguage(index, "level", "en", e.target.value)}
                    placeholder="Level (EN)"
                    disabled={!canEdit}
                    className="bg-secondary border-border"
                  />
                </div>
                {canEdit && (
                  <button
                    onClick={() => removeLanguage(index)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
