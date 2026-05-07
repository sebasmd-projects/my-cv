"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, CheckCircle, Plus, X } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Profile } from "@/lib/api/profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, hasPermission } = useAuth()
  const { t, locale } = useI18n()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const canEdit = hasPermission("edit_profile")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [profileData, techData] = await Promise.all([
      profileService.getProfile(),
      profileService.getTechStack()
    ])
    setProfile(profileData)
    setTechStack(techData)
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!profile || !canEdit) return
    
    setIsSaving(true)
    await Promise.all([
      profileService.updateProfile(profile),
      profileService.updateTechStack(techStack)
    ])
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const updateProfileField = (field: keyof Profile, value: string | Record<string, string>) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
    }
  }

  const updateLocalizedField = (field: "title" | "summary" | "about", lang: "es" | "en", value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: { ...profile[field], [lang]: value }
      })
    }
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
            <h1 className="text-2xl font-bold text-foreground">{t("dashboard.profile")}</h1>
            <p className="text-muted-foreground">
              {t("dashboard.welcome")}, {user?.name}
            </p>
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

        {/* Personal Info */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informacion Personal</CardTitle>
            <CardDescription>Datos basicos de tu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre</label>
                <Input
                  value={profile?.firstName || ""}
                  onChange={(e) => updateProfileField("firstName", e.target.value)}
                  disabled={!canEdit}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Apellido</label>
                <Input
                  value={profile?.lastName || ""}
                  onChange={(e) => updateProfileField("lastName", e.target.value)}
                  disabled={!canEdit}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={profile?.email || ""}
                  onChange={(e) => updateProfileField("email", e.target.value)}
                  disabled={!canEdit}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Telefono</label>
                <Input
                  value={profile?.phone || ""}
                  onChange={(e) => updateProfileField("phone", e.target.value)}
                  disabled={!canEdit}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ubicacion</label>
              <Input
                value={profile?.location || ""}
                onChange={(e) => updateProfileField("location", e.target.value)}
                disabled={!canEdit}
                className="bg-secondary border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                <Input
                  value={profile?.linkedinUrl || ""}
                  onChange={(e) => updateProfileField("linkedinUrl", e.target.value)}
                  disabled={!canEdit}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">GitHub URL</label>
                <Input
                  value={profile?.githubUrl || ""}
                  onChange={(e) => updateProfileField("githubUrl", e.target.value)}
                  disabled={!canEdit}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Title - Bilingual */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Titulo Profesional</CardTitle>
            <CardDescription>En espanol e ingles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Titulo (Espanol)</label>
              <Input
                value={profile?.title?.es || ""}
                onChange={(e) => updateLocalizedField("title", "es", e.target.value)}
                disabled={!canEdit}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title (English)</label>
              <Input
                value={profile?.title?.en || ""}
                onChange={(e) => updateLocalizedField("title", "en", e.target.value)}
                disabled={!canEdit}
                className="bg-secondary border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary - Bilingual */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Resumen Profesional</CardTitle>
            <CardDescription>Descripcion breve para el hero</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resumen (Espanol)</label>
              <Textarea
                value={profile?.summary?.es || ""}
                onChange={(e) => updateLocalizedField("summary", "es", e.target.value)}
                disabled={!canEdit}
                rows={3}
                className="bg-secondary border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Summary (English)</label>
              <Textarea
                value={profile?.summary?.en || ""}
                onChange={(e) => updateLocalizedField("summary", "en", e.target.value)}
                disabled={!canEdit}
                rows={3}
                className="bg-secondary border-border resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* About - Bilingual */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Sobre Mi</CardTitle>
            <CardDescription>Descripcion completa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sobre Mi (Espanol)</label>
              <Textarea
                value={profile?.about?.es || ""}
                onChange={(e) => updateLocalizedField("about", "es", e.target.value)}
                disabled={!canEdit}
                rows={5}
                className="bg-secondary border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">About Me (English)</label>
              <Textarea
                value={profile?.about?.en || ""}
                onChange={(e) => updateLocalizedField("about", "en", e.target.value)}
                disabled={!canEdit}
                rows={5}
                className="bg-secondary border-border resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Stack Tecnologico</CardTitle>
            <CardDescription>Tecnologias principales mostradas en el hero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-mono bg-secondary rounded-md text-foreground"
                >
                  {tech}
                  {canEdit && (
                    <button
                      onClick={() => removeTech(tech)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            
            {canEdit && (
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Nueva tecnologia..."
                  className="bg-secondary border-border"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                />
                <Button onClick={addTech} variant="outline" className="border-border">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
