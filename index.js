//Mi creer serveur

const connectBD = require("./connection");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const moment = require("moment");

const alahady = require('./model/alahady');
const echeance = require('./model/echeance');
const mpino = require('./model/mpino');
const { rows } = require("mssql");

const port = process.env.PORT;

app.use(bodyParser.json());

app.use(cors());
//app.use(express.static("front-end"));
app.listen(5033,()=>{
    console.log("Serveur is online");
})

let sql = "SELECT * FROM alahady where daty = $1";
let date = moment('2023-04-02', 'YYYY-MM-DD');
console.log(date.toDate());
let param=[date.toDate()];
connectBD.query(sql,param,(err,res)=>{
    console.log("Valiny:    ");
    console.log(res.rows);
})

/* Mandefa */ 
app.get("/api/getListMpino",(req,res)=>{
    let Mpino = new mpino();
    (async()=>{
        console.log("Nande tato n*man***************");
        let list_mpino = await Mpino.getAllMpino(connectBD);
        console.log(list_mpino);
        res.send(list_mpino);
    })();
    
})
app.get("/api/getListDemande",(err,res)=>{
    connectBD.connect().query("Select * from demande",(err1,res1)=>{
        res.send(res1.rows);
    });
});
app.get("/api/getListCarnet",(err,res)=>{
    //let con = connectBD;
    (async()=>{

        let Alahady = new alahady();
        let Echance = new echeance();
        let caisse = Alahady.getCaisseFiangonana(connectBD,1);
        let carnets = Echance.liste_echeance(connectBD);
        let data={"caisse":caisse,"carnets":carnets};
        res.send(data);
        
    })();
})

/* Mandray */
app.post("/api/sendFampindramana",(req,res)=>{
    const formData = req.body;
    let Alahady = new alahady();
    (async()=>{
        try {
            await Alahady.setPrediction(formData.id,formData.daty,formData.somme);
            res.json("Nety tsara le insertion");
            console.log(req.body);
        } catch (error) {
            res.json(error);
        }
    })();
    
})
