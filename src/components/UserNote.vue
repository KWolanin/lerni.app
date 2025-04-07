<template>
  <q-card dense class="q-pa-sm bg-pink-12 flex column justify-center radius-15">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('user_note') }}</h6>
    <q-editor v-model="note" min-height="5rem" />
  </q-card>
</template>

<script setup lang="ts">
import {ref} from 'vue'
const note = ref('')

</script>
