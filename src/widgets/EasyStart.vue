<template>
  <q-card class="q-pa-sm flex column bg radius-15" style="height: 100%;">

    <!-- HEADER -->
    <div class="flex row items-center q-mb-sm">
      <p class="q-ma-sm calsans-font user-font text-subtitle2">{{ $t('starter') }}</p>
      <q-space />
      <q-btn
        size="sm"
        icon="check_circle"
        color="user-font"
        flat
        class="q-ml-sm"
        @click="switchMarks"
      >
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right">
          {{ $t('mark_as') }}
        </q-tooltip>
      </q-btn>
      <q-btn
        size="sm"
        icon="delete"
        color="user-font"
        flat
        class="q-ml-sm"
        @click="clear"
      >
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right">
          {{ $t('clear_list') }}
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
          v-for="(starter, index) in sortedStarters"
          :key="index"
        >
          <q-item-section>
            <q-checkbox
              class="text-caption user-font calsans-font"
              :class="{ strike: starter.checked }"
              dense
              keep-color
              color="user-font"
              v-model="starter.checked"
              :label="starter.label"
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
import { ref, watch, computed, onUnmounted, onMounted } from 'vue';
import { loadStarters, saveStarters } from '../service/firebase';
import { debounce, isEqual } from 'lodash';
import { useAuthStore } from '../stores/auth';
import {startersTask} from '../starters';
import { useI18n } from 'vue-i18n';
import type { EasyTask } from 'src/types';
import eventBus from '../eventBus';

const {locale} = useI18n();

const authStore = useAuthStore();

const starters = ref<EasyTask[]>([]);

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadStarters(newUid)
        .then((data) => {
          starters.value = data?.length ? data : getStartersByLang(locale.value)
        })
        .catch((err) => {
          console.error(err);
          starters.value = [];
        });
    }
  },
  { immediate: true },
);

let previous: EasyTask[] | null = null;

watch(
  () => starters.value,
  (newVal) => {
    if (!newVal) return
    if (!isEqual(previous, newVal)) {
      debouncedSave(newVal)
      previous = JSON.parse(JSON.stringify(newVal))
    }
  },
  { deep: true }
)


const debouncedSave = debounce((newData: EasyTask[]) => {
  saveStarters(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

const sortedStarters = computed(() => {
  return [...starters.value].sort((a, b) => b.label.localeCompare(a.label))
});

const switchMarks = () => {
  const inverted: EasyTask[] = [];
  starters.value.forEach((starter) => {
    inverted.push({ label: starter.label, checked: !starter.checked });
  });
  starters.value = inverted;
};

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

const clear = () => {
  starters.value = [];
};


onMounted(() => {
  eventBus.on('refresh-easy', refresh)
})

onUnmounted(() => {
  eventBus.off('refresh-easy', refresh)
})


const refresh = () => {
  loadStarters(authStore.uid)
    .then((data) => {
      starters.value = data?.length ? data : getStartersByLang(locale.value)
    })
    .catch((err) => {
      console.error(err);
      starters.value = [];
    });
}

</script>

<style scoped>

.strike {
  text-decoration: line-through;
}

</style>
