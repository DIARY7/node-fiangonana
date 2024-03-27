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
    async setPrediction(idMpino, datyNanontany, montant,nbMoisR){
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
        let daty_debut_ech = datyNanontany;
        let last_alahady = new Alahady();
        let caisse = Number(await this.getCaisseFiangonana(connectDB,1)) ;
        
        
        if ( await this.isAfterSomeone(connectDB,dateNanontany) &&  ! await this.isAfterEcheance(connectDB,dateNanontany)){
            last_alahady = await this.getAlahadyDepart(connectDB);
            let temp_alahady = last_alahady.daty.add(1,'days');
            daty_debut_ech = temp_alahady.toDate();
            last_alahady.daty = last_alahady.daty.subtract(1,'days');
            console.log("Alahady farany id Mpino = "+idMpino+"  alahady farany : "+last_alahady.daty.toDate() + " fahafiry" + last_alahady.fahafiry);
        } 
            
        else{
            last_alahady = await this.getAlahadyFaranyBeforeDemande(connectDB,dateNanontany);
            
        }
        console.log("La variation globale : "+variation);
        let result = await this.setPredictAlahady(connectDB,caisse,montant,idMpino,last_alahady,variation);       
        
        /* //Le  */

        await this.update_caisse(connectDB,1,result["reste"]);
        await this.putInEcheance(connectDB, idMpino, daty_debut_ech,result['date'],result['isCaisseAmpy']);
        await this.insertDemande(connectDB,idMpino,dateNanontany);
        await this.setRembousement(connectDB,idMpino,montant,nbMoisR);
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
            let tempYear = year_demande-1;
            while (tempYear>=2022) {
                let tempParam=[alahadyCurrent[i].fahafiry,tempYear];
                let res2 = await con.query(sql2,tempParam);
                
                somme+= Number(res2.rows[0].rakitra);
                compte++;
                tempYear--;
            }
            let moyenne = somme/compte;
            let rakitra_predit = moyenne*variation;
            date_temp = date_temp.add(7,'days');
            caisse+=Number(rakitra_predit);
            if (this.isAlahadyFinDuMois(date_temp)) {
                caisse+= await this.montantRembourse(con,date_temp);
            }
            
            await this.insertInPredict(con,idMpino,alahadyCurrent[i].fahafiry,date_temp.toDate(),Number(rakitra_predit));
            if (Number(caisse) >= Number(montant)) {
                let reste = Number(caisse)-Number(montant);
                console.log( "Alahady retournen'i 2025 "+ date_temp.toDate());
                let result = {"reste":reste,"date":date_temp,"isCaisseAmpy":false};
                return result;
            }
        }
        date_temp = date_temp.add(7,'days');
       // console.log("daty farany t@ 2025 :"+ date_temp.toDate())
        // Raha tonga annee prochaine
        return await this.setPredictCompleteMontant(con,caisse,montant,idMpino,date_temp,variation,date_temp.year()-1,fahafiry_demande,date_temp.year());
    }
    async setPredictCompleteMontant(con,caisse,montant,idMpino,date,variation,annee_demande,fahafiry_demande,annee_courante){
        console.log("nandalo tato @ "+annee_courante);
        if (Number(caisse) >= Number(montant)) {
            let reste = Number(caisse)-Number(montant);
            let result = {"reste":reste,"date":date,"isCaisseAmpy":false};
            return result;
        }
        let fahafiry = 1; //logiquement manomboka @1
        let date_temp = date;//Objet moment
        //
        let sql_predict_vola = "SELECT * from prediction where fahafiry = $1  and EXTRACT( YEAR from daty)= $2";
        let sql_tena_vola = "SELECT * from alahady where fahafiry = $1  and EXTRACT( YEAR from daty)= $2";
        while (date_temp.year()==annee_courante) {
            
            let tempYear = annee_courante-1;
            let somme = 0;
            let compte = 0;

            while (tempYear>=2022) {
                
                if (tempYear==annee_demande) {
                    if (fahafiry<=fahafiry_demande) {
                        let param = [fahafiry,tempYear];
                        let res = await con.query(sql_tena_vola,param);
                        somme+= Number(res.rows[0].rakitra);
                        compte++;
                    }
                    else{
                        let param = [fahafiry,tempYear];
                        let res = await con.query(sql_predict_vola,param);
                        somme+= Number(res.rows[0].rakitra);
                        compte++;
                    }
                }
                else if (tempYear<annee_demande) {
                    let param = [fahafiry,tempYear];
                    let res = await con.query(sql_tena_vola,param);
                    somme+= Number(res.rows[0].rakitra);
                    compte++;
                }
                else if (tempYear>annee_demande) {
                    let param = [fahafiry,tempYear];
                    let res = await con.query(sql_predict_vola,param);
                    somme+= Number(res.rows[0].rakitra);
                    compte++;
                }

                tempYear--;
            }

            let moyenne = somme/compte;
            let rakitra_predit = moyenne*variation;
            caisse+= Number(rakitra_predit) ;
            if (this.isAlahadyFinDuMois(date_temp)) {
                caisse+= await this.montantRembourse(con,date_temp);
            }
            
            await this.insertInPredict(con,idMpino,fahafiry,date_temp.toDate(),Number(rakitra_predit));
            
            if ( Number(caisse) >= Number(montant) ) {
                let reste = Number(caisse)-Number(montant);
                let result = {"reste":reste,"date":date_temp,"isCaisseAmpy":false};
                return result;
                
            }

            date_temp = date_temp.add(7,'days');
            fahafiry+=1;
            console.log(fahafiry);
        }
        return await this.setPredictCompleteMontant(con,caisse,montant,idMpino,date_temp,variation,annee_demande,fahafiry_demande,annee_courante+1);

    }

    //Misy remboursement
    isAlahadyFinDuMois(dateALahady){
        let mois1 = dateALahady.month();
        let alahadyManaraka = dateALahady.clone();
        alahadyManaraka = alahadyManaraka.add(7,"days");
        let mois2 = alahadyManaraka.month();
        if ( mois1 != mois2) {
            return true;
        }
        return false;
    }
    async montantRembourse(con,dateALahady){
        let sql = "SELECT sum(montant) as somme from remboursement WHERE $1 >= alahady_debut and $2<= alahady_farany ";
        let param = [dateALahady.toDate(),dateALahady.toDate()];
        let res = await con.query(sql,param);
        return Number(res.rows[0].somme);
    }

    async setRembousement(con,id_mpino,montant,nbMois){
        let montantParMois = Number(montant)/Number(nbMois);
        let sql = "SELECT date_echeance from echeance where id_mpino = $1"
        let param = [id_mpino];
        let res = await con.query(sql,param);
        let alahady = moment(res.rows[0].date_echeance,"YYYY-MM-DD").subtract(1,"days");// D ito ko
        let alahady_debut=alahady.add(7,"days"); // Tonga dia tsy misy an'ito raha manomboka alahady
        while (!this.isAlahadyFinDuMois(alahady_debut)) {
            alahady_debut=alahady_debut.add(7,"days");
            console.log( "Maka alahady debut:   "+ alahady_debut);
        }
        let tena_alahady_debut = alahady_debut.clone();
        let alahady_farany = alahady_debut.add(7,"days");
        let compteMois = 0;
        while (compteMois<nbMois) {
            alahady_farany=alahady_farany.add(7,"days");
            if(this.isAlahadyFinDuMois(alahady_farany)) {
                compteMois++;
                
            }   
        }
        
        let insert ="INSERT INTO remboursement(id_mpino,alahady_debut,alahady_farany,montant) VALUES ($1,$2,$3,$4)";
        let param1 = [id_mpino,tena_alahady_debut.toDate(),alahady_farany.toDate(),montantParMois];
        await con.query(insert,param1);
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
        const res = await con.query(sql,param)
        if (res.rows.length!=0) {
            throw new Error("Vous ne pouvez effectuer un prêt avant un pret precedent");
        }
        
        

    }
    async getVariation(con,dateNanontany){ //Mi ainga avy @ Alahady mi-existe
        let listVariation=[];

        let sql_present = "SELECT fahafiry,rakitra,daty from alahady where daty < $1 and EXTRACT( YEAR from daty)= $2 ORDER BY fahafiry ";
        let sql_precedent = 'SELECT fahafiry,rakitra,daty from alahady where fahafiry = $1  and EXTRACT( YEAR from daty)= $2 ORDER BY fahafiry ';
        const param1 = [dateNanontany.toDate(),dateNanontany.year()];
        const res = await con.query(sql_present,param1);
        let alahadyCurrent = res.rows; //Alahady mi-existe misy rakitra en 2024
        for (let i = 0; i < alahadyCurrent.length; i++) {
                //Mi calcule moyenne
                let somme = 0;
                let compte = 0;
                let tempYear = dateNanontany.year()-1;
                while (tempYear>=2022) {
                    console.log("Temp year : "+tempYear);
                    let tempParam=[alahadyCurrent[i].fahafiry,tempYear];
                    let res2 = await con.query(sql_precedent,tempParam);
                    
                    somme+= Number(res2.rows[0].rakitra) ;
                    compte++;
                    tempYear--;
                    
                }
                let moyenne = somme / compte;
                let variation = Number(alahadyCurrent[i].rakitra) / moyenne;
                listVariation.push(variation);
            }
        let sum=0;
        console.log("Somme des variations");
        for (let i = 0; i < listVariation.length; i++) {
            console.log(listVariation[i]);
            sum+= Number(listVariation[i]);
        }
        console.log("Reo ambony reo");
        let variationGlobal = Number(sum/listVariation.length);
        return variationGlobal;
    }
    async insertInPredict(con,idMpino,fahafiry,daty,rakitra){
        
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
    async getAlahadyDepart(con){ //Mbola tsy mandray raha 2025 ny farany (mila manao alahady misy)

        let sql1 = "SELECT max(date_echeance) as date_depart from echeance "
        let sql2 = "SELECT fahafiry,daty from Alahady where daty = $1 "
        
        let res = await con.query(sql1);
        let date_depart = res.rows[0].date_depart;
        let obj_date_depart = moment(date_depart,'YYYY-MM-DD');
        obj_date_depart = obj_date_depart.subtract(1,"days");
        let param2 = [obj_date_depart.toDate()];

        let res2= await con.query(sql2,param2);
        
        let alahady_depart = new Alahady();
        alahady_depart.constructor_init(res2.rows[0].fahafiry,obj_date_depart,res2.rows[0].rakitra);
        
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
            let sql ="SELECT daty FROM prediction order by daty DESC limit 1 ";
            let res = await con.query(sql);
            let dateEcheance = moment(res.rows[0].daty,"YYYY-MM-DD");
            dateEcheance = dateEcheance.add(1,'days');    
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