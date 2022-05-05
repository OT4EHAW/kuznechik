<template>
  <div class="d-block h-100 overflow-hidden" >
    <navbar></navbar>
     <nuxt/>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Sidebar from "../components/verticalMenu";
import {AUTH_MUTATIONS} from "../store";
import {mapState} from "vuex";

export default {
  components: {Sidebar, Navbar},
  mounted () {
    this.updateSessionData()
  },
  data () {
    return {
      accessTimer: null
    }
  },
  computed: mapState(['refresh_token', "access_token"]),
  watch: {
    refresh_token (value) {
      this.updateSessionData()
    }
  },
  methods: {
    decodedBase64urlFromJSON  (base64url) {
      let base64 = base64url
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const pad = base64.length % 4;
      if(pad) {
        if(pad === 1) {
          throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        base64 += new Array(5-pad).join('=');
      }
      return JSON.parse(atob(base64));
    },
    refresh ()  {
      const refreshToken =localStorage.getItem('refresh_token')
      const id = localStorage.getItem('email')
      if (refreshToken && id){
        this.$axios.post('api/account/refresh', {
          _id: id,
          refresh_token: refreshToken
        }).then(({ data }) => {
          this.$store.commit(AUTH_MUTATIONS.SET_TOKEN, data.token)
        }).catch(()=>{
          this.$store.commit(AUTH_MUTATIONS.LOGOUT)
          this.$router.push('/login')
        })
      }
    },

    updateSessionData () {
      if (!this.access_token) {
        this.refresh()
        return
      }
      const payloadJSON = this.access_token.split(".")[1]
      const timeStr = this.decodedBase64urlFromJSON(payloadJSON).exp
      const timeSec = parseInt(timeStr)
      console.log("timeSec", timeSec)
      console.log("accessToken", this.access_token)
      clearTimeout(this.accessTimer)
      this.accessTimer = window.setTimeout(
        this.refresh, timeSec / 2 * 10000
      )
    }
  },

}
</script>
<style>
body {
  min-width: 360px;
}
</style>
