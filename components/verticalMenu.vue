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
        v-for="(item, index) in items()"
        :active="isActive(item.id)"
        :key="item.id"
        @click="selectHandler(item)"
      >
        {{item.name}}
      </b-nav-item>
    </b-nav>

  </b-collapse>



</template>

<script>
import {GROUP_MUTATIONS} from "../store";
import AddGroupModal from "./AddGroupModal";
import { mapState } from "vuex";

export default {
  name: "verticalMenu",
  components: {AddGroupModal},
  computed: {
    ...mapState(["groupId", "groupList", "access_token", "needRecordListUpdate"]),
    dbGroupId () {
      return this.groupId === "-1" ? null : this.groupId
    }
  },
  data () {
    return {
      sumRecord: {
        id: "-1",
        name: "Все записи",
      }
    }
  },
  watch: {
    needRecordListUpdate () {
      this.loadRecords()
    }
  },
  methods: {
    items () {
      this.loadRecords()
      if (!this.groupList || this.groupList.length === 0) {
        return [ this.sumRecord ]
      }
      return [
        this.sumRecord,
        ...this.groupList.map(item=>({
          id: item._id,
          name:  item.name
        }))
      ]
    },
    isActive (key) {
      return this.groupId === key
    },
    selectHandler ({id, name}) {
      this.$store.commit(GROUP_MUTATIONS.SET_GROUP, {id, name})
      this.$store.commit(GROUP_MUTATIONS.SET_RECORD_LIST, [])
    },
    async loadRecords () {
      const group_id = this.dbGroupId
      this.$emit("select")
      if (!this.access_token) {
        return
      }

      this.$axios.get('/api/record', {
        params: {
          group_id: group_id
        }
      })
        .then(({ data }) => {
          console.log(`records ${data.items}`)
          this.$store.commit(GROUP_MUTATIONS.SET_RECORD_LIST, data.items)
        })
        .catch((errorCode) => {
        })
        .then(() => {
          this.$emit("loaded")
        })
    },
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
