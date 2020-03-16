<template>
  <div class="volunteer-persona registration">
    <!-- Address -->
    <address-form-field 
        :title="$t('registration.volunteer.form.address.title')"
        :description="$t('registration.volunteer.form.address.description')"
        v-model="value.Address" />

    <div class="acknowledgments">
      <div class="banner">
        <div class="title" v-html="$t('registration.volunteer.form.acknowledgments.title')" />
        <div class="description" v-html="$t('registration.volunteer.form.acknowledgments.description')" />
      </div>
      <div class="content">
        <div class="check" 
          v-for="(ack, index) in value.Acknowledgements"
          :key="index">
          <el-checkbox 
            v-model="value.Acknowledgements[index]">
            {{ $t(`medical.volunteerProfile.autoAck.${index}`) }}
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { VolunteerPersonaRegistration } from '../model/VolunteerPersonaRegistration';
import { RiskProfileAssessment, AppPersona } from '../model/Enumerations';
import FormField from './FormField.vue';
import AddressFormField from './AddressFormField.vue';

@Component({
  components: {
    AddressFormField,
    FormField
  }
})
export default class VolunteerPersonaRegistrationComponent extends Vue {
  @Prop(Object) readonly value!: VolunteerPersonaRegistration;
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

  .content {
    margin-bottom: 1em;
  }
}

</style>
