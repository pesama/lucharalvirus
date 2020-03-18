import { DynamoDB, CognitoIdentityServiceProvider, SNS } from 'aws-sdk'

const assistanceTableName = process.env.ASSISTANCE_TABLE_NAME!;
const profilesTableName = process.env.PROFILES_TABLE_NAME!;
const UserPoolId = process.env.USER_POOL_ID!;

const ddb = new DynamoDB.DocumentClient();
const cognito = new CognitoIdentityServiceProvider();
const sns = new SNS();

export interface Event {
  Records: AssignmentRecord[];
}

export interface AssignmentRecord {
  eventID: string;
  eventName: string,
  dynamodb: {
    ApproximateCreationDateTime: Date;
    Keys: {
      UserId: {
        S: string;
      },
      AssistanceId: {
        S: string;
      }
    },
    NewImage: any
  }
}

export const handler = async (event: Event) => {
  console.log('Initialising assistance assignment function');

  const records = event.Records.filter(record => record.eventName === 'INSERT');
  console.log(`There are ${records.length} records to process`);

  const results = await Promise.all(records.map(async record => {
    const volunteerId = record.dynamodb.Keys.UserId.S;
    const assignmentId = record.dynamodb.Keys.AssistanceId.S;

    console.log(`Assignment ID: ${assignmentId}`);

    console.log('Fetching assignment information');
    const assignment = await ddb.query({
      TableName: assistanceTableName,
      IndexName: 'ByUniqueKey',
      KeyConditionExpression: 'UniqueKey = :assignmentId',
      ExpressionAttributeValues: {
        ':assignmentId': assignmentId
      }
    }).promise();

    if (!assignment || !assignment.Items || !assignment.Items.length) {
      console.error(`Failed to find assignment with id ${assignmentId}`);
      throw new Error('INVALID_ASSIGNMENT_ID');
    }

    const realAssignment = assignment.Items[0];
    const requestorId = realAssignment.UserId;
    
    console.log(`Requestor is ${requestorId}. Fetching information`);
    const requestorResponse = await ddb.query({
      TableName: profilesTableName,
      KeyConditionExpression: 'ProfileId = :requestorId',
      ExpressionAttributeValues: {
        ':requestorId': requestorId
      }
    }).promise();
    const requestorData = requestorResponse.Items![0];

    console.log(`Volunteer ID is ${volunteerId}. Fetching volunteer information`);
    const volunteerResponse = await ddb.query({
      TableName: profilesTableName,
      KeyConditionExpression: 'ProfileId = :volunteerId',
      ExpressionAttributeValues: {
        ':volunteerId': volunteerId
      }
    }).promise();
    const volunteerData = volunteerResponse.Items![0];

    const requestorSub = requestorData.UserId;
    const volunteerSub = volunteerData.UserId;

    console.log(`Requestor sub: ${requestorSub}`);
    console.log(`Volunteer sub: ${volunteerSub}`);

    console.log('Fetching actors contact data');
    const contacts = await Promise.all([requestorSub, volunteerSub].map(async sub => 
      await cognito.adminGetUser({
        UserPoolId,
        Username: sub
      }).promise()
    ));

    const requestorName = contacts[0].UserAttributes!.filter(a => a.Name === 'name')[0].Value;
    const requestorPhone = contacts[0].UserAttributes!.filter(a => a.Name === 'phone_number')[0].Value;
    const volunteerName = contacts[1].UserAttributes!.filter(a => a.Name === 'name')[0].Value;
    const volunteerPhone = contacts[1].UserAttributes!.filter(a => a.Name === 'phone_number')[0].Value;
    
    const assignmentDescription = realAssignment.Request;
    const requestorMessage = `${volunteerName} ha decidido ayudarte! Se pondrá en contacto contigo pronto. Su número es ${volunteerPhone}.`;
    const volunteerMessage = `Gracias por ayudar a ${requestorName} a ${assignmentDescription}. Por favor, ponte en contacto en el número ${requestorPhone}.`

    console.log('Sending messages');
    await sns.publish({
      PhoneNumber: volunteerPhone,
      Message: volunteerMessage
    }).promise();

    await sns.publish({
      PhoneNumber: requestorPhone,
      Message: requestorMessage
    }).promise();

    console.log('Updating assistance request');
    const result = await ddb.update({
      TableName: assistanceTableName,
      Key: {
        UserId: requestorId,
        CreationDate: realAssignment.CreationDate
      },
      UpdateExpression: 'set #status = :newStatus, AssigneeName = :volunteerName',
      ExpressionAttributeNames: {
        '#status': 'Status'
      },
      ExpressionAttributeValues: {
        ':newStatus': 'routed',
        ':volunteerName': volunteerName
      }
    }).promise();

    console.log('Finished processing record');

    return true;
  }));

  return true;
};
