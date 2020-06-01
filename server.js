//configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos extras
server.use(express.static("public"))

// habilitar body
server.use(express.urlencoded({extended: true}))

// banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe' // nome do banco de dados
})


// condigurando a template engine (nunjucks)
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,

})


// configurar a apresentação da pagina
server.get("/", function(req, res){

    db.query("SELECT * FROM donors", function(err, result){ // donors nome da tabela

        if(err) return res.send("Erro de Banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})

// req = requisição
// res = resposta
server.post("/", function(req, res){
     // pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatorios!")

    }

    //ADICIONA no cando de dados
    const query = 
        `INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
        // substitui o $1, $2, $3
        
    const values = [name, email, blood]
      
    db.query(query, values, function(err){
        // Fluxo de erro
        if(err) return res.send("erro no banco de dados!")

        // fluxo ideal
        return res.redirect("/")
    })    
        
})

//ligar o servidor e acessar na porta 3000
//Ex: localhost:3000 ou http://127.0.0.1:3000/
// comando node server.js

server.listen(3000, function(){
    console.log("iniciei o servidor.")
})