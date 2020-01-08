#!/bin/bash
cd ..
cd ../be-commons
npm i && npm run build
cd ../business-logic
npm i && npm run build
cd ../standalone
npm i && npm run start-dev
