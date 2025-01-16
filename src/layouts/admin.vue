<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item  :title="user.account">
        <!-- >> VListItem API > SLOTS https://vuetifyjs.com/en/api/v-list-item/  -->
        <template #prepend>
          <!-- vue-boring-avatars: https://github.com/mujahidfa/vue-boring-avatars -->
          <Avatar :size="30" variant="beam" :name="user.account" :colors="colors" />
          <!-- aVueatar: https://github.com/NIV-Shpk/aVueatar?tab=readme-ov-file -->
          <!-- <Avuetar :value="user.account" radius="100" style="shape" shadow="true"/> -->
          &nbsp;&nbsp;&nbsp;&nbsp;
        </template>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item v-for="nav in navs" :key="nav.to" :prepend-icon="nav.icon" :title="nav.text" :to="nav.to"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import Avatar from "vue-boring-avatars";


const { t } = useI18n()

const user = useUserStore()

const navs = computed(() => {
  return [
    { to: '/admin/products', text: t('nav.adminProducts'), icon: 'mdi-shopping' },
    { to: '/admin/orders', text: t('nav.adminOrders'), icon: 'mdi-format-list-bulleted' },
    { to: '/', text: t('nav.home'), icon: 'mdi-home' },
  ]
})
</script>

