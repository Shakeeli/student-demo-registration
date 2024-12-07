# Student Demo Registration - React App

This project is a React-based application for managing student registrations.

## Prerequisites

1. **Node.js** and **npm** should be installed on your system. You can download Node.js from [here](https://nodejs.org/).

2. **MySQL** should be set up and running. You can use Docker to run MySQL.

## Setting Up the Project

### 1. Clone the repository

First, clone the project to your local machine:

```bash
git clone https://github.com/Shakeel1/student-demo-registration.git
cd student-demo-registration

### 2. Install Dependencies
Run the following command to install the required Node.js dependencies:

npm install

### 3. Setup MySQL
Ensure that MySQL is running on your machine. You can use Docker to easily set up MySQL. To start the MySQL container, run:

docker start mysql-container


### 4. Import the SQL File
The database structure and sample data are contained in the src/student_demo_registration.sql file. To import this into your MySQL database, run the following command:

docker exec -it mysql-container mysql -u root -p student_demo_registration < src/student_demo_registration.sql


### 5. Start React App
npm start
