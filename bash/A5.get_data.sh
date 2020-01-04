#!/bin/bash

. ./00.variables.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})

NR_OF_ZONES=$(jq ". | length" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT})

#CSV_FILE_PATH=${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_CSV}
CSV_FILE_PATH=${WORKDIR}/${TADO_DATA_CSV}

CSV_HEADER="ZONE_ID;ZONE_NAME;LINK_TS;LINK_STATE"
CSV_HEADER="${CSV_HEADER};TEMP_TIMESTAMP;TEMP_VALUE;HUMIDITY_TIMESTAMP;HUMIDITY_VALUE;HEATING_POWER_TIMESTAMP;HEATING_POWER_VALUE"
CSV_HEADER="${CSV_HEADER};OBJECTIVE_TEMP_VALUE;OBJECTIVE_HEATING_VALUE" 

if [ ! -f ${CSV_FILE_PATH} ]
then
    echo ${CSV_HEADER} > ${CSV_FILE_PATH}
fi

ZONE_LIST=$(jq "[.[].id] | sort" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} | jq .[]) 
#ZONE_LIST=$(seq 1 1 ${NR_OF_ZONES})
if [ $# -gt 0 ]
then
    ZONE_LIST=$*
fi

echo "Retrieving data from the following zones: >${ZONE_LIST}<"
#exit 0

#zone_idx=0

for aZone in ${ZONE_LIST}
do
    CSV_LINE=""

    ZONE_ID=-1
    ZONE_ID="NOT_FOUND"

    for aZoneToFind in $(seq 1 1 ${NR_OF_ZONES})
    do
        aZoneToFindIdx=0
        let "aZoneToFindIdx=aZoneToFind-1"
        
        ZONE_ID=$(jq ".[${aZoneToFindIdx}].id" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} | sed "s/\"//g")
        ZONE_NAME=$(jq ".[${aZoneToFindIdx}].name" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} | sed "s/\"//g")

        if [ ${ZONE_ID} -eq ${aZone} ]
        then 
            CSV_LINE="${ZONE_ID};\"${ZONE_NAME}\""
            break
        else
            ZONE_ID=-1
            ZONE_ID="NOT_FOUND"
        fi
    done

    if [ ${ZONE_ID} -lt 0 ]
    then
        echo "Unable to find and fetch data for zone ID=${aZone}"
    else
        echo "Processing zone ID=${ZONE_ID}"

        curl -s "${TADO_API_HOME_DETAILS_BASE_URI}/${TADO_HOME_ID}/zones/${ZONE_ID}/state" \
            -H "Authorization: Bearer ${BEARER_TOKEN}" \
            -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json

        STATE_TIME=$(date -u +"%FT%T.000Z")

        #let "zone_idx=aZone-1"
        #echo "zone idx = ${zone_idx}"

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

        echo "${CSV_LINE}" >> ${CSV_FILE_PATH}
    fi

    #let "zone_idx=zone_idx+1"
done
