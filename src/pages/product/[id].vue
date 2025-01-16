<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">{{ product.name }}</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12" md="6">
        <v-img :src="product.image"></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <p>{{ $t( 'productCategory.'+ product.category) }}</p>
        <p>{{ product.price }}</p>
        <p>{{ product.description }}</p>
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <v-text-field v-model.number="quantity.value.value" type="number" :error-messages="quantity.errorMessage.value"></v-text-field>
          <v-btn type="submit" prepend-icon="mdi-cart" :loading="isSubmitting">{{ $t('product.addCart') }}</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay :model-value="!product.sell" class="align-center justify-center" scrim="black" opacity="0.8" persistent>
    <h1 class="text-center">已下架</h1>
  </v-overlay>
  <!-- 商品在架上時，就要產生 overlay -->
</template>

<script setup>
import { ref } from 'vue'
import { useAxios } from '@/composables/axios'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

const { api, apiAuth } = useAxios()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const user = useUserStore()
const createSnackbar = useSnackbar()

const product = ref({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  sell: true,
  category: ''
})

// (用網址) 取得商品並到商品自己的頁面
const getProduct = async () => {
  try {
    const { data } = await api.get('/product/' + route.params.id)
    product.value = data.result
    document.title = product.value.name + ' | 購物網站'
  } catch (error) {
    console.log(error)
    router.push('/') // 商品不存在時 回首頁
    console.log(2)
  }
}
getProduct()

// 表單驗證規則
const schema = yup.object({
  quantity: yup
    .number()
    .typeError(t('product.addCartQuantityInvalid'))
    .required(t('product.addCartQuantityInvalid'))
    .positive(t('product.addCartQuantityInvalid'))
    .integer(t('product.addCartQuantityInvalid'))
})
// 表單初始化
const { handleSubmit, isSubmitting } = useForm({
  // isSubmitting：當表單提交時，狀態為 true（避免重複提交）
  validationSchema: schema, // 綁定驗證規則
  initialValues: {
    quantity: 1 // 預設數量為 1
  }
})
const quantity = useField('quantity') // 綁定 quantity 欄位

// 表單提交邏輯 (submit 方法)
const submit = handleSubmit(async (values) => {
  if (!user.isLoggedIn) {
    router.push('/login') // 未登入引導至登入頁
    return
  }
  try {
    const { data } = await apiAuth.patch('user/cart', {
      // + 要與 models/user.js 的 schema 相同
      product: product.value._id, // 前面定義的ref: product.value 是 Vue 的響應式資料
      quantity: values.quantity // 上面那個欄位裡的數字
    })
    user.cart = data.result // 更新使用者的購物車資料
    createSnackbar({
      text: t('product.addCartSuccess'),
      snackbarProps: {
        color: 'green'
      }
    })
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: t('api.' + (error?.response?.data?.message || 'unknownError')),
      snackbarProps: {
        color: 'red'
      }
    })
  }
})
</script>

<route lang="yaml">
meta:
  title: 'nav.product'
</route>
