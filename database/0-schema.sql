create table users (
  id bigint primary key,
  email varchar(255),
  password varchar(64)
);

create table todos (
  id bigint primary key,
  creation_date varchar(64),
  content text,
  position int,
  status enum ('pending', 'done')
);