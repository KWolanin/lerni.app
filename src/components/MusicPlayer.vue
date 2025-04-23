<template>
  <q-card class="q-pa-sm bg radius-15 flex column" style="height: 100%">
    <div class="flex column justify-center">
      <q-select
        standout="transparent user-font"
        v-model="currentlyPlayed"
        dense
        label-color="user-font"
        :options="options"
        :label="$t('now_playing')"
      />
      <div class="flex justify-center">
        <div style="width: 100%; max-width: 200px">
          <AudioPlayer
            :option="audioOptions"
            class="full-width"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
// @ts-expect-error('no types')
import AudioPlayer from 'vue3-audio-player';
import 'vue3-audio-player/dist/style.css';
import { useFontColorStore } from 'src/stores/fontColor';

const fontColor = useFontColorStore()

type AudioOption = {
  label: string;
  value: string;
};

// todo: add copyright free music
const options = [
  { label: 'Rain', value: 'rain.mp3' },
  { label: 'Restaurant', value: 'restaurant.mp3' },
];

const currentlyPlayed = ref<AudioOption>(options[0]!);

const getAudio = computed(() => {
  return `/audio/${currentlyPlayed.value.value}`;
});

const getTitle = computed(() => {
  return currentlyPlayed.value.label;
});

const audioRef = ref<HTMLAudioElement | null>(null);

watch(getAudio, () => {
  if (audioRef.value) {
    audioRef.value.load();
    audioRef.value.play().catch((err) => {
      console.warn('Audio playing error', err);
    });
  }
});

const audioOptions = computed(() => {
  return {
  src: getAudio,
  title: getTitle,
  progressBarColor: fontColor.fontColor,
  indicatorColor: fontColor.fontColor
}
})


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
