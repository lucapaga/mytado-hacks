#!/bin/bash

. ./00.variables.sh

DO_GET_REAL_DATA=0

if [ ${DO_GET_REAL_DATA} -gt 0 ]
then
     ./01.create_session.sh
     ./02.login.sh

     SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
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
TH_HEATING_PERCENTAGE=0.00
TH_HEATING_SETTING=OFF
TH_HEATING_HAS_OVERLAY=false
ROOM1_CURRENT_TEMPERATURE=1690
ROOM1_TARGET_TEMPERATURE=2100
ROOM1_HEATING_PERCENTAGE=100.00
ROOM1_HEATING_SETTING=ON

# --------- [ IMPLEMENTATION ] ---------
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
          echo "Creating overlay for the thermostat to heat on"
          # TODO
     else
          echo "Temperature differential in ROOM1 is ok"
          if [ "${TH_HEATING_HAS_OVERLAY}" == "true" ]
          then
               echo "Removing overlay that forced thermo to heat on"
               # TODO
          else
               echo "Just keep the thermo going its way"
          fi
     fi
else
     echo "ROOM1 is currently set to OFF: no action!"
fi
