<template>
  <div class="registration doctor-persona">
    <form class="registration-form">
      <div class="details">
        <!-- Name -->
        <form-field 
          :label="$t('registration.doctor.form.name.label')"
          :placeholder="$t('registration.doctor.form.name.placeholder')"
          :hint="$t('registration.doctor.form.name.hint')"
          v-model="profileData.Name" />
        
        <!-- Phone number -->
        <form-field 
            :label="$t('registration.doctor.form.phone.label')"
            :placeholder="$t('registration.doctor.form.phone.placeholder')"
            :hint="$t('registration.doctor.form.phone.hint')"
            v-model="profileData.PhoneNumber" />

          <!-- Speciality -->
          <form-field 
            :label="$t('registration.doctor.form.speciality.label')"
            :placeholder="$t('registration.doctor.form.speciality.placeholder')"
            :hint="$t('registration.doctor.form.speciality.hint')"
            v-model="profileData.Speciality" />
          
          <!-- Bar Id -->
          <form-field 
            :label="$t('registration.doctor.form.barId.label')"
            :placeholder="$t('registration.doctor.form.barId.placeholder')"
            :hint="$t('registration.doctor.form.barId.hint')"
            v-model="profileData.BarId" />

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
import { DoctorPersonaRegistration } from '../model/DoctorPersonaRegistration';

@Component({
  components: {
    AddressFormField,
    FormField,
    SelectField
  }
})
export default class DoctorPersonaRegistrationComponent extends Vue {

  public profileData: DoctorPersonaRegistration = {
    Name: '',
    PhoneNumber: '',
    Speciality: '',
    BarId: ''
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.doctor-persona {

  .actions {
    text-align: right;
  }
}

</style>