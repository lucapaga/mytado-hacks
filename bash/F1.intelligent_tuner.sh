#!/bin/bash

. ./00.variables.sh

DO_GET_REAL_DATA=0

./01.create_session.sh
SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})

if [ ${DO_GET_REAL_DATA} -gt 0 ]
then
     ./02.login.sh

     BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

     ./A1.profile.sh
     ./A2.home_details.sh

     TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})
     echo "Working on home '${TADO_HOME_ID}', collecting data to reason on ..."

     ./A3.zones.sh
     ./A4.weather.sh
     ./A5.get_data.sh
     ./B1.zones_available_timetables.sh  B3.zones_overall_schedule.sh
     ./B2.zones_active_timetable.sh

     echo "Data collected!"
fi

# --------- [ CONFIGURATIONS ] ---------
ROOM_TEMPERATURE_MAX_DIFFERENTIAL=100

# --------- [ SITUATION ] ---------
TH_HEATING_PERCENTAGE=0
TH_HEATING_SETTING=OFF
TH_HEATING_HAS_OVERLAY=false
ROOM1_CURRENT_TEMPERATURE=1690
ROOM1_TARGET_TEMPERATURE=2100
ROOM1_HEATING_PERCENTAGE=100
ROOM1_HEATING_SETTING=ON

# --------- [ IMPLEMENTATION ] ---------
CSV_TS=$(date -u +"%FT%T.000Z")
CSV_ACTION_CODE=0
CSV_ACTION_DESCRIPTION="KEEP UNCHANGED"

if [ "${ROOM1_HEATING_SETTING}" == "ON" ]
then
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
               # TODO
               CSV_ACTION_CODE=9
               CSV_ACTION_DESCRIPTION="ADD OVERLAY TO START THERMO"
          else
               echo "Thermo is already running, just letting it do its job!"
               CSV_ACTION_CODE=0
               CSV_ACTION_DESCRIPTION="KEEP UNCHANGED"
          fi
     else
          echo "Temperature differential in ROOM1 is ok"
          if [ "${TH_HEATING_HAS_OVERLAY}" == "true" ]
          then
               echo "Removing overlay that forced thermo to heat on"
               # TODO
               CSV_ACTION_CODE=8
               CSV_ACTION_DESCRIPTION="REMOVING OVERLAY ON THERMO"
          else
               echo "Just keep the thermo going its way"
               CSV_ACTION_CODE=0
               CSV_ACTION_DESCRIPTION="KEEP UNCHANGED"
          fi
     fi
else
     echo "ROOM1 is currently set to OFF: no action!"
fi

if [ -f ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${INTELLIGENT_TUNER_LOG_CSV} ]
then
     echo "appending log to file"
else
     echo "creating log file"
     echo "CSV_TS;TH_HEATING_PERCENTAGE;TH_HEATING_SETTING;TH_HEATING_HAS_OVERLAY;ROOM1_CURRENT_TEMPERATURE;ROOM1_TARGET_TEMPERATURE;ROOM1_HEATING_PERCENTAGE;ROOM1_HEATING_SETTING;CSV_ACTION_CODE;CSV_ACTION_DESCRIPTION" > ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${INTELLIGENT_TUNER_LOG_CSV}
fi

echo "${CSV_TS};${TH_HEATING_PERCENTAGE};${TH_HEATING_SETTING};${TH_HEATING_HAS_OVERLAY};${ROOM1_CURRENT_TEMPERATURE};${ROOM1_TARGET_TEMPERATURE};${ROOM1_HEATING_PERCENTAGE};${ROOM1_HEATING_SETTING};${CSV_ACTION_CODE};\"${CSV_ACTION_DESCRIPTION}\"" >> ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${INTELLIGENT_TUNER_LOG_CSV}
