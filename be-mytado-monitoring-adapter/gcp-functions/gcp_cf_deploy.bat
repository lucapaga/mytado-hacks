rmdir /S /Q node_modules
npm i
gcloud functions deploy mth-monitoring --set-env-vars MYTADO_SA_USER=luca.paga@gmail.com,MYTADO_SA_PWD=4G@LdQA3vL75Bmx --trigger-http --runtime nodejs10 --allow-unauthenticated --region europe-west1