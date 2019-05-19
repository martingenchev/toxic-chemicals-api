dbConnect = require('../DB/connectDB');
collaborator = require('../controllers/collaborator')();
warehouseController = require('../controllers/warehouse')()
class tickets {
    //create a contrustor with empty array to export data
    constructor(){
        this.data = [];
    }
    //testing function


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



    createTicket(data){
       return new Promise( (resolve,reject)=>{
           let current_datetime = new Date()
           let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
           const $query = `Insert Into tickets values(null, '${formatted_date}' , '${data}')`;

           dbConnect.connection.query($query, (err, rows)=>{
               if(err){
                   console.log('Error in the query');
                   //promise didn't happend because of error
                   reject(err);
               }
               resolve(rows.insertId);
           })

       })
    }// end create ticket

    createTicketDetails(data){
       return new Promise( (resolve, reject)=>{
           this.createTicket(1).then(ticketId=>{
               data.forEach(ticketDetails=>{
                  // converting the chemical type into ID based on the DB
                   let chemicalID = collaborator.returnChemicalID(ticketDetails.chemicalType);
                    const $query = `INSERT INTO ticket_details VALUES(null, '${ticketId}', '${chemicalID}', '${ticketDetails.quantity}', '${ticketDetails.warehouse_id}' )`

                   dbConnect.connection.query($query, (err,rows)=>{
                       if(err){
                           console.log('error in createticket queery', err);
                           reject(err);
                       }
                        console.log(rows)
                       resolve('ticket details done')
                   });

               }); // end foreach loop


           })
       })
    }

    }// end of time

module.exports = () =>{
  return new tickets()
};
