class Mpino {
    constructor(id, nom, login, mdp) {
        this._id = id;
        this._nom = nom;
        this._login = login;
        this._mdp = mdp;
    }
    async getAllMpino(con){
        
        const res = await con.query("SELECT * FROM Mpino");
        
        return res.rows;
    }
    
    // Setter pour l'attribut id
    set id(_id) {
        this._id = _id;
    }
    
    // Getter pour l'attribut id
    get id() {
        return this._id;
    }

    // Setter pour l'attribut nom
    set nom(nom) {
        this._nom = nom;
    }
    
    // Getter pour l'attribut nom
    get nom() {
        return this._nom;
    }

    // Setter pour l'attribut login
    set login(login) {
        this._login = login;
    }
    
    // Getter pour l'attribut login
    get login() {
        return this._login;
    }

    // Setter pour l'attribut mdp
    set mdp(mdp) {
        this._mdp = mdp;
    }
    
    // Getter pour l'attribut mdp
    get mdp() {
        return this._mdp;
    }
    //
}
module.exports = Mpino;