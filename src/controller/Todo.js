import database from "../database.js";

/**
 * Get todo by ID.
 */
export const get = async ({ id }) => {
  const todo = await database("todos").where({ id });
  return todo;
};

/**
 * Get all todos.
 */
export const getAll = async () => {
  const todos = await database("todos");
  return todos;
};

/**
 * Create a new todo.
 * If creation_date is not provided, then current date should be the value.
 */
export const create = async ({
  creation_date = new Date().toISOString(),
  content,
  position,
}) => {
  const [id] = await database("todos").insert({
    creation_date,
    content,
    position,
  });

  const todo = await database("todos").where({ id }).first();
  return todo;
};

/**
 * Search for todos respecting given filters.
 */
export const search = async ({ q, status, from, to }) => {
  const query = database("todos");

  if (q) {
    query.where("content", "like", `%${q}%`);
  }

  if (status) {
    query.where("status", status);
  }

  if (from) {
    query.where("creation_date", ">=", from);
  }

  if (to) {
    query.where("creation_date", "<=", to);
  }

  const todos = await query;
  return todos;
};
