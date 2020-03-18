import { DynamoDB } from 'aws-sdk'
import moment from 'moment';

export interface Event {
  Details: {
    ContactData: {
      Attributes: UserData,
      Channel: "VOICE" | string,
      ContactId: string,
      CustomerEndpoint: {
        Address: string,
        Type: string
      },
      InitialContactId: string,
      InitiationMethod: "INBOUND" | "OUTBOUND" | "TRANSFER" | "CALLBACK",
      InstanceARN: string,
      PreviousContactId: string,
      Queue: string,
      SystemEndpoint: {
        Address: string,
        Type: string
      }
    },
    Parameters: { [key: string]: any }
  },
  Name: string;
}

export interface UserData {
  City: string;
  State: string;
  PostalCode: string;
  BirthYear: string;
}

const profilesTableName = process.env.PROFILES_TABLE_NAME!;

const ddb = new DynamoDB.DocumentClient();
export const handler = async (event: Event) => {
  console.log('Starting profile creation function');

  const data = event.Details.ContactData.Attributes;
  if (!data.City) {
    data.City = 'UNKNOWN'
  }
  if (!data.State) {
    data.State = 'UNKNOWN'
  }

  console.log(`Customer is calling from ${data.City}, in ${data.State} - Postal Code: ${data.PostalCode}`);
  console.log(`Customer is bornt in ${data.BirthYear}`);

  const ProfileId = event.Details.ContactData.CustomerEndpoint.Address;
  const CreationDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const Channel = event.Details.ContactData.Channel;
  console.log(`Triggering profile creation at ${CreationDate}`);

  console.log('Storing customer information');
  try {
    await ddb.put({
      TableName: profilesTableName,
      Item: {
        ProfileId,
        CreationDate,
        Channel,
        City: data.City,
        State: data.State,
        PostalCode: data.PostalCode
      }
    }).promise();

    console.log('Profile stored successfully');
    return {};
  } catch (e) {
    console.error('There was an error storing the profile');
    console.error(e);
    throw e;
  }
};
