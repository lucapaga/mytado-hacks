#!/bin/bash

. ./00.variables.sh

SLEEP_BETWEEN_CYCLE=10

while true
do
    echo "Cycle #${oneCycle}"

    ./F1.intelligent_tuner.sh 5 2

    SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
    rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}

    echo "Sleeping for ${SLEEP_BETWEEN_CYCLE}s ..."
    sleep ${SLEEP_BETWEEN_CYCLE}
done