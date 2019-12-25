#!/bin/bash

. ./00.variables.sh

SESSION_NAME=$(date +"%Y%m%d%H%M%S")
mkdir -p ${WORKDIR}
echo "${SESSION_NAME}" > ${WORKDIR}/${SESSION_FILENAME}
mkdir -p ${WORKDIR}/${SESSION_DIR_PREFIX}${SESSION_NAME}
