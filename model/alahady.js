const moment = require("moment");
const connectDB = require("../connection");

class Alahady{
    constructor_init(fahafiry,daty,rakitra){
        this._fahafiry = fahafiry;
        this._daty = daty;
        this._rakitra = rakitra;
    }
    constructor(){
        
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

        let variation = await this.getVariation(connectDB,dateNanontany);
        let daty_debut_ech = dateNanontany;
        let last_alahady = new Alahady();
        let caisse = await this.getCaisseFiangonana(connectDB,1);
        let isCaisseAmpy = true;
        if ( await this.isAfterSomeone(connectDB,dateNanontany) &&  ! await this.isAfterEcheance(connectDB,dateNanontany)){
            last_alahady = await this.getAlahadyDepart(connectDB);
            daty_debut_ech = last_alahady.daty;
            
        } 
            
        else{
            last_alahady = await this.getAlahadyFaranyBeforeDemande(connectDB,dateNanontany);
        }
        
        let result = await this.setPredictAlahady(connectDB,caisse,montant,idMpino,last_alahady,variation);       
        
        await this.update_caisse(connectDB,1,result["reste"]);
        await this.putInEcheance(connectDB, idMpino, datyNanontany,result['date'],result['isCaisseAmpy']);
        await this.insertDemande(connectDB,idMpino,dateNanontany);
        //con.query('COMMIT');
    
    }
    //
    async setPredictAlahady(con,caisse,montant,idMpino,last_alahady,variation){ // Le alahady tokony tsy hiova
        if (montant <= caisse){
            let reste = caisse-montant;
            let result = {"reste":reste,"date":last_alahady.daty,"isCaisseAmpy":true};
            return result;
        }
        //
        let date_temp = last_alahady.daty;
        let fahafiry_demande = last_alahady.fahafiry; // Le fahafiry farany avant demande
        let year_demande = last_alahady.daty.year();

        let sql1 = "SELECT * from alahady where fahafiry > $1  and EXTRACT( YEAR from daty)= $2 ORDER BY fahafiry";
        let sql2 = 'SELECT fahafiry,rakitra,daty from alahady where fahafiry = $1  and EXTRACT( YEAR from daty)= $2 ORDER BY fahafiry ';
        
        let param1 = [last_alahady.fahafiry,last_alahady.daty.year()];
        
        let res = await con.query(sql1,param1);
        let alahadyCurrent = res.rows;
        for (let i = 0; i < alahadyCurrent.length; i++) {
            let somme = 0;
            let compte = 0;
            let tempYear = year_demande;
            while (tempYear>=2022) {
                let tempParam=[alahadyCurrent[i].fahafiry,tempYear];
                let res2 = await con.query(sql2,tempParam);
                console.log(res2.rows);
                somme+= res2.rows[0].rakitra;
                compte++;
                tempYear--;
            }
            let moyenne = somme/compte;
            let rakitra_predit = moyenne*variation;
            caisse+=rakitra_predit;
            date_temp = date_temp.add(7,'days');
            await this.insertInPredict(con,idMpino,alahadyCurrent[i].fahafiry,date_temp.toDate(),rakitra_predit);
            if (caisse>=montant) {
                let reste = caisse-montant;
                let result = {"reste":reste,"date":date_temp,"isCaisseAmpy":false};
                return result;
            }
        }

        // Raha tonga annee prochaine
        return await this.setPredictCompleteMontant(con,caisse,montant,idMpino,date_temp,variation,date_temp.year(),fahafiry_demande,date_temp.year());
    }
    async setPredictCompleteMontant(con,caisse,montant,idMpino,date,variation,annee_demande,fahafiry_demande,annee_courante){
        if (caisse>=montant) {
            let reste = caisse-montant;
            let result = {"reste":reste,"date":date,"isCaisseAmpy":false};
            return result;
        }
        let fahafiry = 1; //logiquement manomboka @1
        let date_temp = date;//Objet moment
        //
        let sql_predict_vola = "SELECT * from prediction where fahafiry = $1  and EXTRACT( YEAR from daty)= $2 and id_mpino = $3";
        let sql_tena_vola = "SELECT * from alahady where fahafiry = $1  and EXTRACT( YEAR from daty)= $2";
        while (date_temp.year()==annee_courante) {
            
            let tempYear = annee_courante;
            let somme = 0;
            let compte = 0;

            while (tempYear>=2022) {
                
                if (tempYear==annee_demande) {
                    if (fahafiry<=fahafiry_demande) {
                        let param = [fahafiry,tempYear];
                        let res = await con.query(sql_tena_vola,param);
                        somme+= res.rows[0].rakitra;
                        compte++;
                    }
                    else{
                        let param = [fahafiry,tempYear,idMpino];
                        let res = await con.query(sql_predict_vola,param);
                        somme+= res.rows[0].rakitra;
                        compte++;
                    }
                }
                else if (tempYear<annee_demande) {
                    let param = [fahafiry,tempYear];
                    let res = await con.query(sql_tena_vola,param);
                    somme+= res.rows[0].rakitra;
                    compte++;
                }
                else if (tempYear>annee_demande) {
                    let param = [fahafiry,tempYear,idMpino];
                    let res = await con.query(sql_predict_vola,param);
                    somme+= res.rows[0].rakitra;
                    compte++;
                }

                tempYear--;
            }

            let moyenne = somme/compte;
            let rakitra_predit = moyenne*variation;
            caisse+=rakitra_predit;
            date_temp = date_temp.add(7,'days');
            
            await this.insertInPredict(con,idMpino,fahafiry,date_temp.toDate(),rakitra_predit);
            fahafiry++;
            if (caisse>=montant) {
                let reste = caisse-montant;
                let result = {"reste":reste,"date":date_temp,"isCaisseAmpy":false};
                return result;
                
            }
        }
        return await this.setPredictCompleteMontant(con,caisse,montant,idMpino,date_temp,variation,annee_demande,fahafiry_demande,annee_courante+1);

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
        
        

    }
    async getVariation(con,dateNanontany){ //Mi ainga avy @ Alahady mi-existe
        let listVariation=[];

        let sql_present = "SELECT fahafiry,rakitra,daty from alahady where daty < $1 and EXTRACT( YEAR from daty)= $2 ORDER BY fahafiry ";
        let sql_precedent = 'SELECT fahafiry,rakitra,daty from alahady where fahafiry = $1  and EXTRACT( YEAR from daty)= $2 ORDER BY fahafiry ';
        const param1 = [dateNanontany,dateNanontany.year()];
        const res = await con.query(sql_present,param1);
        let alahadyCurrent = res.rows; //Alahady mi-existe misy rakitra en 2024
       
        for (let i = 0; i < alahadyCurrent.length; i++) {
                //Mi calcule moyenne
                let somme = 0;
                let compte = 0;
                let tempYear = dateNanontany.year();
                while (tempYear>=2022) {
                    let tempParam=[alahadyCurrent[i].fahafiry,tempYear];
                    let res2 = await con.query(sql_precedent,tempParam);
                    
                    somme+= res2.rows[0].rakitra;
                    compte++;
                    tempYear--;
                }
                let moyenne = somme / compte;
                let variation = alahadyCurrent[i].rakitra / moyenne;
                listVariation.push(variation);
            }
        let sum=0;
        for (let i = 0; i < listVariation.length; i++) {
            sum+= listVariation[i];
        }
        let variationGlobal = sum/listVariation.length;
        return variationGlobal;
    }
    async insertInPredict(con,idMpino,fahafiry,daty,rakitra){
        console.log("Ny inserer prediciton");
        let insert = "INSERT INTO prediction(id_mpino,fahafiry,daty,rakitra) VALUES ($1,$2,$3,$4)";
        const param = [idMpino,fahafiry,daty,rakitra];
        
        await con.query(insert,param);
    }
    
