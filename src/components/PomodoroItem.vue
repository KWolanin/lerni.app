<template>
  <q-card class="flex column justify-center bg radius-15 q-pa-sm">
    <div class="flex row">
      <q-space />
      <q-btn size="sm" icon="music_off" color="white" class="q-mr-sm q-pr-sm" flat disabled>
        <q-tooltip
          class="text-pink-14 transparent text-weight-bold"
          anchor="top right"
          self="center right"
          >customize</q-tooltip
        >
      </q-btn>
    </div>
    <q-circular-progress
      show-value
      class="q-ma-sm q-pb-sm q-pt-sm center"
      size="15rem"
      :thickness="0.2"
      :style="{
        color: 'rgba(255, 255, 255, 0.4)',
        '--q-circular-progress-track-color': 'rgba(255, 255, 255, 0.2)',
      }"
      :min="0"
      :max="duration"
      :value="remainingTime"
      rounded
    >
      <div class="flex column justify-center">
        <h3 class="q-ma-sm text-center text-weight-bolder">{{ formattedTime }}</h3>
        <h6 v-if="wholeCycle < preferences.limit" class="q-ma-sm text-center text-italic">
          {{ $t('time_for') }} {{ currentCycle =='work' ? $t('work') : $t('relax') }}
        </h6>
        <h6 v-else class="q-ma-sm text-cente text-italic">{{ $t('pomo_end') }}</h6>
        <div class="flex row wrap justify-center">
          <q-icon
            v-for="i in workCycles"
            :key="i"
            size="sm"
            name="favorite"
            class="self-center"
            :color="color"
          />
        </div>
      </div>
    </q-circular-progress>
    <div class="flex row justify-center q-mb-md">
      <q-btn
        @click="startTimer"
        icon="play_circle"
        color="white"
        outline
        :disabled="isRunning"
        class="q-mr-sm"
      >
        <q-tooltip>{{ $t('start') }} pomodoro</q-tooltip>
      </q-btn>
      <q-btn
        @click="stopTimer"
        icon="stop_circle"
        outline
        color="white"
        :disabled="!isRunning"
        class="q-mr-sm"
      >
        <q-tooltip>{{ $t('stop') }} pomodoro</q-tooltip>
      </q-btn>
      <q-btn @click="resetTimer" icon="restart_alt" outline color="white" class="q-mr-sm">
        <q-tooltip>{{ $t('restart') }} pomodoro</q-tooltip>
      </q-btn>
      <q-btn outline @click="nextCycle" icon="next_plan" color="white">
        <q-tooltip>{{ $t('skip') }}</q-tooltip>
      </q-btn>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePreferencesStore } from '../stores/preferences';
import { useAuthStore } from '../stores/auth';
import { colors } from 'quasar';

const preferencesStore = usePreferencesStore();
const authStore = useAuthStore();

const currentCycle = ref<'work' | 'relax'>('work');
const wholeCycle = ref<number>(0);
const workCycles = ref<number>(0);

let timerId: unknown = null;

const isRunning = ref<boolean>(false);

const defaultPreferences = {
  workTime: 25,
  relaxTime: 5,
  longerRelaxTime: 20,
  limit: 4,
};
const preferences = ref({ ...defaultPreferences });

let duration: number = 0;
const minutes = ref<number>(0);
const seconds = ref<number>(0);
const remainingTime = ref<number>(duration);

const loadPreferences = async () => {
  if (!authStore.uid) return;

  await preferencesStore.init(authStore.uid);
  preferences.value = {
    ...defaultPreferences,
    ...preferencesStore.preferences,
  };

  duration = preferences.value.workTime * 60;
  remainingTime.value = duration;
  minutes.value = Math.floor(remainingTime.value / 60);
  seconds.value = remainingTime.value % 60;
};

onMounted(async () => {
  if (!authStore.uid) return;
  await loadPreferences();
});

watch(
  () => authStore.uid,
  async (newUid) => {
    if (newUid) {
      try {
        await loadPreferences();
      } catch (error) {
        console.error('Błąd ładowania preferencji:', error);
      }
    }
  },
  { immediate: true },
);

const preferencesLoaded = ref(false);

const startTimer = (): void => {
  if (isRunning.value || !preferencesLoaded.value) return;

  isRunning.value = true;

  timerId = setInterval(() => {
    remainingTime.value--;

    minutes.value = Math.floor(remainingTime.value / 60);
    seconds.value = remainingTime.value % 60;

    if (remainingTime.value <= 0) {
      if (currentCycle.value === 'work') {
        if (workCycles.value < 4) {
          workCycles.value++;
          wholeCycle.value++;
        }
        if (wholeCycle.value >= preferences.value.limit) {
          alert('reset!');
          resetTimer();
          // todo: save completed session to stats!
          return;
        }
      }

      if (workCycles.value >= 4) {
        if (currentCycle.value === 'work') {
          currentCycle.value = 'relax';
          duration = preferences.value.longerRelaxTime * 60;
        } else {
          currentCycle.value = 'work';
          duration = preferences.value.workTime * 60;
          workCycles.value = 0;
        }
      } else {
        if (currentCycle.value === 'work') {
          currentCycle.value = 'relax';
          duration = preferences.value.relaxTime * 60;
        } else {
          currentCycle.value = 'work';
          duration = preferences.value.workTime * 60;
        }
      }

      remainingTime.value = duration;
      minutes.value = Math.floor(remainingTime.value / 60);
      seconds.value = remainingTime.value % 60;

      if (timerId) {
        clearInterval(timerId as number);
      }
      isRunning.value = false;
    }
  }, 1000);
};

const stopTimer = (): void => {
  if (timerId) {
    clearInterval(timerId as number);
    isRunning.value = false;
  }
};

const resetTimer = (): void => {
  if (timerId) {
    clearInterval(timerId as number);
    isRunning.value = false;
  }
  currentCycle.value = 'work';
  workCycles.value = 0;
  duration = preferences.value.workTime * 60;
  remainingTime.value = duration;
  minutes.value = Math.floor(remainingTime.value / 60);
  seconds.value = remainingTime.value % 60;
};

watch(
  () => preferencesStore.preferences,
  (newPreferences) => {
    if (newPreferences) {
      preferences.value = { ...defaultPreferences, ...newPreferences };
      preferencesLoaded.value = true;
    }
    resetTimer();
  },
  { immediate: true },
);

const nextCycle = (): void => {
  if (currentCycle.value === 'work') {
    currentCycle.value = 'relax';
    if (workCycles.value >= 4) {
      duration = preferences.value.longerRelaxTime * 60;
    } else {
      duration = preferences.value.relaxTime * 60;
    }
  } else {
    currentCycle.value = 'work';
    duration = preferences.value.workTime * 60;
    // workCycles.value = 0; // to się nie powinno zerować;
  }

  remainingTime.value = duration;
  minutes.value = Math.floor(remainingTime.value / 60);
  seconds.value = remainingTime.value % 60;
};

const formattedTime = computed(() => {
  const formattedMinutes = minutes.value.toString().padStart(2, '0');
  const formattedSeconds = seconds.value.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
});

const color = computed((): string => {
  return colors.changeAlpha('#ffffff', -0.3);
});
</script>

<style scoped>
.center {
  display: block;
  margin: 0 auto;
}
</style>
