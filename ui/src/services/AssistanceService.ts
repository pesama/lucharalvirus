import ConfigurationService from './ConfigurationService';
import Amplify from 'aws-amplify';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

export default class AssistanceService {
  private static instance: AssistanceService;
  
  private readonly config: ConfigurationService;
  private readonly assistanceTableName: string;
  private readonly region: string;

  constructor () {
    this.config = ConfigurationService.getInstance();
    this.assistanceTableName = this.config.get('ASSISTANCE_TABLE_NAME');
    this.region = this.config.get('AWS_REGION');
  }

  async myRequests (): Promise<any[] | null> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;
    
    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      const result = await ddb.query({
        TableName: this.assistanceTableName,
        KeyConditionExpression: 'UserId = :id',
        ExpressionAttributeValues: {
          ':id': UserId
        }
      }).promise();

      if (result.Items) {
        return result.Items as any[];
      }
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return null;
    }

    return null;
  }

  async requestAssistance (Request: string, Address: any): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;

    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      await ddb.put({
        TableName: this.assistanceTableName,
        Item: {
          UserId,
          CreationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          Address,
          Request,
          Status: 'requested'
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
    if (!AssistanceService.instance) AssistanceService.instance = new AssistanceService()
    return AssistanceService.instance
  }
}
