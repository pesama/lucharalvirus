<template>
  <div class="form-field">
    <label class="form-label" v-html="label" />
    <el-input :type="fieldType" :placeholder="placeholder" v-model="fieldValue" />
    <div class="hint" v-html="hint"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FormField extends Vue {
  @Prop(String) readonly label: string;
  @Prop(String) readonly placeholder: string;
  @Prop(String) readonly hint: string;
  @Prop() readonly value: any;
  @Prop({ required: false, default: 'text' }) readonly fieldType?: string;

  get fieldValue () {
    return this.value
  }

  set fieldValue (value: any) {
    this.$emit('input', value);
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/branding';

.form-field {
  margin: .5em 0;

  .form-label {
    font-size: .9em;
    font-weight: bold;
  }

  .hint {
    font-size: .9em;
    color: $color-muted;
    margin: .25em 0;
  }

}

</style>
