const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

//Database
connection.authenticate().then(()=>{
    console.log("Conexão feita com o banco de dados!")
}).catch((err)=>{
    console.log(err)
})

// Falando para o Express usar o ejs como view engine
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get("/",(req, res)=>{
    Pergunta.findAll({order: [
        ['id', 'DESC'] // ASC
    ]}).then((perguntas)=>{
        res.render("index", {perguntas})
    })
});

app.get("/perguntar", (req, res) => res.render("perguntar"))

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id
    Pergunta.findOne({where: {id}}).then((pergunta)=> {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id}, 
                order: [['id', 'DESC']]})
                .then(respostas=>{
                    res.render("pergunta", {pergunta, respostas})
                })
        }else{
            res.redirect("/")
        }
    })
})


app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao
    Pergunta.create({titulo, descricao}).then(()=>res.redirect('/'))
})

app.post("/responder", (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.perguntaId
    Resposta.create({corpo, perguntaId}).then(()=>res.redirect(`/pergunta/${perguntaId}`))
})

app.listen(8080, () => console.log("App rodando!"))