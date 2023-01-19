# kromin-be

This project was created to highlight a potential candidate skills.

It's an express powered API handling 2 resources:
- users
- todos

Users can register and login.
User can then retrieve, create, update and remove todos.
User can also search for todos matching specific criterias.

## Development

To run the project locally:
```sh
docker compose up
```

API served at <http://localhost>.
Live reload takes up to 20s to happen.

# ⚠️ KROMIN ONLY ⚠️

Prima di consegnare lo zip:

1. rimuovere questa sezione dal README

2. modificare la riga che avvia il server con:
```js
app.listen(() => console.log(`Example app listening on port ${port}`), port);
```
3. rimuovere `node_modules/` dal `.gitignore`


Problemi introdotti:
- nel .gitignore non c'è node_modules
- la porta nell'index.js è hardcodata invece di usare la variable PORT dell'env
- id non è autoincrement nelle tabelle
- creation_date non è una date nelle tabelle, quindi comparison tramite operatori ><= non funzionano

Errori introdotti:
1. errore critico per cui non parte il progetto (errore di setup di progetto) => nell'index la callback e la porta sono invertiti
2. errore che compare in console immediatamente ma che non fa crashare l’app => MISSING
3. errore che fa crashare al compiersi di un’azione => è sbagliata la env MYSQL_DATABASEE dentro database.js, finchè non fai query non te ne accorgi