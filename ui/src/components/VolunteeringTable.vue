<template>
  <div class="volunteering-table">
    <div class="banner">
      <h3 class="title" v-html="$t('dashboard.tools.volunteer.title')" />
      <div class="description" v-html="$t('dashboard.tools.volunteer.description')" />
      <div class="data">
        <div class="actions">
          <el-button class="no-full" size="mini" @click="fetchData()">
            <i class="fas fa-sync"></i>
          </el-button>
        </div>
        <el-table
          :data="assistanceRequests"
          style="width: 100%">

          <el-table-column
            :label="$t('dashboard.tools.volunteer.requests.status.label')">
            <template slot-scope="scope">
              <el-badge :value="$t(`common.statuses.${scope.row.Status}`)" />
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('dashboard.tools.volunteer.requests.description.label')"
            prop="Request" />
          
          <el-table-column
            :label="$t('dashboard.tools.volunteer.requests.age.label')">
            <template slot-scope="scope">
              {{ scope.row.CreationDate | age }}
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('dashboard.tools.volunteer.requests.distance.label')">
            <template slot-scope="scope">
              {{ `${scope.row.$distance}m` }}
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('dashboard.tools.volunteer.requests.actions.label')">
            <template slot-scope="scope">
              <el-button v-if="scope.row.Status === 'requested'" size="mini" type="normal" @click="assignRequest(scope.row)">
                {{ $t('dashboard.tools.volunteer.requests.actions.assign.label') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import AssistanceService from '../services/AssistanceService';
import { VolunteerPersonaRegistration } from '../model/VolunteerPersonaRegistration';
import moment from 'moment';
import { getDistance } from 'geolib';
import FrameworkService from '../services/FrameworkService';

@Component({
  filters: {
    age (val: string) {
      return moment(val).fromNow();
    }
  }
})
export default class VolunteeringTable extends Vue {
  @Prop(Array) readonly profiles!: VolunteerPersonaRegistration[];

  private readonly assistanceService = AssistanceService.getInstance();
  private readonly fwk = FrameworkService.getInstance();

  public assistanceRequests: any[] = []

  get profile () {
    const profile = this.profiles.filter(p => p.Persona === 'volunteer')[0];
    return profile;
  }

  async created () {
    await this.fetchData();
  }

  async fetchData () {
    const PostalCode = (this.profile.Address as any).PostalCode.long_name;
    const requests = await this.assistanceService.nearbyRequests(PostalCode);

    this.assistanceRequests = requests.map(r => ({
      ...r,
      $distance: this.distanceToTarget(r)
    }));
    
    this.$emit('current-requests', this.assistanceRequests);
  }

  async mounted () {}

  async assignRequest (request: any) {
    const result = await this.assistanceService.assignRequest(request);
    if (result) {
      this.fwk.addAlert('success', this.$t('dashboard.tools.volunteer.requests.actions.assign.success') as string);
    } else {
      this.fwk.addAlert('error', this.$t('dashboard.tools.volunteer.requests.actions.assign.failed') as string);
    }
    
    this.fetchData();
  }

  distanceToTarget (request: any) {
    const geo = request.Address.Geolocation;
    const myAddress = (this.profile.Address as any).Geolocation;
    
    const d = getDistance(geo, myAddress);
    return d;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.volunteering-table {

  .actions {
    text-align: right;
  }

  .el-button.no-full {
    width: auto;
  }

  .el-table {
    /deep/ {
      .cell {
        word-break: break-word;
      }
    }
  }
}

</style>
