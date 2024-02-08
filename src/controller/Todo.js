import database from "../database.js";
import { toSQL } from "../helpers.js";
import ApiError from "../errors/ApiError.js";
/**
 * Get todo by ID.
 */
export const get = async ({ user, id }) => {
  if (!id) {
    throw new ApiError(400, "You need to specify an id");
  }
  // Esegui la query su 'todosimp'
  let query = database("todosimp")
    .select("todosimp.*")
    .where({ 'todosimp.id': id, 'todosimp.user_id': user.id });

  // Se 'todosimp' non restituisce il risultato, esegui la join con 'todos'
  const todo = await query.first();

  if (!todo) {
    // Se 'todosimp' non contiene il todo, prova a cercare in 'todos'
    query = database("todos")
      .select("todos.*")
      .leftJoin("todosimp", "todos.id", "=", "todosimp.id")
      .where({ 'todos.id': id, 'todos.user_id': user.id });

    const joinedTodo = await query.first();

    if (!joinedTodo) {
      throw new ApiError(404, "Todo not found");
    }

    return joinedTodo;
  }

  return todo;
};




/**
 * Create a new todo.
 * If created_at is not provided, then current date should be the value.
 */
export const create = async ({ user, due_date, content, position, tipo, targetTable = 'todos' }) => {
  if (!content) {
    throw new ApiError(400, "You need to specify the content of the todo");
  }

  const [id] = await database(targetTable).insert({
    created_at: toSQL(),
    due_date: toSQL(due_date),
    content,
    position,
    user_id: user.id,
    tipo,
  });

  const todo = await database(targetTable).where({ id }).first();
  return todo;
};

/**
 * Update todo.
 */
export const update = async ({ id, due_date, content, position, status, user, targetTable = 'todos' }) => {
  if (!id) {
    throw new ApiError(400, "You need to specify an id");
  }
  if ([due_date, content, status].every((value) => !value)) {
    throw new ApiError(
      400,
      "Values should at least include one of: due_date, content, status"
    );
  }

  const updateData = {
    due_date: due_date ? toSQL(due_date) : undefined,
    content,
    position,
    status,
  };

  await database(targetTable)
    .update(updateData)
    .where({ id, user_id: user.id });

  const todo = await database(targetTable).where({ id }).first();
  return todo;
};

export const moveTodo = async ({user, id, sourceTable, destinationTable }) => {
  if (!id) {
    throw new ApiError(400, "You need to specify an id");
  }

  // Verifica che la tabella di origine sia valida
  if (!['todos', 'todosimp'].includes(sourceTable)) {
    throw new ApiError(400, "Invalid source table");
  }

  // Verifica che la tabella di destinazione sia valida
  if (!['todos', 'todosimp'].includes(destinationTable)) {
    throw new ApiError(400, "Invalid destination table");
  }
  // Seleziona il todo dalla tabella di origine
  const todoToMove = await database(sourceTable).where({ id, user_id: user.id }).first();
  if (!todoToMove) {
    throw new ApiError(404, "Todo not found in the source table");
  }

  // Inserisci il todo nella tabella di destinazione
  await database(destinationTable).insert({
    created_at: todoToMove.created_at,
    due_date: todoToMove.due_date,
    content: todoToMove.content,
    user_id: todoToMove.user_id,
    tipo: todoToMove.tipo,
  });

  // Cancella il todo dalla tabella di origine
  await database(sourceTable).where({ id, user_id: user.id }).del();

  // Restituisci il todo spostato
  const movedTodo = await database(destinationTable).where({ id }).first();
  return movedTodo;
};


/**
 * Reorder todos.
 */
export const order = async ({ user, ids }) => {
  if (!ids) {
    throw new ApiError(400, "You need to specify which items to update");
  }
  if (!Array.isArray(ids)) {
    throw new ApiError(400, "'ids' deve essere un array di ID");
  }
  if (ids.length === 0) {
    throw new ApiError(400, "L'array 'ids' non può essere vuoto");
  }
  let todos = await database("todos")
    .whereIn("id", ids)
    .where("user_id", user.id);
  if (ids.length !== todos.length) {
    throw new ApiError(
      400,
      "Something went wrong, couldn't update todos order"
    );
  }
  for (const id in ids) {
    database("todos")
      .update({ position: Number.parseInt(id) + 1 })
      .where("id", ids[id]);
  }
  todos = await database("todos").whereIn("id", ids).where("user_id", user.id);
  return todos;
};

