<template>
  <div id="app">
    <framework />
    <div class="content">
      <router-link to="/">
        <img class="logo" src="/logo.png" />
      </router-link>
      <el-container>
        <el-main>
          <div class="route-wrapper" v-if="status === 'idle' || $route.meta.public">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="auth" v-if="status === 'unauth' && !$route.meta.public">
      <div class="auth-panel">
        <div class="welcome">
          <h1 class="title" v-html="$t('login.welcome.title')" />
          <p class="description" v-html="$t('login.welcome.description')" />
        </div>
        <amplify-authenticator v-bind:authConfig="authConfig" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Amplify from 'aws-amplify'
import { AmplifyEventBus, components as AmplifyComponents } from 'aws-amplify-vue'
import FrameworkService from './services/FrameworkService';
import Framework from '@/components/Framework.vue';

@Component({
  components: {
    Framework,
    ...AmplifyComponents
  }
})
export default class App extends Vue {
  private readonly fwk: FrameworkService = FrameworkService.getInstance();
  private dataUpdateSchedule = null;

  public status = 'unauth';

  get authConfig () {
    return {
      usernameAttributes: this.$t('registration.fields.phoneNumber.label'),
      signInConfig: {
        header: this.$t('login.form.title')
      },
      confirmSignUpConfig: {
        header: this.$t('registration.headers.confirmSignUp')
      },
      
    }
  }

  async created () {
    AmplifyEventBus.$on('authState', async (info: string) => {
      await this.verifyAuth()
    });
    
    await this.verifyAuth();
  }
  
  async mounted () {

  }

  async updated () {
    
  }
  
  async verifyAuth (): Promise<void> {
    try {
      const credentials = await Amplify.Auth.currentUserCredentials();
      const loggedIn = !credentials.expired && credentials.authenticated;
      if (loggedIn) {
        this.status = 'idle'
      } else {
        // Stop app
      }
    } catch (e) {
      console.error('Failed to initialise app');
      console.error(e);
    }
  }
}
</script>


<style lang="scss">
@import '@/assets/branding.scss';

body {
  position: absolute;
  top: 0px;
  left: 0px;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;


  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .auth {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .info {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45%;
      flex-direction: column;
      padding-left: 5%;

      .logo {
        width: 100%;
      }

      p {
        flex: 1;
        width: 70%;
      }
    }

    .auth-panel {
      flex: 1;

      display: flex;
      justify-content: center;
      align-items: center;

      .welcome {
        max-width: 400px;
      }

      /deep/ {
        .Form__formSection___3tqxz {
          box-shadow: none !important;
          border-radius: 0 !important;
        }
      }
    }
  }

  > .content {
    width: 900%;
    max-width: 1200px;
    padding-top: 2em;
    
    .logo {
      height: 50px;
    }

    .view {
      
    }
  }
}
</style>
