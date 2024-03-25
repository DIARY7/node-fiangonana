const moment = require("moment");
const connectDB = require("../connection");

class Alahady{
    // constructor(fahafiry,daty,rakitra){
    //     this._fahafiry = fahafiry;
    //     this._daty = daty;
    //     this._rakitra = rakitra;
    // }
    constructor(con){
        this.con = con;
    }
    // Fonction base
    async setPrediction(idMpino, datyNanontany, montant){
        //const con =  await connectDB;
        //con.query('BEGIN')   

        let dateNanontany = moment(datyNanontany, 'YYYY-MM-DD');
        // Manao plus Days date_nanontany.add(7,'days'); Raha te hiformater date_nanontany.format('YYYY-MM-DD')
        try {
            
            await this.isInEcheance(connectDB,idMpino); // Tsy mahazo mindrana in-ndroa
            await this.isAcceptable(connectDB,dateNanontany); // Mila mifampitohy ilay demande
            console.log("Tonga teto ambany isAcceptable");
        } catch (error) {
            console.log(error);
            throw error;
        }

        // let variation = this.getVariation(con,dateNanontany);
        // let daty_debut_ech = dateNanontany;
        // let last_alahady = new Alahady();
        // caisse = this.getCaisseFiangonana(con,1);
        // let isCaisseAmpy = true;
        // if (this.isAfterSomeone(con,dateNanontany) && !this.isAfterEcheance(con,dateNanontany)){
        //     last_alahady = this.getAlahadyDepart(con);
        //     daty_debut_ech = last_alahady.daty;
            
        // } 
            
        // else{
        //     last_alahady = this.getAlahadyFaranyBeforeDemande(con,dateNanontany);
        // }
        
        // let result = this.setPredictAlahady(con,caisse,montant,idMpino,last_alahady,variation);       
        
        // this.putInEcheance(con, idMpino, datyNanontany,result['date'],result['isCaisseAmpy']);
        // this.insertDemande(con,idMpino,dateNanontany);
        //con.query('COMMIT');
    
    }
    //
    setPredictAlahady(con,caisse,montant,idMpino,last_alahady,variation){ // Le alahady tokony tsy hiova
        if (montant <= caisse){
            let reste = caisse-montant;
            let result = {"reste":reste,"date":last_alahady.daty,"isCaisseAmpy":true};
            return result;
        }
        //
        let date_temp = last_alahady.daty;
        let fahafiry_demande = last_alahady.fahafiry; // Le fahafiry farany avant demande

        let sql1 = "SELECT * from alahady where fahafiry > ?  and EXTRACT( YEAR from daty)= ? ORDER BY fahafiry";
        let sql2 = 'SELECT fahafiry,rakitra,daty from alahady where fahafiry = ?  and EXTRACT( YEAR from daty)= ? ORDER BY fahafiry ';
        
        let param1 = [last_alahady.fahafiry,last_alahady.daty.year];
        con.query(sql1,param1,(err,res)=>{
            let alahadyCurrent = res.rows;
            for (let i = 0; i < alahadyCurrent.length; i++) {
                let somme = 0;
                let compte = 0;
                let tempYear = dateNanontany.year();
                while (tempYear>=2022) {
                    let tempParam=[alahadyCurrent.fahafiry,tempYear];
                    con.query(sql2,tempParam,(err,res)=>{
                        somme+= res.rows[0].rakitra;
                        compte++;
                    });
                    tempYear--;
                }
                let moyenne = somme/compte;
                let rakitra_predit = moyenne*variation;
                caisse+=rakitra_predit;
                date_temp = date_temp.add(7,'days');
                insertInPredict(con,idMpino,alahadyCurrent.fahafiry,date_temp.toString(),rakitra_predit);
                if (caisse>=montant) {
                    let reste = caisse-montant;
                    return reste;
                }
            }
        });

        // Raha tonga annee prochaine
        return this.setPredictCompleteMontant(con,caisse,montant,idMpino,date_temp,variation,date_temp.year,fahafiry_demande,date_temp.year);
    }
    setPredictCompleteMontant(con,caisse,montant,idMpino,date,variation,annee_demande,fahafiry_demande,annee_courante){
        if (caisse>=montant) {
            let reste = caisse-montant;
            let result = {"reste":reste,"date":date,"isCaisseAmpy":false};
            return result;
        }
        let fahafiry = 1; //logiquement manomboka @1
        let date_temp = date;//Objet moment
        //
        let sql_predict_vola = "SELECT * from prediction where fahafiry = ?  and EXTRACT( YEAR from daty)= ? and id_mpino = ?";
        let sql_tena_vola = "SELECT * from alahady where fahafiry = ?  and EXTRACT( YEAR from daty)= ? and id_mpino = ?";
        while (date_temp.year==annee_courante) {
            
            let tempYear = annee_courante;
            let somme = 0;
            let compte = 0;

            while (tempYear>=2022) {
                let param = [fahafiry,tempYear];
                if (tempYear==annee_demande) {
                    if (fahafiry<=fahafiry_demande) {
                        con.query(sql_tena_vola,param,(err,res)=>{
                            somme+= res.rows[0].rakitra;
                            compte++;
                        });
                    }
                    else{
                        con.query(sql_predict_vola,param,(err,res)=>{
                            somme+= res.rows[0].rakitra;
                            compte++;
                        });
                    }
                }
                else if (tempYear<annee_demande) {
                    
                    con.query(sql_tena_vola,param,(err,res)=>{
                        somme+= res.rows[0].rakitra;
                        compte++;
                    });
                }
                else if (tempYear>annee_demande) {
                    con.query(sql_predict_vola,param,(err,res)=>{
                        somme+= res.rows[0].rakitra;
                        compte++;
                    });
                }

                tempYear--;
            }

            let moyenne = somme/compte;
            let rakitra_predit = moyenne*variation;
            caisse+=rakitra_predit;
            date_temp = date_temp.add(7,'days');

            insertInPredict(con,idMpino,fahafiry,date_temp.toString(),rakitra_predit);
            fahafiry++;
            if (caisse>=montant) {
                let reste = caisse-montant;
                return reste;
            }
        }
        return setPredictCompleteMontant(con,caisse,montant,idMpino,date_temp,variation,annee_demande,fahafiry_demande,annee_courante+1);

    }

