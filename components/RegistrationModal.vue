<template>
  <b-container>
    <b-row class="mt-5" align-h="center">
      <b-col md="5">
        <b-card
          no-body
          border-variant="primary"
          header="Новый аккаунт"
          bg-variant="light"
          header-bg-variant="primary"
          header-text-variant="white"
        >

        <b-card-body>
          <b-form @submit="onSubmit">

            <b-alert v-if="errorMessage" v-model="isAlertShow" variant="danger" dismissible>
              {{ errorMessage }}
            </b-alert>
            <b-alert v-if="successMessage" v-model="isAlertShow" variant="success" dismissible>
              {{ successMessage }}
            </b-alert>

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
                  Некорректный email
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="userValidation">
                </b-form-valid-feedback>
            </b-form-row>

              <b-form-row class="mt-3">
                <b-input-group>
                  <b-form-input placeholder="Пароль" v-model="userPass" :state="passValidation" id="feedback-pass" :type="isShowPassword ? 'text' : 'password'"></b-form-input>
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
                  <b-form-input placeholder="Повторите пароль" v-model="userPass2" :state="passValidation2" id="feedback-pass-2" :type="isShowPassword2 ? 'text' : 'password'"></b-form-input>
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

            <b-form-row class="mt-4"  >
              <b-button block type="submit" variant="primary" :disabled="!loginValidation">Создать аккаунт</b-button>
            </b-form-row>
          </b-form>
        </b-card-body>

        <b-card-footer>
         <b-button block to="/login" variant="link" @click="handleClickLogin"  >Войти</b-button>
        </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'RegistrationModal',
  data: function () {
    return {
      userId: '',
      userPass: '',
      userPass2: '',
      passFeedback: '',
      errorMessage: null,
      successMessage: null,
      isAlertShow: false,
      isShowPassword: false,
      isShowPassword2: false
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
    passValidation2 () {
      return this.passFeedbackString2()
    },
    loginValidation () {
      return this.userValidation && this.passValidation && this.passValidation2
    }
  },
  methods: {
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    changeShowPassword2 () {
      this.isShowPassword2 = !this.isShowPassword2
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
    passFeedbackString2 () {
      if (this.userPass2.length === 0) {
        return null
      }
      return this.userPass === this.userPass2
    },
    async onSubmit (evt) {
      evt.preventDefault()

      this.$axios.post('/api/account/new',
        { email: this.userId, gost_hash_512: this.userPass }
      )
        .then(res => {
          this.$toast.success('Вы успешно создали новый аккаунт')
          return { account: res.data }
        }).catch(() => {
        })
    },
    handleClickLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
