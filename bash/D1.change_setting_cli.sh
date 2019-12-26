#!/bin/bash

. ./00.variables.sh

./01.create_session.sh
./02.login.sh

SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
BEARER_TOKEN=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${OAUTH_ACCESS_TOKEN})

./A1.profile.sh
./A2.home_details.sh

TADO_HOME_ID=$(cat ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_DATA_HOME_ID})

./A3.zones.sh

echo "*********************************************************"
echo "**    PAGA TADO     -     Configuration Changer CLI    **"
echo "*********************************************************"

echo -e "\n\n"

echo "---------------------------------------------------------"
echo " ZONE:"
echo ""

jq ".[] | [.id, .name] | @csv" ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}/${TADO_API_ZONES_JSON_RESULT} \
     | sed "s/,/ - /g" | sed "s/\"//g" | sed "s/\\\\//g"

echo -e "\n---------------------------------------------------------"

echo -ne "\n [?] Selezionare una zona digitandone il numero: "
read SELECTED_ZONE

echo "Gotcha, working on zone #${SELECTED_ZONE}"
