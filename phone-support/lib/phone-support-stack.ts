import { Construct, Stack, StackProps, RemovalPolicy, CfnOutput } from '@aws-cdk/core';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { ServicePrincipal, PolicyStatement } from '@aws-cdk/aws-iam';
import { Table, BillingMode, AttributeType } from '@aws-cdk/aws-dynamodb';

export interface PhoneSupportStackProps extends StackProps {
  connectInstanceArn: string;
}

export class PhoneSupportStack extends Stack {
  /**
   * Function that decodes postal codes into cities and states
   */
  public readonly postalCodeDecoderFunction: Function;

  /**
   * Table for storing information about users
   */
  public readonly profilesTable: Table;

  /**
   * Function that creates profiles out of phone calls
   */
  public readonly profileCreatorFunction: Function;

  /**
   * Table to register patients' symptoms
   */
  public readonly symptomsTable: Table;

  /**
   * Function that registers patients symptoms
   */
  public readonly symptomRegistrationFunction: Function;

  /**
   * Function that verifies the existence of a profile
   */
  public readonly profileVerifierFunction: Function;

  constructor (scope: Construct, name: string, props: PhoneSupportStackProps) {
    super(scope, name, props);

    this.postalCodeDecoderFunction = new Function(this, 'PostalCodeDecoderFunction', {
      code: new AssetCode(`${__dirname}/../src/postal-code-decoder`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_12_X
    });

    // Define profiles table
    this.profilesTable = new Table(this, 'ProfilesTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'ProfileId',
        type: AttributeType.STRING
      },
      serverSideEncryption: true
    });

    new CfnOutput(this, 'ProfilesTableName', { value: this.profilesTable.tableName });

    this.profileCreatorFunction = new Function(this, 'ProfileCreationFunction', {
      code: new AssetCode(`${__dirname}/../src/profile-creation`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_12_X,
      environment: {
        PROFILES_TABLE_NAME: this.profilesTable.tableName
      }
    });

    this.profileCreatorFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        'dynamodb:PutItem'
      ],
      resources: [
        this.profilesTable.tableArn
      ]
    }));

    this.symptomsTable = new Table(this, 'SymptomsTable', {
      removalPolicy: RemovalPolicy.DESTROY,
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

    this.symptomRegistrationFunction = new Function(this, 'SymptomRegistrationFunction', {
      code: new AssetCode(`${__dirname}/../src/symptom-registration`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_12_X,
      environment: {
        PROFILES_TABLE_NAME: this.profilesTable.tableName,
        SYMPTOMS_TABLE_NAME: this.symptomsTable.tableName
      }
    });

    this.symptomRegistrationFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:UpdateItem'
      ],
      resources: [
        this.profilesTable.tableArn,
      ]
    }));

    this.symptomRegistrationFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        'dynamodb:Query',
        'dynamodb:PutItem'
      ],
      resources: [
        this.symptomsTable.tableArn,
      ]
    }));

    this.profileVerifierFunction = new Function(this, 'ProfileVerifier', {
      code: new AssetCode(`${__dirname}/../src/profile-verifier`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_12_X,
      environment: {
        PROFILES_TABLE_NAME: this.profilesTable.tableName,
        SYMPTOMS_TABLE_NAME: this.symptomsTable.tableName
      }
    });

    this.profileVerifierFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        'dynamodb:GetItem'
      ],
      resources: [
        this.profilesTable.tableArn
      ]
    }));

    this.profileVerifierFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        'dynamodb:Query'
      ],
      resources: [
        this.symptomsTable.tableArn
      ]
    }));

    // Apply connection permissions to functions
    const functions: Function[] = [
      this.postalCodeDecoderFunction, 
      this.profileCreatorFunction,
      this.symptomRegistrationFunction,
      this.profileVerifierFunction
    ];

    functions.forEach((fn: Function) => {
      fn.addPermission('Connect', {
        principal: new ServicePrincipal('connect.amazonaws.com'),
        sourceArn: props.connectInstanceArn
      });
    });
  }
}
