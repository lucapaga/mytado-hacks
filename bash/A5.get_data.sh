#!/bin/bash

. ./00.variables.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})

NR_OF_ZONES=$(jq ". | length" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT})
zone_idx=0

CSV_HEADER="ZONE_ID;ZONE_NAME;LINK_TS;LINK_STATE"
CSV_HEADER="${CSV_HEADER};TEMP_TIMESTAMP;TEMP_VALUE;HUMIDITY_TIMESTAMP;HUMIDITY_VALUE;HEATING_POWER_TIMESTAMP;HEATING_POWER_VALUE"
CSV_HEADER="${CSV_HEADER};OBJECTIVE_TEMP_VALUE;OBJECTIVE_HEATING_VALUE" 
echo ${CSV_HEADER} > ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_CSV}

for aZone in $(seq 1 1 ${NR_OF_ZONES})
do
    echo "Processing zone #${aZone}"
    curl "${TADO_API_HOME_DETAILS_BASE_URI}/${TADO_HOME_ID}/zones/${aZone}/state" \
         -H "Authorization: Bearer ${BEARER_TOKEN}" \
         -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json

    let "zone_idx=aZone-1"
    echo "zone idx = ${zone_idx}"

    CSV_LINE=""

    ZONE_ID=$(jq ".[${zone_idx}].id" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} | sed "s/\"//g")
    ZONE_NAME=$(jq ".[${zone_idx}].name" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} | sed "s/\"//g")
    CSV_LINE="${ZONE_ID};\"${ZONE_NAME}\""

    STATE_TIME=$(date -u +"%FT%T.000Z")
    STATE_VALUE=$(jq ".link.state" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    CSV_LINE="${CSV_LINE};${STATE_TIME};\"${STATE_VALUE}\""

    TEMP_TIME=$(jq ".sensorDataPoints.insideTemperature.timestamp" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    TEMP_CELSIUS=$(jq ".sensorDataPoints.insideTemperature.celsius" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    CSV_LINE="${CSV_LINE};${TEMP_TIME};${TEMP_CELSIUS}"

    HUMID_TIME=$(jq ".sensorDataPoints.humidity.timestamp" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    HUMID_PERC=$(jq ".sensorDataPoints.humidity.percentage" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    CSV_LINE="${CSV_LINE};${HUMID_TIME};${HUMID_PERC}"

    HEAT_PWR_TIME=$(jq ".activityDataPoints.heatingPower.timestamp" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    HEAT_PWR_VALUE=$(jq ".activityDataPoints.heatingPower.percentage" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    CSV_LINE="${CSV_LINE};${HEAT_PWR_TIME};${HEAT_PWR_VALUE}"

    OBJ_TEMP_VALUE=$(jq ".setting.temperature.celsius" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    OBJ_HEAT_VALUE=$(jq ".setting.power" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
    CSV_LINE="${CSV_LINE};${OBJ_TEMP_VALUE};\"${OBJ_HEAT_VALUE}\""

    echo "${CSV_LINE}" >> ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_CSV}
done
