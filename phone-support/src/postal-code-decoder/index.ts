import {} from 'aws-sdk'
import data from './data';

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

export interface DataAddress {
  PostalCode: number;
  City: string;
  State: string;
}

export const handler = async (event: Event) => {
  console.log('Starting postal code decoding');

  // TODO Register interaction

  const PostalCode = event.Details.ContactData.Attributes.PostalCode;
  console.log(`Input value: ${PostalCode}`);

  const parsedCode = `${parseInt(PostalCode)}`;
  if (parsedCode.length > 5) {
    console.log('Code length is invalid')
    throw new Error('INVALID_CODE_LENGTH');
  }

  console.log(`Fetching mapping item`);
  const addressItem = data.filter((item: DataAddress) => item.PostalCode === parseInt(PostalCode))[0];

  if (!addressItem) {
    console.error('Address cannot be found with given code')
    return {
      City: 'UNKNOWN',
      State: 'UNKNOWN'
    };
  }

  const { City, State } = addressItem;
  console.log(`Customer is calling from ${City}, ${State}`);

  return {
    City, State
  }
};
