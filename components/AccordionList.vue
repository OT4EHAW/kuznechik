<template>
  <div  class="accordion" role="tablist" v-if="isLoaded">

    <!--   модальные окна   -->

    <group-password-modal
      :id="groupPasswordModalId"
      @submit="passwordSubmit"
      :group-name="modalGroup.name"
    />
    <group-password-modal
      :id="groupPasswordModal2Id"
      @submit="passwordSubmit2"
      :group-name="modalGroup.name"
    />
    <add-record-modal
      v-if="isSubmit"
      id="modal-adding-record"
      :group-id="modalGroup._id"
      :group-password="groupPassword"
      @close="finishSubmit"
    />


    <b-card
      header-tag="header"
      footer-tag="footer"
      sub-title-tag="sub-title"
      :sub-title="`Количество записей: ${recordList.length}`"
      class="position-sticky"
    >

      <!--   шапка с названием группы и кнопкой для создания записи   -->

      <template #header>
          <b-row class="align-items-center">
            <b-col class="flex-grow-1 mr-2">
              <h4> {{ groupName }}</h4>
            </b-col>
            <!--   создавить записи нельзя в разделе "Все записи" (id = "-1")  -->
            <b-col class="flex-grow-0 ">
              <b-button
                v-if="groupId !== '-1'"
                v-b-modal="groupPasswordModalId"
                size="lg"
                variant="light"
              >
                <b-icon
                  icon="plus-square"
                  font-scale="1.5"
                  aria-label="Help"
                  variant="primary"
                />
              </b-button>
            </b-col>
          </b-row>
      </template>

      <!--  список записей    -->

      <b-list-group  scrollable class="records">
        <b-list-group-item v-for="item in recordList" :key="'list-item-'+groupItemId(item._id)" class="p-0 border-0">
          <b-card no-body class="mb-1" >

            <!--  название записи  -->

            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                variant="light"
                v-b-modal="openRecordModalId(item._id)"
                v-b-toggle="groupItemId(item._id)"
                @click="itemClickHandler(item._id)"
              >
                {{ item.label }}
              </b-button>
            </b-card-header>

            <!--  расшифрованные логин и пароль  -->

            <b-collapse
              v-if="isSubmit2 && item._id === openedRecordId"
              :visible="true"
              :id="groupItemId(item._id)"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
               <record-form
                 :label="item.label"
                 :id="item._id"
                 :login="login"
                 :password="password"
                 :group="{
                   id: modalGroup._id,
                   password: groupPassword
                 }"
               />
              </b-card-body>
            </b-collapse>

          </b-card>
        </b-list-group-item>
      </b-list-group>

      <!--  доп. иныормация    -->

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
import {GROUP_MUTATIONS} from "../store";
import RecordForm from "./RecordForm";
export default {
  name: "AccordionList",
  components: {RecordForm, GroupPasswordModal, AddRecordModal },
  props: {
    isLoaded: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState(["groupId", "groupName", "recordList", "groupList", "recordId", "needRecordUpdate"]),

    groupPasswordModalId (){
     return  this.groupId + "-modal-check-group-password"
    },
    groupPasswordModal2Id (){
      return  this.groupId+"-modal-check-group-password-record"
    },

    modalGroup () {
      const allGroupsObject = {
        _id: this.groupId,
        name: this.groupName
      }
      if (!this.recordId || this.recordList.length === 0) {
        return allGroupsObject
      }
      const record = this.recordList.find(record=>record._id===this.recordId)
      if (!record) {
        console.error("record not found")
        return allGroupsObject;
      }
      const group = this.groupList.find(group=>group._id===record.group_id)
      return group || allGroupsObject
    },
  },
  watch: {

    needRecordUpdate () {
      this.loadRecord(this.groupPassword)
    },
    groupPassword (value) {
      this.loadRecord(value)
    },
    isSubmit (value) {
      if (value) {
        return
      }
      this.$store.commit(GROUP_MUTATIONS.SET_RECORD_ID, null)
      this.groupPassword = null
      this.openedRecordId = null
    }
  },
  methods: {
    openRecordModalId (recordId){
      return this.openedRecordId === recordId
        && this.isSubmit2
        ? null : this.groupPasswordModal2Id
    },
    loadRecord (groupPassword) {
      const recordId = this.openedRecordId
      const groupId = this.modalGroup?._id
      if (!groupId || !recordId || !groupPassword) {
        return;
      }
      this.$axios.post('/api/record/open', {
        record_id: recordId,
        group: {
          _id: groupId,
          password: groupPassword
        }
      })
        .then(res => {
          this.login = res.data.login
          this.password = res.data.password
          this.isSubmit2 = true
          this.$root.$emit('bv::show::collapse', this.groupItemId(this.openedRecordId))

        }).catch(() => {

      })
    },
    groupItemId (recordId) {
      return this.groupId + recordId
    },
    itemClickHandler (openedRecordId) {
      this.openedRecordId = openedRecordId
      this.groupPassword = null
      this.$store.commit(GROUP_MUTATIONS.SET_RECORD_ID, openedRecordId)
      this.isSubmit2 = false
    },
    finishSubmit () {
      this.isSubmit = false
    },
    passwordSubmit (groupPassword) {
      this.$axios.post('/api/group/verify', {
        group: {
          _id: this.modalGroup._id,
          password: groupPassword
        }
      })
        .then(res => {
          this.isSubmit = true
          this.groupPassword = groupPassword
          this.$toast.success('Вы можете создать запись в группе ' + res.data.name)
        }).catch(() => {

      })

    },
    passwordSubmit2 (groupPassword) {
      this.groupPassword = groupPassword
    }
  },
  data() {
    return {
      isSubmit: false,
      isSubmit2: false,
      groupPassword: null,
      openedRecordId: null,
      login:null,
      password: null
    }
  },
}
</script>

<style scoped>
.records {
  flex-wrap: nowrap;
  white-space: nowrap;
  max-height: 60vh;
  min-width: 300px;
  overflow: auto;
}
</style>
