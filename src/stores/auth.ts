import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'firebase/auth'


export const useAuthStore = defineStore('auth', () => {
  const uid = ref('')
  const displayName = ref('')
  const photoURL = ref('')
  const loggedIn = ref(false)
  const isPremium = ref(false)

  function setUser(user: User) {
    uid.value = user.uid
    displayName.value = user.displayName || ''
    photoURL.value = user.photoURL || ''
    loggedIn.value = true
    // isPremium.value = user.isPremium || false
  }

  function reset() {
    uid.value = ''
    displayName.value = ''
    photoURL.value = ''
    loggedIn.value = false
    isPremium.value = false
  }
  return { uid, displayName, photoURL, loggedIn, setUser, reset, isPremium }
})
