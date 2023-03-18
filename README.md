# Skill assessment test (NodeJS)

L'obbiettivo di questo progetto è quello di poter valutare in modo oggettivo
le abilità di programmazione dei candidati alla posizione di backend developer (PHP/Laravel) presso Kromin

L'applicativo è una semplice todo list nella quale ogni utente può loggarsi e può accedere alla propria liste di cose da fare.

Le entità principali sono:
- User
- Todos

Per far partire l'applicazione sarà necessario avere installato docker.
Quindi nel caso non lo aveste installato sulla vostra macchina vi converrà farlo.

Qui di seguito ci sono le istruzioni per farlo partire da una linea di comando unix.
Essendo containerizzato per far partire l'applicazione dovrebbe essere sufficiente lanciare il comando di system start

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