<template>
  <q-card dense class="q-pa-sm flex column justify-center radius-15 bg">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('some_music') }}</h6>
    <q-select
      standout="transparent text-pink-12"
      v-model="currentlyPlayed"
      dense
      :options="options"
      label="Now playing"
      class="q-mb-sm"
    />
    <vue-plyr class="flex row q-mb-sm justify-center">
      <audio  ref="audioRef" controls crossorigin="anonymous" playsinline class="audio">
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
  {label: 'Restaurant', value: 'restaurant.mp3'}
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


<style scoped>

.audio {
  width: 100%;
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
