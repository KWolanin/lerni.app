<template>
  <div class="user-font text-center q-pa-md flex flex-center calsans-font">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('contact') }}
      </q-card-section>
      <q-card-section>
        This app is created by K. Wolanin as a personal project.
        Check my GitHub profile for more projects:
        <a href="https://github.com/KWolanin/">here</a>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>

a,
a:link,
a:hover,
a:active {
  color: white;
  text-decoration: none;
}

</style>
