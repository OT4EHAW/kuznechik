<template>
  <div class="accordion" role="tablist">
    <b-card
      header-tag="header"
      footer-tag="footer"
      sub-title-tag="sub-title"
      :sub-title="`Количество записей: ${recordList.length}`"
    >
      <template #header>
          <b-row class="align-items-center">
            <b-col class="flex-grow-1">
              <h4> {{ groupName }}</h4>
            </b-col>
            <b-col class="flex-grow-0 ">
              <b-button v-if="groupId != '-1'" size="lg" variant="light" class="mb-2"
                        v-b-modal="isSubmit ? 'modal-adding-record' : 'modal-check-group-password'"

              >
                <b-icon icon="plus-square" font-scale="1.5" aria-label="Help" variant="primary"></b-icon>
              </b-button>
              <group-password-modal
                id="modal-check-group-password"
                @submit="passwordSubmit">
              </group-password-modal>
              <add-record-modal
                v-if="isSubmit"
                id="modal-adding-record"
                :group_id="groupId"
                :group-password="groupPassword"
                @close="finishSubmit"
              />
            </b-col>
          </b-row>
      </template>

      <!--  список записей    -->
      <b-list-group scrollable >
        <b-list-group-item v-for="item in recordList" :key="item._id" class="p-0 border-0">
          <b-card no-body class="mb-1" >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle="item._id" variant="light">{{ item.label }}</b-button>
            </b-card-header>
            <b-collapse :id="item._id" :visible="false" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>Логин: {{ item.login }}</b-card-text>
                <b-card-text>Пароль: {{ item.password }}</b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-list-group-item>
      </b-list-group>


      <template #footer>
        <em>Все записи защищены шифрованием. Просмотр доступен после ввода пароля от группы.</em>
      </template>
    </b-card>
  </div>
</template>

<script>
import AddRecordModal from "./AddRecordModal";
import {mapState} from "vuex";
import GroupPasswordModal from "./GroupPasswordModal";
export default {
  name: "AccordionList",
  components: {GroupPasswordModal, AddRecordModal },
  props: {

  },
  computed: {
    ...mapState(["groupId", "groupName", "recordList"]),
  },
  data() {
    return {
      isSubmit: false,
      groupPassword: null,
    }
  },
  methods: {
    finishSubmit () {
      this.isSubmit = false
    },
    passwordSubmit (groupPassword) {
      this.isSubmit = true
      this.groupPassword = groupPassword
    }
  }
}
</script>

<style scoped>

</style>
