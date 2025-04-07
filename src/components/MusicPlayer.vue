<template>
  <q-card dense class="q-pa-sm bg-pink-12 flex column justify-center radius-15">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('some_music') }}</h6>
    <q-select
      standout="bg-pink-14 text-pink-12"
      v-model="currentlyPlayed"
      dense
      :options="options"
      label="Now playing"
      class="q-mb-sm"
    />
    <vue-plyr>
      <audio ref="audioRef" controls crossorigin="anonymous" playsinline>
        <source :src="getAudio" type="audio/mp3" />
      </audio>
    </vue-plyr>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

type AudioOption = {
  label: string;
  value: string;
};

// todo: add copyright free music
const options = [
  { label: 'Rain', value: 'rain.mp3' },
  { label: 'Lofi', value: 'lofi.mp3' },
];

const currentlyPlayed = ref<AudioOption>(options[0]!);

const getAudio = computed(() => {
  return `/audio/${currentlyPlayed.value.value}`;
});

const audioRef = ref<HTMLAudioElement | null>(null);

watch(getAudio, () => {
  if (audioRef.value) {
    audioRef.value.load();
    audioRef.value.play().catch((err) => {
      console.warn('Nie udało się odtworzyć audio:', err);
    });
  }
});
</script>
