-- Dojo General Info / Dojo Info /Dojo Table
Create Table Dojo (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	hero_title TEXT,
	hero_subtitle TEXT,
	hero_image_url TEXT,
	established_date TEXT,
	description TEXT
);

-- Newsletter Subscriber in Home and About Page
Create Table Subscribers(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT UNIQUE NOT NULL,
	subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
 
 
-- Martal arts class/program
Create Table Programs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
	image_url TEXT,
	image BLOB
);

ALTER Table Programs ADD COLUMN pricing TEXT;

-- Team Members/ Instructors The Team Behind
Create Table Instructor (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT not null,
	role TEXT not null,
	phone TEXT,
	email TEXT,
	photo_url TEXT,
	photo BLOB
);

-- What We Do: HighLights
Create Table HighLights(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	content TEXT
);

-- Exisiting table unchanged --
Create Table Admin (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT not null,
	password_hash TEXT not null
)