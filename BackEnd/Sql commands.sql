-- Create Database
CREATE DATABASE assistantapi;
USE assistantapi;
-- Create user_auth table
CREATE TABLE user_auth
(
	user_id varchar(40) PRIMARY KEY,
	user_firstname varchar(30),
	user_lastname varchar(30),
	user_email varchar(30),
	username varchar(30),
	user_pass varchar(50)
);

-- Create Assistant table
CREATE TABLE assistant
(
	assistant_id varchar(40) PRIMARY KEY,
	user_id varchar(40),
	assistant varchar(30),
	description varchar(128),
	last_modified datetime
);

CREATE TABLE database_connection
(
	user_id varchar(40),
	assistant_id varchar(40),
	username varchar(20),
	password varchar(20),
	database_name varchar(20)
);

--Create intent table
CREATE TABLE intent
(
	user_id varchar(40),
	assistant_id varchar(40),
	intent_id varchar(40) PRIMARY KEY,
	previous_intent varchar(40),
	intent_name varchar(30),
	description varchar(128),
	last_modified datetime,
	multiple_reply varchar(20)
);

--Create Message table
CREATE TABLE messages
(
	user_id varchar(40),
	assistant_id varchar(40),
	intent_id varchar(40),
	message_id varchar(40) PRIMARY KEY,
	message_type varchar(20),
	message varchar(500),
	time_created datetime,
		UNIQUE
	unique_message
(intent_id, message_type, message)
);

CREATE TABLE queries
(
	user_id varchar(40),
	assistant_id varchar(40),
	intent_id varchar(40),
	query_id varchar(40) PRIMARY KEY,
	query varchar(255)
);

create table query_table
(
	user_id varchar(40),
	assistant_id varchar(40),
	intent_id varchar(40),
	table_name varchar(40),
	column_name varchar(40),
	compare_condition varchar(40),
	compare_value varchar(40),
	logic varchar(40),
	selected_column varchar(40),
	distinct_column varchar(40)
);

CREATE TABLE entity
(
	user_id varchar(40),
	assistant_id varchar(40),
	intent_id varchar(40),
	entity_id varchar(40),
	entity_name varchar(30),
	entity_type varchar(30),
	entity_value varchar(30),
	UNIQUE
	unique_entity
(intent_id, entity_name)
);


CREATE TABLE richresponses
(
	user_id varchar(40),
	assistant_id varchar(40),
	intent_id varchar(40),
	richresponse_id varchar(40),
	use_query varchar(50),
	card_no int,
	card_name varchar(50),
	card_value varchar(50),
	chip_value varchar(50)
);

CREATE TABLE settings
(
	user_id varchar(40),
	assistant_id varchar(40),
	card_bgcolor varchar(15),
	card_text_color varchar(15),
	card_border varchar(15),
	card_font varchar(40),
	chip_bgcolor varchar(15),
	chip_text_color varchar(15),
	chip_border varchar(15),
	chip_shape varchar(15),
	chip_font varchar(40),
	user_text_bgcolor varchar(15),
	user_font varchar(40),
	user_text_color varchar(15),
	assistant_text_bgcolor varchar(15),
	assistant_font varchar(40),
	assistant_text_color varchar(15),
	chatbox_color varchar(15)
);
