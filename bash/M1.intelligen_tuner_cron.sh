#!/bin/bash

# Example crontab
# */5 9-21 * * * cd /home/luca_paganelli/mytado-hacks/bash && ./M1.intelligen_tuner_cron.sh

. ./00.variables.sh

./F1.intelligent_tuner.sh 5 2

SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}
