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
    welcomeMessage () {
      return "Здесь будет общая информация о программе"
    }
  },
}
</script>
