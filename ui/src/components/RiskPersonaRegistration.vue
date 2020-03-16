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
          v-model="value.Reasons" />
        <!-- Address -->
        <address-form-field 
          :title="$t('registration.risk.form.address.title')"
          :description="$t('registration.risk.form.address.description')"
          v-model="value.Address" />

        <div class="consents">
          <h4 class="title" v-html="$t('legal.consents.title')" />
          <div class="check" 
            v-for="(ack, index) in consents"
            :key="index">
            <el-checkbox 
              v-model="value.Consents[index]">
              {{ $t(`legal.consents.data.${index}`) }}
            </el-checkbox>
          </div>
        </div>
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
export default class RiskPersonaRegistrationComponent extends Vue {
  @Prop(Object) readonly value!: RiskPersonaRegistration;

  get consents () {
    const consents = this.$t('legal.consents.data');
    return consents;
  }

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
.risk-persona {

  .actions {
    text-align: right;
  }

  margin-bottom: 1em;

  .check {
    margin: .5em 0;
  }

  .el-checkbox {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    white-space: normal;
  }
}

</style>
