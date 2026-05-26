export const profileData = {
  fullName: "Analista QA & Desarrollador Full Stack",
  title: "Senior QA Engineer & Full Stack Developer",
  summary: "Analista de Calidad con mas de 7 anos de experiencia en desarrollo de software y aseguramiento de calidad (QA), especializado en automatizacion de pruebas, desarrollo backend con Python (Django, DRF) y Java (Spring) y desarrollo frontend con React y Next.js.",
  about: `He disenado e implementado frameworks de automatizacion para web, movil y APIs, integrados en pipelines CI/CD, logrando mejorar la cobertura de pruebas y reducir tiempos de validacion en entornos productivos.

Experiencia en arquitecturas de microservicios, pruebas end-to-end, rendimiento (JMeter) y validacion de sistemas basados en datos y Machine Learning.

Enfocado en construir soluciones escalables, confiables y alineadas con objetivos de negocio bajo metodologias agiles.`,
  email: "contacto@portfolio.dev",
  phone: "+57 300 123 4567",
  location: "Colombia",
  linkedinUrl: "https://www.linkedin.com/in/sebasti%C3%A1n-morales-delgado-33902b1a1/",
  githubUrl: "https://github.com/sebasmd-projects",
  
  experiences: [
    {
      id: "1",
      company: "Choucair Testing",
      client: "BANCOLOMBIA",
      position: "Analista de Pruebas",
      startDate: "2024-09",
      endDate: "2026-03",
      current: false,
      description: "Soporte tecnico integral en ambientes preproductivos y productivos, asegurando la estabilidad, disponibilidad y continuidad operativa de sistemas criticos en arquitectura de microservicios.",
      achievements: [
        "Gestion y optimizacion de pruebas automatizadas end-to-end",
        "Ejecucion de pruebas funcionales, de regresion y smoke testing",
        "Analisis y resolucion de incidentes en produccion con RCA",
        "Pruebas de rendimiento con JMeter",
        "Desarrollo de pruebas automatizadas para APIs REST con Karate"
      ],
      technologies: ["Karate", "JMeter", "Azure DevOps", "Git", "Docker", "AWS Cognito", "Selenium"]
    },
    {
      id: "2",
      company: "Fundacion Agua Viva",
      position: "Desarrollador Full Stack / QA",
      startDate: "2022-01",
      endDate: "2024-12",
      current: false,
      description: "Desarrollo de soluciones tecnologicas end-to-end e implementacion de frameworks de automatizacion para web y APIs.",
      achievements: [
        "Diseno de planes de prueba basados en analisis de riesgos",
        "Desarrollo de frameworks de automatizacion con Selenium y Karate",
        "Implementacion de soluciones e-commerce con pasarelas de pago",
        "Desarrollo de plataformas de educacion virtual basadas en Moodle",
        "Integracion de modulos CRM y ERP"
      ],
      technologies: ["Python", "Django", "React", "PostgreSQL", "Selenium", "Karate", "Jira", "Git"]
    },
    {
      id: "3",
      company: "Esstrategia S.A.S",
      position: "Desarrollador Full Stack / QA",
      startDate: "2017-01",
      endDate: "2021-12",
      current: false,
      description: "Certificacion de plataforma medica orientada a la calificacion de perdida de capacidad laboral y desarrollo de soluciones con Machine Learning.",
      achievements: [
        "Validacion de modelos de Machine Learning (NLP, Decision Trees, SVM)",
        "Automatizacion de procesos de testing con Robot Framework",
        "Desarrollo de APIs REST y arquitectura de microservicios",
        "Implementacion de dashboards con metricas e indicadores",
        "Pruebas de rendimiento con JMeter"
      ],
      technologies: ["Python", "Robot Framework", "Machine Learning", "PostgreSQL", "MongoDB", "Docker", "Git"]
    }
  ],

  skillsByCategory: {
    "QA & Testing": [
      { name: "Selenium WebDriver", level: 95 },
      { name: "Karate Framework", level: 90 },
      { name: "Robot Framework", level: 85 },
      { name: "JMeter", level: 85 },
      { name: "Appium", level: 80 },
      { name: "Cucumber/BDD", level: 90 },
      { name: "Postman", level: 95 }
    ],
    "Backend": [
      { name: "Python", level: 90 },
      { name: "Django/DRF", level: 90 },
      { name: "Java", level: 85 },
      { name: "Spring Boot", level: 80 },
      { name: "Node.js", level: 75 },
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 75 }
    ],
    "Frontend": [
      { name: "React", level: 85 },
      { name: "Next.js", level: 80 },
      { name: "TypeScript", level: 80 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 90 },
      { name: "Tailwind CSS", level: 85 }
    ],
    "DevOps & Tools": [
      { name: "Docker", level: 85 },
      { name: "Azure DevOps", level: 90 },
      { name: "Git/GitHub", level: 95 },
      { name: "CI/CD Pipelines", level: 85 },
      { name: "AWS", level: 75 },
      { name: "Linux", level: 80 }
    ]
  },

  education: [
    {
      institution: "Fundacion Universitaria Catolica del Norte",
      degree: "Profesional",
      field: "Ingenieria Informatica",
      startDate: "2020-01",
      status: "En Curso"
    }
  ],

  certifications: [
    { name: "Machine Learning", issuer: "UDEMY", date: "2018" },
    { name: "Java Development", issuer: "UDEMY", date: "2017" },
    { name: "Python Programming", issuer: "UDEMY", date: "2017" }
  ],

  languages: [
    { name: "Espanol", level: "Nativo" },
    { name: "Ingles", level: "B2 Intermedio" }
  ],

  stats: {
    yearsExperience: 7,
    projectsCompleted: 50,
    companiesWorked: 4,
    technologiesMastered: 25
  }
}
