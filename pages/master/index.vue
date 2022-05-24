<template>
  <b-container class=" m-0 mt-2 w-100">
      <b-row class="d-flex">
        <b-col  class="">
          <vertical-menu @select="handleSelect" @loaded="handleLoaded"/>
        </b-col>
        <b-col class="flex-grow-1" >
         <accordion-list :isLoaded="isLoadedSelectedGroup"/>
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
  computed: mapState(["access_token", "needGroupListUpdate", "access_token"]),
  watch: {
    access_token () {
      this.loadIGroups()
    },
    needGroupListUpdate () {

      this.loadIGroups()
    }
  },
  mounted() {
    this.loadIGroups()
  },
  methods: {
    handleSelect () {
     this.isLoadedSelectedGroup = false
    },
    handleLoaded () {
      this.isLoadedSelectedGroup = true
    },
    async loadIGroups () {
      if (!this.access_token) {
        return
      }
      this.$axios.get('/api/group')
        .then(({ data }) => {
          console.log(`groups ${data.items}`)
          this.$store.commit(GROUP_MUTATIONS.SET_GROUP_LIST, data.items)

        })
        .catch((errorCode) => {
        })
        .then(() => {

        })
    },
  },
  data () {
    return {
      isLoadedSelectedGroup: true
    }
  }
}
</script>

<style scoped>
</style>
