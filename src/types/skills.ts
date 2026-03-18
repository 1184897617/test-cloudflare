export interface PaginationState {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CategorySummary {
  label: string
  total: number
}

export type SkillsSortKey = 'score' | 'downloads' | 'stars' | 'installs' | 'name'

export interface SkillCard {
  slug: string
  name: string
  summary: string
  version: string
  owner: string | null
  downloads: number
  stars: number
  installs: number
  score: number
  updatedAt: number
  isFeatured: boolean
  featuredRank: number | null
  categoryLabels: string[]
  primaryCategory: string
  canonicalUrl: string
}

export interface Top50Item extends SkillCard {
  rank: number
}

export interface Top50Response {
  items: Top50Item[]
  pagination: PaginationState
}

export interface SkillsResponse {
  items: SkillCard[]
  pagination: PaginationState
  filters: {
    q: string
    category: string
    sort: SkillsSortKey
  }
  meta: {
    generatedAt: string
    totalSkills: number
  }
  categories: CategorySummary[]
}

export interface DetailInstallBlock {
  title: string
  description: string
  code: string
  copyLabel: string
}

export interface DetailInstallMode {
  key: 'agent' | 'human'
  label: string
  intro: string
  blocks: DetailInstallBlock[]
}

export interface SkillDetailResponse {
  slug: string
  note: string
  source: {
    name: string
    url: string
    label: string
  }
  installModes: DetailInstallMode[]
  footerTips: string[]
}
