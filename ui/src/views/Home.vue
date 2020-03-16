<template>
  <div class="home view">
    <div class="banner">
      <h1 v-html="$t('home.title')"></h1>
      <p v-html="$t('home.summaryParagraph')"></p>
    </div>
    <div class="content tools">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="affected-tracking">
            <h2 v-html="$t('home.infected.title')"></h2>
            <p v-html="$t('home.infected.description')"></p>
            <infection-control-form />
            <el-button type="warning" @click="startAffectedPersonaRegistration()">
              {{ $t('home.infected.register') }}
            </el-button>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="risk-assistance">
            <h2 v-html="$t('home.assistance.title')"></h2>
            <p v-html="$t('home.assistance.description')"></p>
            <el-button type="normal" @click="startRiskPersonaRegistration()">
              {{ $t('home.assistance.riskPersona.register') }}
            </el-button>
            <el-button type="primary" @click="startVolunteerPersonaRegistration()">
              {{ $t('home.assistance.volunteerPersona.register') }}
            </el-button>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="medical-assistance">
            <h2 v-html="$t('home.medical.title')" />
            <p v-html="$t('home.medical.description')" />
            <el-button type="primary" @click="startPatientPersonaRegistration()">
              {{ $t('home.medical.actions.registerPatient') }}
            </el-button>
            <el-button type="normal" @click="startDoctorPersonaRegistration()">
              {{ $t('home.medical.actions.registerDoctor') }}
            </el-button>
          </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="8">
          <div class="phone-assistance">
            <h2 v-html="$t('home.phone.title')" />
            <p v-html="$t('home.phone.description')" />
            <div class="phone placeholder" v-if="!showPhone">
              <el-button @click="showPhone = true">Obtener teléfono</el-button>
            </div>
            <div class="phone" v-else>
              <a href="tel:123456">
                123 456 789
                <i class="fas fa-phone"></i>
              </a>
            </div>
          </div>
        </el-col> -->
      </el-row>
    </div>
    <div class="content help">
      <h2 v-html="$t('home.help.title')" />
      <p v-html="$t('home.help.description')" />
      <div class="topics">
        <div class="topic" v-for="(topic, index) in helpTopics" :key="index">
          <h3 class="title" v-html="topic.title" />
          <p class="description" v-html="topic.description" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import InfectionControlForm from '../components/InfectionControlForm.vue';
import RiskPersonaRegistration from '../components/RiskPersonaRegistration.vue';
import VolunteerPersonaRegistration from '../components/VolunteerPersonaRegistration.vue';
import FeedbackForm from '../components/FeedbackForm.vue';

@Component({
  components: {
    InfectionControlForm,
    FeedbackForm,
  }
})
export default class Home extends Vue {

  public showPhone = false;

  get helpTopics () {
    return this.$t('home.help.topics');
  }

  async created () {}

  async mounted () {}

  startAffectedPersonaRegistration () {
    this.$router.push('/registration/affected');
  }

  startRiskPersonaRegistration () {
    this.$router.push('/registration/risk');
  }

  startVolunteerPersonaRegistration () {
    this.$router.push('/registration/volunteer');
  }

  startPatientPersonaRegistration () {
    this.$router.push('/registration/patient');
  }

  startDoctorPersonaRegistration () {
    this.$router.push('/registration/doctor');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/branding';

.home {
  h1 {
    font-size: 1.3em;
  }

  h2 {
    font-size: 1.2em;
  }

  h3 {
    font-size: 1em;
  }

  p {
    color: $color-muted;
  }

  .el-button {
    margin: .5em 0;
    display: block;
    width: 100%;

    button: {
      width: 100%;
    }
  }

  .phone {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .5em;

    &:not(.placeholder) {
      font-size: 2em;
    }
  }
}

</style>
