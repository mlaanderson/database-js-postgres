var pg = require('pg');

var m_connection = Symbol('connection');

class PostgreSQL {
    constructor(connection) {
        this[m_connection] = connection;
    }

    query(sql) {
        var self = this;
        return new Promise((resolve, reject) => {
            self[m_connection].query(sql, (error, data) => {
                if (error) {
                    reject(error);
                } else if (data.rows) {
                    resolve(JSON.parse(JSON.stringify(data.rows)));
                } else {
                    resolve(data);
                }                
            });
        });
    }

    execute(sql) {
        return this.query(sql);
    }

    close() {
        var self = this;
        return new Promise((resolve, reject) => {
            self[m_connection].end((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

function OpenConnection(connection) {
    let base = new pg.Client({
        host: connection.Hostname || 'localhost',
        port: parseInt(connection.Port) || 5432,
        user: connection.Username,
        password: connection.Password,
        database: connection.Database
    });
    base.connect();
    return new PostgreSQL(base);
}
module.exports = {
    open: OpenConnection
};

