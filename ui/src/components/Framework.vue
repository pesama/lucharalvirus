<template>
  <div class="framework">
      <div class="alerts">
        <el-alert :type="alert.type" v-for="(alert, index) in currentAlerts" :key="index" :dismissible="true" v-html="alert.message" />
      </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import FrameworkService, { FrameworkData, FrameworkAlert } from '@/services/FrameworkService';

@Component
export default class FrameworkComponent extends Vue {
  private readonly fwk: FrameworkService;
  public readonly data: FrameworkData;

  constructor () {
    super();

    this.fwk = FrameworkService.getInstance();
    this.data = this.fwk.getData();
  }

  async mounted () {
    setInterval(() => {
      this.refreshAlerts();
    }, 1000);
  }

  get currentAlerts () {
    return this.data.alerts
  }

  refreshAlerts () {
    const now = new Date().getTime()
    const expired = this.data.alerts
      .filter(item => (now - 3000) > item.date.getTime());

    expired.forEach(item => {
      this.removeAlert(item);
    })
  }

  removeAlert (alert: FrameworkAlert) {
    const index = this.data.alerts.indexOf(alert);
    alert.dismissed = true;
    this.data.alerts.splice(index, 1);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.framework {
  z-index: 10001;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 0px;
  text-align: center;

  .alerts {
    margin: 3em auto;
    text-align: center;
    width: 30%;
  }
}

</style>
