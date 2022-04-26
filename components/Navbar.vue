<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" fixed>
      <b-button
        v-b-toggle.vertical-nav-collapse
        variant="primary"
        type="icon"
        class="mr-3"
      >

        <b-icon icon="list" ></b-icon>
      </b-button>
      <b-navbar-brand to="/" class="mr-md-3 title">
        Менеджер паролей
      </b-navbar-brand>
      <b-navbar-toggle  target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          :active="$route.path===item.path"
          class="nav-link"
          active-class="active-nav-link"
          v-for="(item, index) in items"
          :key="index"
          @click="handleItemClick(index)"
        >
          {{item.title}}
        </b-nav-item>
      </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text='userName || "Профиль"' right>
            <b-dropdown-item v-for="item in links" v-bind:key="item.path" @click="item.selectHandler" >
              {{ item.title }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
</b-collapse>
    </b-navbar>
  </div>
</template>

<script>

import Sidebar from "./vertical-menu";
import {AUTH_MUTATIONS} from "../store/auth";
export default {
  components: {Sidebar},
  props: {
    items:{
      type: Array,
      default: []
    }
  },
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
    handleItemClick (index) {
      this.$router.push(this.items[index].path)
    },
    logout () {
      console.warn(this.$store)
      this.$store.commit(AUTH_MUTATIONS.LOGOUT)
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

.nav-link {
  color: #868686;
}
.active-nav-link {
  color: #ffffff;
}

</style>
