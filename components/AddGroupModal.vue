<template>
  <b-modal
    :id="id"
    ref="modal"
    title="Добавление группы паролей"
    cancel-title="Отмена"
    ok-title="Добавить"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form  @submit.stop.prevent="handleSubmit">
      <b-form-row>
        <b-input-group>
          <b-form-input v-model="name" placeholder="Название" :state="nameState" id="feedback-user" ></b-form-input>
          <b-input-group-append>
            <b-input-group-text>
              <b-icon  icon="server" ></b-icon>
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <b-form-invalid-feedback :state="nameState">
          Некорректное название
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="nameValidation">
        </b-form-valid-feedback>
      </b-form-row>

      <b-form-row class="mt-3">
        <b-input-group>
          <b-form-input placeholder="Пароль" v-model="password" :state="passValidation" id="feedback-pass" :type="isShowPassword ? 'text' : 'password'"></b-form-input>
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
          <b-form-input placeholder="Повторите пароль" v-model="password2" :state="passValidation2" id="feedback-pass-2" :type="isShowPassword2 ? 'text' : 'password'"></b-form-input>
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
  methods: {
    nameValidation () {
      if (this.name.length === 0) {
        return null
      }
      const re = /(.+)@(.+){2,}\.(.+){2,}/
      return re.test(this.name.toLowerCase())
    },
    passValidation () {
      return this.passFeedbackString()
    },
    passValidation2 () {
      return this.passFeedbackString2()
    },
    resetModal() {
      this.name = ''
      this.nameState = null
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
     // bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    async handleSubmit() {
      this.$axios.post('/api/groups/new',
        { name: this.name, password: this.password }
      )
        .then(res => {
          this.$toast.success('Вы успешно создали новую группу')
        }).catch(() => {

      })
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
  }
}
</script>

<style scoped>

</style>
