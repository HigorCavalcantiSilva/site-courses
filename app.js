const express = require("express");
const axios = require("axios").default;
const bodyParser = require("body-parser");
const qs = require("qs");

const app = express();

var data = [];

const host = "http://maquiagemback.atwebpages.com";

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

app.use(express.static("."));

app.set('views', __dirname + "\\public");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("index")
});

app.get("/dashboard", function(req, res){
    res.render("dashboard", {res: data})
});

app.get("/dashboard-admin", function(req, res){
    res.render("dashboard-admin")
});

app.get("/profile", function(req, res){
    res.render("profile")
});

app.get("/course", function(req, res){
    axios.get(host + "/get-course.php").then(response => {
        res.render("course", {res: response.data});
    });
});

app.get("/feedback", function(req, res){
    res.render("feedback")
});

app.get("/ratings", function(req,res){
    res.send("Em Desenvolvimento...");
});

app.post("/login", function(req, res){
    axios.get(host + "/get-student.php").then(response => {
        // returning the data here allows the caller to get it through another .then(...)
        for(let i = 0; i < response.data.length; i++){
            if(response.data[i].user == req.body.user && response.data[i].pass == req.body.password){
                data = response.data[i];
                if(response.data[i].adm == 1) {
                    res.render("dashboard-admin", {res: data});
                } else {
                    res.render("dashboard", {res: data});
                }
                res.end();
            } else {
                if(i == response.data.length - 1){
                    res.send("<script>alert('USUÁRIOS OU SENHA INCORRETOS! TENTE NOVAMENTE.'); location.href = '/';</script>")
                }
                continue;
            }
        }
    })
});

app.post("/feedback", function(req, res){
    res.send("OK")
});

app.post("/addAluno", function(req, res){
    const data = {
        id: req.body.id,
        nome: req.body.nome,
        user: req.body.user,
        password: req.body.pass,
        email: req.body.email,
        cell: req.body.cell,
        admin: req.body.adm
    }
    let crud;
    if(data.id != "0"){
        crud = host + "/edit-student.php";
    } else {
        crud = host + "/add-student.php";
    }
    axios.post(crud, qs.stringify(data))
    .then( response => {
        if(response.data.res){
            res.send("<script>alert('ALUNO SALVO COM SUCESSO!'); location.href = '/';</script>");
        } else {
            res.send("<script>alert('ERRO AO SALVAR ALUNO!'); location.href = '/';</script>");
        }
    });
});

app.post("/addCurso", function(req, res){
    const data = {
        id: req.body.id,
        num: req.body.num,
        title: req.body.title,
        link: req.body.link,
        descript: req.body.descript
    }
    let crud;
    if(data.id != "0"){
        crud = host + "/edit-course.php";
    } else {
        crud = host + "/add-course.php";
    }
    axios.post(crud, qs.stringify(data))
    .then( response => {
        if(response.data.res){
            res.send("<script>alert('CURSO SALVO COM SUCESSO!'); location.href = '/';</script>");
        } else {
            res.send("<script>alert('ERRO AO SALVAR CURSO!'); location.href = '/';</script>");
        }
    });
});

app.listen(8000);