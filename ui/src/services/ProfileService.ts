import ConfigurationService from './ConfigurationService';
import { AppPersona } from '../model/Enumerations';
import { DynamoDB } from 'aws-sdk';
import Amplify from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { Profile } from '../model/Profile';
import moment from 'moment';

export default class ProfileService {
  private static instance: ProfileService;

  private readonly profilesTableName: string;
  private readonly region: string;
  private readonly config: ConfigurationService;

  constructor () {
    this.config = ConfigurationService.getInstance();
    this.profilesTableName = this.config.get('PROFILES_TABLE_NAME');
    this.region = this.config.get('AWS_REGION');
  }

  async getProfile (): Promise<Profile[] | null> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const ProfileId = attrs.id;
    
    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      const result = await ddb.query({
        TableName: this.profilesTableName,
        KeyConditionExpression: 'ProfileId = :id',
        ExpressionAttributeValues: {
          ':id': ProfileId
        }
      }).promise();

      if (result.Items) {
        return result.Items as Profile[];
      }
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return null;
    }

    return null;
  }

  async register (role: AppPersona, data: any): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials();
    const attrs = await Amplify.Auth.currentUserInfo();
    const ProfileId = attrs.id;
    const UserId = attrs.attributes.sub;

    delete data.$ready;
    
    const ddb = new DynamoDB.DocumentClient({
      region: this.region,
      credentials
    });

    try {
      await ddb.put({
        TableName: this.profilesTableName,
        Item: {
          ...data,
          Persona: role,
          ProfileId,
          UserId,
          CreationDate: moment().format('YYYY-MM-DD HH:mm:ss')
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
    if (!ProfileService.instance) ProfileService.instance = new ProfileService()
    return ProfileService.instance
  }
}
