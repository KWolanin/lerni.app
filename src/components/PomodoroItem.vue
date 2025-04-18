<template>
  <q-card class="fit flex column justify-between bg radius-15 q-pa-sm">
    <div class="flex row">
      <q-space />
      <q-btn
        size="sm"
        :icon="pingEnabled ? 'music_note' : 'music_off'"
        color="white"
        class="q-mr-sm q-pr-sm"
        flat
        @click="pingEnabled = !pingEnabled"
      >
        <q-tooltip anchor="center left" self="center right" class="bg-blur text-weight-bold">{{
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
        color: 'rgba(255, 255, 255, 0.3)',
        '--q-circular-progress-track-color': 'rgba(255, 255, 255, 0.2)',
      }"
      track-color="gray-1"
      :min="0"
      :max="duration"
      :value="remainingTime"
      rounded
    >
      <div class="flex column justify-center">
        <h3 class="q-ma-sm text-center text-weight-bolder">{{ formattedTime }}</h3>
        <h6 v-if="wholeCycle < preferences.limit" class="q-ma-sm text-center text-italic">
          {{ $t('time_for') }} {{ currentCycle == 'work' ? $t('work') : $t('relax') }}
        </h6>
        <h6 v-else class="q-ma-sm text-center text-italic wrap">{{ $t('pomo_end') }}</h6>
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

      </div>

    <div class="flex row justify-center q-mb-md">
      <q-btn
        @click="startTimer"
        icon="play_circle"
        color="white"
        outline
        :disabled="isRunning"
        class="q-mr-sm"
      >
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right"
          >{{ $t('start') }} pomodoro</q-tooltip
        >
      </q-btn>
      <q-btn
        @click="stopTimer"
        icon="stop_circle"
        outline
        color="white"
        :disabled="!isRunning"
        class="q-mr-sm"
      >
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right"
          >{{ $t('stop') }} pomodoro</q-tooltip
        >
      </q-btn>
      <q-btn @click="resetTimer" icon="restart_alt" outline color="white" class="q-mr-sm">
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right"
          >{{ $t('restart') }} pomodoro</q-tooltip
        >
      </q-btn>
      <q-btn outline @click="nextCycle" icon="next_plan" color="white">
        <q-tooltip class="bg-blur text-weight-bold" anchor="center left" self="center right">{{
          $t('skip')
        }}</q-tooltip>
      </q-btn>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { usePreferencesStore } from '../stores/preferences';
import { useAuthStore } from '../stores/auth';
import { colors } from 'quasar';
import winkSound from '/audio/wink.mp3';

const pingEnabled = ref<boolean>(true);

const preferencesStore = usePreferencesStore();
const authStore = useAuthStore();

const currentCycle = ref<'work' | 'relax'>('work');
const wholeCycle = ref<number>(0);
const workCycles = ref<number>(0);

let timerId: unknown = null;

const isRunning = ref<boolean>(false);


let resizeObserver: ResizeObserver
const wrapper = ref(null)
const progressSize = ref(0)



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
  await loadPreferences();
  if (wrapper.value) {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        progressSize.value = Math.min(entry.contentRect.width, entry.contentRect.height)
      }
    })
    resizeObserver.observe(wrapper.value)
  }
});

onBeforeUnmount(() => {
  resizeObserver.disconnect()
})

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

const playSound = async () => {
  const audio = new Audio(winkSound);
  await audio.play();
};

const startTimer = (): void => {
  if (isRunning.value || !preferencesLoaded.value) return;

  isRunning.value = true;

  timerId = setInterval(() => {
    remainingTime.value--;
    minutes.value = Math.floor(remainingTime.value / 60);
    seconds.value = remainingTime.value % 60;

    if (remainingTime.value <= 0) {
      if (pingEnabled.value) void playSound();
      if (currentCycle.value === 'work') {
        if (workCycles.value < 4) {
          workCycles.value++;
          wholeCycle.value++;
        }
        if (wholeCycle.value >= preferences.value.limit) {
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
