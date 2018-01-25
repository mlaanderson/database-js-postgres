var Postgres = require('.');


var Connection = Postgres.open({
    Hostname: 'localhost',
    Port: 5432,
    Username: 'postgres',
    Database: 'test'
});

var promises = [];
promises.push(Connection.execute('DROP TABLE IF EXISTS test1; CREATE TABLE test1 (key character varying(255), value character varying(1024));').then(() => {
    promises.push(Connection.execute("INSERT INTO test1 VALUES('name', 'Michael Anderson');").then(() => {
        promises.push(Connection.query("SELECT * FROM test1 WHERE key = 'name';").then(data => {
            if (data.length != 1) {
                console.error('Invalid data returned');
                Connection.execute('DROP TABLE test1;').then(() => {
                    Connection.close().then(() => {
                        process.exit(1);
                    });
                })
            }
        }));
    }));
}));

Promise.all(promises).then(() => {
    Connection.execute('DROP TABLE IF EXISTS test1;').then(() => {
        Connection.close().then(() => {
            process.exit(0);
        });
    });
});
