<template>
  <b-container
    class=" m-0 mt-2">
      <b-row>
        <b-col  class="flex-grow-0 w-100">
          <vertical-menu/>
        </b-col>
        <b-col class="flex-grow-1 ">
         <accordion-list/>
        </b-col>
<!--        <b-col class="w-25 flex-grow-0">
          Добавить запись
        </b-col>-->
      </b-row>

  </b-container>
</template>

<script>
import {GROUP_MUTATIONS} from "../../store";
import {mapState} from "vuex";
import VerticalMenu from "../../components/verticalMenu";
import AccordionList from "../../components/AccordionList";

export default {
  name: "master",
  components: {AccordionList, VerticalMenu},
  middleware: 'auth',
  computed: mapState(["access_token", "needUpdate", "access_token"]),
  watch: {
    access_token () {
      this.loadIGroups()
    },
    needUpdate () {
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
    },
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
