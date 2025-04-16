<template>
  <q-layout view="lHh Lpr lFf" :class="gradientBackground">
    <q-header v-if="authStore.loggedIn" elevated class="glass-panel">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Lerni.app </q-toolbar-title>
        <q-btn
          icon="dashboard"
          flat
          @click="openSelector = !openSelector"
        />
        <q-select
          standout="transparent text-pink-12"
          v-model="currentTheme"
          dense
          label-color="white"
          :options="themes"
          :label="$t('theme')"
          class="q-ma-sm"
        />
        <q-select
          v-model="locale"
          :options="localeOptions"
          :label="$t('language')"
          label-color="white"
          dense
          emit-value
          map-options
          standout="transparent text-pink-12"
          class="q-ma-sm"
        />

        <q-img class="user-icon" :src="authStore.photoURL" width="30px" height="30px" />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="authStore.loggedIn" :width="200" v-model="leftDrawerOpen" class="glass-panel">
      <q-list
        bordered
        padding
        style="height: 100%"
        class="text-white flex column items-center justify-evenly"
      >
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section> Staticstics </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section> Settings </q-item-section>
        </q-item>
        <q-space />
        <q-item class="flex justify-center">
          <q-btn outline v-if="!authStore.loggedIn" @click="login">Login via Google Account</q-btn>
          <div v-else class="flex column justify-center">
            <p>{{ authStore.displayName }}</p>
            <q-btn outline @click="handleLogout">Logout</q-btn>
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <widget-selector v-model="openSelector" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  loginWithGoogle,
  logout,
  listenToAuthState,
  loadLanguage,
  saveLanguage,
} from '../service/firebase';
import { usePreferencesStore } from '../stores/preferences';
import { useAuthStore } from '../stores/auth';
import { getAuth, type User } from 'firebase/auth';
import { loadTheme, saveTheme } from '../service/firebase';
import WidgetSelector from 'src/components/WidgetSelector.vue';
import { debounce, isEqual } from 'lodash';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { locale } = useI18n({ useScope: 'global' });

const openSelector = ref<boolean>(false);

watch(
  locale,
  (newVal) => {
    if (!newVal) return;
    debounce((newData: string) => {
      saveLanguage(authStore.uid, newData).catch((err) => console.error(err));
    }, 1000)(newVal);
  },
  { immediate: true },
);

const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'de', label: 'Deutsch' },
];

onMounted(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    authStore.setUser(user);
  }
});

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
  try {
    await router.push('/login');
  } catch (error) {
    console.error('Navigation error:', error);
  }
}

listenToAuthState(async (user: User) => {
  const authStore = useAuthStore();
  const preferencesStore = usePreferencesStore();
  authStore.setUser(user);
  await preferencesStore.init(user.uid);
});

const currentTheme = ref<string>('');

const themes = [
  'Sunset',
  'Morning sky',
  'Intensive',
  'Purple night',
  'Ocean',
  'Pure lust',
  'Rainbow',
  'Mint fresh',
  'Sunkiss',
  'Mirage',
];

const gradientBackground = computed(() => {
  switch (currentTheme.value) {
    case 'Morning sky':
      return 'bg-gradient-3';
    case 'Intensive':
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
    case 'Sunkiss':
      return 'bg-gradient-9';
    case 'Mirage':
      return 'bg-gradient-10';
  }
  return 'bg-gradient-default';
});

watch(
  currentTheme,
  (newVal) => {
    if (!newVal) return;
    if (!isEqual(previous, newVal)) {
      debouncedSave(newVal);
      previous = newVal;
    }
  },
  { deep: true },
);

const debouncedSave = debounce((newData: string) => {
  saveTheme(authStore.uid, newData).catch((err) => console.error(err));
}, 1000);

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadTheme(newUid)
        .then((data) => {
          currentTheme.value = data ? data.theme : 'Sunset';
        })
        .catch((err) => {
          console.error(err);
          currentTheme.value = 'Sunset';
        });
      loadLanguage(newUid)
        .then((data) => {
          locale.value = data ? data.language : 'en-US';
        })
        .catch((err) => {
          console.error(err);
          locale.value = 'en-US';
        });
    }
  },
  { immediate: true },
);

let previous: string | null = null;
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

.bg-gradient-default {
  background: linear-gradient(
    43deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 0.5226541300113796) 50%,
    rgba(252, 176, 69, 1) 100%
  );
}

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
  background: linear-gradient(to right, #40e0d0, #ff8c00, #ff0080);
}

.bg-gradient-8 {
  background: linear-gradient(to right, #11998e, #38ef7d);
}

.bg-gradient-9 {
  background: linear-gradient(to right, #f2994a, #f2c94c);
}

.bg-gradient-10 {
  background: linear-gradient(to right, #16222a, #3a6073);
}

.glass-panel {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