    // Raha multi-client
    async isAfterSomeone(con,dateNanontany){
        let sql = "SELECT * from echeance where date_debut <= $1 ";
        let param = [dateNanontany.toDate()];
        let res = await con.query(sql,param);
        if (res.rows.length!=0) {
            return true;
        }
        return false;
    }

    async isAfterEcheance(con,dateNanontany){
        const sql = "SELECT Max(date_echeance) as max from echeance ";
        let res = await con.query(sql);
        if ( dateNanontany > moment(res.rows[0].max,'YYYY-MM-DD')) {
            return true;  
        } 
        
        return false;
    }
    //
    async getCaisseFiangonana(con,id){

        const sql = "Select caisse from eglise where id = $1";
        let param=[id];
        const res = await con.query(sql,param);
        return res.rows[0].caisse;
    }


    async update_caisse(con,id,caisse){
        const update = "Update eglise set caisse = $1 where id = $2";
        const param = [caisse,id];
        await con.query(update,param);
        
    }
    async getAlahadyDepart(con){

        let sql1 = "SELECT max(date_echeance) as date_depart from echeance "
        let sql2 = "SELECT fahafiry,daty from Alahady where daty = $1 "
        
        let res = await con.query(sql1);
        let date_depart = res.rows[0].date_depart;
        let param2 = [date_depart.toString()];

        let res2= await con.query(sql1,param2);
        let temp_daty = moment(res2.rows[0].daty,"YYYY-MM-DD");
        temp_daty = temp_daty.subtract(1,"days");
        let alahady_depart = new Alahady();
        alahady_depart.constructor_init(res2.rows[0].fahafiry,temp_daty,res2.rows[0].rakitra);
        return alahady_depart;
    }

    async getAlahadyFaranyBeforeDemande(con,dateNanontany){
        let sql = "SELECT fahafiry as last_fahafiry from alahady where daty < $1 order by daty DESC limit 1 ";
        let sql2 = "SELECT fahafiry,daty from alahady where fahafiry = $1 and EXTRACT( YEAR from daty)= $2 ";
        let param = [dateNanontany.toDate()];
        let res = await con.query(sql,param);
        let param2 = [res.rows[0].last_fahafiry,dateNanontany.year()];
        let res2 = await con.query(sql2,param2);
        let alahady = new Alahady();
        alahady.constructor_init(res2.rows[0].fahafiry, moment(res2.rows[0].daty,'YYYY-MM-DD'),null);
        return alahady;
        
    }

    async putInEcheance(con, idMpino, dateDebut,dateEcheance,isCaisseAmpy){

        let insert = "INSERT INTO echeance (id_mpino,date_debut,date_echeance) VALUES($1,$2,$3)";
        let param=[];
        if (isCaisseAmpy) {
            param=[idMpino,dateDebut,dateDebut];
        }
        else{
            console.log("Date echeance avant = "+dateEcheance.toDate());
            dateEcheance = dateEcheance.add(1,'days');
            console.log("Date echeance apres : "+dateEcheance.toDate());
            param = [idMpino,dateDebut,dateEcheance.toDate()];
        }
        await con.query(insert,param);
    }

    async insertDemande(con,idMpino,dateDemande){
        let insert = "INSERT INTO demande (id_mpino,date_demande) VALUES($1,$2)";
        let param = [idMpino,dateDemande.toDate()];
        await con.query(insert,param);
    }
    async getAllDemande(con){
        let sql = "SELECT * from demande";
        let res = await con.query(sql);
        return res.rows;
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