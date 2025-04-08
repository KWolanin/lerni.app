<template>
  <div class="flex column justify-center" >
    <q-circular-progress
      show-value
      class="text-white q-ma-md q-pb-sm center"
      size="15rem"
      :thickness="0.2"
      :color="color"
      :center-color="centerColor"
      :track-color="trackColor"
      :min="0"
      :max="duration"
      :value="remainingTime"
      rounded
    >
      <div class="flex column justify-center">
        <h3 class="q-ma-sm text-center text-weight-bolder">{{ formattedTime }}</h3>
        <h6
        v-if="wholeCycle < preferences.limit"
        class="q-ma-sm text-center text-italic"> {{ $t('time_for') }} {{ currentCycle }}</h6>
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
    <div class="flex row justify-center">
      <q-btn
        @click="startTimer"
        icon="play_circle"
        :color="color"
        :disabled="isRunning"
        class="q-mr-sm"
      >
        <q-tooltip>{{ $t('start') }} pomodoro</q-tooltip>
      </q-btn>
      <q-btn
        @click="stopTimer"
        icon="stop_circle"
        :color="color"
        :disabled="!isRunning"
        class="q-mr-sm"
      >
        <q-tooltip>{{ $t('stop') }} pomodoro</q-tooltip>
      </q-btn>
      <q-btn @click="resetTimer" icon="restart_alt" :color="color" class="q-mr-sm">
        <q-tooltip>{{ $t('restart') }} pomodoro</q-tooltip>
      </q-btn>
      <q-btn @click="nextCycle" icon="next_plan" :color="color">
        <q-tooltip>{{ $t('skip') }}</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { t } = useI18n();
import { usePreferencesStore } from '../stores/preferences'
import { useAuthStore } from '../stores/auth'


const preferencesStore = usePreferencesStore()
const authStore = useAuthStore()

const currentCycle = ref<'work' | 'relax'>('work');
const wholeCycle = ref<number>(0);
const workCycles = ref<number>(0);

let timerId: unknown = null;

const isRunning = ref<boolean>(false);

const defaultPreferences = {
  workTime: 25,
  relaxTime: 5,
  longerRelaxTime: 20,
  limit: 4
}
const preferences = ref({ ...defaultPreferences })

let duration : number = 0;
const minutes = ref<number>(0);
const seconds = ref<number>(0);
const remainingTime = ref<number>(duration);

const loadPreferences = async () => {
  if (!authStore.uid) return

  await preferencesStore.init(authStore.uid)
  preferences.value = {
    ...defaultPreferences,
    ...preferencesStore.preferences
  }

  duration = preferences.value.workTime * 60;
  remainingTime.value = duration;
  minutes.value = Math.floor(remainingTime.value / 60);
  seconds.value = remainingTime.value % 60;
}

onMounted(async () => {
  if (!authStore.uid) return
  await loadPreferences()
});


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
          alert('reset!')
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
    resetTimer()
  },
  { immediate: true }
)

const nextCycle = (): void => {
  if (currentCycle.value === 'work') {
    currentCycle.value = 'relax';
    if (workCycles.value >= 4) {
      duration = preferences.value.longerRelaxTime*60;
    } else {
      duration = preferences.value.relaxTime * 60;
    }
  } else {
    currentCycle.value = 'work';
    duration = preferences.value.workTime * 60;
    workCycles.value = 0;
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
  return 'pink-12';
});

const trackColor = computed((): string => {
  return 'pink-10';
});

const centerColor = computed((): string => {
  return 'pink-11';
});

</script>

<style scoped>
.center  {
  display: block;
  margin: 0 auto;
}

.bg {
  background: linear-gradient(
    43deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 0.5226541300113796) 50%,
    rgba(252, 176, 69, 1) 100%
  );
}

</style>
