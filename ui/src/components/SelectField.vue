<template>
  <div class="select-field form-field">
    <label class="form-label" v-html="label" />
    <el-select class="el-input" :placeholder="placeholder" :multiple="multiple" v-model="formValue">
      <el-option v-for="(option, index) in options" :key="index" :value="option.value" v-html="option.label" />
    </el-select>
    <div class="hint" v-html="hint"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import FormField from './FormField.vue';

export interface Option {
  label: string;
  value: string;
}

@Component
export default class SelectField extends FormField {
  @Prop(Boolean) readonly multiple!: boolean;
  @Prop(Array) readonly options!: Option[];
  @Prop(Array) readonly value!: any;

  get formValue () {
    return this.value;
  }

  set formValue (value: any) {
    this.$emit('input', value);
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.select-field {
}

</style>
