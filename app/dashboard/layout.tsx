"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  BarChart3, 
  GraduationCap, 
  LogOut,
  Settings,
  ArrowLeft,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { key: "profile", icon: User, label: "Perfil", href: "/dashboard" },
  { key: "stats", icon: BarChart3, label: "Estadisticas", href: "/dashboard/stats" },
  { key: "skills", icon: Settings, label: "Habilidades", href: "/dashboard/skills" },
  { key: "experience", icon: Briefcase, label: "Experiencia", href: "/dashboard/experience" },
  { key: "education", icon: GraduationCap, label: "Educacion", href: "/dashboard/education" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout, hasPermission } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border 
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Portfolio</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const permission = `edit_${item.key}`
              const canAccess = item.key === "profile" || hasPermission(permission) || hasPermission("view_dashboard")
              
              if (!canAccess) return null

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t("auth.logout")}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background border-b border-border p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-foreground hover:bg-secondary rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-semibold">Dashboard</span>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
