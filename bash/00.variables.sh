#!/bin/bash

#MYTADO_USERNAME=omissis
#MYTADO_PASSWORD=omissis

OAUTH_URI=https://auth.tado.com/oauth/token
OAUTH_CLIENT_ID=tado-web-app
OAUTH_CLIENT_SECRET=wZaRN7rpjn3FoNyF5IFuxg9uMzYJcvOoQ8QWiIqS3hfk6gLhVlG57j5YNoZL2Rtc
OAUTH_GRANT_TYPE_LOGIN=password
OAUTH_GRANT_TYPE_REFRESH=refresh_token
OAUTH_SCOPE=home.user

WORKDIR=work
SESSION_FILENAME=session.dat
SESSION_DIR_PREFIX=session_

OAUTH_LOGIN_JSON_RESULT=oauth_login.json
OAUTH_ACCESS_TOKEN=oauth_access_token.dat
OAUTH_REFRESH_TOKEN=oauth_refresh_token.dat

TADO_API_BASE=https://my.tado.com/api
TADO_API_VERSION=v2
TADO_API_BASE_URI=${TADO_API_BASE}/${TADO_API_VERSION}

TADO_API_PROFILE_URI=${TADO_API_BASE_URI}/me
TADO_API_PROFILE_JSON_RESULT=tado_api_me.json
TADO_API_HOME_DETAILS_BASE_URI=${TADO_API_BASE_URI}/homes
TADO_API_HOME_DETAILS_JSON_RESULT=tado_api_home_details.json
TADO_API_ZONES_JSON_RESULT=tado_api_home_zones.json
TADO_API_PERZONE_JSON_RESULT_PREFIX=tado_api_home_zone
TADO_API_WEATHER_JSON_RESULT=tado_api_home_weather.json

TADO_DATA_CSV=tado_data.csv

TADO_DATA_HOME_ID=tado_home_id.dat