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
  const todo = await database("todos").where({ id, user_id: user.id }).first();
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }
  return todo;
};

/**
 * Create a new todo.
 * If creation_date is not provided, then current date should be the value.
 */
export const create = async ({ user, due_date, content, position }) => {
  if (!content) {
    throw new ApiError(400, "You need to specify the content of the todo");
  }
  const [id] = await database("todos").insert({
    creation_date: toSQL(),
    due_date: toSQL(due_date),
    content,
    position,
    user_id: user.id,
  });

  const todo = await database("todos").where({ id }).first();
  return todo;
};

/**
 * Update todo.
 */
export const update = async ({ id, due_date, content, position, status }) => {
  if (!id) {
    throw new ApiError(400, "You need to specify an id");
  }
  if ([due_date, content, position, status].every((value) => !value)) {
    throw new ApiError(
      400,
      "Values should at least include one of: due_date, content, position, status"
    );
  }
  await database("todos")
    .update({
      due_date: due_date ? toSQL(due_date) : undefined,
      content,
      position,
      status,
    })
    .where({ id, user_id: user.id });

  const todo = await database("todos").where({ id }).first();
  return todo;
};

/**
 * Reorder todos.
 */
export const order = async ({ user, ids }) => {
  if (!ids) {
    throw new ApiError(400, "You need to specify which items to update");
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
export const remove = async ({ id }) => {
  const affected_rows = await database("todos").delete().where({ id });
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
}) => {
  const query = database("todos");
  console.log(due_to);

  if (q) query.where("content", "like", `%${q}%`);
  if (status) query.where("status", status);
  if (from) query.where("creation_date", ">=", from.substring(0, 19));
  if (to) query.where("creation_date", "<=", to.substring(0, 19));
  if (due_from) query.where("due_date", ">=", due_from.substring(0, 19));
  if (due_to) query.where("due_date", "<=", due_to.substring(0, 19));
  if (limit) query.limit(limit);
  if (offset) query.offset(offset);

  query.where("user_id", user.id).orderBy("position");

  const todos = await query;
  return todos;
};
