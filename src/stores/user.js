// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole'
// import Avvvatars from 'avvvatars-vue'

// + 用 pinia 定義的 「用戶狀態管理模組」:
// > 登入登出狀態、購物車狀態、登入身分
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const account = ref('')
    const role = ref(UserRole.USER)
    const cart = ref(0)

    const isLoggedIn = computed(() => {
      return token.value.length > 0
    })

    const isAdmin = computed(() => {
      return role.value === UserRole.ADMIN
    })

    const avatar = computed(() => {
      return `https://api.multiavatar.com/${account.value}.png`
      // return `<Avvvatars value=${account.value} :radius="10" />`
    })

    const login = (data) => {
      if (data.token) {
        token.value = data.token
      }
      account.value = data.account
      role.value = data.role
      cart.value = data.cart
    }

    const logout = () => {
      token.value = ''
      account.value = ''
      role.value = UserRole.USER
      cart.value = 0
    }

    return {
      token,
      account,
      role,
      cart,
      isLoggedIn,
      isAdmin,
      avatar,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'shop-user',
      pick: ['token'],
    },
  },
)
