#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'LucharAlVirus', {
  acmCertificateArn: process.env.ACM_CERTIFICATE_ARN!,
  patientsDomainName: 'lucharalvirus.com',
  zoneId: process.env.ZONE_ID!
});
