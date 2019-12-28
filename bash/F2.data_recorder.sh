#!/bin/bash

. ./00.variables.sh

./01.create_session.sh
./02.login.sh

#BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

./A1.profile.sh
./A2.home_details.sh

#TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})

./A3.zones.sh
./A4.weather.sh
./A5.get_data.sh #${TH_ZONE} ${ROOM1_ZONE}

SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}
