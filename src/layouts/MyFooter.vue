<template>
  <q-footer class="glass-panel calsans-font">
    <q-toolbar>
      <span>© 2025 Katarzyna Wolanin</span>
      <q-space />
      <div class="q-py-sm row q-gutter-sm">
        <router-link to="/credits">{{$t('credits')}}</router-link>
        <router-link to="/about">{{$t('about')}}</router-link>
        <router-link to="/contact">{{$t('contact')}}</router-link>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<style scoped>
a,
a:link,
a:hover,
a:active {
  color: white;
  text-decoration: none;
}
.glass-panel {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
