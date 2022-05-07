<template>
  <b-modal :id="id"
           title="Переименование записи"
           cancel-title="Отмена"
           ok-title="Сохранить"
           @ok="handleOkClick"
           @cancel="handleCancel"
           :ok-disabled="!labelValidation || label===recordName"
  >
    <form>
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
      </b-form-row>
    </form>
  </b-modal>
</template>

<script>
import {GROUP_MUTATIONS} from "../store";
import {mapState} from "vuex";

export default {
  name: "RenameRecordModal",
  props: {
    id: {
      type: String,
      default: "rename-record-modal"
    },
    recordId: {
      type: String,
      default: null
    },
    recordName: {
      type: String,
      default: ""
    }
  },
  mounted() {
  this.label = this.recordName
    },
  watch: {
    "recordName" () {
      this.label = this.recordName
    }
  },
  computed: {
    ...mapState(["groupId", "groupName"]),
    labelValidation () {
      if (this.label.length === 0) {
        return false
      }
      return true
    },
  },
  methods: {
    handleOkClick () {
      this.$axios.post('/api/record/rename', {
        record: {
          _id: this.recordId,
          label: this.label
        }
      })
        .then(res => {
          const record = res.data
          this.$store.commit(GROUP_MUTATIONS.RENAME_RECORD, record)
          this.$toast.success('Вы успешно переименовали запись')
        }).catch(() => {
        this.$toast.error('Не удалось удалить запись')
      })
    },
    handleCancel () {
      this.label = this.recordName
    }
  },
  data () {
    return {
      label: ""
    }
  }
}
</script>

<style scoped>

</style>
