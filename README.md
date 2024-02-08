## Comandi

I comandi sono pensati per partire da console dalla directory dove avete trovato questo readme

Inizializza il sistema
`yarn install`

System start
`docker-compose up`

Vedi informazioni relative ai container
`docker ps`

Entra nel docker per eseguire operazioni direttamente nel container tramite bash
`docker exec -it <id-container> bash`
=======
## Test Fatti
-Corretti bug e comportamenti indesiderati
    (per esempio)
    da questo--> app.listen(() => console.log(`Example app listening on port ${port}`), port);
    a questo -->server.listen(port, '0.0.0.0'); 
    -ho messo server invece di app per gestire la pagina html
-Fatti esercizi 1,3,4
    -ogni end-point creato è stato testato con l'url commentato e scritto sopra l'endpoint e il consecutivo body se necessario oppure opzionale
    -Ho cambiato la prima route per inserire un semplice file html per fare i test dei socket.io sul front-end
-Problematiche
    -Non so se sono riuscito a fare il punto 8 dell'esercizio 3 perchè ho impostato le req.io.emit ad un destinatario preciso o ad un gruppo con gli id ma ho dei dubbi su come questi id vengano poi collegati agli utenti finali della pagina

