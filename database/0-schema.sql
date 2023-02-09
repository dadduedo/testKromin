create table users (
  id bigint primary key auto_increment,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  email varchar(255) not null,
  password varchar(64) not null
);

create table todos (
  id bigint primary key auto_increment,
  creation_date timestamp not null,
  due_date timestamp,
  content text not null,
  position int,
  user_id bigint,
  status enum ('pending', 'done') default 'pending' not null
);