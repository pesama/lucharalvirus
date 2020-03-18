import ConfigurationService from './ConfigurationService';
import Amplify from 'aws-amplify';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

export default class AssistanceService {
  private static instance: AssistanceService;
  
  private readonly config: ConfigurationService;
  private readonly assistanceTableName: string;
  private readonly assistanceAssignmentsTableName: string;
  private readonly region: string;

  constructor () {
    this.config = ConfigurationService.getInstance();
    this.assistanceTableName = this.config.get('ASSISTANCE_TABLE_NAME');
    this.assistanceAssignmentsTableName = this.config.get('ASSISTANCE_ASSIGNMENTS_TABLE_NAME');
    this.region = this.config.get('AWS_REGION');
  }

  async assignRequest (request: any): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;

    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      await ddb.put({
        TableName: this.assistanceAssignmentsTableName,
        Item: {
          UserId,
          CreationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          AssistanceId: request.UniqueKey
        }
      }).promise();
      return true;
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return false;
    }
  }

  async finishRequest (request: any, feedback?: string): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;

    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      await ddb.update({
        TableName: this.assistanceTableName,
        Key: {
          UserId,
          CreationDate: request.CreationDate
        },
        UpdateExpression: 'set #status = :status, RequestorFeedback = :feedback',
        ExpressionAttributeNames: {
          '#status': 'Status'
        },
        ExpressionAttributeValues: {
          ':status': 'fulfilled',
          ':feedback': feedback || ''
        }
      }).promise();
      return true;
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return false;
    }
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

  async nearbyRequests (PostalCode: string) {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;
    const City = attrs.attributes.address;
    
    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {

      // Attempt by Postal code
      const result = await ddb.query({
        TableName: this.assistanceTableName,
        IndexName: 'ByPostalCode',
        KeyConditionExpression: 'PostalCode = :postalCode',
        ExpressionAttributeValues: {
          ':postalCode': PostalCode
        }
      }).promise();

      if (result.Items && result.Items.length) {
        return result.Items as any[];
      } else {
        // Attempt by City
        const result = await ddb.query({
          TableName: this.assistanceTableName,
          IndexName: 'ByCity',
          KeyConditionExpression: 'City = :city',
          ExpressionAttributeValues: {
            ':city': City
          }
        }).promise();

        if (result.Items) {
          return result.Items as any[];
        } else {
          return []
        }
      }
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return null;
    }
  }

  async requestAssistance (Request: string, Address: any): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const UserId = attrs.id;
    const City = attrs.attributes.address;
    const PostalCode = Address.PostalCode.long_name

    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });


    // Extract city and postal code to use for filtering
    try {
      await ddb.put({
        TableName: this.assistanceTableName,
        Item: {
          UserId,
          CreationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          Address,
          City,
          PostalCode,
          Request,
          Status: 'requested',
          UniqueKey: uuid()
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
