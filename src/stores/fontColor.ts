import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFontColorStore = defineStore('fontColor', () => {
  const fontColor = ref<string>(localStorage.getItem('fontColor') || 'white')

  function setFontColor(color: string) {
    fontColor.value = color
    document.documentElement.style.setProperty('--user-font-color', color)
    localStorage.setItem('fontColor', color)
  }

  function initFontColor() {
    document.documentElement.style.setProperty('--user-font-color', fontColor.value)
  }

  return {
    fontColor,
    setFontColor,
    initFontColor,
  }
})
