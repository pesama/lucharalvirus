<template>
  <div class="registration doctor-persona">
    <form class="registration-form">
      <div class="details">
          <!-- Speciality -->
          <form-field 
            :label="$t('registration.doctor.form.speciality.label')"
            :placeholder="$t('registration.doctor.form.speciality.placeholder')"
            :hint="$t('registration.doctor.form.speciality.hint')"
            v-model="value.Speciality" />
          
          <!-- Bar Id -->
          <form-field 
            :label="$t('registration.doctor.form.barId.label')"
            :placeholder="$t('registration.doctor.form.barId.placeholder')"
            :hint="$t('registration.doctor.form.barId.hint')"
            v-model="value.BarId" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import FormField from './FormField.vue';
import AddressFormField from './AddressFormField.vue';
import SelectField from './SelectField.vue';
import { DoctorPersonaRegistration } from '../model/DoctorPersonaRegistration';
import { AppPersona } from '../model/Enumerations';

@Component({
  components: {
    AddressFormField,
    FormField,
    SelectField
  }
})
export default class DoctorPersonaRegistrationComponent extends Vue {
  @Prop(Object) readonly value!: DoctorPersonaRegistration;
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