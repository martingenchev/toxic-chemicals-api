dbConnect = require('../DB/connectDB');
collaborator = require('../controllers/collaborator')();
warehouseController = require('../controllers/warehouse')()
class tickets {

    checkAvaibleSpaceInWarehouse(truckIN){
            //global function variable
        let jWarehouseInventory = [];
    return new Promise((resolve ,reject )=>{

        warehouseController.getAllInventory().then((result)=>{
            //copy an array
             jWarehouseInventory = [...result];

            let jWarehouseInventoryForA = [];
            let jWareHouseinvetoryForB = []
            let iTotalWarehouseCapacity = 0;
            let iTotalQuantityOnSite = 0;
            // Getting all the tickets with chemical A
            // and calculate the total capacity of all the tickets
            // Calculate all the current quantity
            jWarehouseInventory.forEach( invetory=>{
                iTotalQuantityOnSite += invetory.quantity;
                if(invetory.type === 'A'){
                    jWarehouseInventoryForA.push(invetory);
                    iTotalWarehouseCapacity += invetory.capacity;
                }else if(invetory.type === 'B'){
                    jWareHouseinvetoryForB.push(invetory);
                }
            });

            // getting the total amount in truck
            let iTotalQuantityOfTruck = 0;
            truckIN.forEach(itemOfTruck=>{
                iTotalQuantityOfTruck +=  itemOfTruck.quantity;
            });

            if(iTotalWarehouseCapacity - iTotalQuantityOnSite > iTotalQuantityOfTruck ){
                resolve(collaborator.CheckForEmpty(truckIN,jWarehouseInventory,jWarehouseInventoryForA, jWareHouseinvetoryForB));
            }else{
                reject(JSON.stringify({"message":'No Space'}));
            }

        })


    }) // returning promise

    }


    createTicketDetails(data){
       return new Promise( (resolve, reject)=>{
            // inserting ticket based on arrival
           // inserting ticket details
           dbConnect.connection.beginTransaction( (err)=>{
               if(err) { reject('transaction error', err); return; }
               let current_datetime = new Date()
               let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
               const $query1 = `INSERT INTO tickets values(null, '${formatted_date}' , 1  )`;

               dbConnect.connection.query($query1 , (err, rows)=>{
                   if(err){
                       return dbConnect.connection.rollback(()=>{
                           return  reject('error in the query', err);
                       });
                   }
                   let ticketId = rows.insertId;
                   data.forEach(ticketDetails=>{

                       let chemicalID = collaborator.returnChemicalID(ticketDetails.chemicalType);
                       const  $query2 = `INSERT INTO ticket_details VALUES(null, '${ticketId}', '${chemicalID}', '${ticketDetails.quantity}', '${ticketDetails.warehouse_id}'  , 1)`;
                        dbConnect.connection.query($query2 , (err2, result)=>{
                            if(err2){
                                return dbConnect.connection.rollback(()=>{
                                    return reject('error in the query', err2)
                                });
                            }
                            dbConnect.connection.commit((errCommit)=>{
                               if(errCommit){
                                   return dbConnect.connection.rollback(()=>{
                                       return reject('Commit Error', errCommit)
                                   })
                               }
                               resolve('success')
                            })
                        })// second query

                   });

               }); // end of first query
           }); // end of transaction

       })
    }// createTicketDetails

    getIncomeActiveTicket(){
        return new Promise((resolve, reject)=>{
            // this is a view
            const $query = 'SELECT * FROM active_tickets';

            dbConnect.connection.query($query , (err,rows)=>{
                if(err){
                    return reject('something wrong with the query', err);
                }
                resolve(rows)
            })
        }) // promise
    } // getIncomeActiveTicket

    }// end of time

module.exports = () =>{
  return new tickets()
};
