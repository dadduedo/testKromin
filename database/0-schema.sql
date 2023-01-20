create table users (
  id bigint primary key,
  email varchar(255) not null,
  password varchar(64) not null
);

create table todos (
  id bigint primary key auto_increment,
  creation_date varchar(64) not null,
  content text not null,
  position int,
  status enum ('pending', 'done') default 'pending' not null
);