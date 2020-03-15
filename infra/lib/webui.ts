import { CloudFrontWebDistribution, OriginAccessIdentity, PriceClass, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { PolicyStatement, CanonicalUserPrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, Aws, CfnOutput, Duration } from '@aws-cdk/core';

export interface WebUIProps {
  /**
   * Name of the CloudFront deployment
   */
  deploymentName?: string;

  /**
   * Aliases for accessing your distribution
   */
  aliases: string[];

  /**
   * Certificate to use. Required if using aliases
   */
  acmCertificateArn: string
}

export class WebUI extends Construct {
  
  /** @returns the website bucket */
  public readonly websiteBucket: Bucket;

  /** @returns the website distribution */
  public readonly websiteDistribution: CloudFrontWebDistribution;

  /** @returns the website origin access identity */
  public readonly websiteOAI: OriginAccessIdentity;

  constructor(scope: Construct, id: string, props: WebUIProps) {
    super(scope, id);

    // Create the OAI
    const comment = props.deploymentName || `Cloudmod deployment, simple-web-ui module.`;
    this.websiteOAI = new OriginAccessIdentity(this, 'WebsiteOAI', {
      comment
    });

    // Create the S3 bucket
    this.websiteBucket = new Bucket(this, 'WebsiteBucket');

    // Configure the bucket policy
    this.websiteBucket.addToResourcePolicy(new PolicyStatement({
      principals: [new CanonicalUserPrincipal(this.websiteOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      actions: [
        's3:GetObject',
        's3:ListBucket'
      ],
      resources: [
        this.websiteBucket.bucketArn,
        this.websiteBucket.arnForObjects('*')
      ]
    }));

    this.websiteDistribution = new CloudFrontWebDistribution(this, 'WebsiteDistribution', {
      aliasConfiguration: {
        acmCertRef: props.acmCertificateArn,
        names: props.aliases
      },
      priceClass: PriceClass.PRICE_CLASS_100,
      originConfigs: [{
        behaviors: [{
          minTtl: Duration.seconds(0),
          defaultTtl: Duration.seconds(5),
          maxTtl: Duration.seconds(5),
          isDefaultBehavior: true
        }],
        s3OriginSource: {
          s3BucketSource: this.websiteBucket,
          originAccessIdentity: this.websiteOAI,
        }
      }],
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      defaultRootObject: 'index.html',
      errorConfigurations: [{
        errorCode: 404,
        responseCode: 200,
        responsePagePath: '/'
      }]
    });

    // Configure output
    new CfnOutput(scope, 'WebUIBucketName', { value: this.websiteBucket.bucketName });
    new CfnOutput(scope, 'WebUIDomainName', { value: this.websiteDistribution.domainName });
  }
}