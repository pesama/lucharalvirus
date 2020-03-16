<template>
  <div class="affected-sampling">
    <div class="form">
      <!-- Fever -->
      <number-field
        v-model="fever"
        :min="34"
        :max="45"
        :step="0.1"
        :label="$t('profiles.affected.form.fever.label')"
        :placeholder="$t('profiles.affected.form.fever.placeholder')"
        :hint="$t('profiles.affected.form.fever.hint')" />
      
      <!-- Symptoms -->
      <select-field v-model="symptoms"
        :label="$t('home.infected.form.symptoms.label')"
        :placeholder="$t('home.infected.form.symptoms.placeholder')"
        :options="availableSymptoms"
        :multiple="true" />

      <el-button type="success" @click="storeSample()">
        {{ $t('profiles.affected.form.submit') }}
      </el-button>
    </div>
    <div class="history">
      <h3 class="title" v-html="$t('sampling.history.title')" />
      <el-table
        :data="samplingHistory"
        style="width: 100%">
        <el-table-column
          :label="$t('sampling.history.date.label')">
          <template slot-scope="scope">
            {{ scope.row.CreationDate | age }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('sampling.history.symptoms.label')">
          <template slot-scope="scope">
            <el-badge v-for="s in scope.row.Symptoms" :key="s" :value="$t(`medical.symptoms.${s}`)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Fever"
          :label="$t('sampling.history.fever.label')" />

        <el-table-column>
          <template slot-scope="scope">
            <div class="remove" v-if="sampleIsRemovable(scope.row)">
              <el-button size="mini">
                <i class="fas fa-times"></i>
                {{ $t('sampling.post.removeRecent') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FormField from './FormField.vue';
import NumberField from './NumberField.vue';
import { Symptom } from '../model/Enumerations';
import SelectField from './SelectField.vue';
import { Sample } from '../model/Sample';
import SamplingService from '../services/SamplingService';
import FrameworkService from '../services/FrameworkService';
import moment from 'moment';

@Component({
  components: {
    FormField,
    NumberField,
    SelectField
  },
  filters: {
    age (value: string | Date) {
      return moment(value).fromNow();
    }
  }
})
export default class AffectedSampling extends Vue {

  private readonly samplingService: SamplingService = SamplingService.getInstance();
  private readonly fwk: FrameworkService = FrameworkService.getInstance();

  public fever: number = 35;
  public symptoms: Symptom[] = [];
  public samplingHistory: Sample[] = [];

  get availableSymptoms () {
    return Object.keys(Symptom).map(s => ({
      value: s.toLowerCase(),
      label: this.$t(`medical.symptoms.${s.toLowerCase()}`)
    }));
  }

  async created () {
    await this.fetchData()
  }

  async mounted () {
    setInterval(() => {
      this.$forceUpdate()
    }, 30000);
  }

  async fetchData () {
    const history = await this.samplingService.mySamples();
    this.samplingHistory = history.sort((a: any, b: any) => new Date(a.CreationDate) < new Date(b.CreationDate) ? 1 : -1)
  }

  sampleIsRemovable (sample: any) {
    const now = Date.now();
    const sampleDate = new Date(sample.CreationDate).getTime();
    return now - sampleDate < 900000;
  }

  async storeSample () {
    const sample: Sample = {
      Symptoms: this.symptoms,
      Fever: this.fever
    };

    const result = await this.samplingService.putSample(sample);
    if (result) {
      this.fwk.addAlert('success', this.$t('sampling.post.success') as string);
      await this.fetchData();
    } else {
      this.fwk.addAlert('error', this.$t('sampling.post.failed') as string);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.affected-sampling {
  .el-button {
    width: 100%;
  }
}

</style>
