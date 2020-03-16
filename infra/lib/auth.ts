import { Construct, Aws, CfnOutput } from '@aws-cdk/core';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient, SignInAliases, VerificationEmailStyle } from '@aws-cdk/aws-cognito';
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
  public readonly userPool: UserPool;

  /** @returns the default user pool client */
  public readonly defaultClient: UserPoolClient;

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

    this.userPool = new UserPool(this, 'Users', {
      userPoolName: props && props.userPoolName ? props.userPoolName : undefined,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        phone: true,
        preferredUsername: false,
        username: false
      },
      userVerification: {
        // emailSubject: 'Verifica tu correo en lucharalvirus.com',
        // emailBody: 'Bienvenido a lucharalvirus.com. Confirma tu correo pulsando en el enlace que te incluímos aquí.',
        // emailStyle: VerificationEmailStyle.LINK,
        smsMessage: 'Tu código de verificación para lucharalvirus.com es {####}'
      }
    });

    this.defaultClient = new UserPoolClient(this, 'DefaultClient', {
      userPoolClientName: 'default',
      generateSecret: false,
      userPool: this.userPool,
    });

    this.identityPool = new CfnIdentityPool(this, 'Identities', {
      identityPoolName: props && props.userPoolName ? props.userPoolName : undefined,
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.defaultClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
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

    new CfnOutput(scope, 'AuthUserPoolId', { value: this.userPool.userPoolId });
    new CfnOutput(scope, 'AuthUserPoolClientId', { value: this.defaultClient.userPoolClientId });
    new CfnOutput(scope, 'AuthIdentityPoolId', { value: this.identityPool.ref });
  }
}