#!/bin/bash

. ./00.variables.sh

DO_EXECUTE_CURLZ=true
CURL_VERBOSITY=-v #verbose
#CURL_VERBOSITY=-s #silent

# ----- [ MANDATORY ] -----
OVERLAY_COMMAND=${1}
HOME_ID=${2}
ZONE_ID=${3}

# ----- [ OPTIONAL ] -----
MANUAL_TEMPLATE_JSON=${4}
MANUAL_TEMPERATURE_CELSIUS=${5}
MANUAL_TEMPERATURE_FAHRENHEIT=${6}
MANUAL_DURATION_S=${7}
EXPIRATION_TIMESTAMP=${8}
REMAINING_TIME_S=${9}
PROJECTED_EXPIRATION_TIMESTAMP=${10}

SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

if [[ ${HOME_ID} -le 0 || ${ZONE_ID} -le 0 ]]
then
    echo "*** ERROR: invalid HOME (${HOME_ID}) or ZONE (${ZONE_ID}) values"
    exit 127
fi

if [ "${OVERLAY_COMMAND}" == "SET" ]
then
    if [ ! -f ${MANUAL_TEMPLATE_JSON} ]
    then
        echo "*** ERROR: template file not found (${MANUAL_TEMPLATE_JSON})"
        exit 127
    fi

    echo "Setting overlay on HOME ${HOME_ID}, ZONE ${ZONE_ID}"

    if [ "${EXPIRATION_TIMESTAMP}" == "" ]
    then
        EXPIRATION_TIMESTAMP=$(date -u --date="+${MANUAL_DURATION_S} seconds" +"%FT%TZ")
        PROJECTED_EXPIRATION_TIMESTAMP=${EXPIRATION_TIMESTAMP}
        let "REMAINING_TIME_S=MANUAL_DURATION_S-1"
    fi 

    echo "Parameters:"
    echo " - TEMP       (C): ${MANUAL_TEMPERATURE_CELSIUS}"
    echo " - TEMP       (F): ${MANUAL_TEMPERATURE_FAHRENHEIT}"
    echo " - DURATON    (S): ${MANUAL_DURATION_S}"
    echo " - EXP       (TS): ${EXPIRATION_TIMESTAMP}"
    echo " - REMAIN. T  (S): ${REMAINING_TIME_S}"
    echo " - PROJECTED (TS): ${PROJECTED_EXPIRATION_TIMESTAMP}"
    echo ""

    export MANUAL_TEMPERATURE_CELSIUS
    export MANUAL_TEMPERATURE_FAHRENHEIT
    export MANUAL_DURATION_S
    export EXPIRATION_TIMESTAMP
    export REMAINING_TIME_S
    export PROJECTED_EXPIRATION_TIMESTAMP

    CURL_COMMAND_PAYLOAD=$(cat ${MANUAL_TEMPLATE_JSON} | envsubst | jq -c .)
    #echo ${CURL_COMMAND_PAYLOAD}

    if [ "${DO_EXECUTE_CURLZ}" == "true" ]
    then
        # -d @${OVERLAY_SETTING_TEMPLATE_FILE_PATH} \
        curl ${CURL_VERBOSITY} \
                -X PUT \
                -H "Authorization: Bearer ${BEARER_TOKEN}" \
                -H "Content-Type: application/json;charset=UTF-8" \
                -d ${CURL_COMMAND_PAYLOAD} \
                -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${TADO_OVERLAY_SET_JSON_RESULT_PREFIX}_${ZONE_ID}_SET_$(date +"%Y%d%m_%H%M%S").json \
                ${TADO_API_HOME_DETAILS_BASE_URI}/${HOME_ID}/zones/${ZONE_ID}/overlay
    fi

elif [ "${OVERLAY_COMMAND}" == "UNSET" ]
then
    echo "Removing overlay on HOME ${HOME_ID}, ZONE ${ZONE_ID}"

    if [ "${DO_EXECUTE_CURLZ}" == "true" ]
    then
        curl ${CURL_VERBOSITY} \
                -X DELETE \
                -H "Authorization: Bearer ${BEARER_TOKEN}" \
                -o ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}_${TADO_OVERLAY_SET_JSON_RESULT_PREFIX}_${ZONE_ID}_UNSET_$(date +"%Y%d%m_%H%M%S").json \
                ${TADO_API_HOME_DETAILS_BASE_URI}/${TADO_HOME_ID}/zones/${TH_ZONE}/overlay
    fi
else
    echo "*** ERROR: unrecognized command ('${OVERLAY_COMMAND}'), use 'SET' or 'UNSET' only"
    exit 127
fi

