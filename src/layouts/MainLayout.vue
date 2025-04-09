<template>
  <q-layout view="lHh Lpr lFf" :class="gradientBackground">
    <q-header elevated class="glass-panel">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Lerni.app </q-toolbar-title>
        <q-select
          standout="transparent text-pink-12"
          v-model="currentTheme"
          dense
          label-color="white"
          :options="themes"
          label="Theme"
          class="q-ma-sm"
        />

        <q-img class="user-icon" :src="authStore.photoURL" width="30px" height="30px" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="glass-panel">
      <q-list bordered padding style="height: 100%" class="text-white flex column items-center justify-evenly">
        <q-item class="q-pa-md" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section> Stats </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section> Settings </q-item-section>
        </q-item>
        <q-space/>
        <q-item class="flex justify-center">
          <q-btn outline v-if="!authStore.loggedIn" @click="login">Login via Google Account</q-btn>
          <div v-else class="flex column justify-center">
            <p>Hello, {{ authStore.displayName }}</p>
            <q-btn outline @click="handleLogout">Logout</q-btn>
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { loginWithGoogle, logout, listenToAuthState } from '../service/firebase';
import { usePreferencesStore } from '../stores/preferences';
import { useAuthStore } from '../stores/auth';
import type { User } from 'firebase/auth';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();

async function login() {
  const user = await loginWithGoogle();
  if (user?.uid) {
    authStore.setUser(user);
    await preferencesStore.init(user.uid);
  }
}

async function handleLogout() {
  await logout();
  authStore.reset();
  preferencesStore.$reset();
}

listenToAuthState(async (user: User) => {
  const authStore = useAuthStore();
  const preferencesStore = usePreferencesStore();

  authStore.setUser(user);
  await preferencesStore.init(user.uid);
});

const currentTheme = ref<string>('Sunset');

const themes = [
  'Sunset',
  'Morning sky',
  'Intensive',
  'Purple night',
  'Ocean',
  'Pure lust',
  'Rainbow',
  'Mint fresh',
];

const gradientBackground = computed(() => {
  console.log('computed');
  switch (currentTheme.value) {
    case 'Morning sky':
      console.log('gradient-3');
      return 'bg-gradient-3';
    case 'Intensive':
      console.log('gradient-2');
      return 'bg-gradient-2';
    case 'Sunset':
      return 'bg-gradient-default';
    case 'Purple night':
      return 'bg-gradient-4';
    case 'Ocean':
      return 'bg-gradient-5';
    case 'Pure lust':
      return 'bg-gradient-6';
    case 'Rainbow':
      return 'bg-gradient-7';
    case 'Mint fresh':
      return 'bg-gradient-8';
  }
  return 'bg-gradient-default';
});
</script>

<style scoped>
.user-icon {
  border-radius: 50%;
}

::v-deep(aside) {
  background-color: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(2px) !important ;
  -webkit-backdrop-filter: blur(2px);
}

::v-deep(.q-field__native) {
  color: white;
}

/* default style * zacyztać gradient z konta usera, jak nie ma, dać defualt*/
.bg-gradient-default {
  background: linear-gradient(
    43deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 0.5226541300113796) 50%,
    rgba(252, 176, 69, 1) 100%
  );
}

/* test styles */

.bg-gradient-2 {
  background: linear-gradient(
    328deg,
    rgba(246, 90, 143, 0.7943628134847689) 42%,
    rgba(105, 230, 255, 1) 72%
  );
}

.bg-gradient-3 {
  background: linear-gradient(90deg, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%);
}

.bg-gradient-4 {
  background: linear-gradient(to right, #ad5389, #3c1053);
}

.bg-gradient-5 {
  background: linear-gradient(to right, #a8c0ff, #3f2b96);
}

.bg-gradient-6 {
  background: linear-gradient(to right, #333333, #dd1818);
}

.bg-gradient-7 {
  background: linear-gradient(
    to right,
    #40e0d0,
    #ff8c00,
    #ff0080
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.bg-gradient-8 {
  background: linear-gradient(
    to right,
    #11998e,
    #38ef7d
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.glass-panel {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
