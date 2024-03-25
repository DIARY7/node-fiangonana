class Echeance {
    constructor(nomMpino, idMpino, dateDebut, dateEcheance) {
        this._nomMpino = nomMpino;
        this._idMpino = idMpino;
        this._dateDebut = dateDebut;
        this._dateEcheance = dateEcheance;
    }

    liste_echeance(con){

        let sql = "SELECT * from v_echeance";
        let sql2="SELECT daty,rakitra FROM prediction where id_mpino =?";
        let liste_carnet=[]
        con.query(sql,(err,res)=>{
            let list_echeance = res.rows;
            for (let i = 0; i < list_echeance.length; i++) {
                let param = [list_echeance[i].id_mpino];
                let list_predict=[];
                con.query(sql2,param,(err2,res2)=>{
                    let predictions = res2.rows;
                    for (let i = 0; i < predictions.length; i++) {
                        list_predict[i]={"daty":predictions[i].daty,"rakitra":predictions[i].rakitra};
                    }
                })
                let echeance = new Echance(list_echeance.nom, list_echeance.id_mpino, list_echeance.date_debut, list_echeance.date_echeance);
                carnet = CarnetMpino(echeance, list_predict);
                liste_carnet.append(carnet)
            }
        })
        
    }

    // Setter pour l'attribut nomMpino
    set nomMpino(nomMpino) {
        this._nomMpino = nomMpino;
    }
    
    // Getter pour l'attribut nomMpino
    get nomMpino() {
        return this._nomMpino;
    }

    // Setter pour l'attribut idMpino
    set idMpino(idMpino) {
        this._idMpino = idMpino;
    }
    
    // Getter pour l'attribut idMpino
    get idMpino() {
        return this._idMpino;
    }

    // Setter pour l'attribut dateDebut
    set dateDebut(dateDebut) {
        this._dateDebut = dateDebut;
    }
    
    // Getter pour l'attribut dateDebut
    get dateDebut() {
        return this._dateDebut;
    }

    // Setter pour l'attribut dateEcheance
    set dateEcheance(dateEcheance) {
        this._dateEcheance = dateEcheance;
    }
    
    // Getter pour l'attribut dateEcheance
    get dateEcheance() {
        return this._dateEcheance;
    }
}

class CarnetMpino {
    constructor(echeance, listePredict) {
        this._echeance = echeance;
        this._listePredict = listePredict;
    }

    // Setter pour l'attribut echeance
    set echeance(echeance) {
        this._echeance = echeance;
    }
    
    // Getter pour l'attribut echeance
    get echeance() {
        return this._echeance;
    }

    // Setter pour l'attribut listePredict
    set listePredict(listePredict) {
        this._listePredict = listePredict;
    }
    
    // Getter pour l'attribut listePredict
    get listePredict() {
        return this._listePredict;
    }
}

module.exports=Echeance;