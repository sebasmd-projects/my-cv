"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, CheckCircle, BarChart3, Briefcase, Code2, Building2 } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Stats } from "@/lib/api/profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsDashboardPage() {
  const { hasPermission } = useAuth()
  const { t } = useI18n()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const canEdit = hasPermission("edit_stats")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const data = await profileService.getStats()
    setStats(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!stats || !canEdit) return
    
    setIsSaving(true)
    await profileService.updateStats(stats)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateStat = (field: keyof Stats, value: number) => {
    if (stats) {
      setStats({ ...stats, [field]: value })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    { key: "yearsExperience" as keyof Stats, icon: BarChart3, label: "Anos de Experiencia", color: "text-primary" },
    { key: "projectsCompleted" as keyof Stats, icon: Briefcase, label: "Proyectos Completados", color: "text-green-500" },
    { key: "companiesWorked" as keyof Stats, icon: Building2, label: "Empresas", color: "text-blue-500" },
    { key: "technologiesMastered" as keyof Stats, icon: Code2, label: "Tecnologias", color: "text-orange-500" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("dashboard.stats")}</h1>
            <p className="text-muted-foreground">Numeros destacados del portfolio</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.map(({ key, icon: Icon, label, color }) => (
            <Card key={key} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">{label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={stats?.[key] || 0}
                  onChange={(e) => updateStat(key, parseInt(e.target.value) || 0)}
                  disabled={!canEdit}
                  className="bg-secondary border-border text-2xl font-bold h-14"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card border-border mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Vista Previa</CardTitle>
            <CardDescription>Asi se veran las estadisticas en el portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map(({ key, label }) => (
                <div key={key} className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-3xl font-bold text-primary">{stats?.[key]}+</div>
                  <div className="text-sm text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
