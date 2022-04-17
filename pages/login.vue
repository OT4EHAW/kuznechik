
<template>
  <login-modal @submit="handleLoginSubmit" @link="handleLoginLink"></login-modal>
</template>

<script>

import LoginModal from "../components/LoginModal";

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
     this.$axios.get(`/api/account/${email}`)
        .then(({data}) => {
          if (!data) {
            this.$toast.error('Пользователь не найден')
            return
          }
          this.$toast.success('Вы успешно зашли в аккаунт')
          this.$store.commit('onAuth')
          this.$store.commit('login', data.email)
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
