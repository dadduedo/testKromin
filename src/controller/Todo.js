import database from "../database.js";

/**
 * Create a new todo.
 */
export const create = async ({ content, position }) => {
  const todo = await database("todos").insert({ content, position });
  return todo;
};

/**
 * Search for todos respecting given filters.
 */
export const search = async ({ from, to }) => {
  // TODO
};
