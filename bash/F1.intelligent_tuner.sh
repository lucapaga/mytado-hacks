#!/bin/bash

. ./00.variables.sh

THERMOSTAT_ZONE=${1}
if [[ "${THERMOSTAT_ZONE}" == "" || ${THERMOSTAT_ZONE} -le 0 ]]
then
     echo "Thermostat Zone not set, default is 5"
     THERMOSTAT_ZONE=5
fi

R1_ZONE=${2}
if [[ "${R1_ZONE}" == "" || ${R1_ZONE} -le 0 ]]
then
     echo "ROOM 1 Zone not set, default is 2"
     R1_ZONE=2
fi

# --------- [ CONFIGURATIONS ] ---------
TH_ZONE=${THERMOSTAT_ZONE}
OVERLAY_TEMP_CELSIUS=21.00
OVERLAY_TEMP_FAHRENHEIT=69.80
OVERLAY_DURATION=1800

ROOM1_ZONE=${R1_ZONE}
ROOM_TEMPERATURE_MAX_DIFFERENTIAL=100 # 100 = 1 celsius

DO_GET_REAL_DATA=true
DO_CREATE_NEW_SESSION=true

DO_CREATE_OVERLAYS=true
OVERLAY_SETTING_TEMPLATE_FILE_PATH=./F1B.add_overlay_payload_temperature.tpl
OVERLAY_SETTING_OFF_TEMPLATE_FILE_PATH=./F1B.add_overlay_payload_off.tpl
# --------- [ end CONFIGURATIONS ] ---------

LOG_SEPARATOR_MAJOR="*************************************************************"
LOG_SEPARATOR_MINOR="-------------------------------------------------------------"

#INTELLIGENT_TUNER_LOG_CSV_FILE_PATH=${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${INTELLIGENT_TUNER_LOG_CSV}
INTELLIGENT_TUNER_LOG_CSV_FILE_PATH=${WORKDIR}/${INTELLIGENT_TUNER_LOG_CSV}

if [ "${DO_CREATE_NEW_SESSION}" == "true" ]
then
     ./01.create_session.sh
fi

SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})

if [ "${DO_GET_REAL_DATA}" == "true" ]
then
     ./02.login.sh

     BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

     ./A1.profile.sh
     ./A2.home_details.sh

     TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})
     echo "Working on home '${TADO_HOME_ID}', collecting data to reason on ..."

     ./A3.zones.sh
     ./A4.weather.sh
     ./A5.get_data.sh ${TH_ZONE} ${ROOM1_ZONE}
     #./B1.zones_available_timetables.sh  
     #./B3.zones_overall_schedule.sh
     #./B2.zones_active_timetable.sh

     echo "Data collected!"
else
     TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})
     echo "Working on home '${TADO_HOME_ID}'"
fi


# --------- [ SITUATION ] ---------
ZONE_DATA_FILE_PREFIX=${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_PERZONE_JSON_RESULT_PREFIX}

TH_HEATING_PERCENTAGE=$(jq -r .activityDataPoints.heatingPower.percentage ${ZONE_DATA_FILE_PREFIX}_${TH_ZONE}.json | sed "s/\.//g")
TH_HEATING_PERCENTAGE="${TH_HEATING_PERCENTAGE}0000"
TH_HEATING_PERCENTAGE=${TH_HEATING_PERCENTAGE:0:4}

TH_HEATING_SETTING=$(jq -r .setting.power ${ZONE_DATA_FILE_PREFIX}_${TH_ZONE}.json)
#TH_HEATING_SETTING="OFF"

TH_HEATING_HAS_OVERLAY=$(jq -r .overlay.type ${ZONE_DATA_FILE_PREFIX}_${TH_ZONE}.json)
if [ "${TH_HEATING_HAS_OVERLAY}" == "MANUAL" ]
then
     TH_HEATING_HAS_OVERLAY=true
else
     TH_HEATING_HAS_OVERLAY=false
fi

#-----------

ROOM1_CURRENT_TEMPERATURE=$(jq -r .sensorDataPoints.insideTemperature.celsius ${ZONE_DATA_FILE_PREFIX}_${ROOM1_ZONE}.json | sed "s/\.//g")
ROOM1_CURRENT_TEMPERATURE="${ROOM1_CURRENT_TEMPERATURE}0000"
ROOM1_CURRENT_TEMPERATURE=${ROOM1_CURRENT_TEMPERATURE:0:4}

