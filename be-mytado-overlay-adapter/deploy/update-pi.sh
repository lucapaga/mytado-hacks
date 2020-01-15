#!/bin/bash
cd ../../be-commons
npm i && npm run build
cd ../be-mytado-overlay-adapter/business-logic
npm i && npm run build
cd ../standalone
npm i && touch src/Server.ts
