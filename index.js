// const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const express=require("express");
const app=express();

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql2');

const connection=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        database:'animal',
        password:'Varun@01'
    }
);

const port=3000;

app.listen(port,()=>{
    console.log("server started");
});

  

app.get("/",(req,res)=>{
    let q="SELECT * FROM info";
    try {
        connection.query(q,(err,result)=>{
            if (err) {
               throw err; 
            }
            // res.send(result);
            let users=result;
            res.render("home.ejs",{ users });
        });    
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM info WHERE Id='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if (err) {
               throw err; 
            }
            let user=result[0];
            // res.send(user.Id);

            res.render("user.ejs",{ user });
        });    
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {username: newname}=req.body;
    // res.send("success");
    let q2=`UPDATE info SET username='${newname}' WHERE id='${id}'`;
    try {
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    res.redirect("/");
                })
            
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.post("/user/new",(req,res)=>{
    let {changename: name}=req.body;
    // res.send(uuidv4());
    let q3=`INSERT INTO info (Id,Username) VALUES ('${uuidv4()}','${name}')`;
    try {
        connection.query(q3,(err,result)=>{
            if(err) throw err;
            res.redirect("/");
        })
    
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});