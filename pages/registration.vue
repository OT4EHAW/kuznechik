
<template>
  <registration-modal></registration-modal>


</template>

<script>

import RegistrationModal from "../components/RegistrationModal";
export default {
  name:"registration",
  components: {RegistrationModal},
  middleware: 'authenticated',
}
</script>
