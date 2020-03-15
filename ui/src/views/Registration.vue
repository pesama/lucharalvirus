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
import RiskPersonaRegistration from '../components/RiskPersonaRegistration.vue';
import VolunteerPersonaRegistration from '../components/VolunteerPersonaRegistration.vue';
import PatientPersonaRegistration from '../components/PatientPersonaRegistration.vue';
import DoctorPersonaRegistration from '../components/DoctorPersonaRegistration.vue';
import { Profile } from '../model/Profile';
import { AppPersona } from '../model/Enumerations';

import { DoctorPersonaRegistration as DoctorModel } from '../model/DoctorPersonaRegistration';
import { PatientPersonaRegistration as PatientModel } from '../model/PatientPersonaRegistration';
import { RiskPersonaRegistration as RiskModel } from '../model/RiskPersonaRegistration';
import { VolunteerPersonaRegistration as VolunteerModel } from '../model/VolunteerPersonaRegistration';
import { RiskProfileAssessment } from '../model/Enumerations';
import { AmplifyEventBus } from 'aws-amplify-vue';

export interface UiProfile extends Profile {
  $ready: boolean;
}

@Component({
  components: {
    DoctorPersonaRegistration,
    PatientPersonaRegistration,
    RiskPersonaRegistration,
    VolunteerPersonaRegistration
  }
})
export default class Registration extends Vue {

  public authConfig: any = null;
  public dataModel: UiProfile | null = null;
  public registrationConfirmed: boolean = false;

  get formReady () {
    return this.dataModel && this.dataModel.$ready;
  }

  get role (): AppPersona {
    return this.$route.params.persona as AppPersona;
  }

  async created () {
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

    switch (this.role) {
      
      case AppPersona.DOCTOR:
        const doctorModel: DoctorModel = {
          ...this.dataModel,
          Speciality: '',
          BarId: ''
        };

        this.dataModel = {
          $ready: false,
          ...doctorModel
        };
        break;
      case AppPersona.PATIENT:
        const patientModel: PatientModel = {
          ...this.dataModel,
          Condition: '',
          Specialist: ''
        };

        this.dataModel = {
          $ready: false,
          ...patientModel
        };
        break;
      case AppPersona.RISK:
        const riskModel: RiskModel = {
          ...this.dataModel,
          Reasons: [],
          Address: {
            Street: '',
            PostalCode: ''
          }
        };

        this.dataModel = {
          $ready: false,
          ...riskModel
        };
        break;
      case AppPersona.VOLUNTEER:
        const volunteerModel: VolunteerModel = {
          ...this.dataModel,
          Acknowledgements: Object.values(RiskProfileAssessment).map((k: string) => ({ [k]: false })).reduce((t, i) => ({ ...t, ...i }), {}),
          Address: {
            Street: '',
            PostalCode: ''
          }
        };

        this.dataModel = {
          $ready: false,
          ...volunteerModel
        };
        break;
    } 

    this.dataModel = {
      ...this.dataModel,
      Persona: this.role
    }

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
