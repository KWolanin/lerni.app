<template>
  <q-card class="q-pa-sm flex column justify-center radius-15 bg">
    <Bar :data="data" :options="chartOptions" />
  </q-card>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  type ChartData,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import type { PomoSession } from 'src/types';
import { useAuthStore } from '../stores/auth';
import { computed, ref, watch } from 'vue';
import { loadPomoSession } from 'src/service/firebase';
import { useFontColorStore } from 'src/stores/fontColor';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const fontColorStore = useFontColorStore();

const { t, locale } = useI18n();

const chartColor = ref<string>(fontColorStore.fontColor);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale);

const data = ref<ChartData<'bar'>>({
  datasets: [],
});

const chartOptions = computed(() => ({
  responsive: true,
  plugins: {
      legend: {
        labels: {
          color: chartColor.value
        }
      }
    },
  scales: {
    x: {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        tooltipFormat: 'PPP',
      },
      title: {
        display: true,
        text: t('date'),
        color: chartColor.value,
      },
      ticks: {
        color: chartColor.value,
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: t('minutes'),
        color: chartColor.value,
      },
      ticks: {
        color: chartColor.value,
      },
    },
  },
}));

watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      loadPomoSession(newUid)
        .then((d) => {
          if (!d) return;
          data.value = chartData(d);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  { immediate: true },
);

watch(
  () => fontColorStore.fontColor,
  (newVal) => {
    if (!newVal) return;
    chartColor.value = newVal;
    loadPomoSession(authStore.uid)
      .then((d) => {
        if (!d) return;
        data.value = chartData(d);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  { immediate: true },
);

watch(
  locale,
  (newVal) => {
    if (!newVal) return;
    loadPomoSession(authStore.uid)
      .then((d) => {
        if (!d) return;
        data.value = chartData(d);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  { immediate: true },
);

const chartData = (sessions: PomoSession[]) => {
  return {
    labels: sessions.map((s) => (s.date instanceof Date ? s.date : s.date.toDate())),
    datasets: [
      {
        label: t('time'),
        backgroundColor: chartColor.value,
        data: sessions.map((s) => s.workTime * s.sessions),
      },
    ],
  };
};
</script>
