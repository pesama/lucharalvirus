<template>
  <div class="form infection-control">
    <select-field v-model="symptoms"
      :label="$t('home.infected.form.symptoms.label')"
      :placeholder="$t('home.infected.form.symptoms.placeholder')"
      :options="availableSymptoms"
      :multiple="true" />

    <form-field v-model="birthDate"
      field-type="date"
      :label="$t('home.infected.form.birthDate.label')"
      :hint="$t('home.infected.form.birthDate.hint')"
      :options="availableSymptoms"
      multiple="true" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Symptom } from '../model/Enumerations'
import SelectField from './SelectField.vue';
import FormField from './FormField.vue';

@Component({
  components: {
    FormField,
    SelectField
  }
})
export default class InfectionControlForm extends Vue {

  public readonly symptoms: Symptom[] = [];
  public readonly birthDate = '';

  get availableSymptoms () {
    return Object.keys(Symptom).map(s => ({
      value: s.toLowerCase(),
      label: this.$t(`medical.symptoms.${s.toLowerCase()}`)
    }));
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.infection-control {
  .el-button {
    width: 100%;
  }
}

</style>
