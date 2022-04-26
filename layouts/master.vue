<template>
  <div>
    <navbar :items="navItems"></navbar>
    <nuxt/>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Sidebar from "../components/vertical-menu";
export default {
  components: {Sidebar, Navbar},
  data: () => {
    return {
      navItems: [
        {
          title: "Записи",
          path:"/master"
        }
      ]
    }
  }
}
</script>
