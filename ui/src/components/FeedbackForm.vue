<template>
  <div class="feedback-form">
    <!-- Name -->
    <form-field 
      :label="$t('home.feedback.form.name.label')"
      :placeholder="$t('home.feedback.form.name.placeholder')"
      :hint="$t('home.feedback.form.name.hint')"
      v-model="profileData.Name" />
    
    <!-- Phone number -->
    <form-field 
      :label="$t('home.feedback.form.phone.label')"
      :placeholder="$t('home.feedback.form.phone.placeholder')"
      :hint="$t('home.feedback.form.phone.hint')"
      v-model="profileData.PhoneNumber" />

    <!-- Comment -->
    <form-field 
      :label="$t('home.feedback.form.comment.label')"
      :placeholder="$t('home.feedback.form.comment.placeholder')"
      :hint="$t('home.feedback.form.comment.hint')"
      v-model="profileData.Comment" />

    <div class="actions">
      <el-button type="normal">Enviar comentario</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component } from 'vue-property-decorator'
import { FeedbackRequest } from '../model/FeedbackRequest';
import FormField from './FormField.vue';

@Component({
  components: {
    FormField
  }
})
export default class FeedbackForm extends Vue {

  public profileData: FeedbackRequest = {
    Name: '',
    SampleTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    PhoneNumber: '',
    Comment: ''
  }

  async created () {}

  async mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.feedback-form {
  .actions {
    .el-button {
      width: 100%;
    }
  }
}

</style>
