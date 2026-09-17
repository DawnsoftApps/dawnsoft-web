<script setup>
import { computed, ref, watch } from 'vue'
import {
  languageOptions,
  normalizeLanguage,
  resolveLanguage,
} from './language.js'

const policyFiles = import.meta.glob('./locales/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const policies = Object.fromEntries(
  Object.entries(policyFiles).map(([path, policy]) => [
    path.match(/\/([^/]+)\.html$/)[1],
    policy,
  ]),
)

const pageText = {
  en: {
    title: 'Tabs Keeper Privacy Policy',
    description: 'Learn how Tabs Keeper processes and protects your data.',
    language: 'Language',
    automatic: 'Auto (browser language)',
  },
  'zh-Hans': {
    title: 'Tabs Keeper 隐私政策',
    description: '了解 Tabs Keeper 如何处理和保护你的数据。',
    language: '语言',
    automatic: '自动（浏览器语言）',
  },
  'zh-Hant': {
    title: 'Tabs Keeper 隱私權政策',
    description: '瞭解 Tabs Keeper 如何處理和保護你的資料。',
    language: '語言',
    automatic: '自動（瀏覽器語言）',
  },
  ja: {
    title: 'Tabs Keeper プライバシーポリシー',
    description: 'Tabs Keeper によるデータの処理と保護について説明します。',
    language: '言語',
    automatic: '自動（ブラウザの言語）',
  },
  ko: {
    title: 'Tabs Keeper 개인정보 처리방침',
    description: 'Tabs Keeper가 데이터를 처리하고 보호하는 방법을 알아보세요.',
    language: '언어',
    automatic: '자동(브라우저 언어)',
  },
  de: {
    title: 'Datenschutzerklärung für Tabs Keeper',
    description: 'Erfahren Sie, wie Tabs Keeper Ihre Daten verarbeitet und schützt.',
    language: 'Sprache',
    automatic: 'Automatisch (Browsersprache)',
  },
  fr: {
    title: 'Politique de confidentialité de Tabs Keeper',
    description: 'Découvrez comment Tabs Keeper traite et protège vos données.',
    language: 'Langue',
    automatic: 'Automatique (langue du navigateur)',
  },
}

const browserLanguages = navigator.languages?.length
  ? navigator.languages
  : [navigator.language]
const requestedLanguage = new URLSearchParams(window.location.search).get('lang')
const locale = ref(resolveLanguage(window.location.search, browserLanguages))
const selection = ref(
  requestedLanguage === null
    ? 'auto'
    : normalizeLanguage(requestedLanguage) ?? 'en',
)

const text = computed(() => pageText[locale.value])
const policy = computed(() => policies[locale.value] ?? policies.en)

watch(
  locale,
  (language) => {
    document.documentElement.lang = language
    document.title = pageText[language].title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', pageText[language].description)
  },
  { immediate: true },
)

function changeLanguage() {
  const url = new URL(window.location.href)

  if (selection.value === 'auto') {
    url.searchParams.delete('lang')
    locale.value = resolveLanguage('', browserLanguages)
  } else {
    url.searchParams.set('lang', selection.value)
    locale.value = selection.value
  }

  window.history.replaceState(null, '', url)
}
</script>

<template>
  <header class="toolbar">
    <a class="brand" href="/tabskeeper/privacy" aria-label="Tabs Keeper">
      <img class="brand-mark" src="./icon.png" alt="" />
      <span>Tabs Keeper</span>
    </a>

    <label class="language-picker">
      <span>{{ text.language }}</span>
      <select v-model="selection" @change="changeLanguage">
        <option value="auto">{{ text.automatic }}</option>
        <option
          v-for="option in languageOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </header>

  <main>
    <article class="policy" v-html="policy"></article>
  </main>
</template>
