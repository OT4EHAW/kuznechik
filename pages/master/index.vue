<template>
  <b-container
    class=" m-0 mt-2">
      <b-row>
        <b-col  class="flex-grow-0">
          <sidebar/>
        </b-col>

        <b-col class="flex-grow-1">
          Здесь будут добавленные в группу записи
        </b-col>
      </b-row>

  </b-container>
</template>

<script>
import Sidebar from "../../components/vertical-menu";

export default {
  name: "master",
  components: {Sidebar},
  middleware: 'auth',
  layout () {
    return  'master'
  },
}
</script>

<style scoped>

</style>
