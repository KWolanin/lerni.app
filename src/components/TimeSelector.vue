<template>
  <q-card class="q-pa-sm flex column justify-center radius-15 bg">
    <h6 class="q-ma-sm text-italic user-font">{{ $t('set_preferences') }}</h6>
    <q-form class="q-ma-sm flex column justify-center" @submit.prevent="savePreferences">
      <q-input
        standout="transparent text-user-font"
        :label="$t('work_time')"
        v-model="preferences.workTime"
        type="number"
        label-color="user-font"
        class="q-mb-sm"
        rounded
        hide-bottom-space
        :rules="[(val) => val > 0 || $t('must_be_positive')]"
        dense
      ></q-input>
      <q-input
        standout="transparent text-user-font"
        :label="$t('relax_time')"
        v-model="preferences.relaxTime"
        type="number"
        label-color="user-font"
        class="q-mb-sm"
        rounded
        hide-bottom-space
        :rules="[(val) => val > 0 || $t('must_be_positive')]"
        dense
      ></q-input>
      <q-input
        standout="transparent text-user-font"
        :label="$t('longer_relax_time')"
        v-model="preferences.longerRelaxTime"
        label-color="user-font"
        type="number"
        class="q-mb-sm"
        hide-bottom-space
        :rules="[(val) => val > 0 || $t('must_be_positive')]"
        rounded
        dense
      ></q-input>
      <q-input
        standout="transparent text-user-font"
        :label="$t('limit')"
        v-model="preferences.limit"
        label-color="user-font"
        type="number"
        hide-bottom-space
        :rules="[(val) => val > 0 || $t('must_be_positive')]"
        rounded
        dense
      ></q-input>
      <q-btn class="q-mt-md" outline text-color="user-font" type="submit">
        {{ $t('save') }}
      </q-btn>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { usePreferencesStore } from '../stores/preferences';

const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();

const defaultPreferences = {
  workTime: 25,
  relaxTime: 5,
  longerRelaxTime: 20,
  limit: 4,
};

const preferences = ref({ ...defaultPreferences });

const loadPreferences = async () => {
  if (!authStore.uid) return;
  await preferencesStore.init(authStore.uid);
  preferences.value = {
    ...defaultPreferences,
    ...preferencesStore.preferences,
  };
};

watch(
  () => authStore.uid,
  async (newUid) => {
    if (newUid) {
      try {
        await loadPreferences();
      } catch (error) {
        preferences.value = { ...defaultPreferences };
        console.error('Preferences load error', error);
      }
    }
  },
  { immediate: true },
);

const savePreferences = async () => {
  if (!authStore.uid) return;
  await preferencesStore.update(preferences.value);
};
</script>
<style scoped>
::v-deep(.q-field__native) {
  color: var(--user-font-color);
}

::v-deep(.q-field--standout.q-field--highlighted .q-field__native) {
  color: var(--user-font-color);
}



</style>
