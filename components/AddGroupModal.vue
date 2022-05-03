<template>
  <b-modal
    :id="id"
    ref="modal"
    title="Добавление группы паролей"
    cancel-title="Отмена"
    ok-title="Добавить"
    :ok-disabled="!nameValidation || !passValidation || !passValidation2"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form @submit.stop.prevent="handleSubmit">
      <b-form-row>
        <b-input-group>
          <b-form-input
            id="feedback-user"
            placeholder="Название"
            :state="nameValidation"
            v-model="name"
          />
          <b-input-group-append>
            <b-input-group-text>
              <b-icon  icon="server" ></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <b-form-invalid-feedback :state="nameValidation">
          Некорректное название
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

      <b-form-row class="mt-3">
        <b-input-group>
          <b-form-input
            id="feedback-pass-2"
            placeholder="Повторите пароль"
            :state="passValidation2"
            :type="isShowPassword2 ? 'text' : 'password'"
            v-model="password2"
         />
          <b-input-group-append is-text  role="button" @click="changeShowPassword2">
                  <span  v-if="isShowPassword2" >
                     <b-icon  size="sm" text="icon"  variant="icon"  icon="eye" ></b-icon>
                  </span>
            <span  v-else >
                    <b-icon  size="sm" text="icon"  variant="icon" icon="eye-slash"></b-icon>
                  </span>
          </b-input-group-append>
        </b-input-group>
        <b-form-invalid-feedback :state="passValidation2">
          Пароли не совпадают
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="passValidation2">
        </b-form-valid-feedback>
      </b-form-row>

    </form>
  </b-modal>
</template>

<script>
import {GROUP_MUTATIONS} from "../store";

export default {
  name: "AddGroupModal",
  props:{
    id: {
      type: String,
      default: "modal-adding-group"
    }
  },
  data() {
    return {
      name: '',
      nameState: null,
      submittedNames: [],
      password: "",
      password2: "",
      passwordState: null,
      isShowPassword: false,
      isShowPassword2: false,
      passFeedback: '',
    }
  },
  computed: {
    nameValidation () {
      if (this.name.length === 0) {
        return null
      }
      return true
    },
    passValidation () {
      return this.passFeedbackString()
    },
    passValidation2 () {
      return this.passFeedbackString2()
    },
  },
  methods: {
    resetModal() {
      this.name = ''
      this.nameState = null
    },
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    changeShowPassword2 () {
      this.isShowPassword2 = !this.isShowPassword2
    },
    passFeedbackString () {
      if (this.password.length === 0) {
        return null
      } else if (this.password.length < 8 && /\d/.test(this.password)) {
        this.passFeedback = 'В пароле должно быть не менее 8-и символов.'
      } else if (!this.password.length < 8 && !/\d/.test(this.password)) {
        this.passFeedback = 'В пароле должна быть хотябы одна цифра.'
      }
      return this.password.length >= 8 && /\d/.test(this.password)
    },
    passFeedbackString2 () {
      if (this.password2.length === 0) {
        return null
      }
      return this.password === this.password2
    },
    handleOk(event) {
      // Prevent modal from closing
      event.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
      this.$axios.post('/api/group/new',
        { name: this.name, password: this.password }
      )
        .then(res => {
          this.$store.commit(GROUP_MUTATIONS.NEED_UPDATE_GROUP_LIST)
          this.$toast.success('Вы успешно создали новую группу')
        }).catch(() => {
        this.$toast.error('Не удалось создать группу')
      })
    }
  },
}
</script>

<style scoped>

</style>
