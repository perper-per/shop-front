<template>
  <v-container class="h-100">
    <v-row class="h-100" align="center">
      <v-col cols="12">
        <h1 class="text-center">{{ $t('admin.index') }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- +可以設定不同版型 -->
<route lang="yaml">
meta:
  layout: admin
  login: true
  admin: true
  title: 'nav.admin'
</route>


