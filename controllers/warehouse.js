dbConnect = require('../DB/connectDB');
collaborator = require('../controllers/collaborator')();

class warehouse {
    getAllInventory(){
        // we have two options either use promises or async wait
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
    } // getData()

    updateInventory(data){
        return new Promise( (resolve,reject)=>{
            let chemicalID = collaborator.returnChemicalID(data.chemicalType);

            const $query = `UPDATE warehouse_inventory SET quantity = '${data.quantity}' WHERE warehouse_id = ${data.warehouse_id} AND chemical_type_id = '${chemicalID}'` ;


            dbConnect.connection.query($query , (err, rows)=>{
                if(err){
                    console.log('error in the query');
                    reject(err)

                }
                resolve(rows);
            })
        });
    } //updateInventory


}

module.exports = ()=>{
    return new warehouse();
};
