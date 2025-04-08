<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-pink-10">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="bg-pink-10"
        />

        <q-toolbar-title> Lerni.app </q-toolbar-title>
        <q-img class="user-icon" :src="authStore.photoURL" width="30px" height="30px"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-pink-10">
      <q-list>
        <q-item-label header class="text-white"> Lerni - your learning friend </q-item-label>

        <q-list-label>stats</q-list-label>
        <q-list-label>login</q-list-label>
        <q-list-label>change language</q-list-label>
        <q-list-label>customize</q-list-label>
        <div>
          <button v-if="!authStore.loggedIn" @click="login">Zaloguj się przez Google</button>
          <div v-else>
            <p>Witaj, {{ authStore.displayName }}</p>
            <button @click="handleLogout">Wyloguj się</button>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
</script>


<style scoped>

.user-icon {
  border-radius: 50%;
}

</style>
