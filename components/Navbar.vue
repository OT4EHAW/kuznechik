<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="/">Менеджер паролей</b-navbar-brand>
      <b-navbar-toggle  target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text='userName || "Профиль"' right>
            <b-dropdown-item v-for="item in links" v-bind:key="item.path" @click="item.selectHandler" >
              {{ item.title }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

<!--
        <b-navbar-nav v-if="isAuth" class="ml-auto">
          <b-nav-form>
            <b-button @click="handleLogout" class="nav-button">Выход</b-button>
          </b-nav-form>
        </b-navbar-nav>

        <b-navbar-nav v-else class="ml-auto">
          <b-button variant="link" @click="handleClickLogin">
            Вход
          </b-button>
          <b-button variant="link" @click="handleClickRegistration">
            Регистрация
          </b-button>
        </b-navbar-nav>
-->

      </b-collapse>

    </b-navbar>
  </div>
</template>

<script>

export default {

computed: {
  links () {
    const userSettings = [{
      title: "Выход",
      path: '/',
      selectHandler: this.logout
    }]
    const defaultSettings = [{
      title: "Вход",
      path: '/login',
      selectHandler: this.loginForm
    },{
      title: "Регистрация",
      path: '/registration',
      selectHandler:  this.registrationForm
    }]
    return this.isAuth ? userSettings : defaultSettings
  },
  isAuth () {
    return this.$store.state.auth.isAuth
  },
  userName () {
    return this.$store.state.auth.email
  }
},
  data: () => {
    /* const configKeys = Object.keys(schemaConfig);
    var links = []
    for (const key of configKeys) {
      links.push({ title: startCase(camelCase(schemaConfig[key].path)),
        path: schemaConfig[key].path })
    } */
    return {

    }
  },
  methods: {
    logout () {
      this.$store.commit("logout")
      this.$router.push("/login")
    },
    loginForm () {
      this.$router.push("/login")
    },
    registrationForm () {
      this.$router.push("/registration")
    },
    crudUrl (link) {
      return `/crud?model=${link.path}`
    },
  }
}
</script>

<style scoped>

</style>
