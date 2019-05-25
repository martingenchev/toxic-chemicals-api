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

        });
    } // getAllInventory()

    updateInventory(data){
        console.log(data)
        return new Promise( (resolve,reject)=>{
            // getting the warehouse inventory based on the chemical and warehouse id
            // Updating the warehouse inventory.
            //TODO we need proper error handling
            dbConnect.connection.beginTransaction(function(err) {
                if (err) { reject('transaction error', err) ; return }
                const $query1 = `SELECT * FROM warehouse_inventory_view WHERE warehouse_id = ${data.warehouse_id} AND type = '${data.type}' ` ;
                dbConnect.connection.query($query1,(error, result)=> {
                        if(error){
                            return reject("Cannot get the inventory in update")
                        }
                        if(result.length === 0 ){
                            return reject("Cannot get the inventory in update")
                        }

                        console.log(result);
                        let chemicalID = collaborator.returnChemicalID(data.type);
                        let newQuanity = result[0].quantity + data.quantity;
                        // TODO Total quantity of all chemicals cannot be more of the newQuantity
                        if(newQuanity > result[0].capacity){
                            return reject('Quantity cannot be more than  the capacity');

                        }
                    const $query2 = `UPDATE warehouse_inventory SET quantity = ${newQuanity} WHERE warehouse_id = ${data.warehouse_id} AND chemical_type_id = '${chemicalID}'` ;
                    dbConnect.connection.query($query2, (err2, results) =>{
                        if (err2) {
                            return dbConnect.connection.rollback(function() {
                                return reject('Something wrong with the query' , err2);

                            });
                        }
                        const $query3= `UPDATE ticket_details SET active = 0 WHERE id=${data.id}`;
                        dbConnect.connection.query($query3,(err3, response)=>{
                            if(err3){
                                return dbConnect.connection.rollback(()=>{
                                    return reject('something wrong with queary 3 ', err3);
                                })
                            }
                            dbConnect.connection.commit(function(errCommit) {
                                if (errCommit) {
                                    return dbConnect.connection.rollback(function() {
                                        return reject('Commit Error', errCommit)
                                    });
                                }
                                resolve('success')
                            });
                        }) // third query

                    }); // second query
                });// first query
            });
        }); // end of promise land
    } //updateInventory


}

module.exports = ()=>{
    return new warehouse();
};
