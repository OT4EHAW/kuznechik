<template>
  <b-container >
    <b-row class="mt-5" align-h="center">
      <b-col md="5">
        <b-card
          no-body
          border-variant="primary"
          header="Вход"
          bg-variant="light"
          header-bg-variant="primary"
          header-text-variant="white"
        >
          <!--  форма для входа        -->
          <b-card-body>
            <b-form @submit="onSubmit">
            <!--   поле ввода логина (почты)        -->
              <b-form-row>
                <b-input-group>
                    <b-form-input v-model="userId" placeholder="E-mail" :state="userValidation" id="feedback-user" ></b-form-input>
                    <b-input-group-append>
                      <b-input-group-text>
                        <b-icon  icon="envelope" ></b-icon>
                      </b-input-group-text>
                    </b-input-group-append>
                </b-input-group>
                <b-form-invalid-feedback :state="userValidation">
                  Некорректный формат электронной почты
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="userValidation">
                </b-form-valid-feedback>
              </b-form-row>
            <!--   поле ввода пароля        -->
              <b-form-row class="mt-3">
                  <b-input-group>
                    <b-form-input placeholder="Пароль" v-model="userPass" :state="passValidation" id="feedback-pass" :type="isShowPassword ? 'text' : 'password'">
                    </b-form-input>
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
            <!--   кнопка для входа        -->
              <b-form-row class="mt-4"  >
                <b-button block type="submit" variant="primary" :disabled="!loginValidation">
                  Войти
                </b-button>
              </b-form-row>
            </b-form>
           </b-card-body>
          <!--   ссылка для перехода на страницу регистрации        -->
          <b-card-footer>
         <b-button block  variant="link" @click="handleClickRegistration"  >Создать новый аккаунт</b-button>
        </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'LoginModal',
  props: {
  },
  data: function () {
    return {
      userId: '',
      userPass: '',
      passFeedback: '',
      isShowPassword: false
    }
  },
  computed: {
    userValidation () {
      if (this.userId.length === 0) {
        return null
      }
      const re = /(.+)@(.+){2,}\.(.+){2,}/
      return re.test(this.userId.toLowerCase())
    },
    passValidation () {
      return this.passFeedbackString()
    },
    loginValidation () {
      if (!this.userValidation || !this.passValidation) {
        return false
      } else {
        return this.userValidation && this.passValidation
      }
    }
  },
  methods: {
    hidePassword () {
      this.isShowPassword = false
    },
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },

    passFeedbackString () {
      if (this.userPass.length === 0) {
        return null
      } else if (this.userPass.length < 8 && /\d/.test(this.userPass)) {
        this.passFeedback = 'В пароле должно быть не менее 8-и символов.'
      } else if (!this.userPass.length < 8 && !/\d/.test(this.userPass)) {
        this.passFeedback = 'В пароле должна быть хотябы одна цифра.'
      }
      return this.userPass.length >= 8 && /\d/.test(this.userPass)
    },
    async onSubmit (evt) {
      evt.preventDefault()
      const formData =  {email: this.userId, password: this.userPass }
      this.$emit('submit', {...formData})
    },
    handleClickRegistration () {
      this.$emit('link')
    }
  }
}
</script>

<style scoped>

</style>
