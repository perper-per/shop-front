<template>
  <v-card>
    <v-img :src="image" height="200" cover></v-img>
    <v-card-title>
      <router-link :to="'/product/' + _id">{{ name }}</router-link>
      <!-- v-card 也可綁 :to -->
    </v-card-title>
    <v-card-subtitle>{{ $t('productCategory.'+ category) }}</v-card-subtitle>
    <v-card-subtitle>{{ price }}</v-card-subtitle>
    <v-card-text>{{ description }}</v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  // 下面這則註解用來忽略 Vue.js 的 prop-name-casing 規則
  // eslint-disable-next-line vue/prop-name-casing
  _id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
})
</script>