/**
 * Delete todo.
 */
export const remove = async ({ id, tableName }) => {
  const affected_rows = await database(tableName).delete().where({ id });
  return !!affected_rows;
};

/**
 * Search for todos respecting given filters.
 */
export const search = async ({
  user,
  q,
  status,
  from,
  to,
  due_from,
  due_to,
  limit,
  offset,
  tipo
}) => {
  //ho ipotizzato che le due tabelle potessero non avere tutte le colonne uguali.
  const commonColumns = [
    "id",
    "content",
    "status",
    "created_at",
    "due_date",
    "user_id",
    "tipo"
  ];

  const query = database("todos")
    .select(commonColumns)
    .where("user_id", user.id);

  if (q) query.where("content", "like", `%${q}%`);
  if (status) query.where("status", status);
  if (from) query.where("created_at", ">=", from.substring(0, 19));
  if (to) query.where("created_at", "<=", to.substring(0, 19));
  if (due_from) query.where("due_date", ">=", due_from.substring(0, 19));
  if (due_to) query.where("due_date", "<=", due_to.substring(0, 19));
  if (tipo) query.where("tipo", tipo); //aggiunto nuovo campo

  // Aggiungio una seconda query per la tabella 'todosimp' e combino i risultati con UNION
  const todos = await query
    .union(function () {
      this
        .select(commonColumns)
        .from("todosimp")
        .where("user_id", user.id)
        .andWhere((builder) => {
          // Aggiungi eventuali clausole di filtro per la tabella 'todosimp'
          if (q) builder.where("content", "like", `%${q}%`);
          if (status) builder.where("status", status);
          if (from) builder.where("created_at", ">=", from.substring(0, 19));
          if (to) builder.where("created_at", "<=", to.substring(0, 19));
          if (due_from) builder.where("due_date", ">=", due_from.substring(0, 19));
          if (due_to) builder.where("due_date", "<=", due_to.substring(0, 19));
          if (tipo) builder.where("tipo", tipo); //aggiunto nuovo campo
        });
    })
    .limit(limit)
    .offset(offset);
  return todos;
};



export const updateList = async ({user,emailToChange,todolist,idTodo}) => {
  const emailDomain = user.email.split('@')[1];
  const emailToChangeDomain = emailToChange.split('@')[1];
  if (!emailToChange) {
    throw new ApiError(400, "You need to specify an mail");
  }
  if (emailDomain == "gmail.com" || emailToChangeDomain == "gmail.com") {
    throw new ApiError(
      400,
      "This email is not accepted"
    );
  }
  if(emailToChangeDomain == emailDomain){
    const idUserTochange = await database("users")
    .select(["id"])
    .where({ email:emailToChange })
    //se c'è l'id del todo allora faccio l'update solo suo
    if(idTodo){
      await database("todos").update({
        user_id:idUserTochange[0].id,
        })
        .where({"id":idTodo});
        let todo = {"singolID":idUserTochange[0].id}
        return todo;
    }
    else {
    //se non c'è l'id vuol dire che esiste il parametro todolist e in quel caso assegno tutta la lista
      await database("todos").update({
        user_id:idUserTochange[0].id,
        })
        .where({"user_id": user.id ,"tipo": todolist});
        const todo = await database("todos").distinct("user_id").select(["user_id"]).where({"user_id": idUserTochange[0].id ,"tipo": todolist});
        const idArray = todo.map(item => item.user_id);
        return idArray;
    }
  }
  
};

export const completionPercentage = async ({ user, from, to }) => {
  let todosValidList = await database("todos")
    .whereNotNull("start_date")
    .whereNotNull("end_date")
    .where("user_id", user.id);

  const totalTodos = todosValidList.length;
  if (from && to) {
    // Filtra i todos nel range specificato
    todosValidList = todosValidList.filter(todo => {
      const todoStartDate = new Date(todo.start_date);
      const todoEndDate = new Date(todo.end_date);
      // Confronto delle date
      return todoStartDate >= new Date(from) && todoEndDate <= new Date(to);
    });
  }

  todosValidList = todosValidList.filter(todo => {
    const todoStartDate = new Date(todo.start_date);
    const todoEndDate = new Date(todo.end_date);
    const completionTime = todoEndDate - todoStartDate;
    const completionDays = completionTime / (1000 * 60 * 60 * 24);
    return completionDays <= 5;
  });


  const completionPercentage = (todosValidList.length / totalTodos) * 100;

  return  {completionPercentage} ; 
};
