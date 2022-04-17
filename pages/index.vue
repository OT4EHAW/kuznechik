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
      return localStorage.getItem('username')
    },
    welcomeMessage () {
      return this.name ? `Добро пожаловать ${this.name} :)` : "Добро пожаловать :)"
    }
  },
  layout (context) {
    console.log(context)
    return localStorage.getItem('isAuth')==="true" ? 'user' : "default"
  },
}
</script>
