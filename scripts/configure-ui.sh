#!/bin/bash
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
project_dir="${script_dir}/.."
dashboard_dir="${project_dir}/ui"

echo "INFO: Configuring UI"

source ${script_dir}/config.sh

echo "INFO: Creating Typescript configuration"
config="export default { \
  \"AWS_ACCOUNT_ID\": \"${aws_account_id}\", \
  \"AWS_REGION\": \"${aws_region}\", \
  \"USER_POOL_ID\": \"${user_pool_id}\", \
  \"USER_POOL_CLIENT_ID\": \"${user_pool_client_id}\", \
  \"IDENTITY_POOL_ID\": \"${identity_pool_id}\", \
  \"PROFILES_TABLE_NAME\": \"${portfolio_service_api_endpoint}\" \
}"

echo "INFO: Writing Typescript configuration"
echo $config > $dashboard_dir/src/assets/config.ts

echo "INFO: Creating AWSMobile config file"
awsmobile="export default { \
    'aws_project_region': '$aws_region', \
    'aws_cognito_identity_pool_id': '$identity_pool_id', \
    'aws_cognito_region': '$aws_region', \
    'aws_user_pools_id': '$user_pool_id', \
    'aws_user_pools_web_client_id': '$user_pool_client_id', \
    'oauth': {}, \
    'aws_dynamodb_all_tables_region': '$aws_region', \
}"

echo "INFO: Writing AWSMobile configuration"
echo $awsmobile > $dashboard_dir/src/assets/awsmobile.ts