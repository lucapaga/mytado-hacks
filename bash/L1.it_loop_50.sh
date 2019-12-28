#!/bin/bash

. ./00.variables.sh

NR_OF_LOOPS=50
SLEEP_BETWEEN_CYCLE=10

for oneCycle in $(seq 1 1 ${NR_OF_LOOPS})
do
    echo "Cycle #${oneCycle}"

    ./F1.intelligent_tuner.sh 5 2

    SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
    rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}

    echo "Sleeping for ${SLEEP_BETWEEN_CYCLE}s ..."
    sleep ${SLEEP_BETWEEN_CYCLE}
done