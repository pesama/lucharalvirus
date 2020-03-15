<template>
  <div class="registration risk-persona">
    <form class="registration-form">
      <div class="reason">
        <!-- Reason for risk profile -->
        <select-field 
          :label="$t('registration.risk.form.reason.label')"
          :placeholder="$t('registration.risk.form.reason.placeholder')"
          :hint="$t('registration.risk.form.reason.hint')"
          :options="riskProfileAssessmentOptions"
          :multiple="true"
          v-model="profileData.Reasons" />
      </div>
      <div class="details">
        <!-- Name -->
        <form-field 
          :label="$t('registration.risk.form.name.label')"
          :placeholder="$t('registration.risk.form.name.placeholder')"
          :hint="$t('registration.risk.form.name.hint')"
          v-model="profileData.Name" />
        
        <!-- Phone number -->
        <form-field 
            :label="$t('registration.risk.form.phone.label')"
            :placeholder="$t('registration.risk.form.phone.placeholder')"
            :hint="$t('registration.risk.form.phone.hint')"
            v-model="profileData.PhoneNumber" />

        <!-- Address -->
        <address-form-field 
            :title="$t('registration.risk.form.address.title')"
            :description="$t('registration.risk.form.address.description')"
            v-model="profileData.Address" />

        <div class="actions">
          <el-button type="primary">{{ $t('common.actions.startRegistration.title') }}</el-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FormField from './FormField.vue';
import AddressFormField from './AddressFormField.vue';
import SelectField from './SelectField.vue';
import { RiskProfileAssessment } from '../model/Enumerations';
import { RiskPersonaRegistration } from '../model/RiskPersonaRegistration';

@Component({
  components: {
    AddressFormField,
    FormField,
    SelectField
  }
})
export default class RiskPersonaRegistrationComponent extends Vue {

  public profileData: RiskPersonaRegistration = {
    Reasons: [],
    Name: '',
    PhoneNumber: '',
    Address: {
      Street: '',
      City: '',
      PostalCode: ''
    }
  }

  get riskProfileAssessmentOptions () {
    return Object.values(RiskProfileAssessment).map(a => ({
      value: a,
      label: this.$t(`medical.riskProfile.autoAssessment.${a}`)
    }))
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.risk-persona {

  .actions {
    text-align: right;
  }
}

</style>
