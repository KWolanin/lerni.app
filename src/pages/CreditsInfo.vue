<template>
  <div class="user-font text-center q-pa-md flex flex-center calsans-font">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('credits') }}
      </q-card-section>
      <q-card-section>
        Focus sounds (not included on github repo)
        <ol>
          <li v-for="(credit, index) in credits.sounds" :key="index">
            <a :href="credit.sound_url" target="_blank">
              {{ credit.sound_name }}
            </a>
            by
            <a :href="credit.author_url" target="_blank">
              {{ credit.author_name }}
            </a>
            [{{ credit.license_name }}]
          </li>
        </ol>
        Notification sound
        <ol>
          <li v-for="(credit, index) in credits.notification_sounds" :key="index">
            <a :href="credit.sound_url" target="_blank">
              {{ credit.sound_name }}
            </a>
            by
            <a :href="credit.author_url" target="_blank">
              {{ credit.author_name }}
            </a>
            [{{ credit.license_name }}]
          </li>
        </ol>
        Backgrounds:
        <ol>
          <li>
            <a href="https://uigradients.com/" target="_blank"> UI Gradients</a>
          </li>
          <li>
            <a
              href="https://www.svgbackgrounds.com/set/free-svg-backgrounds-and-patterns/"
              target="_blank"
            >
              SVG Backgrounds (free)</a
            >
          </li>
        </ol>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import credits from '../../credits.json';
</script>

<style scoped>
a,
a:link,
a:hover,
a:active {
  color: white;
  text-decoration: none;
}
</style>
