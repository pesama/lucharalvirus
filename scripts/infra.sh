#!/bin/bash
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
project_dir="${script_dir}/.."

# echo "INFO: Preparing infrastructure"

# echo "INFO: Building functions"
# cd $project_dir/functions/src
# for d in */ ; do
#     echo "$d"
#     cd $d
#     npm run build
#     cd ..
# done

source $project_dir/secrets/infra.sh

echo "INFO: Building infra"
cd $project_dir/infra
npm run build

echo "INFO: Deploying"
cdk deploy

echo "INFO: Done"