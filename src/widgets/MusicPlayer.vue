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
        :option-label="getLabelField"
      />
      <div class="flex justify-center q-mb-sm q-mr-sm q-ml-sm">
        <div class="full-width q-mt-sm">
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
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });
const fontColor = useFontColorStore();

const currentlyPlayed = ref<Sound>(sounds[0]!);

const getAudio = computed(() => {
  return `/audio/${currentlyPlayed.value.value}`;
});

const getTitle = computed(() => {
  switch (locale.value) {
    case 'en-US':
      return sounds.find((s) => s.value == currentlyPlayed.value.value)?.label_EN;
    case 'pl':
      return sounds.find((s) => s.value == currentlyPlayed.value.value)?.label_PL;
    case 'de':
      return sounds.find((s) => s.value == currentlyPlayed.value.value)?.label_DE;
    case 'ua':
      return sounds.find((s) => s.value == currentlyPlayed.value.value)?.label_UA;
    default:
      return sounds.find((s) => s.value == currentlyPlayed.value.value)?.label_EN;
  }
});

const getLabelField = computed(() => {
  switch (locale.value) {
    case 'en-US':
      return 'label_EN';
    case 'pl':
      return 'label_PL';
    case 'de':
      return 'label_DE';
    case 'ua':
      return 'label_UA';
    default:
    return 'label_EN';
  }
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
