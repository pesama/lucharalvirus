<template>
  <div class="volunteer-persona registration">

    <!-- Name -->
    <form-field 
      :label="$t('registration.volunteer.form.name.label')"
      :placeholder="$t('registration.volunteer.form.name.placeholder')"
      :hint="$t('registration.volunteer.form.name.hint')"
      v-model="profileData.Name" />

      <!-- PhoneNumber -->
    <form-field 
      :label="$t('registration.volunteer.form.phone.label')"
      :placeholder="$t('registration.volunteer.form.phone.placeholder')"
      :hint="$t('registration.volunteer.form.phone.hint')"
      v-model="profileData.PhoneNumber" />

    <!-- Address -->
    <address-form-field 
        :title="$t('registration.volunteer.form.address.title')"
        :description="$t('registration.volunteer.form.address.description')"
        v-model="profileData.Address" />

    <div class="acknowledgments">
      <div class="banner">
        <div class="title" v-html="$t('registration.volunteer.form.acknowledgments.title')" />
        <div class="description" v-html="$t('registration.volunteer.form.acknowledgments.description')" />
      </div>
      <div class="content">
        <el-checkbox 
          v-for="(ack, index) in profileData.Acknowledgements"
          :key="index" 
          v-model="profileData.Acknowledgements[index]">
          {{ $t(`medical.volunteerProfile.autoAck.${index}`) }}
        </el-checkbox>
      </div>
    </div>
    <div class="actions">
      <el-button type="primary">{{ $t('common.actions.startRegistration.title') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { VolunteerPersonaRegistration } from '../model/VolunteerPersonaRegistration';
import { RiskProfileAssessment } from '../model/Enumerations';
import FormField from './FormField.vue';
import AddressFormField from './AddressFormField.vue';

@Component({
  components: {
    AddressFormField,
    FormField
  }
})
export default class VolunteerPersonaRegistrationComponent extends Vue {

  public profileData: VolunteerPersonaRegistration = {
    Acknowledgements: Object.values(RiskProfileAssessment).map(k => ({ [k]: false })).reduce((t, i) => ({ ...t, ...i }), {}),
    Name: '',
    PhoneNumber: '',
    Address: {
      Street: '',
      City: '',
      PostalCode: ''
    }
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/branding';

.volunteer-persona {
  .acknowledgments {
    .banner {
      .title {
        font-size: .9em;
        font-weight: bold;
      }

      .description {
        font-size: .9em;
        color: $color-muted;
      }
      margin: .5em 0;
    }
  }

  .actions {
    margin: .5em 0;
    text-align: right;
  }
}

</style>
