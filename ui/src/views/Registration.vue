<template>
  <div class="registration view" 
    v-loading="registrationConfirmed"
    :element-loading-text="$t('registration.loadingText')">
    <el-row :gutter="20">
      <el-col :xs="12" :md="12">
        <h1 v-html="$t(`registration.${role}.title`)" />
        <p v-html="$t(`registration.${role}.description`)" />
        <p class="disclaimer" v-html="$t('registration.disclaimer')" />
      </el-col>
      <el-col :xs="12" :md="12">
        <div class="data">
          <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Profile } from '../model/Profile';
import { AppPersona } from '../model/Enumerations';
import { AmplifyEventBus } from 'aws-amplify-vue';
import Amplify from 'aws-amplify';

@Component
export default class Registration extends Vue {

  public authConfig: any = null;
  public registrationConfirmed: boolean = false;

  get role (): AppPersona {
    return this.$route.params.persona as AppPersona;
  }

  async created () {
    const creds = await Amplify.Auth.currentUserCredentials();
    if (!creds.expired && creds.authenticated) {
      this.$router.push(`/dashboard/${this.role}`)
    }

    this.authConfig = {
      usernameAttributes: this.$t('registration.fields.phoneNumber.label'),
      confirmSignUpConfig: {
        header: this.$t('registration.headers.confirmSignUp')
      },
      signUpConfig: {
        header: this.$t('registration.headers.signUp'),
        defaultCountryCode: '34',
        signUpFields: [
          {
            label: this.$t('registration.fields.name.label'),
            key: 'name',
            type: 'string',
            required: true,
            displayOrder: 1
          },
          {
            label: this.$t('registration.fields.email.label'),
            key: 'email',
            required: true,
            type: 'string',
            displayOrder: 2
          },
          {
            label: this.$t('registration.fields.phoneNumber.label'),
            key: 'phone_number',
            required: true,
            displayOrder: 3,
            type: 'string',
            signUpWith: true
          },
          {
            label: this.$t('registration.fields.address.label'),
            key: 'address',
            required: true,
            type: 'string',
            displayOrder: 4
          },
          {
            label: this.$t('registration.fields.password.label'),
            key: 'password',
            type: 'password',
            required: true,
            displayOrder: 5,
            signUpWith: true
          },
        ],
        hideAllDefaults: true
      }
    };

    AmplifyEventBus.$on('localUser', user => {
      
    });

    AmplifyEventBus.$on('authState', authState => {
      if (authState === 'signIn') {
        this.registrationConfirmed = true;
        setTimeout(() => {
          this.$router.push(`/dashboard/${this.role}`);
        }, 5000);
      }
    });
  }

  async mounted () {
    setTimeout(() => {
      const btn = document.querySelector('a[data-test="sign-in-create-account-link"]');
      // @ts-ignore
      btn.click();
    }, 50);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/branding';

.registration {
  .disclaimer {
    color: $color-danger;
    font-weight: bold;
  }

  .data {
    text-align: center;
  }

  /deep/ {
    div[data-test="sign-up-section"] {
      border-radius: 0;
      box-shadow: none;
    }

    .Section__sectionFooterSecondaryContent___3cjOa {
      display: none;
    }
  }

  // .el-row:not(.ready) {
  //   /deep/ {
  //     .Button__button___1FrBC {
  //       display: none;
  //     }
  //   }
  // }
}

</style>
