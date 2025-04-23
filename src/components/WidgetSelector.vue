<template>
  <q-dialog v-model="dialog" backdrop-filter="blur(4px) saturate(150%) brightness(50%)">
    <q-card class="bg radius-15 q-pa-sm">
      <q-card-section class="row items-center q-pb-none text-h6 user-font">
        {{ $t('customize_dashboard') }}
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item v-for="widget in availableWidgets" :key="widget.widgetName" tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox
                keep-color
                color="user-font"
                checked-icon="check_circle"
                unchecked-icon="radio_button_unchecked"
                v-model="widgets"
                :val="widget.widgetName"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="user-font text-bold">{{ widget.label }}</q-item-label>
              <q-item-label class="user-font" caption>{{ widget.desc }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="user-font" @click="saveSelected" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { saveSelectedWidgets, loadSelectedWidgets } from 'src/service/firebase';
import { useAuthStore } from 'src/stores/auth';
import eventBus from '../eventBus'

const authStore = useAuthStore();

const dialog = ref(false);
const widgets = ref<string[]>([]);

const availableWidgets = [
  { label: 'Pomodoro', widgetName: 'PomodoroItem', desc: 'Simple pomodoro app' },
  { label: 'Music player', widgetName: 'MusicPlayer', desc: 'Play music' },
  { label: 'Simple start', widgetName: 'StartTodo', desc: 'Predefinied to do before work' },
  { label: 'Set pomodoro', widgetName: 'TimeSelector', desc: 'Dustomize your pomodoro' },
  { label: 'Quick note', widgetName: 'UserNote', desc: 'Use it as post-in(?)' },
  { label: 'Todo', widgetName: 'UserTodo', desc: 'Your todolist' },
  {label: 'Kanban', widgetName: 'KanbanTable', desc: 'Your kanban board'},
];

const saveSelected = () => {
  saveSelectedWidgets(authStore.uid, widgets.value).catch((err) => console.error(err));
  eventBus.emit('refresh-dashboard')
};

watch(
  () => authStore.uid,
  (newUid: string) => {
    if (newUid) {
      loadSelectedWidgets(newUid)
        .then((data) => {
          widgets.value = data ? data : [];
        })
        .catch((err) => console.error(err));
    }
  },
  { immediate: true },
);
</script>
