<template>
  <q-card dense class="q-pa-md flex column justify-center radius-15 bg">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('user_note') }}</h6>
    <q-editor  v-model="note" min-height="5rem" />
  </q-card>
</template>

<script setup lang="ts">
import {ref} from 'vue'
const note = ref('')

</script>

<style scoped>
/* .bg {
  background: linear-gradient(
    43deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 0.5226541300113796) 50%,
    rgba(252, 176, 69, 1) 100%
  );
} */
.bg {
  /* background: linear-gradient(
    43deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 0.5226541300113796) 50%,
    rgba(252, 176, 69, 1) 100%
  ); */
  background: rgba(255, 255, 255, 0.2) !important;
  /* box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 ); */
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

</style>
