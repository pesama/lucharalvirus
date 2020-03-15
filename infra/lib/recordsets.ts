import { Construct, Duration } from '@aws-cdk/core';
import { IHostedZone, HostedZone, RecordSet, RecordType, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { WebUI } from './webui';

export interface RecordSetProps {
  webUi: WebUI;
  appDomainName: string;
  zoneId: string;
}

export default class RecordSets extends Construct {

  /**
   * Defines the `invest.trade` hosted zone.
   * This zone is not created, but rather imported. 
   * Zone must exist prior deployment, and ID must be provided as environment value
   */
  public readonly lucharAlVirusZone: IHostedZone;

  constructor (scope: Construct, name: string, props: RecordSetProps) {
    super(scope, name);

    this.lucharAlVirusZone = HostedZone.fromHostedZoneId(this, 'lucharAlVirusZone', props.zoneId);

    const appMainRecord = new RecordSet(this, 'AppMainRecord', {
      recordType: RecordType.A,
      target: RecordTarget.fromAlias(new CloudFrontTarget(props.webUi.websiteDistribution)),
      zone: this.lucharAlVirusZone,
      comment: 'Main app record',
      recordName: `${props.appDomainName}.`,
      ttl: Duration.seconds(300)
    });

    const appWwwRecord = new RecordSet(this, 'AppWwwRecord', {
      recordType: RecordType.A,
      target: RecordTarget.fromAlias(new CloudFrontTarget(props.webUi.websiteDistribution)),
      zone: this.lucharAlVirusZone,
      comment: 'WWW app record',
      recordName: `www.${props.appDomainName}.`,
      ttl: Duration.seconds(300)
    });
  }
}