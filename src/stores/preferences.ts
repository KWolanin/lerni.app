import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadPreferences, savePreferences } from '../service/firebase'
import type { Preferences } from 'src/types'

export const usePreferencesStore = defineStore('preferences', () => {
  const uid = ref('')
  const preferences = ref<Preferences>({})

  async function init(userId: string) {
    uid.value = userId
    const data = await loadPreferences(userId)
    preferences.value = data || {}
  }

  async function update(newPrefs: Preferences) {
    preferences.value = { ...preferences.value, ...newPrefs }
    await savePreferences(uid.value, preferences.value)
  }

  return { uid, preferences, init, update }
})
