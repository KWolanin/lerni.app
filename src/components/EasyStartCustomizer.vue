<template>
  <q-card class="fit q-pa-sm column radius-15 bg calsans-font">
    <q-item class="user-font q-ma-sm text-bold flex row items-center">
    <span>{{ $t('here_edit') }}</span>
    <q-space />
     <q-btn icon="refresh" size="sm" flat round color="user-font" @click="bringDefaultsBack">
      <q-tooltip class="bg-blur text-weight-bold user-font" anchor="center left" self="center right">
        {{ $t('bring_defaults_back') }} </q-tooltip>
      </q-btn>
  </q-item>
    <q-scroll-area class="q-mt-sm full-width" style="flex: 1 1 auto; min-height: 0">
      <q-list v-if="localStarters">
        <q-item
          dense
          v-ripple
          v-for="(starter, index) in sortedStarters"
          :key="index"
        >
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
            <q-btn icon="delete" size="sm" flat round color="user-font" @click="removeTask(starter.label)" />
        </q-item>
      </q-list>
    </q-scroll-area>
        <div class="q-mt-sm column full-width">
      <q-input
        v-model="newEasyTask"
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
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { loadStarters, saveStarters } from 'src/service/firebase'
import { startersTask } from 'src/starters'
import { useAuthStore } from 'src/stores/auth'
import { useI18n } from 'vue-i18n';
import type { EasyTask } from 'src/types';
import eventBus from '../eventBus';

const {locale} = useI18n();

const authStore = useAuthStore()

const localStarters = ref<EasyTask[]>([])

const sortedStarters = computed(() => {
  return [...localStarters.value].sort((a, b) => b.label.localeCompare(a.label))
});


const saveStarter = (index: number, event: string) => {
  if (localStarters.value[index]) {
    localStarters.value[index].label = event;
  }
  debouncedSave()
}

const debouncedSave = debounce(() => {
  saveStarters(authStore.uid, localStarters.value)
    .then(() => eventBus.emit('refresh-easy'))
    .catch((err: Error) => console.error('Błąd zapisu:', err))
}, 1000)


watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadStarters(newUid)
        .then((data) => {
          localStarters.value = data?.length ? data : getStartersByLang(locale.value)
        })
        .catch((err) => {
          console.error(err);
          localStarters.value = [];
        });
    }
  },
  { immediate: true },
);

const getStartersByLang = (lang: string) : EasyTask[] => {
  const tasks : EasyTask[] = [];
  switch (lang) {
    case 'pl':
      startersTask.PL.map((starter) => {
        tasks.push({ label: starter, checked: false });
      });
      break;
    case 'en_US':
      startersTask.EN.map((starter) => {
        tasks.push({ label: starter, checked: false });
      });
      break;
    case 'de':
      startersTask.DE.map((starter) => {
        tasks.push({ label: starter, checked: false });
      });
      break;
    case 'ua':
      startersTask.UA.map((starter) => {
        tasks.push({ label: starter, checked: false });
      });
      break;
    default:
      startersTask.EN.map((starter) => {
        tasks.push({ label: starter, checked: false });
      });
      break;
  }
  return tasks;
};

const newEasyTask = ref('')
const addTask = () => {
  if (newEasyTask.value.trim() === '') return;
  const newTask: EasyTask = {
    label: newEasyTask.value,
    checked: false,
  };
  localStarters.value.push(newTask)
  newEasyTask.value = '';
  debouncedSave()
};

const removeTask = (label: string) => {
  const index = localStarters.value.findIndex((task) => task.label === label);
  if (index !== -1) {
    localStarters.value.splice(index, 1);
    debouncedSave();
  }
};
const bringDefaultsBack = () => {
  localStarters.value = getStartersByLang(locale.value);
  debouncedSave();
};
</script>

<style scoped>
::v-deep(.q-checkbox--dense) {
  color: var(--user-font-color);}


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
