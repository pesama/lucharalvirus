<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <div class="banner" v-if="user">
          <h1 class="title" v-html="$t('dashboard.welcome.title', { user: user.attributes.name })" />
          <div class="subtitle" v-html="$t('dashboard.welcome.subtitle', { role: $t(`common.personas.${role}`) })" />
          <p v-html="$t(`dashboard.welcome.${role}`)" />
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="new-profile" v-if="!profiles.length && newProfile">
          <affected-persona-registration v-model="newProfile" v-if="role === 'affected'" />
          <risk-persona-registration v-model="newProfile" v-else-if="role === 'risk'" />
          <volunteer-persona-registration v-model="newProfile" v-else-if="role === 'volunteer'" />
          <patient-persona-registration v-model="newProfile" v-else-if="role === 'patient'" />
          <doctor-persona-registration v-model="newProfile" v-else-if="role === 'doctor'" />
          <div class="unknown" v-else>
            {{ $t('registration.unknown.message') }}
          </div>
          <div class="actions">
            <el-button type="primary" @click="startProfileCreation()">
              {{ $t(`registration.${role}.form.submit`) }}
            </el-button>
          </div>
        </div>
        <div class="profiles" v-else-if="profiles.length">
          <div class="data" v-if="role !== 'affected'">
            <my-profile :profiles="profiles" :user="user" />
          </div>
          <div v-else>
            <affected-sampling />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Profile } from '../model/Profile';
import ProfileService from '../services/ProfileService';
import Amplify from 'aws-amplify';
import RiskPersonaRegistration from '../components/RiskPersonaRegistration.vue';
import VolunteerPersonaRegistration from '../components/VolunteerPersonaRegistration.vue';
import PatientPersonaRegistration from '../components/PatientPersonaRegistration.vue';
import DoctorPersonaRegistration from '../components/DoctorPersonaRegistration.vue';
import { DoctorPersonaRegistration as DoctorModel } from '../model/DoctorPersonaRegistration';
import { PatientPersonaRegistration as PatientModel } from '../model/PatientPersonaRegistration';
import { RiskPersonaRegistration as RiskModel } from '../model/RiskPersonaRegistration';
import { VolunteerPersonaRegistration as VolunteerModel } from '../model/VolunteerPersonaRegistration';
import { AppPersona, RiskProfileAssessment } from '../model/Enumerations';
import FrameworkService from '../services/FrameworkService';
import ProfilesTable from '../components/ProfilesTable.vue';
import MyProfile from '../components/MyProfile.vue';
import AffectedSampling from '../components/AffectedSampling.vue';
import AffectedPersonaRegistration from '../components/AffectedPersonaRegistration.vue';
import AffectedSamplingHistory from '../components/AffectedSamplingHistory.vue';

export interface UiProfile extends Profile {
  $ready: boolean;
}

@Component({
  components: {
    AffectedSampling,
    AffectedSamplingHistory,
    AffectedPersonaRegistration,
    DoctorPersonaRegistration,
    PatientPersonaRegistration,
    ProfilesTable,
    RiskPersonaRegistration,
    VolunteerPersonaRegistration,
    MyProfile
  }
})
export default class Dashboard extends Vue {

  private readonly fwkService: FrameworkService = FrameworkService.getInstance();
  private readonly profileService: ProfileService = ProfileService.getInstance();

  public newProfile: UiProfile | null = null;
  public profiles: Profile[] = [];
  public user: any = null;

  get role (): AppPersona {
    return this.$route.params.persona as AppPersona;
  }

  async created () {
    const allProfiles = await this.profileService.getProfile();
    this.user = await Amplify.Auth.currentAuthenticatedUser();

    let profiles = [];
    if (allProfiles.length) {
      profiles = allProfiles.filter(p => p.Persona === this.role);
    }

    if (!profiles || !profiles.length) {
      switch (this.role) {
        case AppPersona.DOCTOR:
          const doctorModel: DoctorModel = {
            ...this.newProfile,
            Speciality: '',
            BarId: ''
          };

          this.newProfile = {
            $ready: false,
            ...doctorModel
          };
          break;
        case AppPersona.PATIENT:
          const patientModel: PatientModel = {
            ...this.newProfile,
            Condition: '',
            Specialist: ''
          };

          this.newProfile = {
            $ready: false,
            ...patientModel
          };
          break;
        case AppPersona.RISK:
          const riskModel: RiskModel = {
            ...this.newProfile,
            Reasons: [],
            Address: ''
          };

          this.newProfile = {
            $ready: false,
            ...riskModel
          };
          break;
        case AppPersona.VOLUNTEER:
          const volunteerModel: VolunteerModel = {
            ...this.newProfile,
            Acknowledgements: Object.values(RiskProfileAssessment).map((k: string) => ({ [k]: false })).reduce((t, i) => ({ ...t, ...i }), {}),
            Address: ''
          };

          this.newProfile = {
            $ready: false,
            ...volunteerModel
          };
          break;
      } 

      this.newProfile = {
        ...this.newProfile,
        Persona: this.role as AppPersona
      }
    } else {
      this.profiles = profiles;
    }
  }

  async mounted () {}

  private creationTimeout = null
  async startProfileCreation () {
    if (this.creationTimeout) return;
    await new Promise((resolve, reject) => {
      this.creationTimeout = setTimeout(async () => {
        const result = await this.profileService.register(this.role, this.newProfile);
        if (result) {
          this.fwkService.addAlert('success', this.$t('registration.success') as string);
          const profiles = await this.profileService.getProfile();
          this.profiles = this.profiles.concat(profiles);
        } else {
          this.fwkService.addAlert('error', this.$t('registration.error') as string);
        }
      }, 100);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dashboard {
  .actions {
    .el-button {
      width: 100%;
    }
  }
}

</style>