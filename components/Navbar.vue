<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="primary"
    >
      <b-navbar-brand to="/" class="mr-md-3 title">
        Менеджер паролей
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            :active="$route.path === item.path"
            class="nav-link"
            active-class="active-nav-link"
            v-for="(item, index) in navItems"
            :key="index"
            @click="handleItemClick(index)"
          >
            {{item.title}}
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            :text='email || "Профиль"'
            right
          >
            <b-dropdown-item
              v-for="item in links"
              v-bind:key="item.path"
              @click="item.selectHandler"
            >
              {{ item.title }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>

import Sidebar from "./verticalMenu";
import {AUTH_MUTATIONS} from "../store";

export default {
  components: {Sidebar},
  data () {
    return {
      isAuth: false,
      email: null,
      items: [],
      navItems:[]
    }
  },
  mounted() {
    this.setAuthData()
  },
  watch: {
    "$route" (value) {
      this.setAuthData()
      this.setNavItems()
    },
    "$store.state.access_token" (value) {
      this.setAuthData()
      this.setNavItems()
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
      console.log("isAuth", this.isAuth)
      return this.isAuth ? userSettings : defaultSettings
    },
  },
  methods: {
    setNavItems () {
      const accessToken = this.$store.state.access_token

      if (!accessToken) {
        this.navItems = []
        return
      }
      this.navItems =  [
        {
          title: "Записи",
          path:"/master"
        }
      ]
    },
    setAuthData () {
      this.email = this.$store.state.email
      this.isAuth = !!this.email
    },
    handleItemClick (index) {
      this.$router.push(this.navItems[index].path)
    },
    logout () {
      this.$store.commit(AUTH_MUTATIONS.LOGOUT)
      this.$router.push("/login")
    },
    loginForm () {
      this.$router.push("/login")
    },
    registrationForm () {
      this.$router.push("/registration")
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
