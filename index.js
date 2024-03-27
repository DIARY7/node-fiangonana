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
// const mymoment = moment('2024-02-26','YYYY-MM-DD');
// let mois1 = mymoment.month(); 
// const mymoment1 = mymoment.add(7,"days");
// let mois2 = mymoment1.month();
// console.log("mois 1 " + mois1);
// console.log("mois 2 " + mois2);
//console.log( "L'index du mois:  "+ mymoment.month());
//console.log( "L'index du mois1:  "+ mymoment1.month());

// let sql = "SELECT * FROM alahady where daty = $1";
// let date = moment('2023-04-02', 'YYYY-MM-DD');
// console.log(date.toDate());
// let param=[date.toDate()];
// connectBD.query(sql,param,(err,res)=>{
//     console.log("Valiny:    ");
//     console.log(res.rows);
// })psql

/* Mandefa */ 
app.get("/api/getListMpino",(req,res)=>{
    let Mpino = new mpino();
    (async()=>{
        let list_mpino = await Mpino.getAllMpino(connectBD);
        res.send(list_mpino);
    })();
    
})
app.get("/api/getListDemande",(req,res)=>{
    (async()=>{
        let res1 = await connectBD.query("Select  id_mpino,TO_CHAR(date_demande,'YYYY-MM-DD') as date_demande from demande");
        res.send(res1.rows);
    } )();
});
app.get("/api/getListRemboursement",(req,res)=>{
    (async()=>{
        let res1 = await connectBD.query("Select  id_mpino,TO_CHAR(alahady_debut,'YYYY-MM-DD') as alahady_debut, TO_CHAR(alahady_farany,'YYYY-MM-DD') as alahady_farany , montant from remboursement");
        res.send(res1.rows);
    } )();
})
app.get("/api/getListCarnet",(req,res)=>{
    
    (async()=>{

        let Alahady = new alahady();
        let Echance = new echeance();
        let caisse = await Alahady.getCaisseFiangonana(connectBD,1);
        let carnets = await Echance.liste_echeance(connectBD);
        // for (let i = 0; i < carnets.length; i++) {
        //     console.log("mpino carnet : "+carnets[i].echeance.idMpino);
        // }
        let carnetStringifie = JSON.stringify(carnets);
        let data={"caisse":caisse,"carnets":carnetStringifie};
        
        
        res.send(data);
        
    })();
})

/* Mandray */
app.post("/api/sendFampindramana",(req,res)=>{
    (async()=>{
        try {
            const formData = req.body;
            let Alahady = new alahady();
            await Alahady.setPrediction(formData.id,formData.daty,formData.somme,formData.nbMoisR);
            res.json("Nety tsara le insertion");
            console.log(req.body);
        } catch (error) {
            console.log(error);
            res.json(error.message);
        }
    })();
    
})
