<template>
  <div class="my-profile">
    <div class="patient" v-if="role === 'patient'">
      <div class="banner">
        <h3 class="title">
          {{ profile.Condition }}
          <el-badge :value="status" />
        </h3>
        <div class="data">
          <div class="item">
            <label class="data-label" v-html="$t('profiles.patient.data.speciality.label')" />
            <span class="value">{{ profile.Specialist || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="risk request" v-else-if="role === 'risk' && !assistanceRequests.length">
      <div class="banner">
        <h3 class="title">
          {{ user.attributes.name }} - {{ profile.Address.Street }}, {{ user.attributes.address }}
          <el-badge :value="$t(`common.personas.${role}`)" />
        </h3>
        <div class="actions">
          <div class="help">
            <h4 class="title" v-html="$t('profiles.risk.actions.help.title')" />
            <p class="description" v-html="$t('profiles.risk.actions.help.description')" />
            <form-field
              :label="$t('profiles.risk.actions.help.form.reason.label')"
              :placeholder="$t('profiles.risk.actions.help.form.reason.placeholder')"
              :hint="$t('profiles.risk.actions.help.form.reason.hint')"
              v-model="assistanceRequest" />
            
            <el-button type="primary" @click="submitAssistanceRequest()">
              {{ $t('profiles.risk.actions.help.form.submit') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="risk track" v-else-if="role === 'risk' && assistanceRequests.length">
      <div class="banner">
        <h3 class="title">
          {{ $t('profiles.risk.actions.help.awaitingTitle') }}
          <el-badge :value="$t(`common.statuses.${assistanceRequests[0].Status}`)" />
        </h3>
        <div class="data">
          <div class="item">
            <label class="data-label" v-html="$t('profiles.risk.actions.help.data.requestSummary')" />
            <span class="value">
              {{ assistanceRequests[0].Request }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Profile } from '../model/Profile';
import FormField from './FormField.vue';
import AssistanceService from '../services/AssistanceService';
import FrameworkService from '../services/FrameworkService';

@Component({
  components: {
    FormField
  }
})
export default class MyProfile extends Vue {
  @Prop(Array) readonly profiles!: Profile[];
  @Prop(Object) readonly user!: any;

  private readonly assistance: AssistanceService = AssistanceService.getInstance();
  private readonly fwk: FrameworkService = FrameworkService.getInstance();

  public assistanceRequests: any[] = [];
  public assistanceRequest: string = '';

  get profile () {
    return this.profiles[0];
  }

  get role () {
    return this.$route.params.persona;
  }

  get status () {
    return 'En espera';
  }

  async created () {
    this.assistanceRequests = await this.assistance.myRequests();
  }

  async mounted () {}

  async submitAssistanceRequest () {
    if (!this.assistanceRequest.length) {
      this.fwk.addAlert('error', this.$t('profiles.risk.actions.help.errors.noData') as string);
    } else {
      const result = await this.assistance.requestAssistance(this.assistanceRequest, (this.profile as any).Address);
      if (result) {
        this.fwk.addAlert('success', this.$t('profiles.risk.actions.help.success') as string);
        this.assistanceRequests = await this.assistance.myRequests();
      } else {
        this.fwk.addAlert('error', this.$t('profiles.risk.actions.help.error.unknown') as string);
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/branding';

.my-profile {

  .data {
    padding: 1em;
    background: $background-container;
    border-radius: 5px;
    
    .item {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .data-label {
        width: 40%;
      }

      .value {
        flex: 1;
      }
    }

    .data-label {
      font-weight: bold;
      margin-right: 1em;
      
      &::after {
        content: ':';
      }
    }
  }

  .actions {
    .el-button {
      width: 100%;
    }
  }
}

</style>
