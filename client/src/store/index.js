import { defineStore } from 'pinia'

export const useStore = defineStore('loonburo', {
  state: () => {
    return {
      theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', this.theme)
      document.documentElement.setAttribute('data-theme', this.theme)
    },
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
})
