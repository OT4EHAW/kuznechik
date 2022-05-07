<template>
  <b-modal :id="id"
           cancel-title="Отмена"
           ok-title="Удалить"
           @ok="handleRemoveClick"
           :title="`Удаление записи`"
  >
    <p class="my-4">Вы действительно хотите удалить запись {{recordName}}?</p>
  </b-modal>
</template>

<script>
import {GROUP_MUTATIONS} from "../store";

export default {
  name: "RemoveRecordModal",
  props: {
    id: {
      type: String,
      default: "remove-record-modal"
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
  methods: {
    handleRemoveClick () {
      this.$axios.delete('/api/record/' + this.recordId)
        .then(res => {
          this.$store.commit(GROUP_MUTATIONS.NEED_UPDATE_RECORD_LIST)
          this.$toast.success('Вы успешно удалили запись')

        }).catch(() => {
        this.$toast.error('Не удалось удалить запись')
      })
    }
  }
}
</script>

<style scoped>

</style>
