<template>

<div class="flex row justify-center q-mb-md">
      <q-btn
        @click="() => startTimer()"
        icon="play_circle"
        color="user-font"
        outline
        :disabled="isRunning"
        class="q-mr-sm"
      >
        <q-tooltip class="bg-blur calsans-font" anchor="center left" self="center right"
          >{{ $t('start') }} pomodoro</q-tooltip
        >
      </q-btn>
      <q-btn
        @click="() => stopTimer()"
        icon="stop_circle"
        outline
        color="user-font"
        :disabled="!isRunning"
        class="q-mr-sm"
      >
        <q-tooltip class="bg-blur calsans-font" anchor="center left" self="center right"
          >{{ $t('stop') }} pomodoro</q-tooltip
        >
      </q-btn>
      <q-btn @click="() => resetTimer()" icon="restart_alt" outline color="user-font" class="q-mr-sm">
        <q-tooltip class="bg-blur calsans-font" anchor="center left" self="center right"
          >{{ $t('restart') }} pomodoro</q-tooltip
        >
      </q-btn>
      <q-btn outline @click="() => nextCycle()" icon="next_plan" color="user-font">
        <q-tooltip class="bg-blur calsans-font" anchor="center left" self="center right">{{
          $t('skip')
        }}</q-tooltip>
      </q-btn>
    </div>

</template>

<script setup lang="ts">

defineProps({
  startTimer: {
   type: Function,
   required: true
  },
  stopTimer: {
    type: Function,
    required: true
  },
  resetTimer: {
    type: Function,
    required: true
  },
  nextCycle: {
    type: Function,
    required: true
  },
  isRunning: {
    type: Boolean,
    required: true
  },
  workCycles: {
    type: Number,
    required: true
  }
})

</script>