    //
    async isInEcheance(con, idMpino){
        let sql = "Select * from echeance where id_mpino = $1";
        console.log(idMpino);
        let param = [idMpino];
        const res=await con.query(sql,param);
        if (res.rows.length!=0) {
            throw new Error("Cette personne n'a pas encore remboursé son prêt");
        }
        
        
    }
    async isAcceptable(con,date){
        let sql = "Select * from demande where date_demande > $1 "
        let param = [date.toDate()];
        console.log("date   "+date.toDate());
        const res = await con.query(sql,param)
        if (res.rows.length!=0) {
            throw new Error("Vous ne pouvez effectuer un prêt avant un pret precedent");
        }
        // await con.query(sql,param,(err,res)=>{
        //     if (res.rows.length!=0) {
        //         throw new Error("Vous ne pouvez effectuer un prêt avant un pret precedent");
        //     }
        // })
        

    }
    getVariation(con,dateNanontany){ //Mi ainga avy @ Alahady mi-existe
        let listVariation=[];

        let sql_present = "SELECT fahafiry,rakitra,daty from alahady where daty < ? and EXTRACT( YEAR from daty)= ? ORDER BY fahafiry ";
        let sql_precedent = 'SELECT fahafiry,rakitra,daty from alahady where fahafiry = ?  and EXTRACT( YEAR from daty)= ? ORDER BY fahafiry ';
        const param1 = [dateNanontany,dateNanontany.year()];
        con.query(sql_present,param1,(err1,res1)=>{
            let alahadyCurrent = res1.rows; //Alahady mi-existe misy rakitra en 2024
            for (let i = 0; i < alahadyCurrent.length; i++) {
                //Mi calcule moyenne
                let somme = 0;
                let compte = 0;
                let tempYear = dateNanontany.year();
                while (tempYear>=2022) {
                    let tempParam=[alahadyCurrent.fahafiry,tempYear];
                    con.query(sql_precedent,tempParam,(err,res)=>{
                        somme+= res.rows[0].rakitra;
                        compte++;
                    });
                    tempYear--;
                }
                let moyenne = somme / compte;
                let variation = alahadyCurrent[i].rakitra / moyenne;
                listVariation.push(variation);
            }
        });
        let sum=0;
        for (let i = 0; i < listVariation.length; i++) {
            sum+= listVariation[i];
        }
        let variationGlobal = sum/listVariation.length;
        return variationGlobal;
    }
    insertInPredict(con,idMpino,fahafiry,daty,rakitra){
        let insert = "INSERT INTO prediction(idMpino,fahafiry,daty,rakitra) VALUES (?,?,?,?)";
        const param = [idMpino,fahafiry,daty,rakitra];
        con.query(insert,param,()=>{});
    }
    
