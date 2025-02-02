# chat_app

## Installation Guide

### Cloning a repository 

* On GitHub.com, navigate to the main page of the [repository](https://github.com/arezooq/chat_app).
* Above the list of files, click <>Code.

* Copy the URL for the repository.

To clone the repository using an SSH key, including a certificate issued by your organization's SSH certificate authority, click SSH, then click .

  1. Open Terminal.

  2. Change the current working directory to the location where you want the cloned directory.

  3. Type git clone, and then paste the URL you copied earlier.

    git clone git@github.com:arezooq/chat_app.git

  4. Press Enter to create your local clone.

    git clone git@github.com:arezooq/chat_app.git

     Cloning into 'chat_app'...
     remote: Enumerating objects: 4522, done.
     remote: Counting objects: 100% (4522/4522), done.
     remote: Compressing objects: 100% (3371/3371), done.
     remote: Total 4522 (delta 959), reused 4522 (delta 959), pack-reused 0
     Receiving objects: 100% (4522/4522), 22.08 MiB | 2.38 MiB/s, done.
     Resolving deltas: 100% (959/959), done.


### Install

* Install Xampp & Run command to start services:
 
   sudo /opt/lampp/lampp start


*  Run npm install to install all dependencies

### Usage

* Create database in phpmyadmin name database : node_sequelize_chatapp_db
* Run nodemon server.js to start the application.
* Connect to the Login page using on port 3004.


### Technologies Used

* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.

* [ExpressJS](https://www.expressjs.org/) This is a NodeJS web application framework.

* [Embedded JavaScript templating.](https://ejs.co/)  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. No religiousness about how to organize things. No reinvention of iteration and control-flow. It's just plain JavaScript.


### Author

* [Arezoo Ghorbanzade](https://github.com/arezooq)
* [Farnaz Madadi](https://github.com/farnazmmd)
