<template>
  <q-card class="q-pa-md bg radius-15 flex column" style="height: 100%">
    <div class="flex row items-center q-mb-sm">
      <h6 class="q-ma-sm text-italic text-white">{{ $t('some_music') }}</h6>
      <q-space />
      <q-btn
        size="sm"
        icon="settings"
        color="white"
        flat
        class="q-mr-sm q-mt-sm q-mb-sm"
        disabled
      >
        <q-tooltip
          class="bg-blur text-weight-bold"
          anchor="center left"
          self="center right"
        >
          {{ $t('customize') }}
        </q-tooltip>
      </q-btn>
    </div>

    <q-select
      standout="transparent text-pink-12"
      v-model="currentlyPlayed"
      dense
      label-color="white"
      :options="options"
      :label="$t('now_playing')"
      class="q-mb-md"
    />

    <div class="q-mt-md flex justify-center">
      <div style="width: 100%; max-width: 400px">
        <vue-plyr class="full-width">
          <audio
            ref="audioRef"
            controls
            crossorigin="anonymous"
            playsinline
            class="audio"
          >
            <source :src="getAudio" type="audio/mp3" />
          </audio>
        </vue-plyr>
      </div>
    </div>
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
      console.warn('Audio playing error', err);
    });
  }
});
</script>


<style scoped>

.audio {
  width: 100%;
}

::v-deep(.q-field__native) {
  color: white;
}

</style>
