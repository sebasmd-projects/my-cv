"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Check, X, Shield, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Password validation rules
const passwordRules = [
  { id: "length", label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "Una letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "Un número", test: (p: string) => /[0-9]/.test(p) },
]

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordRules, setShowPasswordRules] = useState(false)
  
  const { login, register, user, isLoading: authLoading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isPasswordValid = passwordRules.every(rule => rule.test(password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    if (!isLogin) {
      if (name.trim().length < 2) {
        setError("El nombre debe tener al menos 2 caracteres")
        return
      }

      if (!isPasswordValid) {
        setError("La contraseña no cumple con los requisitos")
        return
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden")
        return
      }
    }

    setIsLoading(true)

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isLogin ? t("auth.login") : t("auth.register")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? "Accede al panel de administración"
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
                    placeholder="Tu nombre completo"
                    required={!isLogin}
                    className="bg-secondary border-border"
                    autoComplete="name"
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
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("auth.password")}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => !isLogin && setShowPasswordRules(true)}
                    onBlur={() => setTimeout(() => setShowPasswordRules(false), 200)}
                    placeholder="********"
                    required
                    className="bg-secondary border-border pr-10"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {!isLogin && showPasswordRules && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-secondary/50 rounded-lg mt-2"
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-2">Requisitos:</p>
                    <ul className="space-y-1">
                      {passwordRules.map((rule) => {
                        const passed = rule.test(password)
                        return (
                          <li
                            key={rule.id}
                            className={`flex items-center gap-2 text-xs ${
                              passed ? "text-green-500" : "text-muted-foreground"
                            }`}
                          >
                            {passed ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            {rule.label}
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("auth.confirmPassword")}</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                      required={!isLogin}
                      className={`bg-secondary border-border pr-10 ${
                        confirmPassword && confirmPassword !== password
                          ? "border-destructive"
                          : confirmPassword && confirmPassword === password
                          ? "border-green-500"
                          : ""
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                >
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading || (!isLogin && (!isPasswordValid || password !== confirmPassword))}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
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
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <p className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Credenciales de prueba
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span>Admin</span>
                    <code className="text-xs bg-secondary px-2 py-0.5 rounded">admin@portfolio.dev</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span>Editor</span>
                    <code className="text-xs bg-secondary px-2 py-0.5 rounded">editor@portfolio.dev</code>
                  </div>
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    Contraseña: <code className="bg-secondary px-1 rounded">admin123</code> o <code className="bg-secondary px-1 rounded">editor123</code>
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setPassword("")
                setConfirmPassword("")
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <span className="ml-1 text-primary font-medium">
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </span>
            </button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </motion.div>
    </div>
  )
}
