import { mockSkillDetail } from '@/data/mockSkillDetail'
import type { SkillCard, SkillDetailResponse, SkillsResponse, SkillsSortKey, Top50Response } from '@/types/skills'

const DATASET_URL = `${import.meta.env.BASE_URL}data/skillhub-export.json`
const TOP50_PAGE_SIZE = 7
const ALL_SKILLS_PAGE_SIZE = 24
const BLOCKED_BRAND_PATTERN = new RegExp(
  ['\\u817e\\u8baf', ['ten', 'cent'].join('')].join('|'),
  'iu',
)

interface RawSkill {
  slug?: string
  name?: string
  description?: string
  description_zh?: string
  version?: string
  homepage?: string
  tags?: unknown
  downloads?: number
  stars?: number
  installs?: number
  updated_at?: number
  score?: number
  owner?: string | null
}

interface RawDataset {
  meta: {
    generated_at: string
    total: number
    top50_count: number
    all_skills_count: number
    categories_count: number
  }
  featured_top50_slugs: string[]
  featured_top50: RawSkill[]
  categories: Record<string, string[]>
  all_skills: RawSkill[]
}

interface CategoryConfig {
  label: string
  keywords: string[]
}

interface NormalizedSkill {
  slug: string
  name: string
  summary: string
  description: string
  descriptionZh: string
  version: string
  homepage: string
  canonicalUrl: string
  tags: string[]
  downloads: number
  stars: number
  installs: number
  updatedAt: number
  score: number
  owner: string | null
  isFeatured: boolean
  featuredRank: number | null
  categoryLabels: string[]
  primaryCategory: string
  searchIndex: string
}

interface DataCache {
  generatedAt: string
  total: number
  top50: NormalizedSkill[]
  allSkills: NormalizedSkill[]
  categories: Array<{
    label: string
    total: number
  }>
}

let cachePromise: Promise<DataCache> | null = null

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[]
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

function dedupeBySlug(skills: RawSkill[]) {
  const seen = new Set<string>()

  return skills.filter((skill) => {
    const slug = normalizeString(skill.slug)

    if (!slug || seen.has(slug)) {
      return false
    }

    seen.add(slug)
    return true
  })
}

function containsBlockedBrandText(skill: RawSkill) {
  const haystack = [
    normalizeString(skill.slug),
    normalizeString(skill.name),
    normalizeString(skill.description),
    normalizeString(skill.description_zh),
    normalizeString(skill.homepage),
    normalizeString(skill.owner),
  ].join(' ')

  return BLOCKED_BRAND_PATTERN.test(haystack)
}

function resolveCategoryLabels(skill: RawSkill, categoryConfig: CategoryConfig[]) {
  const tags = normalizeTags(skill.tags).map((tag) => tag.toLowerCase())
  const haystack = [
    normalizeString(skill.slug),
    normalizeString(skill.name),
    normalizeString(skill.description_zh),
    normalizeString(skill.description),
    normalizeString(skill.owner),
  ]
    .join(' ')
    .toLowerCase()

  return categoryConfig
    .filter(({ keywords }) =>
      keywords.some((keyword) => tags.includes(keyword) || haystack.includes(keyword)),
    )
    .map(({ label }) => label)
}

function buildCanonicalUrl(skill: RawSkill) {
  const slug = normalizeString(skill.slug)
  const owner = normalizeString(skill.owner)

  if (owner) {
    return `https://clawhub.ai/${owner}/${slug}`
  }

  const homepage = normalizeString(skill.homepage)

  if (homepage) {
    return homepage
  }

  return `https://clawhub.ai/${slug}`
}

function normalizeSortName(name: string) {
  const cleaned = name.trim().replace(/^[^A-Za-z0-9\u4e00-\u9fa5]+/, '')

  return cleaned.toLowerCase()
}

function normalizeSkill(
  skill: RawSkill,
  featuredRankMap: Map<string, number>,
  categoryConfig: CategoryConfig[],
): NormalizedSkill | null {
  const slug = normalizeString(skill.slug)
  const name = normalizeString(skill.name) || slug

  if (!slug || !name) {
    return null
  }

  const description = normalizeString(skill.description)
  const descriptionZh = normalizeString(skill.description_zh)
  const summary = descriptionZh || description
  const categoryLabels = resolveCategoryLabels(skill, categoryConfig)
  const featuredRank = featuredRankMap.get(slug) ?? null
  const owner = normalizeString(skill.owner) || null

  return {
    slug,
    name,
    summary,
    description,
    descriptionZh,
    version: normalizeString(skill.version) || '1.0.0',
    homepage: normalizeString(skill.homepage),
    canonicalUrl: buildCanonicalUrl(skill),
    tags: normalizeTags(skill.tags),
    downloads: normalizeNumber(skill.downloads),
    stars: normalizeNumber(skill.stars),
    installs: normalizeNumber(skill.installs),
    updatedAt: normalizeNumber(skill.updated_at),
    score: normalizeNumber(skill.score),
    owner,
    isFeatured: featuredRank !== null,
    featuredRank,
    categoryLabels,
    primaryCategory: categoryLabels[0] ?? '未分类',
    searchIndex: [
      slug,
      name,
      summary,
      description,
      owner,
      ...normalizeTags(skill.tags),
      ...categoryLabels,
    ]
      .join(' ')
      .toLowerCase(),
  }
}

