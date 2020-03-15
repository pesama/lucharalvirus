#!/bin/bash
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
project_dir="${script_dir}/.."
ui_dir="$project_dir/ui"

source ${script_dir}/config.sh

echo "INFO: Starting UI delivery"

echo "INFO: Building app"
bash $script_dir/configure-ui.sh
cd $ui_dir
npm run build -- --force # FIXME or die

echo "INFO: Copying assets"
aws s3 cp --recursive $ui_dir/dist/ s3://$website_bucket_name/

echo "INFO: Delivery done"