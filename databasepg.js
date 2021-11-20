const {Pool,Client}  = require('pg')
// const connectionString = 'postgressql://postgres:root@http://127.0.0.1/pgadmin4/SalesTable'
const client = new Client({
    host:"http://localhost:127.0.0.1/",
    user: "postgres",
    post: 5432,
    password: "root",
    database: "SalesTable"
})

// const client = new Client({
//     connectionString:connectionString
// })

client.connect();

client.query('SELECT  * from SalesMan', (err,res)=>{
   if (!err){
       console.log(res.rows);
    }else {
        console.log(err.message);
    }
    client.end()
})

//  client.query(`SELECT * FROM SalesMan`,(err,res)=>{
//      if (!err){
//          console.log(res.rows);
//      }else {
//          console.log(err.message);
//      }
//      client.end;
//  })