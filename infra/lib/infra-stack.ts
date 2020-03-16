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
   * Stores samples of affected users, for condition monitoring.
   */
  public readonly samplingTable: Table;

  /**
   * Stores assistance requests by customers in risk profiles
   */
  public readonly assistanceTable: Table;

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

    // Define profiles table
    this.profilesTable = new Table(this, 'PatientsTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'ProfileId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'CreationDate',
        type: AttributeType.STRING
      },
      serverSideEncryption: true
    });

    new CfnOutput(this, 'ProfilesTableName', { value: this.profilesTable.tableName });

    // Define patients table
    this.assistanceTable = new Table(this, 'AssistanceTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'UserId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'CreationDate',
        type: AttributeType.STRING
      },
      serverSideEncryption: true
    });

    // Allow assistance table to be queried by city or PostalCode
    this.assistanceTable.addGlobalSecondaryIndex({
      indexName: 'ByCity',
      partitionKey: {
        name: 'City',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'UniqueKey',
        type: AttributeType.STRING
      }
    });

    this.assistanceTable.addGlobalSecondaryIndex({
      indexName: 'ByPostalCode',
      partitionKey: {
        name: 'PostalCode',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'UniqueKey',
        type: AttributeType.STRING
      }
    });

    new CfnOutput(this, 'AssistanceTableName', { value: this.assistanceTable.tableName });

    // Define sampling table
    this.samplingTable = new Table(this, 'SamplingTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'UserId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'CreationDate',
        type: AttributeType.STRING
      },
      serverSideEncryption: true
    });

    new CfnOutput(this, 'SamplingTableName', { value: this.samplingTable.tableName });

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
    this.authModule.authenticatedRole.addToPolicy(new PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:Query'
      ],
      resources: [
        this.profilesTable.tableArn
      ],
      conditions: {
        'ForAllValues:StringEquals': {
          'dynamodb:LeadingKeys': [
            '${cognito-identity.amazonaws.com:sub}'
          ]
        }
      }
    }));

    // Authorize users to request assistance
    this.authModule.authenticatedRole.addToPolicy(new PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:Query'
      ],
      resources: [
        this.assistanceTable.tableArn
      ],
      conditions: {
        'ForAllValues:StringEquals': {
          'dynamodb:LeadingKeys': [
            '${cognito-identity.amazonaws.com:sub}'
          ]
        }
      }
    }));

    // Authorize users to query assistance
    this.authModule.authenticatedRole.addToPolicy(new PolicyStatement({
      actions: [
        'dynamodb:Query',
      ],
      resources: [
        `${this.assistanceTable.tableArn}/index/ByCity`,
        `${this.assistanceTable.tableArn}/index/ByPostalCode`
      ]
    }));

    // Authorize users to provide samples
    this.authModule.authenticatedRole.addToPolicy(new PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:Query'
      ],
      resources: [
        this.samplingTable.tableArn
      ],
      conditions: {
        'ForAllValues:StringEquals': {
          'dynamodb:LeadingKeys': [
            '${cognito-identity.amazonaws.com:sub}'
          ]
        }
      }
    }));
  }
}
