<template>
  <b-container>
    <b-row class="mt-5" align-h="center">
      <b-col>
        <h1 class="text-center">
          {{ welcomeMessage }}
        </h1>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  computed: {
    name () {
      return this.$store.state.auth.email
    },
    welcomeMessage () {
      return "Здесь будет общая информация о программе"
    }
  },
  layout ({store}) {
    return store.state.auth.isAuth ? 'master' : "default"
  },
}
</script>
