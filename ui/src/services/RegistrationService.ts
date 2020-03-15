import ConfigurationService from './ConfigurationService';
import { AppPersona } from '../model/Enumerations';
import { DynamoDB } from 'aws-sdk';
import Amplify from 'aws-amplify';
import { v4 as uuid } from 'uuid';

export default class RegistrationService {
  private static instance: RegistrationService;

  private readonly profilesTableName: string;
  private readonly region: string;
  private readonly config: ConfigurationService;

  constructor () {
    this.profilesTableName = this.config.get('PROFILES_TABLE_NAME');
    this.region = this.config.get('AWS_REGION');
  }

  async register (role: AppPersona, data: any): Promise<boolean> {
    const credentials = await Amplify.Auth.currentUserCredentials
    
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
          ProfileId: uuid()
        }
      }).promise();
    } catch (e) {
      console.error('An error occurred');
      console.error(e);
      return false;
    }

    return true;
  }

  static getInstance () {
    if (!RegistrationService.instance) RegistrationService.instance = new RegistrationService()
    return RegistrationService.instance
  }
}
