<template>
  <div>
    <rename-record-modal
      :id="'rename-record-modal'"
      :record-id="id"
      :record-name="label"
    />
    <remove-record-modal
      :id="'remove-record-modal'"
      :record-id="id"
      :record-name="label"
    />
  <form>

    <b-form-row>
      <b-input-group>
        <b-form-input
          id="feedback-user"
          placeholder="Логин"
          v-model="recordLogin"
        />
        <b-input-group-append role="button">
          <b-input-group-text>
            <b-icon  icon="person" ></b-icon>
          </b-input-group-text>
          <b-input-group-text @click="handleCopyClick(recordLogin)">
            <b-icon  icon="stickies" ></b-icon>
          </b-input-group-text>
        </b-input-group-append>
      </b-input-group>
    </b-form-row>

    <b-form-row class="mt-3">
      <b-input-group>
        <b-form-input
          id="feedback-pass"
          placeholder="Пароль"
          :type="isShowPassword ? 'text' : 'password'"
          v-model="recordPassword"
        />
        <b-input-group-append  role="button" >
          <b-input-group-text @click="changeShowPassword">
            <b-icon  v-if="isShowPassword"  size="sm" text="icon"  variant="icon"  icon="eye" ></b-icon>
            <b-icon  v-else size="sm" text="icon"  variant="icon" icon="eye-slash"></b-icon>
          </b-input-group-text>
          <b-input-group-text @click="handleCopyClick(recordPassword)">
            <b-icon  icon="stickies" ></b-icon>
          </b-input-group-text>
        </b-input-group-append>
      </b-input-group>
    </b-form-row>

    <b-form-row class="mt-4"  v-if="!isReadMode">
      <b-button id="ok-btn" block variant="primary" :disabled="isNotChanges" @click="handleOk">
        Сохранить
      </b-button>
      <b-button id="cancel-btn" block  @click="handleCancel">
        Отмена
      </b-button>
    </b-form-row>

    <b-form-row  class="mt-4"  v-else>
      <b-button
        id="rename-btn"
        block
        variant="outline-primary"
        v-b-modal.rename-record-modal
      >
         Переименовать
      </b-button>
      <b-button
        id="remove-btn"
        block
        variant="outline-danger"
        v-b-modal.remove-record-modal
      >
        Удалить
      </b-button>

    </b-form-row>

  </form>
  </div>
</template>

<script>


import {mapState} from "vuex";
import {GROUP_MUTATIONS} from "../store";
import RemoveRecordModal from "./RemoveRecordModal";
import RenameRecordModal from "./RenameRecordModal";

export default {
  name: "RecordForm",
  components: {RenameRecordModal, RemoveRecordModal},
  props: {
    label: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    login: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    group: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.recordLogin = this.login;
    this.recordPassword = this.password
  },
  watch: {
    login (value) {
      this.recordLogin = value;
    },
    password (value) {
      this.recordPassword = value;
    },
    recordLogin (newLogin) {
      if (newLogin === this.login) {
        this.isNotChanges = true
        return
      }
      this.isReadMode = false
      this.isNotChanges = false
    },
    recordPassword (newPassword) {
      if (newPassword === this.password) {
        this.isNotChanges = true
        return
      }
      this.isReadMode = false
      this.isNotChanges = false
    }
  },
  data () {
    return {
      recordLogin: null,
      recordPassword: null,
      isShowPassword: false,
      isNotChanges: true,
      isReadMode: true
    }
  },
  computed: {
    ...mapState(["groupId", "groupName"]),
    labelValidation () {
      if (this.label.length === 0) {
        return null
      }
      return true
    },
    nameValidation () {
      if (this.name.length === 0) {
        return null
      }
      return true
    },
    passValidation () {
      return this.passFeedbackString()
    },
  },
  methods: {
    async handleCopyClick (message) {
      this.$copyText(message).then(()=>{
        this.$toast.success('Данные скопированы')
      }).catch((err)=>{
        this.$toast.success(err)
      })

    },
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    passFeedbackString () {
      if (this.password.length === 0) {
        return null
      }
      return true
    },
    handleCancel () {
      this.isReadMode = true
      this.isNotChanges = true
      this.recordPassword = this.password
      this.recordLogin = this.login
      this.$emit("cancel")
    },
    handleOk(event) {
      // Prevent modal from closing
      //   event.preventDefault()
      // Trigger submit handler
      this.isReadMode = true
      this.isNotChanges = true
      this.handleSubmit()
    },
    handleSubmit () {
      this.$axios.post('/api/record/edit', {
        record: {
          _id: this.id,
          login: this.recordLogin,
          password: this.recordPassword
        },
        group: {
          _id: this.group.id,
          password: this.group.password
        }
      })
        .then(res => {
          this.$store.commit(GROUP_MUTATIONS.NEED_UPDATE_RECORD)
          this.$toast.success('Вы успешно изменили запись')
          this.$emit("change")

        }).catch(() => {
        this.$emit("cancel")
        this.$toast.error('Не удалось изменить запись')
      })
    },
  },
}
</script>

<style scoped>

</style>
