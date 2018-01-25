# database-js-postgres

[![Build Status](https://travis-ci.org/mlaanderson/database-js-postgres.svg?branch=master)](https://travis-ci.org/mlaanderson/database-js-postgres)

Database-js wrapper for PostgreSQL
## About
Database-js-mysql is a wrapper around the [node-postgres](https://github.com/brianc/node-postgres) package by Brian Carlson. It is intended to be used with the [database-js](https://github.com/mlaanderson/database-js) package. However it can also be used in stand alone mode. The only reason to do that would be to use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
## Usage
### Stand Alone
~~~~
var postgres = require('database-js-postgres');

(async () => {
    let connection, rows;
    connection = postgres.open({
        Hostname: localhost,
        Port: 5432,
        Username: 'my_secret_username',
        Password: 'my_secret_password',
        Database: 'my_top_secret_database'
    });
    
    try {
        rows = await connection.query("SELECT * FROM tablea WHERE user_name = 'not_so_secret_user'");
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
})();
~~~~
### With Database-js
~~~~
var Database = require('database-js2').Connection;

(async () => {
    let connection, statement, rows;
    connection = new Database('database-js-postgres://my_secret_username:my_secret_password@localhost:5432/my_top_secret_database');
    
    try {
        statement = await connection.prepareStatement("SELECT * FROM tablea WHERE user_name = ?");
        rows = await statement.query('not_so_secret_user');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
})();
~~~~