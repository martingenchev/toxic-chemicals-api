dbConnect = require('../DB/connectDB');

class warehouse {
    //create a contrustor with empty array to export data
    constructor(){
        this.data = [];
    }
    //testing function
    getData(){
        // we have two options either use promises or async wait
        // for getting data from DB server
        return new Promise( (resolve, reject)=>{
            const $query = 'SELECT * from users';

            dbConnect.connection.query($query, (err, rows)=>{
                if(err){
                    console.log('Error in the query');
                    //promise didn't happend because of error
                    reject(err);
                }
                 resolve(rows);
            });

        });
    } // getData()

    InsertData(obj){

        return new Promise( (resolve, reject)=>{
            const $query = `INSERT INTO users Values('null', '${obj.first_name}','${obj.last_name}','${obj.email}','${obj.password}','${obj.phone}','${obj.company_name}','${obj.admin}'  )`;

            dbConnect.connection.query($query, (err, rows)=>{
                if(err){
                    console.log('Error in the query');
                    //promise didn't happend because of error
                    reject(err);
                }
                resolve(rows);
                dbConnect.connection.release();
            });

        });
    }
}

module.exports = () =>{
  return new warehouse()
};
