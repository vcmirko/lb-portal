# Uitleg voor mirko

* alles draait met vitejs
* in dev modus kan via concurrent de server en client tegelijk draaien
* in dev modus zal vite /api proxyen naar de server op poort 3001
* in dev modus zal de server op poort 3001 draaien en de greenlock bypassen
* in productie modus zal de server op poort 80 draaien en de greenlock gebruiken (https met let's encrypt)

# Deploy

* in de root gewoon ./publish.sh draaien
  * dit zal de server en client builden en moven naar de juiste map /src/public op de server
  * via rsync zal de src/server naar digital ocean geupload worden
  * met uitzondering van de belangrijk mappen !! zoals loonbrieven & greenlock.d
  * remote zal een publish.sh draaien die de server herdeployt (pm2 stop, pm2 delete, npm install, pm2 start)

# Technisch

Vite wordt gebruikt, geen babel of webpack, 100% pure javascript met import/export, hierdoor is een build niet nodig voor de server.  De client met vite in dev runt heel snel.