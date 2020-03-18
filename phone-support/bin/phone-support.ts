#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PhoneSupportStack } from '../lib/phone-support-stack';

const app = new cdk.App();
new PhoneSupportStack(app, 'LucharAlVirusPhoneSupport', {
  env: {
    region: 'eu-central-1'
  },
  connectInstanceArn: process.env.CONNECT_INSTANCE_ARN!
});
