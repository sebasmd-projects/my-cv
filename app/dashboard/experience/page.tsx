"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, CheckCircle, Plus, X, Pencil, Trash2, Building2 } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Experience } from "@/lib/api/profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ExperienceDashboardPage() {
  const { hasPermission } = useAuth()
  const { t } = useI18n()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const canEdit = hasPermission("edit_experience")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const data = await profileService.getExperiences()
    setExperiences(data)
    setIsLoading(false)
  }

  const handleSave = async (exp: Experience) => {
    if (!canEdit) return
    
    setIsSaving(true)
    if (exp.id.startsWith("new-")) {
      const { id, ...data } = exp
      const newExp = await profileService.addExperience(data)
      setExperiences(prev => [...prev.filter(e => e.id !== id), newExp])
    } else {
      await profileService.updateExperience(exp.id, exp)
      setExperiences(prev => prev.map(e => e.id === exp.id ? exp : e))
    }
    setIsSaving(false)
    setSaved(true)
    setIsDialogOpen(false)
    setEditingExp(null)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!canEdit || !confirm("Estas seguro de eliminar esta experiencia?")) return
    
    await profileService.deleteExperience(id)
    setExperiences(prev => prev.filter(e => e.id !== id))
  }

  const createNewExperience = (): Experience => ({
    id: `new-${Date.now()}`,
    company: "",
    client: null,
    position: { es: "", en: "" },
    startDate: "",
    endDate: "",
    current: false,
    description: { es: "", en: "" },
    achievements: { es: [], en: [] },
    technologies: []
  })

  const formatDate = (dateString: string): string => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return `${months[parseInt(month) - 1]} ${year}`
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
            <h1 className="text-2xl font-bold text-foreground">{t("dashboard.experience")}</h1>
            <p className="text-muted-foreground">Gestiona tu trayectoria laboral</p>
          </div>
          
          {canEdit && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingExp(createNewExperience())}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Experiencia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingExp?.id.startsWith("new-") ? "Nueva Experiencia" : "Editar Experiencia"}
                  </DialogTitle>
                  <DialogDescription>
                    Completa los campos en ambos idiomas
                  </DialogDescription>
                </DialogHeader>
                
                {editingExp && (
                  <ExperienceForm
                    experience={editingExp}
                    onChange={setEditingExp}
                    onSave={() => handleSave(editingExp)}
                    onCancel={() => {
                      setIsDialogOpen(false)
                      setEditingExp(null)
                    }}
                    isSaving={isSaving}
                  />
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{exp.position.es}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                      {exp.client && <p className="text-sm text-primary">{exp.client}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate)}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.technologies.slice(0, 5).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 text-xs font-mono bg-secondary rounded text-foreground">
                            {tech}
                          </span>
                        ))}
                        {exp.technologies.length > 5 && (
                          <span className="px-2 py-0.5 text-xs text-muted-foreground">
                            +{exp.technologies.length - 5} mas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingExp(exp)
                          setIsDialogOpen(true)
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exp.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ExperienceForm({
  experience,
  onChange,
  onSave,
  onCancel,
  isSaving
}: {
  experience: Experience
  onChange: (exp: Experience) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}) {
  const [techInput, setTechInput] = useState("")
  const [achievementInputEs, setAchievementInputEs] = useState("")
  const [achievementInputEn, setAchievementInputEn] = useState("")

  const addTech = () => {
    if (techInput.trim() && !experience.technologies.includes(techInput.trim())) {
      onChange({ ...experience, technologies: [...experience.technologies, techInput.trim()] })
      setTechInput("")
    }
  }

  const removeTech = (tech: string) => {
    onChange({ ...experience, technologies: experience.technologies.filter(t => t !== tech) })
  }

  const addAchievement = (lang: "es" | "en") => {
    const input = lang === "es" ? achievementInputEs : achievementInputEn
    if (input.trim()) {
      onChange({
        ...experience,
        achievements: {
          ...experience.achievements,
          [lang]: [...experience.achievements[lang], input.trim()]
        }
      })
      lang === "es" ? setAchievementInputEs("") : setAchievementInputEn("")
    }
  }

  const removeAchievement = (lang: "es" | "en", index: number) => {
    onChange({
      ...experience,
      achievements: {
        ...experience.achievements,
        [lang]: experience.achievements[lang].filter((_, i) => i !== index)
      }
    })
  }

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Empresa</label>
          <Input
            value={experience.company}
            onChange={(e) => onChange({ ...experience, company: e.target.value })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cliente (opcional)</label>
          <Input
            value={experience.client || ""}
            onChange={(e) => onChange({ ...experience, client: e.target.value || null })}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cargo (Espanol)</label>
          <Input
            value={experience.position.es}
            onChange={(e) => onChange({ ...experience, position: { ...experience.position, es: e.target.value } })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Position (English)</label>
          <Input
            value={experience.position.en}
            onChange={(e) => onChange({ ...experience, position: { ...experience.position, en: e.target.value } })}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Fecha Inicio (YYYY-MM)</label>
          <Input
            value={experience.startDate}
            onChange={(e) => onChange({ ...experience, startDate: e.target.value })}
            placeholder="2024-01"
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Fecha Fin (YYYY-MM)</label>
          <Input
            value={experience.endDate}
            onChange={(e) => onChange({ ...experience, endDate: e.target.value })}
            placeholder="2025-12"
            disabled={experience.current}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={experience.current}
          onChange={(e) => onChange({ ...experience, current: e.target.checked })}
          className="rounded border-border"
        />
        Trabajo actual
      </label>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Descripcion (Espanol)</label>
        <Textarea
          value={experience.description.es}
          onChange={(e) => onChange({ ...experience, description: { ...experience.description, es: e.target.value } })}
          rows={2}
          className="bg-secondary border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description (English)</label>
        <Textarea
          value={experience.description.en}
          onChange={(e) => onChange({ ...experience, description: { ...experience.description, en: e.target.value } })}
          rows={2}
          className="bg-secondary border-border resize-none"
        />
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tecnologias</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {experience.technologies.map((tech) => (
            <span key={tech} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-secondary rounded text-foreground">
              {tech}
              <button onClick={() => removeTech(tech)} className="text-muted-foreground hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Nueva tecnologia..."
            className="bg-secondary border-border"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
          />
          <Button onClick={addTech} variant="outline" size="sm" className="border-border">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Achievements ES */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Logros (Espanol)</label>
        <ul className="space-y-1 mb-2">
          {experience.achievements.es.map((ach, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex-1">{ach}</span>
              <button onClick={() => removeAchievement("es", i)} className="text-muted-foreground hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Input
            value={achievementInputEs}
            onChange={(e) => setAchievementInputEs(e.target.value)}
            placeholder="Nuevo logro..."
            className="bg-secondary border-border"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement("es"))}
          />
          <Button onClick={() => addAchievement("es")} variant="outline" size="sm" className="border-border">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Achievements EN */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Achievements (English)</label>
        <ul className="space-y-1 mb-2">
          {experience.achievements.en.map((ach, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex-1">{ach}</span>
              <button onClick={() => removeAchievement("en", i)} className="text-muted-foreground hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Input
            value={achievementInputEn}
            onChange={(e) => setAchievementInputEn(e.target.value)}
            placeholder="New achievement..."
            className="bg-secondary border-border"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement("en"))}
          />
          <Button onClick={() => addAchievement("en")} variant="outline" size="sm" className="border-border">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} className="border-border">
          Cancelar
        </Button>
        <Button onClick={onSave} disabled={isSaving} className="bg-primary text-primary-foreground">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>
    </div>
  )
}
