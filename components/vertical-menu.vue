<template>
  <b-collapse visible id="vertical-nav-collapse" >
    <b-dropdown variant="light" class="mb-4">
      <template #button-content>
        <b-icon icon="journals" aria-hidden="true" class="mr-1"></b-icon> Группы
      </template>
      <b-dropdown-item-button v-b-modal.modal-adding-group >
        <b-icon icon="plus" aria-hidden="true" ></b-icon>
        Добавить

        <add-group-modal id="modal-adding-group"/>
      </b-dropdown-item-button>

    </b-dropdown>


    <b-nav vertical class="bd-links w-auto">
      <b-nav-item
        v-for="(item, index) in items"
        :active="isActive(item.id)"
        :key="item.id"
        @click="selectHandler(item.id)"
      >
        {{item.name}}
      </b-nav-item>
    </b-nav>

  </b-collapse>



</template>

<script>
import {GROUP_MUTATIONS} from "../store/groups";
import AddGroupModal from "./AddGroupModal";

export default {
  name: "sidebar",
  components: {AddGroupModal},
  data ()  {
    return {
      selectedKey: 0
    }
},
  computed: {
    items () {
      return [
        {
          id: 0,
          name: "Все записи",
        },
        {
          id: 1,
          name: "Работа",
        },
        {
          id: 2,
          name: "Магазины",
        },
      ]
    }
  },
  methods: {
    isActive (key) {
      return this.selectedKey === key
    },
    selectHandler (key) {
      this.selectedKey = key
      this.$store.commit(GROUP_MUTATIONS.SET_GROUP_ID, key)
    },
    addHandler () {

    }
  }
}
</script>

<style scoped>
.nav-link {
  color: #007bff;

}
.nav-link.active{

font-weight: bold;
}
</style>
