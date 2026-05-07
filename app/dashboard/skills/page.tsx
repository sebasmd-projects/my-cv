"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, CheckCircle, Plus, X, GripVertical } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { profileService, type Skill } from "@/lib/api/profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function SkillsDashboardPage() {
  const { hasPermission } = useAuth()
  const { t } = useI18n()
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newSkillName, setNewSkillName] = useState<Record<string, string>>({})

  const canEdit = hasPermission("edit_skills")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const data = await profileService.getSkillsByCategory()
    setSkillsByCategory(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!canEdit) return
    
    setIsSaving(true)
    await profileService.updateSkillsByCategory(skillsByCategory)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateSkillLevel = (category: string, skillIndex: number, level: number) => {
    const updated = { ...skillsByCategory }
    updated[category][skillIndex].level = level
    setSkillsByCategory(updated)
  }

  const addSkill = (category: string) => {
    const name = newSkillName[category]?.trim()
    if (!name) return

    const updated = { ...skillsByCategory }
    updated[category] = [...updated[category], { name, level: 50 }]
    setSkillsByCategory(updated)
    setNewSkillName({ ...newSkillName, [category]: "" })
  }

  const removeSkill = (category: string, skillIndex: number) => {
    const updated = { ...skillsByCategory }
    updated[category] = updated[category].filter((_, i) => i !== skillIndex)
    setSkillsByCategory(updated)
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
            <h1 className="text-2xl font-bold text-foreground">{t("dashboard.skills")}</h1>
            <p className="text-muted-foreground">Gestiona tus habilidades tecnicas</p>
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

        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <Card key={category} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
                <CardDescription>{skills.length} habilidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={`${category}-${index}`} className="flex items-center gap-4">
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Slider
                        value={[skill.level]}
                        onValueChange={([value]) => updateSkillLevel(category, index, value)}
                        max={100}
                        step={5}
                        disabled={!canEdit}
                        className="w-full"
                      />
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => removeSkill(category, index)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {canEdit && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Input
                      value={newSkillName[category] || ""}
                      onChange={(e) => setNewSkillName({ ...newSkillName, [category]: e.target.value })}
                      placeholder="Nueva habilidad..."
                      className="bg-secondary border-border"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(category))}
                    />
                    <Button onClick={() => addSkill(category)} variant="outline" className="border-border">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
