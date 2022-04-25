
<template>
  <login-modal @submit="handleLoginSubmit" @link="handleLoginLink"></login-modal>
</template>

<script>

import LoginModal from "../components/LoginModal";
import {AUTH_MUTATIONS} from "../store/auth";

export default {
  name: "login",
  components: {LoginModal},

  data () {
    return {
    }
  },
  computed: {
    errorMessage () {
      return "Не удалось войти в аккаунт"
    }
  },
  methods: {
    handleLoginLink () {
      this.$router.push('/registration')
    },

    async handleLoginSubmit ({email, password}) {
      this.loading = true
      this.$axios.post('/api/account/login', {  _id: email, email, password })
        .then(({data}) => {
          if (!data) {
            this.$toast.error('Пользователь не найден')
            return
          }
          this.$toast.success('Вы успешно зашли в аккаунт')
          this.$store.commit(AUTH_MUTATIONS.SET_USER, { email: email })
          this.$store.commit(AUTH_MUTATIONS.SET_TOKEN, data.token)
          console.log("auth",this.$store.state.isAuth)
          this.$router.push('/')

        })
        .catch((errorCode ) => {
      })
       .then(()=>{
       this.loading = false;
     })
    }
  },

}
</script>
