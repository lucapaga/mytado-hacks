#!/bin/bash

. ./00.variables.sh

./F1.intelligent_tuner.sh 5 2

SESSION_NAME=$(cat ${WORKDIR}/${SESSION_FILENAME})
rm -rf ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}
