<template>
  <q-card class="fit q-pa-sm column radius-15 bg calsans-font" style="height: 100%">
    <div class="flex row items-center q-mb-sm">
      <p class="q-ma-sm calsans-font user-font text-subtitle2">{{ $t('here_edit') }}</p>
      <q-space />
      <q-btn icon="refresh" size="sm" flat round color="user-font" @click="bringDefaultsBack">
        <q-tooltip
          class="bg-blur text-weight-bold user-font"
          anchor="center left"
          self="center right"
        >
          {{ $t('bring_defaults_back') }}
        </q-tooltip>
      </q-btn>
    </div>

    <q-scroll-area class="q-mt-sm full-width" style="flex: 1 1 auto; min-height: 0">
      <q-list v-if="starters">
        <q-item dense v-ripple v-for="(starter, index) in invertedStarters" :key="index">
          <q-input
            type="text"
            v-model="starter.label"
            standout="transparent text-user-font"
            rounded
            dense
            :value="starter.label"
            class="full-width"
            @change="(value: string) => saveStarter(index, value)"
          />
          <q-btn
            icon="delete"
            size="sm"
            flat
            round
            color="user-font"
            @click="removeTask(starter.label)"
          />
        </q-item>
      </q-list>
    </q-scroll-area>
    <div class="q-mt-sm column full-width">
      <q-input
        v-model="newStarter"
        :label="$t('new_task')"
        dense
        standout="transparent"
        class="q-mb-sm user-font"
        @keyup.enter="addTask"
      />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { debounce } from 'lodash';
import { loadStarters, saveStarters } from 'src/service/firebase';
import { useAuthStore } from 'src/stores/auth';
import { useI18n } from 'vue-i18n';
import type { EasyTask } from 'src/types';
import eventBus from '../eventBus';
import { getStartersByLang } from '../service/easy_start';

const { locale } = useI18n();
const authStore = useAuthStore();
const starters = ref<EasyTask[]>([]);
const newStarter = ref<string>('');

const invertedStarters = computed(() => {
  return [...starters.value].sort((a, b) => b.label.localeCompare(a.label));
});

const saveStarter = (index: number, event: string) => {
  if (starters.value[index]) {
    starters.value[index].label = event;
  }
  debouncedSave();
};

/* Saves starters values and send event to refresh easy start component */
const debouncedSave = debounce(() => {
  saveStarters(authStore.uid, starters.value)
    .then(() => eventBus.emit('refresh-easy'))
    .catch((err: Error) => console.error('Easy starter saving error:', err));
}, 1000);

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadStarters(newUid)
        .then((data) => {
          starters.value = data?.length ? data : getStartersByLang(locale.value);
        })
        .catch((err) => {
          console.error(err);
          starters.value = [];
        });
    }
  },
  { immediate: true },
);

const addTask = () => {
  if (newStarter.value.trim() === '') return;
  const newTask: EasyTask = {
    label: newStarter.value,
    checked: false,
  };
  starters.value.push(newTask);
  newStarter.value = '';
  debouncedSave();
};

const removeTask = (label: string) => {
  const index = starters.value.findIndex((task) => task.label === label);
  if (index !== -1) {
    starters.value.splice(index, 1);
    debouncedSave();
  }
};

/* Brings back default list based on used language */
const bringDefaultsBack = () => {
  starters.value = getStartersByLang(locale.value);
  debouncedSave();
};
</script>

<style scoped>
::v-deep(.q-field__label) {
  color: var(--user-font-color);
}
::v-deep(.q-field__native) {
  color: var(--user-font-color);
}
::v-deep(.q-field--standout.q-field--highlighted .q-field__native) {
  color: var(--user-font-color);
}
</style>
