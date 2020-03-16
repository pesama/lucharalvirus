<template>
  <div class="registration affected-persona">
    <form class="registration-form">
      <div class="reason">
        <!-- Reason for risk profile -->
        <select-field 
          :label="$t('registration.affected.form.riskAssessment.label')"
          :placeholder="$t('registration.affected.form.riskAssessment.placeholder')"
          :hint="$t('registration.affected.form.riskAssessment.hint')"
          :options="riskProfileAssessmentOptions"
          :multiple="true"
          v-model="value.Reasons" />
        
        <!-- Address -->
        <address-form-field 
            :title="$t('registration.risk.form.address.title')"
            :description="$t('registration.risk.form.address.description')"
            v-model="value.Address" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import FormField from './FormField.vue';
import AddressFormField from './AddressFormField.vue';
import SelectField from './SelectField.vue';
import { RiskProfileAssessment, AppPersona } from '../model/Enumerations';
import { RiskPersonaRegistration } from '../model/RiskPersonaRegistration';

@Component({
  components: {
    AddressFormField,
    FormField,
    SelectField
  }
})
export default class AffectedPersonaRegistrationComponent extends Vue {
  @Prop(Object) readonly value!: RiskPersonaRegistration;

  get riskProfileAssessmentOptions () {
    return Object.values(RiskProfileAssessment).map(a => ({
      value: a,
      label: this.$t(`medical.riskProfile.autoAssessment.${a}`)
    }))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.affected-persona {

}

</style>
