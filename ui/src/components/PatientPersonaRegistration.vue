<template>
  <div class="registration risk-persona">
    <h2 class="title" v-html="$t('registration.patient.form.title')" />
    <form class="registration-form">
      <div class="details">
        <!-- Condition summary -->
        <form-field 
          :label="$t('registration.patient.form.condition.label')"
          :placeholder="$t('registration.patient.form.condition.placeholder')"
          :hint="$t('registration.patient.form.condition.hint')"
          v-model="value.Condition"
          :required="true" />

        <!-- Specialist request summary -->
        <form-field 
          :label="$t('registration.patient.form.specialist.label')"
          :placeholder="$t('registration.patient.form.specialist.placeholder')"
          :hint="$t('registration.patient.form.specialist.hint')"
          v-model="value.Specialist"
          :required="true" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import FormField from './FormField.vue';
import AddressFormField from './AddressFormField.vue';
import SelectField from './SelectField.vue';
import { PatientPersonaRegistration } from '../model/PatientPersonaRegistration';
import { AppPersona } from '../model/Enumerations';

@Component({
  components: {
    AddressFormField,
    FormField,
    SelectField
  }
})
export default class PatientPersonaRegistrationComponent extends Vue {
  @Prop(Object) readonly value!: PatientPersonaRegistration;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.risk-persona {

  
}

</style>
