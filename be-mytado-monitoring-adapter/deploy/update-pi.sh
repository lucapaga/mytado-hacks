#!/bin/bash
cd ../../be-commons
npm i && npm run build
cd ../be-mytado-monitoring-adapter/business-logic
npm i && npm run build
cd ../standalone
npm i && touch src/Server.ts
