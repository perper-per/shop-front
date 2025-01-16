<template>
  <v-app>
    <router-view :key="$route.fullPath" />
    <!--
    + :key 是 Vue 的特殊屬性，用來強制元件重新渲染。
    當路由切換時，默認情況下，<router-view> 會復用現有的元件，而不會重新掛載。如果需要在路由切換時重新掛載元件（例如重置狀態），可以使用 :key 屬性。
    當路由的 fullPath 發生變化時，key 也會改變，Vue 會將現有的元件卸載，並重新掛載新的元件。
    -->
  </v-app>
</template>