    // Raha multi-client
    isAfterSomeone(con,dateNanontany){
        let sql = "SELECT * from echeance where date_debut <= ? ";
        param = (dateNanontany.toString());
        con.query(sql,param,(err,res)=>{
            if (res.rows.length!=0) {
                return true;
            }
        })
        return false;
    }

    isAfterEcheance(con,dateNanontany){
        const sql = "SELECT Max(date_echeance) as max from echeance "
        con.query(sql,(err,res)=>{
            if ( dateNanontany > moment(res.rows[0].max,'YYYY-MM-DD')) {
                return true;  
            } 
        })
        
        return false;
    }
    //
    async getCaisseFiangonana(con,id){

        const sql = "Select caisse from eglise where id = $1";
        param=[id];
        const res = await con.query(sql,param);
        return res.rows[0].caisse;
    }


    async update_caisse(id,caisse){
        const update = "Update eglise set caisse = ? where id = ?";
        const param = [caisse,id];
        await con.query(update);
        
    }
    getAlahadyDepart(con){

        let sql1 = "SELECT max(date_echeance) as date_depart from echeance "
        let sql2 = "SELECT fahafiry,daty from Alahady where daty = ? "
        
        con.query(sql1,(err,res)=>{
            let date_depart = res.rows[0].date_depart;
            param2 = [date_depart.toString()];
            con.query(sql1,param2,(err2,res2)=>{
                let temp_daty = moment(res2.rows[0].daty,"YYYY-MM-DD");
                temp_daty = temp_daty.subtract(1,"days");
                let alahady_depart = new Alahady(res2.rows[0].fahafiry,temp_daty,res2.rows[0].rakitra);
                return alahady_depart;
            });
        });
    
        return null;
    }
    getAlahadyFaranyBeforeDemande(con,dateNanontany){
        let sql = "SELECT Max(fahafiry) as last_fahafiry from alahady where daty < ? ";
        let sql2 = "SELECT fahafiry,daty from alahady where fahafiry = ?";
        let param = [dateNanontany];
        con.query(sql,param,(err,res)=>{
            let param2 = [res.rows[0].last_fahafiry];
            con.sql(sql2,param2,(err2,res2)=>{
                let alahady = new Alahady(res2.rows[0].fahafiry, moment(res2.rows[0].daty,'YYYY-MM-DD'),null);
                return alahady;
            })
        });
    }

    putInEcheance(con, idMpino, dateDebut,dateEcheance,isCaisseAmpy){

        let insert = "INSERT INTO echeance (id_mpino,date_echeance,date_debut) VALUES(?,?,?)";
        let param=[];
        if (isCaisseAmpy) {
            param=[idMpino,dateDebut,dateDebut];
        }
        else{
            dateEcheance = dateEcheance.add(7,'days');
            param = [idMpino,dateDebut,dateEcheance];
        }
        con.query(insert,param,(err,res)=>{});
    }

    insertDemande(con,idMpino,dateDemande){
        let insert = "INSERT INTO demande (id_mpino,date_demande) VALUES(?,?)";
        let param = [idMpino,dateDemande];
        con.query(insert,param,(err,res)=>{});
    }
    getAllDemande(con){
        let sql = "SELECT * from demande";
        con.query(sql,(err,res)=>{
            return res.rows;
        });
    }

    //getters and setters
    get fahafiry(){
        return this._fahafiry;
    }
    set fahafiry(fahafiry){
        this._fahafiry=fahafiry;
    }

    get daty(){
        return this._daty;
    }
    set daty(daty){
        this._daty=daty;
    }

    get rakitra(){
        return this.rakitra;
    }
    set rakitra(rakitra){
        this.rakitra=rakitra;
    }



}
module.exports = Alahady;