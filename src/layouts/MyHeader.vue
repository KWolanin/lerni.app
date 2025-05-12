<template>
  <q-header class="glass-panel calsans-font">
    <q-toolbar>
      <q-toolbar-title>
        <q-btn flat to="/">
            Lerni.app
        </q-btn>

       </q-toolbar-title>
      <q-btn icon="dashboard" flat @click="emit('toggle-widget')" />
      <q-btn icon="palette" flat @click="emit('toggle-theme')" />
      <q-btn icon="format_color_text" flat @click="emit('toggle-color')" />
      <q-btn icon="translate" flat @click="emit('toggle-language')" />

      <q-img
        :src="hasError ? 'icons/error_temp.jpg' : authStore.photoURL"
        @error="hasError = true"
        width="30px"
        height="30px"
        class="user-icon q-ml-sm cursor-pointer"
      >
        <q-menu class="calsans-font glass-panel bg user-font">
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
import { useAuthStore } from 'src/stores/auth';
import { ref } from 'vue';
const authStore = useAuthStore();
const hasError = ref(false)


defineProps({
  photoUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([
  'toggle-widget',
  'toggle-theme',
  'toggle-color',
  'toggle-language',
  'logout',
]);

function handleLogoutClick() {
  emit('logout');
}
</script>

<style scoped>
.user-icon {
  border-radius: 50%;
}
.glass-panel {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
