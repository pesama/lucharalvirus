import { DynamoDB } from 'aws-sdk'
import moment from 'moment';

export interface Event {
  Details: {
    ContactData: {
      Attributes: Symptoms,
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

export interface Symptoms {
  ShortnessOfBreath?: 'true' | boolean;
  Fever?: 'true' | boolean;
  Cough?: 'true' | boolean;
  ContactWithPositivePatient?: 'true' | boolean;
  MusclePain?: 'true' | boolean;
  Discomfort?: 'true' | boolean;
}

const symptomsTableName = process.env.SYMPTOMS_TABLE_NAME!;

const ddb = new DynamoDB.DocumentClient()
export const handler = async (event: Event) => {
  console.log('Starting symptom registration function');

  const ProfileId = event.Details.ContactData.CustomerEndpoint.Address;
  const Channel = event.Details.ContactData.Channel;
  const Symptoms = Object.keys(event.Details.ContactData.Attributes)
    .filter(key => [
      'ShortnessOfBreath',
      'Fever',
      'Cough',
      'ContactWithPositivePatient',
      'MusclePain',
      'Discomfort'
    ].indexOf(key) !== -1)
    .filter(key => (event.Details.ContactData.Attributes as any)[key] === 'true');
  const CreationDate = moment().format('YYYY-MM-DD HH:mm:ss');

  let Affected = false;
  // TODO Modify algorithm
  console.log('Calculating veredict');
  const parsedSymptoms: Symptoms = Symptoms
    .map(symptom => ({ [symptom]: true }))
    .reduce((t, i) => ({ ...t, ...i }), {});

  if (

    // Symptoms-based
    (parsedSymptoms.ShortnessOfBreath &&
    parsedSymptoms.Fever && 
    parsedSymptoms.Cough)
    || // or
    // Contact-based
    (parsedSymptoms.ContactWithPositivePatient)
  ) {
    // Possibly affected. Do something
    Affected = true
  }

  console.log('Storing symptoms information');
  try {
    await ddb.put({
      TableName: symptomsTableName,
      Item: {
        ProfileId,
        Channel,
        Symptoms,
        CreationDate,
        Affected
      }
    }).promise();

    console.log('Symptoms stored')
  } catch(e) {
    console.error('Something failed storing the symptoms');
    console.error(e);
    throw e;
  }

  console.log(`Patient ${Affected ? 'is' : 'is not'} affected`);
  return {
    AffectionResult: Affected ? 'affected' : 'not-affected'
  }
};
