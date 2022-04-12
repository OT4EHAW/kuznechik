
<template>

  <login-modal></login-modal>

</template>

<script>

import LoginModal from "../components/LoginModal";
export default {
  name: "login",
  components: {LoginModal},
  middleware: 'authenticated',
}
</script>
