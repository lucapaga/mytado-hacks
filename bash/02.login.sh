#!/bin/bash

. ./00.variables.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})

echo "Running into session ${SESSION_NAME}"

echo "Logging in. username: >${MYTADO_USERNAME}<, password: >${MYTADO_PASSWORD}<"

curl -s "${OAUTH_URI}" \
     -d client_id=${OAUTH_CLIENT_ID} \
     -d grant_type=${OAUTH_GRANT_TYPE_LOGIN} \
     -d scope=${OAUTH_SCOPE} \
     -d username="${MYTADO_USERNAME}" \
     -d password="${MYTADO_PASSWORD}" \
     -d client_secret=${OAUTH_CLIENT_SECRET} \
     -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_LOGIN_JSON_RESULT}

jq .access_token ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_LOGIN_JSON_RESULT} | sed "s/\"//g" > ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN}
jq .refresh_token ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_LOGIN_JSON_RESULT} | sed "s/\"//g" > ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_REFRESH_TOKEN}
