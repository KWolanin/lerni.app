import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { loadColor, saveColor } from 'src/service/firebase'

let saveTimeout: ReturnType<typeof setTimeout>

export const useFontColorStore = defineStore('fontColor', () => {
  const authStore = useAuthStore()
  const fontColor = ref<string>(localStorage.getItem('fontColor') || 'white')

  function setFontColor(color: string) {
    fontColor.value = color
    document.documentElement.style.setProperty('--user-font-color', color)
    localStorage.setItem('fontColor', color)

    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      void saveToFirebase(color)
    }, 3000)
  }

  async function saveToFirebase(color: string) {
    const uid = authStore.uid
    if (!uid) return

    try {
      await saveColor(uid, color)
    } catch (e) {
      console.error('Error occured during saving a color to firebase:', e)
    }
  }

  async function initFontColor() {
    document.documentElement.style.setProperty('--user-font-color', fontColor.value)

    const uid = authStore.uid
    if (!uid) return

    try {
      const color = await loadColor(uid)
      if (color) {
        fontColor.value = color
        localStorage.setItem('fontColor', color)
        document.documentElement.style.setProperty('--user-font-color', color)
      }
    } catch (e) {
      console.error('Error occured during loading a color to firebase:', e)
    }
  }

  return {
    fontColor,
    setFontColor,
    initFontColor,
  }
})
