const {Client,Pool} = require('pg');
const connectionString = 'postgressql://postgres:root@localhost:5432/SalesTable'




const client = new Client({
    connectionString:connectionString
})

client.connect();

client.query(`SELECT * from SalesMan`, (err,result)=>{
    if (!err){
        console.log('result.rows',result.rows);
    }else {
        client.end();
    }
})