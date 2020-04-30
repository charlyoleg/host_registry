#!/usr/bin/env bash
# generate_keys.sh

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

## go to the script directory
cd $(dirname $0)

## create the key and certificate for ssl
openssl genrsa -out ${KEY_FILENAME} 2018
chmod a-w ${KEY_FILENAME}
chmod go-r ${KEY_FILENAME}
openssl req -new -x509 -nodes -sha256 -days 365 -key ${KEY_FILENAME} -out ${CERT_FILENAME}
