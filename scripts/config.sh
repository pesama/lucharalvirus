#!/bin/bash
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
project_dir="${script_dir}/.."

export STACK_NAME="LucharAlVirus"
export AWS_REGION="eu-west-1"

echo "INFO: Fetching deployment information."
stack_description=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${AWS_REGION})

export aws_account_id=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AwsAccountId") | .OutputValue')
export aws_region=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AwsRegion") | .OutputValue')
export user_pool_id=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AuthUserPoolId") | .OutputValue')
export user_pool_client_id=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AuthUserPoolClientId") | .OutputValue')
export identity_pool_id=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AuthIdentityPoolId") | .OutputValue')
export profiles_table_name=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "ProfilesTableName") | .OutputValue')
export assistance_table_name=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AssistanceTableName") | .OutputValue')
export assistance_assignments_table_name=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AssistanceAssignmentsTableName") | .OutputValue')
export sampling_table_name=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "SamplingTableName") | .OutputValue')
export samples_table_name=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "AssetsTableName") | .OutputValue')
export website_bucket_name=$(echo $stack_description | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "WebUIBucketName") | .OutputValue')
export gmaps_api_key="AIzaSyCIh4fDoXFneNegg49mDgiSZvJC9-cs_B0"