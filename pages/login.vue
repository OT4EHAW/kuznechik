
<template>
  <login-form @login="handleLoginSubmit" @link="handleLoginLink"></login-form>
</template>

<script>

import LoginForm from "../components/LoginForm";
import {AUTH_MUTATIONS} from "../store";

export default {
  name: "login",
  components: {LoginForm},
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
          console.log("data", data)
          if (!data) {
            this.$toast.error('Пользователь не найден')
            return
          }
          this.$toast.success('Вы успешно зашли в аккаунт')
          this.$store.commit(AUTH_MUTATIONS.SET_USER, { email: email })
          this.$store.commit(AUTH_MUTATIONS.SET_TOKEN, data.token)
          this.$router.push('/master')
        })
        .catch((errorCode ) => {

      })
       .then(()=>{

       this.loading = false;
     })
    },

  },
}
</script>
