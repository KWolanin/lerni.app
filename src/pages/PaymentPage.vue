<template>
  <div class="user-font text-center q-pa-md flex flex-center calsans-font">
    <q-card class="bg radius-15 q-pa-sm calsans-font">
      <q-card-section class="row justify-center q-pb-none text-h6 user-font">
        {{ $t('premium_account') }}
      </q-card-section>
      <q-card-section>
        {{ $t('premium_status') }}
        <span :class="[isPremium ? 'active' : 'inactive']">
          {{ isPremium ? $t('premium_status_active') : $t('premium_status_inactive') }}
        </span>
      </q-card-section>
      <q-card-section>
        <span>
          <p>[Cheat mode] enable your premium here:</p>
          <q-checkbox
            v-model="isPremium"
            :label="$t('premium_account')"
            class="q-mt-md"
          ></q-checkbox>
          <p>
{{ isPremium ? 'now you have access to all premium themes' : '' }}
          </p>
        </span>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { ref, watch } from 'vue';
import { changePremiumStatus, getPremiumStatus } from 'src/service/firebase';

const authStore = useAuthStore();
const isPremium = ref<boolean>(authStore.isPremium);



watch(
  () => authStore.uid,
  (newUid) => {
    if (newUid) {
      getPremiumStatus(newUid)
      .then((premiumStatus) => {
        isPremium.value = premiumStatus;
      })
      .catch((error) => {
        console.error('Error fetching premium status:', error);
      });
    }
  },
  { immediate: true },
);

watch(isPremium, (newValue) => {
  changePremiumStatus(authStore.uid, newValue)
  .catch((error) => {
    console.error('Error updating premium status:', error);
  });
});

</script>

<style scoped>
.active {
  color: green;
}

.inactive {
  color: red;
}
</style>
