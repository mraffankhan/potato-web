import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'db.mum-1.endercloud.in',
    port: 3306,
    database: 's1336_Argon',
    user: 'u1336_EGjFu4y4L9',
    password: 'H!0PZBvdZAb58+HZ+^QG.850',
    connectionLimit: 10,
    waitForConnections: true
});
