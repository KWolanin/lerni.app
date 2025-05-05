<template>
  <q-header class="glass-panel calsans-font">
    <q-toolbar>
      <q-toolbar-title> Lerni.app </q-toolbar-title>
      <q-btn icon="dashboard" flat @click="emit('toggle-widget')" />
      <q-btn icon="palette" flat @click="emit('toggle-theme')" />
      <q-btn icon="format_color_text" flat @click="emit('toggle-color')" />
      <q-btn icon="translate" flat @click="emit('toggle-language')" />

      <q-img
        :src="authStore.photoURL"
        width="30px"
        height="30px"
        class="user-icon q-ml-sm cursor-pointer"
      >
        <q-menu class="calsans-font bg user-font">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="handleLogoutClick">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-img>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth'
const authStore = useAuthStore()

defineProps({
  photoUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'toggle-widget',
  'toggle-theme',
  'toggle-color',
  'toggle-language',
  'logout'
])

function handleLogoutClick() {
  emit('logout')
}
</script>

<style scoped>
  .user-icon {
  border-radius: 50%;
}
</style>