ROOM1_TARGET_TEMPERATURE=$(jq -r .setting.temperature.celsius ${ZONE_DATA_FILE_PREFIX}_${ROOM1_ZONE}.json | sed "s/\.//g")
ROOM1_TARGET_TEMPERATURE="${ROOM1_TARGET_TEMPERATURE}0000"
ROOM1_TARGET_TEMPERATURE=${ROOM1_TARGET_TEMPERATURE:0:4}

ROOM1_HEATING_PERCENTAGE=$(jq -r .activityDataPoints.heatingPower.percentage ${ZONE_DATA_FILE_PREFIX}_${ROOM1_ZONE}.json | sed "s/\.//g")
ROOM1_HEATING_PERCENTAGE="${ROOM1_HEATING_PERCENTAGE}0000"
ROOM1_HEATING_PERCENTAGE=${ROOM1_HEATING_PERCENTAGE:0:4}

ROOM1_HEATING_SETTING=$(jq -r .setting.power ${ZONE_DATA_FILE_PREFIX}_${ROOM1_ZONE}.json)

ROOM1_WINDOW_OPEN=$(jq -r .openWindow ${ZONE_DATA_FILE_PREFIX}_${ROOM1_ZONE}.json)
if [ "${ROOM1_WINDOW_OPEN}" == "null" ]
then
     ROOM1_WINDOW_OPEN=false
fi

echo "${LOG_SEPARATOR_MAJOR}"
echo "***   CURRENT SITUATION"
echo "${LOG_SEPARATOR_MINOR}"
echo "*"
echo "*      -     THERMOSTAT ZONE: ${TH_ZONE}"
echo "*      -      THERMO HEATING: ${TH_HEATING_PERCENTAGE}"
echo "*      - THERMO HEAT SETTING: ${TH_HEATING_SETTING}"
echo "*      -  THERMO HAS OVERLAY: ${TH_HEATING_HAS_OVERLAY}"
echo "*"
echo "*      -         ROOM 1 ZONE: ${ROOM1_ZONE}"
echo "*      - ROOM 1 CURRENT TEMP: ${ROOM1_CURRENT_TEMPERATURE}"
echo "*      -  ROOM 1 TARGET TEMP: ${ROOM1_TARGET_TEMPERATURE}"
echo "*      -      ROOM 1 HEATING: ${ROOM1_HEATING_PERCENTAGE}"
echo "*      - ROOM 1 HEAT SETTING: ${ROOM1_HEATING_SETTING}"
echo "*      -  ROOM 1 WINDOW OPEN: ${ROOM1_WINDOW_OPEN}"
echo "*"
echo "${LOG_SEPARATOR_MAJOR}"


# --------- [ IMPLEMENTATION ] ---------
CSV_TS=$(date -u +"%FT%T.000Z")
CSV_ACTION_CODE=0
CSV_ACTION_DESCRIPTION="UNMATCHED EVENT"

