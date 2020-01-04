#!/bin/bash

. ./00.variables.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})

ZONE_ID=1

# Current api version (1.6) is now unsupported/unavailable
curl -X POST "https://my.tado.com/mobile/1.6/getTemperaturePlotData" \
     -H "Authorization: Bearer ${BEARER_TOKEN}" \
     -d fromDate=2019-12-24T00:00:00.000Z \
     -d toDate=2019-12-26T00:00:00.000Z \
     -d zoneId=${ZONE_ID} \
     -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PLOTDATA_JSON_RESULT_PREFIX}_${ZONE_ID}.json

