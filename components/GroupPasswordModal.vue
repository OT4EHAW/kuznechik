<template>
  <b-modal
    :id="id"
    ref="modal"
    :title="`Ввод пароля для группы ${groupName}`"
    cancel-title="Отмена"
    ok-title="Подтвердить"
    :ok-disabled="!passValidation"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    no-stacking
  >
    <form @submit.stop.prevent="handleSubmit">

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
import AddRecordModal from "./AddRecordModal";

export default {
  name: "GroupPasswordModal",
  components: {AddRecordModal},
  props:{
    id: {
      type: String,
      default: "modal-adding-group"
    },
  },
  data() {
    return {
      password: "",
      passwordState: null,
      isShowPassword: false,
      passFeedback: '',
    }
  },
  computed: {
    passValidation () {
      return this.passFeedbackString()
    },
    ...mapState(["groupId", "groupName"]),
  },
  methods: {
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
      } else if (this.password.length < 8 && /\d/.test(this.password)) {
        this.passFeedback = 'В пароле должно быть не менее 8-и символов.'
      } else if (!this.password.length < 8 && !/\d/.test(this.password)) {
        this.passFeedback = 'В пароле должна быть хотябы одна цифра.'
      }
      return this.password.length >= 8 && /\d/.test(this.password)
    },
    handleOk(event) {
      // Prevent modal from closing
      //event.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
     this.$emit("submit", this.password)
    }
  },
}
</script>

<style scoped>

</style>
