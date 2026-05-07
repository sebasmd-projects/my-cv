"use client"

import mockData from "./mock-data.json"
import type { Locale } from "@/lib/i18n/context"

// Types
export interface Profile {
  id: string
  firstName: string
  lastName: string
  title: Record<Locale, string>
  roles: string[]
  summary: Record<Locale, string>
  about: Record<Locale, string>
  email: string
  phone: string
  location: string
  linkedinUrl: string
  githubUrl: string
}

export interface Stats {
  yearsExperience: number
  projectsCompleted: number
  companiesWorked: number
  technologiesMastered: number
}

export interface Experience {
  id: string
  company: string
  client: string | null
  position: Record<Locale, string>
  startDate: string
  endDate: string
  current: boolean
  description: Record<Locale, string>
  achievements: Record<Locale, string[]>
  technologies: string[]
}

export interface Skill {
  name: string
  level: number
}

export interface Education {
  id: string
  institution: string
  degree: Record<Locale, string>
  field: Record<Locale, string>
  startDate: string
  status: Record<Locale, string>
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
}

export interface Language {
  name: Record<Locale, string>
  level: Record<Locale, string>
}

// In-memory state (simulates database)
let profileState = { ...mockData.profile }
let statsState = { ...mockData.stats }
let experiencesState = [...mockData.experiences]
let skillsByCategoryState = { ...mockData.skillsByCategory }
let educationState = [...mockData.education]
let certificationsState = [...mockData.certifications]
let languagesState = [...mockData.languages]
let techStackState = [...mockData.techStack]

// Simulated API calls
export const profileService = {
  // Profile
  async getProfile(): Promise<Profile> {
    await delay(100)
    return profileState as Profile
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    await delay(300)
    profileState = { ...profileState, ...data }
    return profileState as Profile
  },

  // Stats
  async getStats(): Promise<Stats> {
    await delay(100)
    return statsState
  },

  async updateStats(data: Partial<Stats>): Promise<Stats> {
    await delay(300)
    statsState = { ...statsState, ...data }
    return statsState
  },

  // Tech Stack
  async getTechStack(): Promise<string[]> {
    await delay(100)
    return techStackState
  },

  async updateTechStack(data: string[]): Promise<string[]> {
    await delay(300)
    techStackState = [...data]
    return techStackState
  },

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    await delay(100)
    return experiencesState as Experience[]
  },

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    await delay(300)
    const index = experiencesState.findIndex(e => e.id === id)
    if (index !== -1) {
      experiencesState[index] = { ...experiencesState[index], ...data }
    }
    return experiencesState[index] as Experience
  },

  async addExperience(data: Omit<Experience, "id">): Promise<Experience> {
    await delay(300)
    const newExp = { ...data, id: String(Date.now()) }
    experiencesState.push(newExp as typeof experiencesState[0])
    return newExp as Experience
  },

  async deleteExperience(id: string): Promise<void> {
    await delay(300)
    experiencesState = experiencesState.filter(e => e.id !== id)
  },

  // Skills
  async getSkillsByCategory(): Promise<Record<string, Skill[]>> {
    await delay(100)
    return skillsByCategoryState
  },

  async updateSkillsByCategory(data: Record<string, Skill[]>): Promise<Record<string, Skill[]>> {
    await delay(300)
    skillsByCategoryState = { ...data }
    return skillsByCategoryState
  },

  // Education
  async getEducation(): Promise<Education[]> {
    await delay(100)
    return educationState as Education[]
  },

  async updateEducation(data: Education[]): Promise<Education[]> {
    await delay(300)
    educationState = [...data] as typeof educationState
    return educationState as Education[]
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    await delay(100)
    return certificationsState
  },

  async updateCertifications(data: Certification[]): Promise<Certification[]> {
    await delay(300)
    certificationsState = [...data]
    return certificationsState
  },

  // Languages
  async getLanguages(): Promise<Language[]> {
    await delay(100)
    return languagesState as Language[]
  },

  async updateLanguages(data: Language[]): Promise<Language[]> {
    await delay(300)
    languagesState = [...data] as typeof languagesState
    return languagesState as Language[]
  },

  // Get all data for public portfolio
  async getAllData() {
    await delay(100)
    return {
      profile: profileState,
      stats: statsState,
      techStack: techStackState,
      experiences: experiencesState,
      skillsByCategory: skillsByCategoryState,
      education: educationState,
      certifications: certificationsState,
      languages: languagesState
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
