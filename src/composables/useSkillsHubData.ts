import { onBeforeUnmount, ref } from 'vue'
import { fetchSkillDetail, fetchSkills, fetchTop50 } from '@/api/skills'
import type {
  SkillCard,
  SkillDetailResponse,
  SkillsResponse,
  SkillsSortKey,
  Top50Response,
} from '@/types/skills'

export function useSkillsHubData() {
  const top50Response = ref<Top50Response | null>(null)
  const skillsResponse = ref<SkillsResponse | null>(null)
  const detailResponse = ref<SkillDetailResponse | null>(null)
  const selectedSkill = ref<SkillCard | null>(null)
  const top50Loading = ref(false)
  const skillsLoading = ref(false)
  const detailLoading = ref(false)
  const top50Error = ref('')
  const skillsError = ref('')
  const detailError = ref('')
  const top50Page = ref(1)
  const skillsPage = ref(1)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const sortBy = ref<SkillsSortKey>('score')
  const activeInstallMode = ref<'agent' | 'human'>('agent')

  let searchTimer: number | undefined
  let top50RequestId = 0
  let skillsRequestId = 0
  let detailRequestId = 0

  async function loadTop50(page = top50Page.value) {
    top50Page.value = page
    top50Loading.value = true
    top50Error.value = ''
    const requestId = ++top50RequestId

    try {
      const response = await fetchTop50(page)

      if (requestId !== top50RequestId) {
        return
      }

      top50Response.value = response
    } catch (error) {
      if (requestId !== top50RequestId) {
        return
      }

      top50Error.value = error instanceof Error ? error.message : 'TOP50 数据加载失败'
    } finally {
      if (requestId === top50RequestId) {
        top50Loading.value = false
      }
    }
  }

  async function loadSkills() {
    skillsLoading.value = true
    skillsError.value = ''
    const requestId = ++skillsRequestId

    try {
      const response = await fetchSkills({
        page: skillsPage.value,
        q: searchQuery.value,
        category: selectedCategory.value,
        sort: sortBy.value,
      })

      if (requestId !== skillsRequestId) {
        return
      }

      skillsResponse.value = response
    } catch (error) {
      if (requestId !== skillsRequestId) {
        return
      }

      skillsError.value = error instanceof Error ? error.message : '技能列表加载失败'
    } finally {
      if (requestId === skillsRequestId) {
        skillsLoading.value = false
      }
    }
  }

  async function loadInitial() {
    await Promise.all([loadTop50(1), loadSkills()])
  }

  async function openSkill(skill: SkillCard) {
    selectedSkill.value = skill
    detailResponse.value = null
    detailError.value = ''
    detailLoading.value = true
    activeInstallMode.value = 'agent'
    const requestId = ++detailRequestId

    try {
      const response = await fetchSkillDetail(skill.slug)

      if (requestId !== detailRequestId) {
        return
      }

      detailResponse.value = response
    } catch (error) {
      if (requestId !== detailRequestId) {
        return
      }

      detailError.value = error instanceof Error ? error.message : '详情加载失败'
    } finally {
      if (requestId === detailRequestId) {
        detailLoading.value = false
      }
    }
  }

  function closeSkill() {
    selectedSkill.value = null
    detailResponse.value = null
    detailError.value = ''
    detailLoading.value = false
  }

  function changeTop50Page(page: number) {
    if (!top50Response.value) {
      void loadTop50(page)
      return
    }

    const totalPages = top50Response.value.pagination.totalPages
    const nextPage = Math.min(Math.max(page, 1), totalPages)

    if (nextPage === top50Page.value) {
      return
    }

    void loadTop50(nextPage)
  }

  function changeSkillsPage(page: number) {
    if (!skillsResponse.value) {
      skillsPage.value = page
      void loadSkills()
      return
    }

    const totalPages = skillsResponse.value.pagination.totalPages
    const nextPage = Math.min(Math.max(page, 1), totalPages)

    if (nextPage === skillsPage.value) {
      return
    }

    skillsPage.value = nextPage
    void loadSkills()
  }

  function updateSearch(query: string) {
    searchQuery.value = query
    skillsPage.value = 1

    if (searchTimer) {
      window.clearTimeout(searchTimer)
    }

    searchTimer = window.setTimeout(() => {
      void loadSkills()
    }, 260)
  }

  function updateCategory(category: string) {
    selectedCategory.value = category
    skillsPage.value = 1
    void loadSkills()
  }

  function updateSort(sort: SkillsSortKey) {
    if (sortBy.value === sort) {
      return
    }

    sortBy.value = sort
    skillsPage.value = 1
    void loadSkills()
  }

  function setInstallMode(mode: 'agent' | 'human') {
    activeInstallMode.value = mode
  }

  onBeforeUnmount(() => {
    if (searchTimer) {
      window.clearTimeout(searchTimer)
    }
  })

  return {
    top50Response,
    skillsResponse,
    detailResponse,
    selectedSkill,
    top50Loading,
    skillsLoading,
    detailLoading,
    top50Error,
    skillsError,
    detailError,
    top50Page,
    skillsPage,
    searchQuery,
    selectedCategory,
    sortBy,
    activeInstallMode,
    loadInitial,
    openSkill,
    closeSkill,
    changeTop50Page,
    changeSkillsPage,
    updateSearch,
    updateCategory,
    updateSort,
    setInstallMode,
    reloadSkills: loadSkills,
  }
}
