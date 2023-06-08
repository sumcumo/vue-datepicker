import { createApp } from 'vue'
import DemoPage from './DemoPage.vue'

createApp(DemoPage).mount('#app')

// Check for dark mode...
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.style.setProperty('--theme', 'dark')
  document.documentElement.classList.add('dark')
  localStorage.setItem('theme', 'dark')
} else {
  document.documentElement.style.setProperty('--theme', 'light')
  document.documentElement.classList.remove('dark')
  localStorage.setItem('theme', 'light')
}
