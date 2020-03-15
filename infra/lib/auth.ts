import { Construct, Aws, Token, CfnOutput, Lazy, Intrinsic } from '@aws-cdk/core';
import { CfnUserPool, CfnUserPoolClient, CfnIdentityPool, CfnIdentityPoolRoleAttachment } from '@aws-cdk/aws-cognito';
import { Role, FederatedPrincipal, PolicyStatement } from '@aws-cdk/aws-iam';

export interface AuthProps {
  /**
   * The name of the user pool
   */
  userPoolName?: string;

  /**
   * Password policy for your users
   */
  passwordPolicy?: AuthPasswordPolicy;
}

export interface AuthPasswordPolicy {
  /**
   * Minimum length for the password
   * @default 8
   */
  minPasswordLength: number;

  /**
   * Password must have lowercase characters
   * @default true
   */
  requireLowercaseChars: boolean;

  /**
   * Password must have uppercase characters
   * @default true
   */
  requireUppercaseChars: boolean;

  /**
   * Password must have digits
   * @default true
   */
  requireDigits: boolean;

  /**
   * Password must have symbols
   * @default false
   */
  requireSymbols: boolean;
}

export class Auth extends Construct {
  
  /** @returns the User Pool */
  public readonly userPool: CfnUserPool;

  /** @returns the default user pool client */
  public readonly defaultClient: CfnUserPoolClient;

  /** @returns the default role for unauthenticated users */
  public readonly unauthenticatedRole: Role;

  /** @returns the default role for authenticated users */
  public readonly authenticatedRole: Role;

  /** @returns the default identity pool */
  public readonly identityPool: CfnIdentityPool;

  constructor (scope: Construct, id: string, props?: AuthProps) {
    super(scope, id);

    const awsRegion = Aws.REGION;
    const awsAccountId = Aws.ACCOUNT_ID;

    this.userPool = new CfnUserPool(this, 'Users', {
      userPoolName: props && props.userPoolName ? props.userPoolName : undefined,
      aliasAttributes: ['email'],
      autoVerifiedAttributes: ['email'],
      policies: {
        passwordPolicy: {
          minimumLength: props && props.passwordPolicy && props.passwordPolicy.minPasswordLength ? props.passwordPolicy.minPasswordLength : 8,
          requireLowercase: props && props.passwordPolicy && props.passwordPolicy.requireLowercaseChars ? props.passwordPolicy.requireLowercaseChars : true,
          requireUppercase: props && props.passwordPolicy && props.passwordPolicy.requireUppercaseChars ? props.passwordPolicy.requireUppercaseChars : true,
          requireNumbers: props && props.passwordPolicy && props.passwordPolicy.requireDigits ? props.passwordPolicy.requireDigits : true,
          requireSymbols: props && props.passwordPolicy && props.passwordPolicy.requireSymbols ? props.passwordPolicy.requireSymbols : false,
        }
      },
      schema: [
        {
          attributeDataType: 'String',
          name: 'email',
          required: true
        },
        {
          attributeDataType: 'String',
          name: 'phone_number',
          required: false
        }
      ]
    });

    this.defaultClient = new CfnUserPoolClient(this, 'DefaultClient', {
      clientName: 'default',
      generateSecret: false,
      refreshTokenValidity: 1,
      writeAttributes: [
        'email', 
        'phone_number',
      ],
      userPoolId: this.userPool.ref,
    });

    this.identityPool = new CfnIdentityPool(this, 'Identities', {
      identityPoolName: props && props.userPoolName ? props.userPoolName : undefined,
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.defaultClient.ref,
          providerName: this.userPool.attrProviderName,
        }
      ]
    });

    this.unauthenticatedRole = new Role(this, 'UnauthIdentitiesRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {}, 'sts:AssumeRoleWithWebIdentity')
    });

    this.unauthenticatedRole.addToPolicy(new PolicyStatement({
      resources: [`arn:aws:cognito-identity:${awsRegion}:${awsAccountId}:identitypool/${this.identityPool.ref}`],
      actions: ['mobileanalytics:PutEvents']
    }));

    this.authenticatedRole = new Role(this, 'AuthIdentitiesRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      }, 'sts:AssumeRoleWithWebIdentity')
    });

    this.authenticatedRole.addToPolicy(new PolicyStatement({
      resources: [`arn:aws:cognito-identity:${awsRegion}:${awsAccountId}:identitypool/${this.identityPool.ref}`],
      actions: ['mobileanalytics:PutEvents']
    }));

    // const clientId = new Intrinsic(`!Sub cognito-idp-\$\{AWS::Region\}.amazonaws.com/\$\{${this.userPool.logicalId}\}:\$\{${this.defaultClient.logicalId}\}`);
    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachments', {
      identityPoolId: this.identityPool.ref,
      roles: {
        unauthenticated: this.unauthenticatedRole.roleArn,
        authenticated: this.authenticatedRole.roleArn
      },
      // roleMappings: {
      //   [clientId.toString()]: {
      //     ambiguousRoleResolution: 'AuthenticatedRole',
      //     type: 'Token'
      //   }
      // }
    });

    new CfnOutput(scope, 'AuthUserPoolId', { value: this.userPool.ref });
    new CfnOutput(scope, 'AuthUserPoolClientId', { value: this.defaultClient.ref });
    new CfnOutput(scope, 'AuthIdentityPoolId', { value: this.identityPool.ref });
  }
}