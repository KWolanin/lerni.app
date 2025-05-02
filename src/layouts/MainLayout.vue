<template>
  <q-layout view="lHh Lpr lFf" :style="gradientBackground">
    <q-header v-if="authStore.loggedIn" elevated class="glass-panel calsans-font">
      <q-toolbar>
        <q-toolbar-title> Lerni.app </q-toolbar-title>
        <q-btn icon="dashboard" flat @click="openWidgetSelector = !openWidgetSelector" />
        <q-btn icon="palette" flat @click="openThemeSelector = !openThemeSelector" />
        <q-btn icon="format_color_text" flat @click="openColorSelector = !openColorSelector" />
        <q-btn icon="translate" flat @click="openLanguageSelector = !openLanguageSelector" />

        <q-img
            :src="authStore.photoURL"
            width="30px"
            height="30px"
            class="user-icon q-ml-sm cursor-pointer">
        <q-menu class="calsans-font bg user-font">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-img>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <widget-selector v-model="openWidgetSelector" />
    <theme-selector
      v-model="openThemeSelector"
      :current-theme="currentTheme"
      @change-theme="changeTheme"
    />
    <color-selector v-model="openColorSelector" />
    <language-selector v-model="openLanguageSelector" @change-language="changeLanguage" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue';
import {
  logout,
  listenToAuthState,
  loadLanguage,
  saveLanguage,
} from '../service/firebase';
import { usePreferencesStore } from '../stores/preferences';
import { useAuthStore } from '../stores/auth';
import { getAuth, type User } from 'firebase/auth';
import { loadTheme, saveTheme } from '../service/firebase';
import { debounce, isEqual } from 'lodash';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { themes } from 'src/themes';
import { useFontColorStore } from 'stores/fontColor';

const ThemeSelector = defineAsyncComponent(() => import('src/components/ThemeSelector.vue'));
const WidgetSelector = defineAsyncComponent(() => import('src/components/WidgetSelector.vue'));
const ColorSelector = defineAsyncComponent(() => import('src/components/ColorSelector.vue'));
const LanguageSelector = defineAsyncComponent(() => import('src/components/LanguageSelector.vue'));

const fontStore = useFontColorStore();

const router = useRouter();
const { locale } = useI18n({ useScope: 'global' });

const openWidgetSelector = ref<boolean>(false);
const openThemeSelector = ref<boolean>(false);
const openColorSelector = ref<boolean>(false);
const openLanguageSelector = ref<boolean>(false);

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

onMounted(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    authStore.setUser(user);
  }
  fontStore.initFontColor();
});




const authStore = useAuthStore();


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

const gradientBackground = computed(() => {
  const t = themes.find((t) => t.name === currentTheme.value);
  return 'background: ' + t?.css_background + ';';
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

const changeTheme = (theme: string) => {
  openThemeSelector.value = false;
  currentTheme.value = theme;
};

const changeLanguage = (language: string) => {
  openLanguageSelector.value = false;
  locale.value = language;
};
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
  color: var(--user-font-color);
}

.glass-panel {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
