
// const sql = require('mssql/msnodesqlv8');
// const config = {
    
//     server:'172.0.0.1',
//     database:'fiangonana',
//     driver:'SQL Server', 
//     options: {
//         trustServerCertificate: true,
//         trustedConnection:true
//     }
// }
// //const config = "server=.;Database=fiangonana;Trusted_Connection:Yes;Driver = SQL Server";

// async function connectBD(){
//     try {
//         await sql.connect(config);
//         console.log("le driver est = "+sql.driver);
        
//         console.log('Connecté a la base de données SQL Server');
        
//     } catch (error) {
//         console.log(error)
//     }
// }

const {Client} = require('pg');
const client=new Client(
    {
        host:'localhost',
        user:'postgres',
        port:5432,
        password:'root',
        database:'fiangonana'
    }
)
client.connect();
module.exports = client;
