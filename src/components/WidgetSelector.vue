<template>
  <q-dialog v-model="dialog" backdrop-filter="blur(8px) saturate(150%) brightness(100%)">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
      <q-card-section class="row items-center q-pb-none text-h6 user-font">
        {{ $t('customize_dashboard') }}
      </q-card-section>

      <q-card-section>
        <q-item class="user-font q-ma-sm text-bold flex row items-center">
          <q-icon name="widgets" size="20px" color="blur" class="icon-lightbulb q-mr-sm" />
          <span>{{ $t('widget_desc') }}</span>
        </q-item>
        <q-list>
          <q-item v-for="widget in filteredWidgets" :key="widget.widgetName" tag="label" v-ripple>
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
              <q-item-label class="user-font text-bold">{{
                getWidgetNameI18n(widget.label)
              }}</q-item-label>
              <q-item-label class="user-font" caption>{{
                getWidgetDescI18n(widget.label)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator />
        <q-item class="user-font q-ma-sm text-bold flex row items-center">
          <q-icon name="settings" size="20px" color="blur" class="icon-lightbulb q-mr-sm" />
          <span>{{ $t('tools_desc') }}</span>
        </q-item>
        <q-list>
          <q-item v-for="widget in filteredTools" :key="widget.widgetName" tag="label" v-ripple>
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
              <q-item-label class="user-font text-bold">{{
                getWidgetNameI18n(widget.label)
              }}</q-item-label>
              <q-item-label class="user-font" caption>{{
                getWidgetDescI18n(widget.label)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('close')"
          color="user-font"
          class="text-bold"
          @click="saveSelected"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { saveSelectedWidgets, loadSelectedWidgets } from 'src/service/firebase';
import { useAuthStore } from 'src/stores/auth';
import eventBus from '../eventBus';
import { availableWidgets, Type } from 'src/availableWidgets';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });

const authStore = useAuthStore();

const dialog = ref(false);
const widgets = ref<string[]>([]);

const saveSelected = () => {
  saveSelectedWidgets(authStore.uid, widgets.value).catch((err) => console.error(err));
  eventBus.emit('refresh-dashboard');
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

const getWidgetDescI18n = (label: string) => {
  switch (locale.value) {
    case 'en_US':
      return availableWidgets.find((widget) => widget.label === label)?.desc_EN;
    case 'de':
      return availableWidgets.find((widget) => widget.label === label)?.desc_DE;
    case 'pl':
      return availableWidgets.find((widget) => widget.label === label)?.desc_PL;
    case 'ua':
      return availableWidgets.find((widget) => widget.label === label)?.desc_UA;
    default:
      return availableWidgets.find((widget) => widget.label === label)?.desc_EN;
  }
};

const getWidgetNameI18n = (label: string) => {
  switch (locale.value) {
    case 'en_US':
      return availableWidgets.find((widget) => widget.label === label)?.label_EN;
    case 'de':
      return availableWidgets.find((widget) => widget.label === label)?.label_DE;
    case 'pl':
      return availableWidgets.find((widget) => widget.label === label)?.label_PL;
    case 'ua':
      return availableWidgets.find((widget) => widget.label === label)?.label_UA;
    default:
      return availableWidgets.find((widget) => widget.label === label)?.label_EN;
  }
};

const filteredTools = availableWidgets.filter((widget) => widget.type === Type.TOOL);
const filteredWidgets = availableWidgets.filter((widget) => widget.type === Type.WIDGET);
</script>
