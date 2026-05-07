"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, register } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!isLogin && password !== confirmPassword) {
      setError("Las contrasenas no coinciden")
      setIsLoading(false)
      return
    }

    const result = isLogin 
      ? await login(email, password)
      : await register(email, password, name)

    setIsLoading(false)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Error desconocido")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Portfolio
        </Link>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isLogin ? t("auth.login") : t("auth.register")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? "Accede al panel de administracion"
                : "Crea una cuenta para acceder"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("auth.name")}</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required={!isLogin}
                    className="bg-secondary border-border"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("auth.email")}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@ejemplo.com"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("auth.password")}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    className="bg-secondary border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("auth.confirmPassword")}</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required={!isLogin}
                    className="bg-secondary border-border"
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isLogin ? "Iniciando..." : "Registrando..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {isLogin ? t("auth.login") : t("auth.register")}
                  </span>
                )}
              </Button>
            </form>

            {isLogin && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Credenciales de prueba:</p>
                <p>Admin: admin@portfolio.dev / admin123</p>
                <p>Editor: editor@portfolio.dev / editor123</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
              <span className="ml-1 text-primary font-medium">
                {isLogin ? t("auth.register") : t("auth.login")}
              </span>
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
