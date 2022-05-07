<template>
  <b-modal
    :id="id"
    ref="modal"
    :title="`Добавление записи в группу ${groupName}`"
    cancel-title="Отмена"
    ok-title="Добавить"
    :ok-disabled="!nameValidation || !passValidation || !labelValidation"
    @show="resetModal"
    @hidden="closeModal"
    @ok="handleOk"
    v-model="show"
  >
    <form @submit.stop.prevent="handleSubmit">
      <b-form-row>
        <b-input-group>
          <b-form-input
            id="label-input"
            placeholder="Метка"
            :state="labelValidation"
            v-model="label"
          />
          <b-input-group-append>
            <b-input-group-text>
              <b-icon  icon="bookmark" ></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <b-form-invalid-feedback :state="labelValidation">
          Некорректное название
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="labelValidation">
        </b-form-valid-feedback>
      </b-form-row>

      <b-form-row  class="mt-3">
        <b-input-group>
          <b-form-input
            id="feedback-user"
            placeholder="Логин"
            :state="nameValidation"
            v-model="name"
          />
          <b-input-group-append>
            <b-input-group-text>
              <b-icon  icon="person" ></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <b-form-invalid-feedback :state="nameValidation">
          Некорректный логин
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="nameValidation">
        </b-form-valid-feedback>
      </b-form-row>

      <b-form-row class="mt-3">
        <b-input-group>
          <b-form-input
            id="feedback-pass"
            placeholder="Пароль"
            :state="passValidation"
            :type="isShowPassword ? 'text' : 'password'"
            v-model="password"
          />
          <b-input-group-append is-text  role="button" @click="changeShowPassword">
                  <span  v-if="isShowPassword" >
                     <b-icon  size="sm" text="icon"  variant="icon"  icon="eye" ></b-icon>
                  </span>
            <span  v-else >
                    <b-icon  size="sm" text="icon"  variant="icon" icon="eye-slash"></b-icon>
                  </span>
          </b-input-group-append>
        </b-input-group>
        <b-form-invalid-feedback :state="passValidation">
          {{ passFeedback }}
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="passValidation">
        </b-form-valid-feedback>
      </b-form-row>

    </form>
  </b-modal>
</template>

<script>
import {GROUP_MUTATIONS} from "../store";
import {mapState} from "vuex";

export default {
  name: "AddRecordModal",
  props:{
    id: {
      type: String,
      default: "madel-adding-record"
    },
    groupPassword: {
      type: String,
      default: null
    },
    /*isShow: {
      type: Boolean,
      default: false
    }*/
  },
/*watch: {
    isShow (value) {
      this.show = value
    }
},*/
  data() {
    return {
      label: "",
      labelState: null,
      name: '',
      nameState: null,
      submittedNames: [],
      password: "",
      passwordState: null,
      isShowPassword: false,
      passFeedback: '',
      show: true
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
    closeModal () {
      this.resetModal()
      this.$emit("close")
    },
    resetModal() {
      this.name = ''
      this.nameState = null
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
    handleOk(event) {
      // Prevent modal from closing
   //   event.preventDefault()
      // Trigger submit handler
      this.show = false
      this.handleSubmit()
    },
    handleSubmit () {
      this.$axios.post('/api/record/new', {
        record: {
          label: this.label,
          login: this.name,
          password: this.password
        },
        group: {
          _id: this.groupId,
          password: this.groupPassword
        }
      })
        .then(res => {
          this.$store.commit(GROUP_MUTATIONS.NEED_UPDATE_RECORD_LIST)
          this.$toast.success('Вы успешно создали новую запись')
        }).catch(() => {
        this.$toast.error('Не удалось создать запись')
      })
    }
  },
}
</script>

<style scoped>

</style>
