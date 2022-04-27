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
import {GROUP_MUTATIONS} from "../../store";
import {mapState} from "vuex";

export default {
  name: "master",
  components: {Sidebar},
  middleware: 'auth',
  computed: mapState(["access_token"]),
  watch: {
    access_token () {
      this.loadIGroups()
    }
  },
  mounted() {
    this.loadIGroups()
  },
  methods: {
    async loadIGroups () {

      if (!this.access_token) {
        return
      }
      this.$axios.get('/api/group')
        .then(({ data }) => {
          console.log(`groups ${data.items}`)
          this.$store.commit(GROUP_MUTATIONS.SET_GROUP_LIST, data.items)
          this.$store.commit(GROUP_MUTATIONS.SET_GROUP_ID, "-1")
        })
        .catch((errorCode) => {
        })
        .then(() => {

        })
    }
  }
}
</script>

<style scoped>

</style>
