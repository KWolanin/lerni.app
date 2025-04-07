<template>
      <q-card class="q-pa-sm bg-pink-12 flex column justify-center radius-15">
      <h6 class="q-ma-sm text-italic text-white">{{ $t('starter') }}</h6>
      <q-scroll-area style="height: 300px; max-width: 100%;">
        <q-list dense>
        <q-item dense clickable v-ripple v-for="([label, checked], index) in Object.entries(starters)" :key="index">
          <q-item-section>
          <q-checkbox class="text-caption" :class="{strike : checked}" dense keep-color color="pink-14" v-model="starters[label]" :label="label" :value="checked"/>
        </q-item-section>
        </q-item>
      </q-list>
      </q-scroll-area>
    </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const starters = ref<{ [key: string]: boolean }>({
  'Clean your desk and room a bit 🧹': false,
  'Prepare some snacks 🥐': false,
  'Prepare some drinks ☕': false,
  'Turn off wi-fi on your phone 📵': false,
  'Hide phone to avoid distractions (to the drawer, for example) 📵': false,
  'Hide everything what can distract you 😫': false,
  'Prepare your favorite music if you want 🎵': false,
  'Prepare a plan for today - what you want to do today? 📝': false,
  'Do you have everything you need to work? 📓': false,
  'Check: Are you not hungry? 🥙': false,
  'Check: Are you not thirsty? 🧃': false,
  'Check: Need to go to the bathroom? 🚾': false,
  'Check: Are you feeling comfortable? 💺': false,
  'Set your pomodoro 🍅': false,
  'All set? Go! 🚀':false
})

</script>

<style scoped>
::v-deep(.q-checkbox--dense) {
  color: #841e4c;
}
.strike {
  text-decoration: line-through;
}
</style>
