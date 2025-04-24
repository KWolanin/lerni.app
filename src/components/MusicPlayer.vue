<template>
  <q-card class="q-pa-sm bg radius-15 flex column" style="height: 100%">
    <div class="flex column justify-center">
      <q-select
        standout="transparent user-font"
        v-model="currentlyPlayed"
        dense
        label-color="user-font"
        :options="sounds"
        :label="$t('now_playing')"
      />
      <div class="flex justify-center q-mb-sm q-mr-sm q-ml-sm">
        <div class="full-width">
          <AudioPlayer :option="audioOptions" />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// @ts-expect-error('no types')
import AudioPlayer from 'vue3-audio-player';
import 'vue3-audio-player/dist/style.css';
import { useFontColorStore } from 'src/stores/fontColor';
import { sounds } from 'src/sounds';
import type { Sound } from 'src/sounds';

const fontColor = useFontColorStore();

const currentlyPlayed = ref<Sound>(sounds[0]!);

const getAudio = computed(() => {
  return `/audio/${currentlyPlayed.value.value}`;
});

const getTitle = computed(() => {
  return currentlyPlayed.value.label;
});

const audioOptions = computed(() => {
  return {
    src: getAudio,
    title: getTitle,
    progressBarColor: fontColor.fontColor,
    indicatorColor: fontColor.fontColor,
  };
});
</script>

<style scoped>
.audio {
  width: 100%;
}

::v-deep(.q-field__native) {
  color: var(--user-font-color);
}

::v-deep(.audio__player-title) {
  color: var(--user-font-color);
}

::v-deep(.audio__player-time span) {
  font-size: 0.3rem;
  color: var(--user-font-color);
}

::v-deep(.audio__player-progress-container) {
  width: 100%;
}
</style>
