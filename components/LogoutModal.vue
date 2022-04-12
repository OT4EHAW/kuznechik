<template>
    <b-modal
      id="logout-modal"
      v-model="modalShow"
      title="Выход"
      ok-variant="danger"
      ok-title="Да"
      @ok="submitEvent">
     Вы уверены, что хотите выйти?
    </b-modal>
</template>
<script>
export default {
  name: "logoutModal",
  data: function () {
    return {
      modalShow: false,
    }
  },
  methods : {
    async submitEvent(evt) {
      evt.preventDefault()
      await this.$store.dispatch('setState', { username: '',
        logged_in: false,
        access_token: '' })
      /*await this.$axios.setToken('')*/
      this.modalShow = false
      this.$router.push('/login')
    }
  },

}
</script>

<style scoped>

</style>
