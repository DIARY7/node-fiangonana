const connectBD = require("./connection");

async function main () {
    try {
        const con = await connectBD.connect();
        console.log(con);
        let mpino = await func1(con);
        let alahady = await func2(con);
        console.log("Liste mpino");
        console.log(mpino);
        console.log("Liste alahady");
        console.log(alahady);
        con.release(); // Libérer la connexion après utilisation
    } catch (error) {
        console.error("Une erreur s'est produite:", error);
    }
}

async function func1(con) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * from mpino";
        con.query(sql, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

async function func2(con) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM alahady";
        con.query(sql, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

main();