<template>
  <div class="registration view">
    <h1 v-html="$t(`registration.${role}.title`)" />
    <p v-html="$t(`registration.${role}.description`)" />
    <p class="disclaimer" v-html="$t('registration.disclaimer')" />
    <div class="form">
      <risk-persona-registration v-if="role === 'risk'" />
      <volunteer-persona-registration v-else-if="role === 'volunteer'" />
      <patient-persona-registration v-else-if="role === 'patient'" />
      <doctor-persona-registration v-else-if="role === 'doctor'" />
      <div class="unknown" v-else>
        {{ $t('registration.unknown.message') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import RiskPersonaRegistration from '../components/RiskPersonaRegistration.vue';
import VolunteerPersonaRegistration from '../components/VolunteerPersonaRegistration.vue';
import PatientPersonaRegistration from '../components/PatientPersonaRegistration.vue';
import DoctorPersonaRegistration from '../components/DoctorPersonaRegistration.vue';

@Component({
  components: {
    DoctorPersonaRegistration,
    PatientPersonaRegistration,
    RiskPersonaRegistration,
    VolunteerPersonaRegistration
  }
})
export default class Registration extends Vue {

  get role () {
    return this.$route.params.persona;
  }

  async created () {}

  async mounted () {}
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
}

</style>
