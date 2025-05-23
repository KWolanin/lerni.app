<template>
  <q-card class="fit flex column justify-between bg radius-15 q-pa-sm">
    <div class="flex row">
      <q-space />
      <q-btn
        size="sm"
        :icon="pingEnabled ? 'music_note' : 'music_off'"
        color="user-font"
        flat
        round
        @click="pingEnabled = !pingEnabled"
      >
        <q-tooltip anchor="center left" self="center right" class="bg-blur calsans-font">{{
          $t('ping_sound_enable')
        }}</q-tooltip>
      </q-btn>
    </div>
    <div ref="wrapper" class="progress-wrapper">
      <q-circular-progress
        show-value
        class="q-ma-sm q-pb-sm q-pt-sm center"
        :size="progressSize + 'px'"
        :thickness="0.2"
        :style="{
          color: 'color-mix(in srgb, var(--user-font-color) 30%, transparent)',
          '--q-circular-progress-track-color': 'rgba(255, 255, 255, 0.2)',
        }"
        track-color="gray-1"
        :min="0"
        :max="duration"
        :value="remainingTime"
        rounded
      >
        <div class="flex column justify-center">
          <p class="q-mb-sm text-center user-font text-weight-bolder text-h3 calsans-font">{{ formattedTime }}</p>
          <p
            v-if="wholeCycle < preferences.limit"
            class="q-mb-sm text-center user-font text-subtitle2 calsans-font"
          >
            {{ $t('time_for') }} {{ currentCycle == 'work' ? $t('work') : $t('relax') }}
          </p>
          <p v-else class="q-ma-sm text-center user-font calsans-fontc wrap text-subtitle2">
            {{ $t('pomo_end') }}
          </p>
          <div class="flex row wrap justify-center">
            <q-icon
              v-for="i in workCycles"
              :key="i"
              size="sm"
              name="favorite"
              class="self-center"
              color="user-font"
            />
          </div>
        </div>
      </q-circular-progress>
    </div>
    <pomodoro-buttons
    :is-running="isRunning"
    :start-timer="startTimer"
    :stop-timer="stopTimer"
    :reset-timer="resetTimer"
    :next-cycle="nextCycle"
    :work-cycles="workCycles"
    />
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { usePreferencesStore } from '../stores/preferences';
import { useAuthStore } from '../stores/auth';
import winkSound from '/audio/wink.mp3';
import TimerWorker from './timerWorker.ts?worker';
import PomodoroButtons from './PomodoroButtons.vue';
import { addPomoSession } from '../service/pomo_sessions';

const preferencesStore = usePreferencesStore();
const authStore = useAuthStore();

// worker
let timerWorker: Worker | null = null;

// sound
const pingEnabled = ref<boolean>(true);

const playSound = async () => {
  const audio = new Audio(winkSound);
  await audio.play();
};

// current timer values
const currentCycle = ref<'work' | 'relax'>('work');
const wholeCycle = ref<number>(0);
const workCycles = ref<number>(0);
const isRunning = ref<boolean>(false);

let duration: number = 0;
const minutes = ref<number>(0);
const seconds = ref<number>(0);
const remainingTime = ref<number>(duration);

// progress circle size
let resizeObserver: ResizeObserver;
const wrapper = ref(null);
const progressSize = ref(0);

// default preferences
const defaultPreferences = {
  workTime: 25,
  relaxTime: 5,
  longerRelaxTime: 20,
  limit: 4,
};
const preferences = ref({ ...defaultPreferences });

// loads preferences from store
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
  preferences.value = { ...defaultPreferences };
  await loadPreferences();
  if (wrapper.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        progressSize.value = Math.min(entry.contentRect.width, entry.contentRect.height);
      }
    });
    resizeObserver.observe(wrapper.value);
  }

  timerWorker = new TimerWorker();

  timerWorker.onmessage = (e) => {
    if (e.data?.type === 'tick') {
      handleTick();
    }
  };
  timerWorker.onmessage = (e) => {
    if (e.data?.type === 'tick') {
      handleTick();
    }
  };
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
  if (timerWorker) {
    timerWorker.postMessage('stop');
    timerWorker.terminate();
    timerWorker = null;
  }
});

watch(
  () => authStore.uid,
  async (newUid) => {
    if (newUid) {
      try {
        await loadPreferences();
      } catch (error) {
        console.error('Preferences loading eror:', error);
      }
    }
  },
  { immediate: true },
);

const preferencesLoaded = ref(false);

const startTimer = () => {
  if (isRunning.value || !preferencesLoaded.value || !timerWorker) return;
  isRunning.value = true;
  timerWorker.postMessage('start');
};

const stopTimer = () => {
  if (!timerWorker) return;
  isRunning.value = false;
  timerWorker.postMessage('stop');
};

const resetTimer = () => {
  stopTimer();
  currentCycle.value = 'work';
  workCycles.value = 0;
  duration = preferences.value.workTime * 60;
  remainingTime.value = duration;
  minutes.value = Math.floor(duration / 60);
  seconds.value = duration % 60;
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

const nextCycle = () => {
  if (currentCycle.value === 'work') {
    currentCycle.value = 'relax';
    duration =
      workCycles.value >= preferences.value.limit
        ? preferences.value.longerRelaxTime * 60
        : preferences.value.relaxTime * 60;
  } else {
    currentCycle.value = 'work';
    duration = preferences.value.workTime * 60;
  }

  remainingTime.value = duration;
  minutes.value = Math.floor(duration / 60);
  seconds.value = duration % 60;
};

const formattedTime = computed(() => {
  const formattedMinutes = minutes.value.toString().padStart(2, '0');
  const formattedSeconds = seconds.value.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
});

function handleTick() {
  remainingTime.value--;
  minutes.value = Math.floor(remainingTime.value / 60);
  seconds.value = remainingTime.value % 60;

  if (remainingTime.value <= 0) {
    if (pingEnabled.value) void playSound();

    if (currentCycle.value === 'work') {
      if (workCycles.value < preferences.value.limit) {
        workCycles.value++;
        wholeCycle.value++;
      }

      if (wholeCycle.value >= preferences.value.limit) {
        resetTimer();
        addPomoSession(wholeCycle.value, Number(preferences.value.workTime));
        return;
      }
    }

    if (workCycles.value >= preferences.value.limit) {
      currentCycle.value = currentCycle.value === 'work' ? 'relax' : 'work';
      duration =
        currentCycle.value === 'work'
          ? preferences.value.workTime * 60
          : preferences.value.longerRelaxTime * 60;
      if (currentCycle.value === 'work') workCycles.value = 0;
    } else {
      currentCycle.value = currentCycle.value === 'work' ? 'relax' : 'work';
      duration =
        currentCycle.value === 'work'
          ? preferences.value.workTime * 60
          : preferences.value.relaxTime * 60;
    }

    remainingTime.value = duration;
    minutes.value = Math.floor(duration / 60);
    seconds.value = duration % 60;
    stopTimer();
  }
}

</script>

<style scoped>
.center {
  display: block;
  margin: 0 auto;
}

.fit {
  width: 100%;
  height: 100%;
}

.progress-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
}
</style>
