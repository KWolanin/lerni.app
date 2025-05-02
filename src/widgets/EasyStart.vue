<template>
  <q-card class="q-pa-sm flex column bg radius-15" style="height: 100%;">

    <!-- HEADER -->
    <div class="flex row items-center q-mb-sm">
      <p class="q-ma-sm calsans-font user-font text-subtitle2">{{ $t('starter') }}</p>
      <q-space />
      <q-btn
        size="sm"
        icon="delete"
        color="user-font"
        flat
        class="q-ml-sm"
        @click="clear"
      >
        <q-tooltip class="bg-blur calsans-font" anchor="center left" self="center right">
          clear all
        </q-tooltip>
      </q-btn>
      <q-btn
        size="sm"
        icon="settings"
        color="user-font"
        flat
        class="q-ml-sm"
        disabled
      >
        <q-tooltip class="bg-blur calsans-font" anchor="center left" self="center right">
          customize
        </q-tooltip>
      </q-btn>
    </div>

    <!-- SCROLLABLE LIST -->
    <q-scroll-area class="q-mt-sm" style="flex: 1 1 auto; min-height: 100px;">
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
              class="text-caption user-font calsans-font"
              :class="{ strike: checked }"
              dense
              keep-color
              color="user-font"
              v-model="starters[label]"
              :label="label"
              checked-icon="check_circle"
              unchecked-icon="radio_button_unchecked"
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
          starters.value = null;
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

.strike {
  text-decoration: line-through;
}

</style>
