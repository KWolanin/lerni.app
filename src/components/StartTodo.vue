<template>
  <q-card class="q-pa-sm flex column justify-center bg radius-15">
    <div class="flex row">
      <h6 class="q-ma-sm text-italic text-white">{{ $t('starter') }}</h6>
      <q-space />
      <q-btn
        size="sm"
        icon="delete"
        color="white"
        class="q-ml-sm q-pl-sm q-pr-sm q-mt-sm q-mb-sm"
        flat
        @click="clear"
      >
        <q-tooltip
          class="text-pink-14 transparent text-weight-bold"
          anchor="center left"
          self="center right"
          >clear all</q-tooltip
        >
      </q-btn>
      <q-btn
        size="sm"
        icon="settings"
        color="white"
        class="q-mr-sm q-pr-sm q-pl-sm q-mt-sm q-mb-sm"
        flat
        disabled
      >
        <q-tooltip
          class="text-pink-14 transparent text-weight-bold"
          anchor="top right"
          self="center right"
          >customize</q-tooltip
        >
      </q-btn>
    </div>
    <q-scroll-area style="height: 50vh; max-width: 100%">
      <q-list v-if="starters" dense>
        <q-item
          dense
          clickable
          v-ripple
          v-for="([label, checked], index) in Object.entries(sortedStarters)"
          :key="index"
        >
          <q-item-section>
            <q-checkbox
              class="text-caption text-white"
              :class="{ strike: checked }"
              dense
              keep-color
              color="white"
              v-model="starters[label]"
              :label="label"
              :value="checked"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { loadStarters, saveStarters } from '../service/firebase';
import type { DocumentData } from 'firebase/firestore';
import { debounce, isEqual } from 'lodash';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const starters = ref<DocumentData | null>(null);

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadStarters(newUid)
        .then((data) => {
          starters.value = data;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  { immediate: true },
);

let previous: Record<string, boolean> | null = null;

watch(
  starters,
  (newVal) => {
    if (!newVal) return;
    if (!isEqual(previous, newVal)) {
      debouncedSave({ ...newVal });
      previous = { ...newVal };
    }
  },
  { deep: true },
);

const debouncedSave = debounce((newData: Record<string, boolean>) => {
  saveStarters(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

const sortedStarters = computed(() => {
  const entries = Object.entries(starters.value || {}).sort(([keyA], [keyB]) =>
    keyB.localeCompare(keyA),
  );
  return Object.fromEntries(entries);
});

const clear = () => {
  for (const property in starters.value) {
    starters.value[property] = false;
  }
};
</script>

<style scoped>
::v-deep(.q-checkbox--dense) {
  color: #841e4c;
}
.strike {
  text-decoration: line-through;
}

</style>
