<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">{{ $t('nav.cart') }}</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-list lines="two">
          <template  v-for="(item, i) in cart" :key="item._id" >
          <v-list-item
:title="item.product.name"
              :subtitle="item.product.price"
              active-class="bg-error"
              :active="!item.product.sell">

            <template #prepend>
               <v-avatar rounded="0">
                <v-img :src="item.product.image"></v-img>
               </v-avatar>
            </template>
             <template #append>
                <v-btn color="rgba(50, 50, 50, 0.5)" icon="mdi-plus" size="small" class="mr-4" @click="editCart(item.product._id, +1)"></v-btn>
                {{ item.quantity }}
                <v-btn color="rgba(50, 50, 50, 0.5)" icon="mdi-minus" size="small" class="ml-4" @click="editCart(item.product._id, -1)"></v-btn>
              </template>
          </v-list-item>
          <!-- v-if：「不是最後一個索引」的才有線 -->
          <v-divider v-if="i < cart.length - 1"></v-divider>
          </template>
        </v-list>
      </v-col>
      <v-col cols="12" class="text-center">
        <p>{{ total }}</p>
        <v-btn color="primary" :disabled="!canCheckout" @click="checkout">{{ $t('cart.checkout') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- + 先確定有取到資料 再來寫迴圈ㄛ -->

<script setup>
import { ref, computed } from 'vue'
import { useAxios } from '@/composables/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useI18n } from 'vue-i18n'

const { apiAuth } = useAxios()
const user = useUserStore()
const router = useRouter()
const createSnackbar = useSnackbar()
const { t } = useI18n()

const cart = ref([])

const getCart = async () => {
  try {
    const { data } = await apiAuth.get('/user/cart')
    cart.value = data.result
  } catch (error) {
    console.log(error)
  }
}
getCart()

// 計算總金額
const total = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
})

// 有東西才可以按結帳
const canCheckout = computed(() => {
  return cart.value.length > 0 && cart.value.every(item => item.product.sell)
})

const editCart = async (product, quantity) => {
  try {
    const { data } = await apiAuth.patch('/user/cart', { product, quantity })
    user.cart = data.result
    getCart()
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: t('api.' + (error?.response?.data?.message || 'unknownError')),
      snackbarProps: {
        color: 'red'
      }
    })
  }
}

const checkout = async () => {
  try {
    await apiAuth.post('/order')
    user.cart = 0
    router.push('/orders')
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: t('api.' + (error?.response?.data?.message || 'unknownError')),
      snackbarProps: {
        color: 'red'
      }
    })
  }
}
</script>

<route lang="yaml">
meta:
  login: true
  title: 'nav.cart'
</route>
