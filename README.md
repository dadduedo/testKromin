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

4. cambiare creation_date e due_date da timestamp a varchar dentro schema.sql

Problemi strutturali (non prettamente codice) introdotti:
- i controller fanno query... xD
- nel .gitignore non c'è node_modules
- la porta nell'index.js è hardcodata invece di usare la variable PORT dell'env
- creation_date non è una date nelle tabelle, quindi comparison tramite operatori ><= non funzionano

Errori introdotti:
1. errore critico per cui non parte il progetto (errore di setup di progetto) => nell'index la callback e la porta sono invertiti
2. errore che compare in console immediatamente ma che non fa crashare l’app => Gli errori sono inviati come stringa e il send(status) non numerico è deprecato 
3. errore che fa crashare al compiersi di un’azione => Chiamata di update fa crashare tutto (manca user)
4. errore che non gestisce la persistenza di un’azione (es. API di update, che però non aggiorna veramente il DB) => Manca l'await sulla order
5. errore che gestisce un Datetime senza tenere conto del Timezone => La query delle date nella ricerca taglia la stringa invece di usare toSQL.
6. errore difficile da scovare => Manca l'asyncHandler sulla rotta di signup che fa esplodere il server in caso di errore


Rimuovere => 
```sh
curl -X POST http://localhost:3000/auth/register -H 'Content-type: application/json' -d '{"email":"john@gmail.com","password":"password","first_name":"John","last_name":"Doe"}'
curl -X POST http://localhost:3000/auth/login -H 'Content-type: application/json' -d '{"email":"john@gmail.com","password":"password"}'

curl -X POST http://localhost:3000/todo -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"content":"ciao papà"}'
curl -X POST http://localhost:3000/todo -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"content":"ciao mamma","creation_date":"2022-01-01"}'
curl -X POST http://localhost:3000/todo -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"content":"hello mom","creation_date":"2022-12-31 00:00:00"}'

curl http://localhost:3000/todo -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE'
curl http://localhost:3000/todo/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE'

curl -X PATCH http://localhost:3000/todo/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"content":"yoyo","due_date":"2023-12-31","status":"done"}'
curl -X DELETE http://localhost:3000/todo/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE'

curl -X POST http://localhost:3000/todo/search -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"limit":"2","offset":2}'
curl -X POST http://localhost:3000/todo/search -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"q":"ciao","from":"2023-01-01"}'
curl -X POST http://localhost:3000/todo/search -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"q":"ciao","from":"2023-01-01","to":"2023-12-12"}'
curl -X POST http://localhost:3000/todo/search -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.yDrGoBzVPIN_JVlqNF9lmPPRSXE-vp0jv4ybW5tEXsE' -H 'Content-type: application/json' -d '{"q":"ciao","from":"2022-01-01","to":"2022-12-31"}'
```