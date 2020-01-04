#!/bin/bash

. ./00.variables.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

#EXPORT_DATE=$(date +"%F")
EXPORT_DATE=2019-12-25

TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})

NR_OF_ZONES=$(jq ". | length" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT})

for aZone in $(seq 1 1 ${NR_OF_ZONES})
do
    echo "Processing zone #${aZone}"
    curl -s "${TADO_API_HOME_DETAILS_BASE_URI}/${TADO_HOME_ID}/zones/${aZone}/dayReport?date=${EXPORT_DATE}" \
         -H "Authorization: Bearer ${BEARER_TOKEN}" \
         -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}_${TADO_API_PERZONE_DAYEXPORT_JSON_RESULT_POSTFIX}_$(echo ${EXPORT_DATE} | sed "s/-//g").json

done

