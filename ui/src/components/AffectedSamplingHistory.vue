<template>
  <div class="affected-sampling-history">
    <el-table
      :data="samplingHistory"
      style="width: 100%">
        <el-table-column
          prop="date"
          :label="$('sampling.history.date.label')" />

        <el-table-column
          prop="symptoms"
          :label="$('sampling.history.symptoms.label')" />

        <el-table-column
          prop="fever"
          :label="$('sampling.history.fever.label')" />
      </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Sample } from '../model/Sample';

@Component
export default class AffectedSamplingHistory extends Vue {

  public readonly samplingHistory: Sample[];

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.affected-sampling-history {
}

</style>
