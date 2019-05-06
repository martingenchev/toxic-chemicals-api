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
}

module.exports = () =>{
  return new warehouse()
};
