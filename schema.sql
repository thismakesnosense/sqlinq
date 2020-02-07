USE office_db;


CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary decimal,
  department_id int,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT Null,
  role_id int,
  manager_id int,
  PRIMARY KEY (id)
);

-- Insert a set of records.
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John','Jacob', 7, 12);