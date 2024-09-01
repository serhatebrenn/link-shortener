const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app= express();
const PORT =3000;

app.use(express.json());

//MySQL bağlantısını yapılandırma
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Serhat1.',
    database:'link_shortener'
});

connection.connect((err)=>{
    if(err){
        console.error('Error connecting to MySQL:',err);
        return;
    }
    console.log('Connected to MySQL!');
});
//Kullanıcı kayıt ve giriş işlemleri burada olacak
app.listen(PORT,()=>{
    console.log('Server is running on http://localhost:${3000}');
});

app.post('/register',async(req,res)=>{
    const{username, password}=req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        connection.query(
            'INSERT INTO users (username,password) VALUES(?,?)',
            [username,hashedPassword],
            (err,results)=>{
                if(err) return res.status(500).send(err);
                res.status(201).send('User register successfully');

            }
        )
    }catch(err){
        res.status(500).send(err);
    }
});
app.post('/login',(req,res)=>{
    const{username, password}=req.body;
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async(err,results) =>{
            if(err) return res.status(500).send(err);
            if(results.length===0)return res.status(401).send('User not found');
            const user =results[0];
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) return res.status(401).send('Invalid credentials');
            const token = jwt.sign({id: user.id},'your_jwt_secret',{expiresIn: '1h'});
            res.json({ token });
        }
    
    );
});
app.post('/shorten',(req,res)=>{
    const{ original_url }=req.body;
    const short_url = Math.random().toString(36).substring(2,8);//kısaltılmış link oluşturma
    connection.query(
        'INSERT INTO links (original_url, short_url)VALUES(?;?)',
        [original_url,short_url],
        (err, results)=>{
            if(err) return res.status(500).send(err);
            res.json({ short_url});
        }
    );

});

app.get('/:short_url', (req, res) => {
    const { short_url } = req.params;
    connection.query(
      'SELECT original_url FROM links WHERE short_url = ?',
      [short_url],
      (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Link not found');
        res.redirect(results[0].original_url);
      }
    );
  });
  
