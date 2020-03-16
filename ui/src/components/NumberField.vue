<template>
  <div class="form-field">
    <label class="form-label" v-html="label" />
    <el-input-number class="el-input"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder" v-model="numberValue" />
    <div class="hint" v-html="hint"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import FormField from './FormField.vue';

@Component
export default class NumberField extends FormField {
  @Prop(Number) readonly min?: number;
  @Prop(Number) readonly max?: number;
  @Prop(Number) readonly step?: number;
  @Prop(Number) readonly value: number;


  get numberValue () {
    return this.value
  }

  set numberValue (value: number) {
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
