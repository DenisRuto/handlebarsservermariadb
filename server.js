const express = require('express')
const { engine } = require('express-handlebars');
const path = require('path')
const mysql = require('mysql')

require('dotenv').config()


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
  });


const app = express()




app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

connection.connect((err)=>{
  if (err) throw err;
  console.log('MySQL Connected...');
})

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/addstudent',(req,res)=>{
    res.render('addstudent')
})
app.post('/addstudent',(req,res)=>{
  const { reg,lastname,firstname,phonenumber,id,course } = req.body;
  const studentdata = [reg,lastname,firstname,phonenumber,id,course]
 


  const query = 'insert into students (studentreg,lastname,firstname,phonenumber,id,course) values (?, ?, ?, ? , ? , ?)';
  connection.query(query, studentdata,(err) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database error');
  }
  console.log('Success');
  res.status(201).send('Student added successfully');
});
})


app.get('/students',(req,res)=>{
  
  const query = 'SELECT * FROM students';
  connection.query(query,(err,results)=>{
    if (err) throw err;
    res.render('students',{ data: results})
  })
  
})



app.listen(3001,()=>{
    console.log('server is working')
})



// connection.query('SELECT * FROM students', (err,rows) => {
//     if(err) throw err;
  
//     results=JSON.parse(JSON.stringify(rows))
//     console.log(results)
//   });
