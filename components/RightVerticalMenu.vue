<template>
  <b-dropdown variant="light" class="mb-4">
    <template #button-content>
      <b-icon icon="journals" aria-hidden="true" class="mr-1"></b-icon>
      {{groupName}}
    </template>
    <b-dropdown-item-button v-b-modal.modal-adding-record >
      <b-icon icon="plus" aria-hidden="true" ></b-icon>
      Добавить

      <add-record-modal id="modal-adding-record"/>
    </b-dropdown-item-button>

  </b-dropdown>
</template>

<script>
import AddRecordModal from "./AddRecordModal";
export default {
  name: "RightVerticalMenu",
  props: {
    groupName: {
      type: String,
      default: "Все записи"
    }
  },
  components: {AddRecordModal}
}
</script>

<style scoped>

</style>
