#!/bin/bash
. ./00.variables.sh

CSV_FILE_PATH=${WORKDIR}/${MONITOR_CSV}
CSV1L_FILE_PATH=${WORKDIR}/${MONITOR_CSV1L}

sensingTs=$(date -u +"%FT%T.000Z")
CSV_HEADER="SENSING_TS"
CSV_LINE_DATA="${sensingTs}"

echo "Creating session and logging in"
./01.create_session.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})

./02.login.sh
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

echo "Getting 'Configurations' (Profile, Home, Zones)"
./A1.profile.sh
./A2.home_details.sh
./A3.zones.sh
TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})
TADO_HOME_NAME=$(jq .homes[0].name ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PROFILE_JSON_RESULT})
NR_OF_ZONES=$(jq ". | length" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT})

CSV_HEADER="${CSV_HEADER};TADO_HOME_ID;TADO_HOME_NAME"
CSV_LINE_DATA="${CSV_LINE_DATA};${TADO_HOME_ID};${TADO_HOME_NAME}"

CSV_HEADER="${CSV_HEADER};NR_OF_ZONES"
CSV_LINE_DATA="${CSV_LINE_DATA};${NR_OF_ZONES}"

echo "Retrieving current weather data"
./A4.weather.sh
WEATHER_SOLAR_INTENSITY=$(jq .solarIntensity.percentage ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_WEATHER_JSON_RESULT})
WEATHER_OUTSIDE_TEMP=$(jq .outsideTemperature.celsius ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_WEATHER_JSON_RESULT})
WEATHER_STATE=$(jq .weatherState.value ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_WEATHER_JSON_RESULT})

CSV_HEADER="${CSV_HEADER};W_SOLAR_INTENSITY;W_OUTSIDE_TEMP;W_STATE"
CSV_LINE_DATA="${CSV_LINE_DATA};${WEATHER_SOLAR_INTENSITY};${WEATHER_OUTSIDE_TEMP};\"${WEATHER_STATE}\""

echo "Retrieving Sensor Data"
./A5.get_data.sh

CSV_HEADER_1L="${CSV_HEADER}"
CSV_LINE_DATA_1L="${CSV_LINE_DATA}"

ZONE_LIST=$(jq "[.[].id] | sort" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} | jq .[]) 
#ZONE_LIST=$(seq 1 1 ${NR_OF_ZONES})
if [ $# -gt 0 ]
then
    ZONE_LIST=$*
fi

CSV_HEADER="${CSV_HEADER};ZONE_ID;LINK;TEMP_TS;TEMP_VALUE;HUMID_TS;HUMID_VALUE;HEAT_PWR_TS;HEAT_PWR_VALUE;TARGET_TEMP_VALUE;TARGET_HEAT_VALUE;OVERLAY_TYPE;OVERLAY_POWER;OVERLAY_TEMP_VALUE;OPEN_WINDOW"

lineCounter=1
for aZone in ${ZONE_LIST}
do
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
            #CSV_LINE="${ZONE_ID};\"${ZONE_NAME}\""
            break
        else
            ZONE_ID=-1
            ZONE_ID="NOT_FOUND"
        fi
    done

    if [ ${ZONE_ID} -lt 0 ]
    then
        echo "Unable to elaborate data for zone ID=${aZone}"
    else
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA}"

        echo "Elaborating zone ID=${aZone}"
        CSV_1L_ZONE_PREFIX=ZONE_${ZONE_ID}

        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_ID;${CSV_1L_ZONE_PREFIX}_NAME"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};${ZONE_ID};\"${ZONE_NAME}\""
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};${ZONE_ID};\"${ZONE_NAME}\""

        STATE_VALUE=$(jq ".link.state" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_LINK"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};\"${STATE_VALUE}\""
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};\"${STATE_VALUE}\""

        TEMP_TIME=$(jq ".sensorDataPoints.insideTemperature.timestamp" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        TEMP_CELSIUS=$(jq ".sensorDataPoints.insideTemperature.celsius" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_TEMP_TS;${CSV_1L_ZONE_PREFIX}_TEMP_VALUE"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};${TEMP_TIME};${TEMP_CELSIUS}"
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};${TEMP_TIME};${TEMP_CELSIUS}"

        HUMID_TIME=$(jq ".sensorDataPoints.humidity.timestamp" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        HUMID_PERC=$(jq ".sensorDataPoints.humidity.percentage" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_HUMID_TS;${CSV_1L_ZONE_PREFIX}_HUMID_VALUE"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};${HUMID_TIME};${HUMID_PERC}"
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};${HUMID_TIME};${HUMID_PERC}"

        HEAT_PWR_TIME=$(jq ".activityDataPoints.heatingPower.timestamp" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        HEAT_PWR_VALUE=$(jq ".activityDataPoints.heatingPower.percentage" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_HEAT_PWR_TS;${CSV_1L_ZONE_PREFIX}_HEAT_PWR_VALUE"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};${HEAT_PWR_TIME};${HEAT_PWR_VALUE}"
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};${HEAT_PWR_TIME};${HEAT_PWR_VALUE}"

        OBJ_TEMP_VALUE=$(jq ".setting.temperature.celsius" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        OBJ_HEAT_VALUE=$(jq ".setting.power" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json | sed "s/\"//g")
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_TARGET_TEMP_VALUE;${CSV_1L_ZONE_PREFIX}_TARGET_HEAT_VALUE"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};${OBJ_TEMP_VALUE};\"${OBJ_HEAT_VALUE}\""
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};${OBJ_TEMP_VALUE};\"${OBJ_HEAT_VALUE}\""

        OVERLAY_TYPE=$(jq -r ".overlay.type" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json)
        OVERLAY_POWER=$(jq -r ".overlay.setting.power" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json)
        OVERLAY_TEMPERATURE=$(jq -r ".overlay.setting.temperature.celsius" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json)
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_OVERLAY_TYPE;${CSV_1L_ZONE_PREFIX}_OVERLAY_POWER;${CSV_1L_ZONE_PREFIX}_OVERLAY_TEMP_VALUE"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};\"${OVERLAY_TYPE}\";\"${OVERLAY_POWER}\";${OVERLAY_TEMPERATURE}"
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};\"${OVERLAY_TYPE}\";\"${OVERLAY_POWER}\";${OVERLAY_TEMPERATURE}"

        OPEN_WINDOW="null"
        #OPEN_WINDOW=$(jq -r ".overlay.type" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${aZone}.json)
        CSV_HEADER_1L="${CSV_HEADER_1L};${CSV_1L_ZONE_PREFIX}_OPEN_WINDOW"
        CSV_LINE_DATA_ZONEDATA="${CSV_LINE_DATA_ZONEDATA};\"${OPEN_WINDOW}\""
        CSV_LINE_DATA_1L="${CSV_LINE_DATA_1L};\"${OPEN_WINDOW}\""

        echo "Packing & CSV-ing (${lineCounter}/${NR_OF_ZONES} lines)"
        if [ ! -f ${CSV_FILE_PATH} ]
        then
            echo ${CSV_HEADER} > ${CSV_FILE_PATH}
        fi
        echo "${CSV_LINE_DATA_ZONEDATA}" >> ${CSV_FILE_PATH}
    fi

    let "lineCounter=lineCounter+1"
done

echo "Packing & CSV-ing (one-line)"
if [ ! -f ${CSV1L_FILE_PATH} ]
then
    echo ${CSV_HEADER_1L} > ${CSV1L_FILE_PATH}
fi
echo "${CSV_LINE_DATA_1L}" >> ${CSV1L_FILE_PATH}


echo "Cleaning-up work dir"
rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}

echo "DONE"