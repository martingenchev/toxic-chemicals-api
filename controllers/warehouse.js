dbConnect = require('../DB/connectDB');
collaborator = require('../controllers/collaborator')();

class warehouse {
    getAllInventory(){
        // for getting data from DB server
        return new Promise( (resolve, reject)=>{
            const $query = 'SELECT * FROM warehouse_inventory_view';

            dbConnect.connection.query($query, (err, rows)=>{
                if(err){
                    console.log('Error in the query');
                    //promise didn't happend because of error
                    reject(err);
                }
                resolve(rows);

            });
            dbConnect.connection.end()
        });
    } // getAllInventory()

    updateInventory(data){
        return new Promise( (resolve,reject)=>{
            // getting the warehouse inventory based on the chemical and warehouse id
            // Updating the warehouse inventory.
            dbConnect.connection.beginTransaction(function(err) {
                if (err) { reject('transaction error', err) ; return }
                const $query1 = `SELECT * FROM warehouse_inventory_view WHERE warehouse_id = ${data.warehouse_id} AND type = '${data.chemicalType}' ` ;
                dbConnect.connection.query($query1,(error, result)=> {


                        console.log(result);
                        let chemicalID = collaborator.returnChemicalID(data.chemicalType);
                        let newQuanity = result[0].quantity + data.quantity;
                        // TODO Total quantity of all chemicals cannot be more of the newQuantity
                        if(newQuanity > result[0].capacity){
                            reject('Quantity cannot be more than  the capacity');
                            return;
                        }
                    const $query2 = `UPDATE warehouse_inventory SET quantity = ${newQuanity} WHERE warehouse_id = ${data.warehouse_id} AND chemical_type_id = '${chemicalID}'` ;
                    dbConnect.connection.query($query2, (err2, results) =>{
                        if (err2) {
                            return dbConnect.connection.rollback(function() {
                                reject('Something wrong with teh query' , err2)
                                return
                            });
                        }
                        dbConnect.connection.commit(function(errCommit) {
                            if (errCommit) {
                                return dbConnect.connection.rollback(function() {
                                  reject('Commit Error', errCommit)
                                    return
                                });
                            }
                           resolve('success')
                        });
                    });
                });
            });
        }); // end of promise land
    } //updateInventory


}

module.exports = ()=>{
    return new warehouse();
};
