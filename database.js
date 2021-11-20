const {Client}  = require('pg');

const client  = new Client({
    host: "localhost",
    port : 5432,
    user : "postgres",
    password: "root",
    database: "salesdb"
})


client.connect();


client.query(`select * from salestable`,(err,result)=>{
    if (!err){
        console.log('result',result);
    }
    client.end();
})