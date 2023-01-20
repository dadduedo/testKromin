# kromin-be

This project was created to highlight a potential candidate skills.

It's an express powered API handling 2 resources:
- users
- todos

Users will be able to register and log in, then manage its todos.

## Feature requests

The candidate:
- should complete 1 among the following tasks
- should find possible errors in the codebase provided
- can use any library of his choice to achieve the task
- can apply any change he wants to the provided codebase

**1. Easy task**

The user can register and log in.
The user can get, create, edit, remove and search todo lists.  
A todo list is a named list containing todos.

For instance, the user X can create 2 different todo list:
- todo list `Xmas presents` holding the todos `Barbie`, `Micromachine` and `Get others from grandma`
- todo list `Groceries` holding the todos `Bananas`, `Pasta` and `Eggs`

The search must accept the following parameters:
- `q`: string => the todo content must include `q`
- `from`: date => the todo must be created after `from`
- `to`: date => the todo must be created before `to`
  
and it must return the todo lists matching the given criteria.

**2. Normal task**

All features described in the easy task, with the following addition: the todo list must be sharable.  
For instance, the user X can create 2 different todo list: 
- the private todo list `Xmas presents`: only X can access the todo list and manage it
- the public todo list `Groceries`: everybody having the correct link can access the todo list and manage it

When sharing a list, the user X can decide if the shared users can only see the list or also edit the todos in it. 

**3. Hard task**

All features described in the medium task, with the following addition: the todo list must update realtime.
For instance, if the user X and Y are both on the same todo list `Groceries` holding the todo `Bananas`, if X rename the todo to `Apples` then Y see the change reflected in realtime. 

This task requires the use of sockets.

**Errors**

Creating the following todos:
```sh
curl -X POST http://localhost:3000/todo -H 'Content-type: application/json' -d '{"content":"ciao papà"}'
curl -X POST http://localhost:3000/todo -H 'Content-type: application/json' -d '{"content":"ciao mamma","creation_date":"2022-01-01"}'
curl -X POST http://localhost:3000/todo -H 'Content-type: application/json' -d '{"content":"hello mom","creation_date":"2022-12-31T00:00:00"}'
```

And then search for all todos in year `2022`:
```sh
curl -X POST http://localhost:3000/todo/search -H 'Content-type: application/json' -d '{"from":"2022-01-01","to":"2022-12-31"}'
```

The wrong result is returned:
```sh
[
  {
    "id": 2,
    "creation_date": "2022-01-01",
    "content": "ciao mamma",
    "position": null,
    "status": "pending"
  }
]
```

We are expecting to find 2 todos in year `2022`. 

## Development

To run the project locally:
```sh
docker compose up
```

API served at <http://localhost>.  

Live reload (`nodemon`) takes up to 20s on MacOS + Docker: feel free to either
1) fix this and keep developing using Docker
2) find another way to develop out of Docker

# ⚠️ KROMIN ONLY ⚠️

Prima di consegnare lo zip:

1. rimuovere questa sezione dal README

2. modificare la riga in `index.js` che avvia il server con:
```js
app.listen(() => console.log(`Example app listening on port ${port}`), port);
```

3. rimuovere `node_modules/` dal `.gitignore`

4. modificare la riga in `src/database.js` con:
```js
database: process.env.MYSQL_DATABASEE,
```

Problemi introdotti:
- nel .gitignore non c'è node_modules
- la porta nell'index.js è hardcodata invece di usare la variable PORT dell'env
- id non è autoincrement nella tabella users
- creation_date non è una date nelle tabelle, quindi comparison tramite operatori ><= non funzionano

Errori introdotti:
1. errore critico per cui non parte il progetto (errore di setup di progetto) => nell'index la callback e la porta sono invertiti
2. errore che compare in console immediatamente ma che non fa crashare l’app => MISSING
3. errore che fa crashare al compiersi di un’azione => è sbagliata la env MYSQL_DATABASEE dentro database.js, finchè non fai query non te ne accorgi
4. errore che non gestisce la persistenza di un’azione (es. API di update, che però non aggiorna veramente il DB) => MISSING
5. errore che gestisce un Datetime senza tenere conto del Timezone => MISSING
6. errore difficile da scovare => MISSING



Rimuovere => 
```sh
curl http://localhost:3000/todo
curl http://localhost:3000/todo/1

curl -X POST http://localhost:3000/todo -H 'Content-type: application/json' -d '{"content":"ciao papà"}'
curl -X POST http://localhost:3000/todo -H 'Content-type: application/json' -d '{"content":"ciao mamma","creation_date":"2022-01-01"}'
curl -X POST http://localhost:3000/todo -H 'Content-type: application/json' -d '{"content":"hello mom","creation_date":"2022-12-31T00:00:00"}'

curl -X POST http://localhost:3000/todo/search -H 'Content-type: application/json' -d '{"q":"ciao","from":"2023-01-01"}'
curl -X POST http://localhost:3000/todo/search -H 'Content-type: application/json' -d '{"q":"ciao","from":"2023-01-01","to":"2023-12-12"}'
curl -X POST http://localhost:3000/todo/search -H 'Content-type: application/json' -d '{"q":"ciao","from":"2022-01-01","to":"2022-12-31"}'
```