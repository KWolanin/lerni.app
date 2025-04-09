<template>
  <q-card dense class="q-pa-md flex column justify-center radius-15 bg">
    <h6 class="q-ma-sm text-italic text-white">{{ $t('your_notes') }}</h6>
    <q-list>
      <q-list-item v-for="(i, index) in 10" :key="index">
        <p>i</p>
      </q-list-item>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">

</script>
