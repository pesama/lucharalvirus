import { Auth } from './auth';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { Bucket } from '@aws-cdk/aws-s3';
import { WebUI } from './webui';
import { StackProps, Stack, Construct, CfnOutput, Aws } from '@aws-cdk/core';
import RecordSets from './recordsets';
import { PolicyStatement } from '@aws-cdk/aws-iam';

export interface MainProps extends StackProps {
  acmCertificateArn: string;
  patientsDomainName: string;
  zoneId: string;
}

export class InfraStack extends Stack {

  /**
   * Users of the platform
   * We will store the following information about users:
   * * Username: National ID of the user.
   * * Age: Age range of the patient.
   */
  public readonly authModule: Auth;

  /**
   * Stores profiles of users. Data may vary due to profile role.
   */
  public readonly profilesTable: Table;

  /**
   * Bucket holding patients data
   */
  public readonly profilesBucket: Bucket;

  /**
   * Website for patients to start tracking their symptoms
   */
  public readonly endCustomerWebUi: WebUI;

  /**
   * Provides DNS record sets for applications and systems
   */
  public readonly recordSets: RecordSets;

  constructor(scope: Construct, id: string, props: MainProps) {
    super(scope, id, props);

    new CfnOutput(this, 'AwsAccountId', { value: Aws.ACCOUNT_ID });
    new CfnOutput(this, 'AwsRegion', { value: Aws.REGION });

    this.authModule = new Auth(this, 'AuthModule');

    // Define patients table
    this.profilesTable = new Table(this, 'PatientsTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'ProfileId',
        type: AttributeType.STRING
      },
      serverSideEncryption: true
    });

    new CfnOutput(this, 'ProfilesTableName', { value: this.profilesTable.tableName });

    // Define data bucket
    this.profilesBucket = new Bucket(this, 'DataBucket');

    // Define web ui
    this.endCustomerWebUi = new WebUI(this, 'PatientsWebUi', {
      acmCertificateArn: props.acmCertificateArn,
      aliases: [
        props.patientsDomainName,
        `www.${props.patientsDomainName}`
      ]
    });

    this.recordSets = new RecordSets(this, 'RecordSets', {
      appDomainName: props.patientsDomainName,
      webUi: this.endCustomerWebUi,
      zoneId: props.zoneId
    });

    // Authorize everyone to register
    this.authModule.unauthenticatedRole.addToPolicy(new PolicyStatement({
      actions: [
        'dynamodb:PutItem'
      ],
      resources: [
        this.profilesTable.tableArn
      ]
    }));
  }
}
