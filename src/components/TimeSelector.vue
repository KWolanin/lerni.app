<template>
  <q-card class="q-pa-sm bg-pink-12 flex column justify-center radius-15">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('set_preferences') }}</h6>
    <q-form class="q-ma-md flex column justify-center" @submit.prevent="savePreferences">
      <q-input
        standout="bg-pink-14 text-pink-12"
        :label="$t('work_time')"
        v-model="preferences.workTime"
        type="number"
        label-color="white"
        class="q-mb-sm"
        rounded
        dense
      ></q-input>
      <q-input
        standout="bg-pink-14 text-pink-12"
        :label="$t('relax_time')"
        v-model="preferences.relaxTime"
        type="number"
        label-color="white"
        class="q-mb-sm"
        rounded
        dense
      ></q-input>
      <q-input
        standout="bg-pink-14 text-pink-12"
        :label="$t('longer_relax_time')"
        v-model="preferences.longerRelaxTime"
        label-color="white"
        type="number"
        class="q-mb-sm"
        rounded
        dense
      ></q-input>
      <q-input
        standout="bg-pink-14 text-pink-12"
        :label="$t('limit')"
        v-model="preferences.limit"
        label-color="white"
        type="number"
        rounded
        dense
      ></q-input>
      <q-btn class="q-mt-md" color="pink-14" text-color="white" type="submit">save</q-btn>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { usePreferencesStore } from '../stores/preferences'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { t } = useI18n()
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()

const defaultPreferences = {
  workTime: 25,
  relaxTime: 5,
  longerRelaxTime: 20,
  limit: 4
}

const preferences = ref({ ...defaultPreferences })

const loadPreferences = async () => {
  if (!authStore.uid) return
  await preferencesStore.init(authStore.uid)
  preferences.value = {
    ...defaultPreferences,
    ...preferencesStore.preferences
  }
}

watch(
  () => authStore.uid,
  async (newUid) => {
    if (newUid) {
      try {
        await loadPreferences()
      } catch (error) {
        console.error('Błąd ładowania preferencji:', error)
      }
    }
  },
  { immediate: true }
)

const savePreferences = async () => {
  if (!authStore.uid) return
  await preferencesStore.update(preferences.value)
}
</script>
<style scoped>
::v-deep(.q-field__native) {
  color: #841e4c;
}
</style>
