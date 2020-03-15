<template>
  <div class="registration risk-persona">
    <form class="registration-form">
      <div class="details">
        <!-- Name -->
        <form-field 
          :label="$t('registration.patient.form.name.label')"
          :placeholder="$t('registration.patient.form.name.placeholder')"
          :hint="$t('registration.patient.form.name.hint')"
          v-model="profileData.Name" />
        
        <!-- Phone number -->
        <form-field 
            :label="$t('registration.patient.form.phone.label')"
            :placeholder="$t('registration.patient.form.phone.placeholder')"
            :hint="$t('registration.patient.form.phone.hint')"
            v-model="profileData.PhoneNumber" />

          <!-- Condition summary -->
          <form-field 
            :label="$t('registration.patient.form.condition.label')"
            :placeholder="$t('registration.patient.form.condition.placeholder')"
            :hint="$t('registration.patient.form.condition.hint')"
            v-model="profileData.Condition" />

          <!-- Specialist request summary -->
          <form-field 
            :label="$t('registration.patient.form.specialist.label')"
            :placeholder="$t('registration.patient.form.specialist.placeholder')"
            :hint="$t('registration.patient.form.specialist.hint')"
            v-model="profileData.Specialist" />

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
import { PatientPersonaRegistration } from '../model/PatientPersonaRegistration';

@Component({
  components: {
    AddressFormField,
    FormField,
    SelectField
  }
})
export default class PatientPersonaRegistrationComponent extends Vue {

  public profileData: PatientPersonaRegistration = {
    Name: '',
    PhoneNumber: '',
    Condition: '',
    Specialist: ''
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
