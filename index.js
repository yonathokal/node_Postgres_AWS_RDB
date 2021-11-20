const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const {Client} = require('pg');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
    console.log('before entering to server');
    const client  = new Client({
        host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
        port : 5433,
        user : "postgres",
        password: "rootroot",
        database: "postgres"
    })
    await client.connect();
    client.query(`select * from salestable`,async (err,result)=>{
    if (!err){console.log('result',result);}
    const structuredData = await JSON.stringify(result.rows) 
    res.status(200).send(structuredData) 
    client.end();
    })      
});



app.post('/addsales',async (req,res)=>{
    try {
        var salesman_name = req.body.salesman_name
    var amount = req.body.amount
    var date = req.body.date
    var val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);
    const id = val;
    console.log('salesman_name',salesman_name,'amount',amount,'date',date);
    const client  = new Client({
        host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
        port : 5433,
        user : "postgres",
        password: "rootroot",
        database: "postgres"
    })
    await client.connect();
    const query = `INSERT INTO public.salestable(id, salesman_name, amount, date) VALUES (${id}, '${salesman_name}', '${amount}', '${date}');`;
    console.log('query',query); 
        client.query(`${query}`,async (err,result)=>{
        if (!err){
            const response = ` ${id}, '${salesman_name}', '${amount}', '${date}' inserted SuccessFully`
            console.log('response',response,'result',result)
            res.status(200).send(response);
        }
        client.end();
    })
    } catch (error) {
        res.status(400).send(error);
    }
          
})

//------------------------------------------ getAll data --------------------------------
app.get('/getAll', async (req, res) => {
    try {
        const client  = new Client({
            host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
            port : 5433,
            user : "postgres",
            password: "rootroot",
            database: "postgres"
        })
        await client.connect();
        client.query(`select * from salestable ORDER BY date ASC`,async (err,result)=>{
            if (!err){console.log('result',result);}
            const structuredData = await JSON.stringify(result.rows) 
            res.status(200).send(structuredData) 
            client.end();
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

//------------------------------------------ getAll data for a day --------------------------------

app.get('/getdaily/', async (req, res) => {
    try {
        const daily = req.query.date
    console.log('daily',daily);
    const client  = new Client({
        host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
        port : 5433,
        user : "postgres",
        password: "rootroot",
        database: "postgres"
    })
    await client.connect();
    const query = `select * from salestable where DATE(date) = '${daily}' ORDER BY date ASC`
    client.query(query,async (err,result)=>{
        if (!err){console.log('result',result.rows);}
        const arr = [];
        for (const data of result.rows){
            const time = `Hour : ${data.date.toLocaleTimeString().slice(0,2)} | Sales : ${data.amount}`;
            console.log('.getHours();',time)
            arr.push(time)
        }
        console.log('arr',arr);
        res.status(200).send(arr) 
        client.end();
    })
    } catch (error) {
        res.status(400).send(error);
    }      
});

//------------------------------------------ getAll data - past 7 days--------------------------------

app.get('/getweekly/', async (req, res) => {
    try {
        const client  = new Client({
            host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
            port : 5433,
            user : "postgres",
            password: "rootroot",
            database: "postgres"
        })
        await client.connect();
        const days = `'7 days'`
        const query = `SELECT DATE(date) as Date,sum(amount) as TotalSale
            FROM public.salestable
            where DATE(date) > current_date - interval '7 days'
            group by DATE(date)
            order by DATE(date) DESC` 
        console.log(query);
        client.query(query,async (err,result)=>{
            if (!err){console.log('result',result.rows);}
            const structuredData = await JSON.stringify(result.rows) 
            res.status(200).send(JSON.parse(structuredData)) 
            client.end();
        })
    } catch (error) {
        res.status(400).send(error);
    }      
});

//------------------------------------------ getAll data - past 30 days--------------------------------

app.get('/getmonthly/', async (req, res) => {
    try {
        const client  = new Client({
            host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
            port : 5433,
            user : "postgres",
            password: "rootroot",
            database: "postgres"
        })
        await client.connect();
        const days = `'7 days'`
        const query = `SELECT DATE(date),sum(amount) as TotalSale
                        FROM public.salestable
                        where DATE(date) > current_date - interval '30 days'
                        group by DATE(date)
                        order by DATE(date) DESC` 
        client.query(query,async (err,result)=>{
            if (!err){console.log('result',result.rows);}
            const structuredData = await JSON.stringify(result.rows) 
            res.status(200).send(JSON.parse(structuredData)) 
            client.end();
        })
    } catch (error) {
        res.status(400).send(error);
    }      
});
//-----------------------------------------------------------------------------------

app.post('/getSales', async(req,res)=> {

    try {
        const from = req.body.from
    const to = req.body.to
    console.log('from',from,'to',to);
    const client  = new Client({
        host: "database-1.celpluavx0lp.us-east-1.rds.amazonaws.com",
        port : 5433,
        user : "postgres",
        password: "rootroot",
        database: "postgres"
    })
    await client.connect();
    const query = `SELECT * FROM public.salestable WHERE date >= '${from}' AND date < '${to}'`;
        client.query(`${query}`,async (err,result)=>{
        if (!err){console.log('result',result);}
        const structuredData = await JSON.stringify(result.rows) 
        res.status(200).send(structuredData) 
        client.end();
    })
    } catch (error) {
        res.status(400).send(error);
    }
          
})



  






// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ..${PORT}`);
  console.log('Press Ctrl+C to quit.');
});