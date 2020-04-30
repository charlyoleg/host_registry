#!/usr/bin/env bash
# serve_accesslog_report.sh

## key basename
if [ "$1" = "dev" ]; then
  BASENAME='server_dev'
elif [ "$1" = "prod" ]; then
  BASENAME='server_prod'
else
  echo "ERR010: Error, one argument required: 'dev' or 'prod'"
  exit 1
fi

echo "BASENAME: ${BASENAME}"

## filenames
KEY_FILENAME="${BASENAME}.key"
CERT_FILENAME="${BASENAME}.crt"


cd $(dirname $0)/..
pwd

cd hosts/app_accesslog_report

npx http-server dist \
  --port 6101 \
  --username toto \
  --password toto \
  --ssl \
  --cert keys/${CERT_FILENAME} \
  --key keys/${KEY_FILENAME}


