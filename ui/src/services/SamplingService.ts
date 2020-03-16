import ConfigurationService from './ConfigurationService';
import Amplify from 'aws-amplify';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import { Sample } from '../model/Sample';

export default class SamplingService {
  private static instance: SamplingService;
  
  private readonly config: ConfigurationService;
  private readonly samplingTableName: string;
  private readonly region: string;

  constructor () {
    this.config = ConfigurationService.getInstance();
    this.samplingTableName = this.config.get('SAMPLING_TABLE_NAME');
    this.region = this.config.get('AWS_REGION');
  }

  async mySamples (): Promise<Sample[] | null> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;
    
    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      const result = await ddb.query({
        TableName: this.samplingTableName,
        KeyConditionExpression: 'UserId = :id',
        ExpressionAttributeValues: {
          ':id': UserId
        }
      }).promise();

      if (result.Items) {
        return result.Items as Sample[];
      }
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return null;
    }

    return null;
  }

  async putSample (Item: Sample): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;

    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      await ddb.put({
        TableName: this.samplingTableName,
        Item: {
          UserId,
          CreationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          ...Item
        }
      }).promise();
      return true;
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return false;
    }
  }

  static getInstance () {
    if (!SamplingService.instance) SamplingService.instance = new SamplingService()
    return SamplingService.instance
  }
}
