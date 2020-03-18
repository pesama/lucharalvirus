import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

export interface Event {
  Details: {
    ContactData: {
      Attributes: { [key: string]: any },
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

const profilesTableName = process.env.PROFILES_TABLE_NAME!;
const symptomsTableName = process.env.SYMPTOMS_TABLE_NAME!;

const ddb = new DynamoDB.DocumentClient();
export const handler = async (event: Event) => {
  console.log('Starting profile verifier function');
  
  const ProfileId = event.Details.ContactData.CustomerEndpoint.Address;
  const Channel = event.Details.ContactData.Channel;

  console.log('Determining if profile already exists');

  const profileResponse = await ddb.get({
    TableName: profilesTableName,
    Key: {
      ProfileId
    }
  }).promise();

  let existingProfile = false;
  if (profileResponse.Item) {
    console.log('Profile already exists');
    existingProfile = true;

    console.log('Fetching previous symptoms reports');
    const symptomsResponse = await ddb.query({
      TableName: symptomsTableName,
      KeyConditionExpression: 'ProfileId = :profileId',
      ExpressionAttributeValues: {
        ':profileId': ProfileId
      }
    }).promise();

    const previousSymptomsData = symptomsResponse.Items;
    if (!previousSymptomsData || !previousSymptomsData.length) {
      console.log('There are no previous symptoms reports');

      // TODO Report why there is no data - there should as flow guides you through it just after profile creation
      return {
        UserType: 'no-data'
      }
    } else {
      console.log(`There are ${previousSymptomsData.length} previous symptoms reports`);

      const sortedSymptoms = previousSymptomsData.sort((a, b) => new Date(a.CreationDate) < new Date(b.CreationDate) ? 1 : -1);
      const lastSymptomsReport = sortedSymptoms[0]

      const reportDate = new Date(lastSymptomsReport.CreationDate);
      const alreadyAffected = lastSymptomsReport.Affected;

      const now = Date.now();
      const diff = now - reportDate.getTime();
      const diffInHours = Math.round(diff / 3600000);

      if (alreadyAffected) {
        console.log(`User already reported affected ${moment(reportDate).fromNow()}.`);

        return {
          UserType: 'affected',
          LastReportHoursAgo: diffInHours
        }
      } else {
        if (diffInHours < 8) {
          console.log('Last report is still too recent.');
          const nextReportHours = 12 - diffInHours
          return {
            UserType: 'too-early',
            NextReportInHours: nextReportHours
          }
        } else if (diffInHours > 14) {
          console.log('Last report was too long ago');
          return {
            UserType: 'too-late',
            LastReportHoursAgo: diffInHours
          }
        } else {
          console.log('Last report is within time bounds');
          return {
            UserType: 'existing',
            LastReportHoursAgo: diffInHours
          }
        }
      }
    }
  } 

  return {
    UserType: 'new'
  };
};