if [ "${ROOM1_HEATING_SETTING}" == "ON" ]
then
     if [ "${ROOM1_WINDOW_OPEN}" == "true" ]
     then
          echo "ROOM1 has an open window, keeping everything unchanged"
          CSV_ACTION_CODE=18
          CSV_ACTION_DESCRIPTION="OPEN WINDOW, KEEP UNCHANGED"
     else
          TARGET_CURRENT_DIFFERENTIAL=0
          let "TARGET_CURRENT_DIFFERENTIAL=ROOM1_CURRENT_TEMPERATURE-ROOM1_TARGET_TEMPERATURE"
          if [ ${TARGET_CURRENT_DIFFERENTIAL} -lt 0 ]
          then
               let "TARGET_CURRENT_DIFFERENTIAL = -1 * TARGET_CURRENT_DIFFERENTIAL"
          fi

          if [ ${TARGET_CURRENT_DIFFERENTIAL} -gt ${ROOM_TEMPERATURE_MAX_DIFFERENTIAL} ]
          then
               echo "Temperature differential in ROOM1 is greater than tolerated: ${TARGET_CURRENT_DIFFERENTIAL} (ref. ${ROOM_TEMPERATURE_MAX_DIFFERENTIAL})"
               if [ "${TH_HEATING_SETTING}" == "OFF" ]
               then
                    echo "Thermo is currently OFF, creating overlay for the thermostat to heat on"

                    A9_RETVAL=0
                    if [ "${DO_CREATE_OVERLAYS}" == "true" ]
                    then
                         ./A9.set_overlay.sh SET \
                                             ${TADO_HOME_ID} \
                                             ${TH_ZONE} \
                                             ${OVERLAY_SETTING_TEMPLATE_FILE_PATH} \
                                             ${OVERLAY_TEMP_CELSIUS} \
                                             ${OVERLAY_TEMP_FAHRENHEIT} \
                                             ${OVERLAY_DURATION}

                         A9_RETVAL=$?
                    fi

                    if [ ${A9_RETVAL} -eq 0 ]
                    then
                         CSV_ACTION_CODE=20
                         CSV_ACTION_DESCRIPTION="ADD OVERLAY TO START THERMO"
                    else
                         CSV_ACTION_CODE=38
                         CSV_ACTION_DESCRIPTION="ERROR WHEN SETTING OVERLAY: ${A9_RETVAL}"
                    fi
               else
                    echo "Thermo is already running, just letting it do its job!"
                    CSV_ACTION_CODE=10
                    CSV_ACTION_DESCRIPTION="KEEP UNCHANGED"
               fi
          else
               echo "Temperature differential in ROOM1 is ok"
               if [ "${TH_HEATING_HAS_OVERLAY}" == "true" ]
               then
                    echo "Removing overlay that forced thermo to heat on"

                    A9_RETVAL=0
                    if [ "${DO_CREATE_OVERLAYS}" == "true" ]
                    then
                         ./A9.set_overlay.sh UNSET \
                                             ${TADO_HOME_ID} \
                                             ${TH_ZONE}

                         A9_RETVAL=$?
                    fi

                    if [ ${A9_RETVAL} -eq 0 ]
                    then
                         CSV_ACTION_CODE=29
                         CSV_ACTION_DESCRIPTION="REMOVING OVERLAY ON THERMO"
                    else
                         CSV_ACTION_CODE=39
                         CSV_ACTION_DESCRIPTION="ERROR WHEN REMOVING OVERLAY: ${A9_RETVAL}"
                    fi
               else
                    echo "Just keep the thermo going its way"
                    CSV_ACTION_CODE=11
                    CSV_ACTION_DESCRIPTION="TEMP DIFF IS OK (${TARGET_CURRENT_DIFFERENTIAL} less than ${ROOM_TEMPERATURE_MAX_DIFFERENTIAL}), KEEP UNCHANGED"
               fi
          fi
     fi
else
     echo "ROOM1 is currently set to OFF."
     if [ "${TH_HEATING_HAS_OVERLAY}" == "true" ]
     then
          echo "Removing overlay that forced thermo to heat on"

          A9_RETVAL=0
          if [ "${DO_CREATE_OVERLAYS}" == "true" ]
          then
               ./A9.set_overlay.sh UNSET \
                                   ${TADO_HOME_ID} \
                                   ${TH_ZONE}

               A9_RETVAL=$?
          fi

          if [ ${A9_RETVAL} -eq 0 ]
          then
               CSV_ACTION_CODE=29
               CSV_ACTION_DESCRIPTION="REMOVING OVERLAY ON THERMO"
          else
               CSV_ACTION_CODE=39
               CSV_ACTION_DESCRIPTION="ERROR WHEN REMOVING OVERLAY: ${A9_RETVAL}"
          fi
     else
          echo "No overlay = No action"
          CSV_ACTION_CODE=19
          CSV_ACTION_DESCRIPTION="ROOM SET TO OFF, KEEP UNCHANGED"
     fi
fi

if [ -f ${INTELLIGENT_TUNER_LOG_CSV_FILE_PATH} ]
then
     echo "appending log to file"
else
     echo "creating log file"
     echo "CSV_TS;TH_HEATING_PERCENTAGE;TH_HEATING_SETTING;TH_HEATING_HAS_OVERLAY;ROOM1_CURRENT_TEMPERATURE;ROOM1_TARGET_TEMPERATURE;ROOM1_HEATING_PERCENTAGE;ROOM1_HEATING_SETTING;MAX_DIFFERENTIAL;CSV_ACTION_CODE;CSV_ACTION_DESCRIPTION" > ${INTELLIGENT_TUNER_LOG_CSV_FILE_PATH}
fi

echo "${CSV_TS};${TH_HEATING_PERCENTAGE};${TH_HEATING_SETTING};${TH_HEATING_HAS_OVERLAY};${ROOM1_CURRENT_TEMPERATURE};${ROOM1_TARGET_TEMPERATURE};${ROOM1_HEATING_PERCENTAGE};${ROOM1_HEATING_SETTING};${ROOM_TEMPERATURE_MAX_DIFFERENTIAL};${CSV_ACTION_CODE};\"${CSV_ACTION_DESCRIPTION}\"" >> ${INTELLIGENT_TUNER_LOG_CSV_FILE_PATH}

#rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}