function sortSkills(skills: NormalizedSkill[], sort: SkillsSortKey = 'score') {
  return [...skills].sort((left, right) => {
    if (sort === 'downloads') {
      return right.downloads - left.downloads || right.score - left.score
    }

    if (sort === 'stars') {
      return right.stars - left.stars || right.score - left.score
    }

    if (sort === 'installs') {
      return right.installs - left.installs || right.score - left.score
    }

    if (sort === 'name') {
      const leftName = normalizeSortName(left.name)
      const rightName = normalizeSortName(right.name)

      if (!leftName && rightName) {
        return 1
      }

      if (leftName && !rightName) {
        return -1
      }

      return leftName.localeCompare(rightName, 'zh-CN') || right.score - left.score
    }

    if (right.score !== left.score) {
      return right.score - left.score
    }

    if (right.downloads !== left.downloads) {
      return right.downloads - left.downloads
    }

    if (right.stars !== left.stars) {
      return right.stars - left.stars
    }

    if (right.installs !== left.installs) {
      return right.installs - left.installs
    }

    return right.updatedAt - left.updatedAt
  })
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    items: items.slice(start, start + pageSize),
  }
}

function toSkillCard(skill: NormalizedSkill): SkillCard {
  return {
    slug: skill.slug,
    name: skill.name,
    summary: skill.summary,
    version: skill.version,
    owner: skill.owner,
    downloads: skill.downloads,
    stars: skill.stars,
    installs: skill.installs,
    score: skill.score,
    updatedAt: skill.updatedAt,
    isFeatured: skill.isFeatured,
    featuredRank: skill.featuredRank,
    categoryLabels: skill.categoryLabels,
    primaryCategory: skill.primaryCategory,
    canonicalUrl: skill.canonicalUrl,
  }
}

async function readDataset() {
  const response = await fetch(DATASET_URL)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as RawDataset
}

async function buildCache() {
  const raw = await readDataset()
  const featuredRankMap = new Map(
    raw.featured_top50_slugs.map((slug, index) => [slug, index + 1]),
  )
  const categoryConfig = Object.entries(raw.categories).map(([label, keywords]) => ({
    label,
    keywords: keywords.map((keyword) => keyword.toLowerCase()),
  }))
  const filteredAllSkills = raw.all_skills.filter((skill) => !containsBlockedBrandText(skill))
  const filteredTop50 = raw.featured_top50.filter((skill) => !containsBlockedBrandText(skill))

  const allSkills = sortSkills(
    dedupeBySlug(filteredAllSkills)
      .map((skill) => normalizeSkill(skill, featuredRankMap, categoryConfig))
      .filter((skill): skill is NormalizedSkill => skill !== null),
  )

  const top50 = filteredTop50
    .map((skill) => normalizeSkill(skill, featuredRankMap, categoryConfig))
    .filter((skill): skill is NormalizedSkill => skill !== null)
    .sort((left, right) => (left.featuredRank ?? 999) - (right.featuredRank ?? 999))

  const categories = categoryConfig.map(({ label }) => ({
    label,
    total: allSkills.filter((skill) => skill.categoryLabels.includes(label)).length,
  }))

  return {
    generatedAt: raw.meta.generated_at,
    total: allSkills.length,
    top50,
    allSkills,
    categories,
  } satisfies DataCache
}

function getCache() {
  if (!cachePromise) {
    cachePromise = buildCache().catch((error) => {
      cachePromise = null
      throw error
    })
  }

  return cachePromise
}

export async function fetchTop50(page: number): Promise<Top50Response> {
  const { top50 } = await getCache()
  const paginated = paginate(top50, page, TOP50_PAGE_SIZE)

  return {
    items: paginated.items.map((skill) => ({
      ...toSkillCard(skill),
      rank: skill.featuredRank ?? 0,
    })),
    pagination: {
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
    },
  }
}

export async function fetchSkills(input: {
  page: number
  q: string
  category: string
  sort: SkillsSortKey
}): Promise<SkillsResponse> {
  const { allSkills, categories, generatedAt, total } = await getCache()
  const query = input.q.trim().toLowerCase()
  const category = input.category.trim()
  const terms = query ? query.split(/\s+/).filter(Boolean) : []

  const filtered = allSkills.filter((skill) => {
    const matchesQuery =
      terms.length === 0 || terms.every((term) => skill.searchIndex.includes(term))
    const matchesCategory =
      !category || category === '全部' || category === '全部技能'
        ? true
        : skill.categoryLabels.includes(category)

    return matchesQuery && matchesCategory
  })

  const paginated = paginate(sortSkills(filtered, input.sort), input.page, ALL_SKILLS_PAGE_SIZE)

  return {
    items: paginated.items.map(toSkillCard),
    pagination: {
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
    },
    filters: {
      q: input.q,
      category,
      sort: input.sort,
    },
    meta: {
      generatedAt,
      totalSkills: total,
    },
    categories,
  }
}

export async function fetchSkillDetail(slug: string): Promise<SkillDetailResponse> {
  const normalizedSlug = normalizeString(slug)

  if (!normalizedSlug) {
    throw new Error('Request failed: 404')
  }

  const { allSkills } = await getCache()
  const skill = allSkills.find((entry) => entry.slug === normalizedSlug)

  if (!skill) {
    throw new Error('Request failed: 404')
  }

  return {
    slug: skill.slug,
    ...mockSkillDetail,
    source: {
      ...mockSkillDetail.source,
      url: skill.canonicalUrl,
    },
  }
}
