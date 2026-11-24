import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import PublicationsPage from './pages/PublicationsPage.vue'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.vue'
import PersonalDataConsentPage from './pages/PersonalDataConsentPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

export const pages = {
  'index.html': HomePage,
  'news/publications.html': PublicationsPage,
  'privacy-policy.html': PrivacyPolicyPage,
  'personal-data-consent.html': PersonalDataConsentPage,
  '404.html': NotFoundPage,
}

export function renderPage(path: keyof typeof pages) {
  return renderToString(createSSRApp(App, { page: pages[path] }))
}
