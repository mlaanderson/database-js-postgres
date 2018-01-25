var pg = require('pg');

var m_connection = Symbol('connection');
var m_transaction = Symbol('transaction');

class PostgreSQL {
    constructor(connection) {
        this[m_connection] = connection;
        this[m_transaction] = false;
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

    isTransactionSupported() {
        return true;
    }

    inTransaction() {
        return this[m_transaction];
    }

    beginTransaction() {
        var self = this;
        if (this.inTransaction() == true) {
            return Promise.resolve(false);
        }
        return new Promise((resolve, reject) => {
            this.execute('BEGIN')
            .then(() => {
                self[m_transaction] = true;
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    commit() {
        var self = this;
        if (this.inTransaction() == false) {
            return Promise.resolve(false);
        }
        return new Promise((resolve, reject) => {
            this.execute('COMMIT')
            .then(() => {
                self[m_transaction] = false;
                resolve(true);
            })
            .catch(error => {
                reject(error);
            })
        });
    }

    rollback() {
        var self = this;
        if (this.inTransaction() == false) {
            return Promise.resolve(false);
        }
        return new Promise((resolve, reject) => {
            this.execute('ROLLBACK')
            .then(() => {
                self[m_transaction] = false;
                resolve(true);
            })
            .catch(error => {
                reject(error);
            })
        });
    }
}

/**
 * 
 * @param {{Hostname: string, Port: number, Username: string, Password: string, Database: string}} connection 
 */
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

