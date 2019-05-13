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
    } // getData()

    InsertData(truckIN){
            //global function variable
        let jWarehouseInventory = [];
    return new Promise((resolve ,reject )=>{

        this.getData().then((result)=>{
            //copy an array
             jWarehouseInventory = [...result];

            let jWarehouseInventoryForA = [];
            let jWareHouseinvetoryForB = []
            let iTotalWarehouseCapacity = 0;
            let iTotalQuantityOnSite = 0;
            // Getting all the warehouse with chemical A
            // and calculate the total capacity of all the warehouse
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
                resolve(this.CheckForEmpty(truckIN,jWarehouseInventory,jWarehouseInventoryForA, jWareHouseinvetoryForB));
            }else{
                reject(JSON.stringify({"message":'No Space'}));
            }

        })


    }) // returning promise

        }
         CheckForEmpty(JTruck,TotalInvetory, invetoryForA, invetoryForB){
          let jTicketDetails = [];
       //Looping through the truck invetory
        JTruck.forEach(jTruckInvetory=>{
            // we check all chemical types in the Truck
            switch (jTruckInvetory.type) {
                case "A":
                    // Looping through all warehouse to check where we have empty B
                    let isMatchedA = false;
                    let inventoryAMatch ;

                    invetoryForB.forEach(warehouseObjectB=>{

                        if(warehouseObjectB.quantity === 0){
                            // Looping through to check neighbor warehouse
                            // where we have empty A
                            let warehousesLeft = warehouseObjectB.warehouse_id;

                           for(let i = 0; i < invetoryForA.length; i++){

                               if( isMatchedA === false && typeof invetoryForA[i-1] === 'undefined' &&
                               invetoryForA[i].warehouse_id === warehousesLeft &&
                               invetoryForA[i+1].quantity === 0 &&
                                   this.checkWarehouseCapacity(invetoryForA[i].warehouse_id , TotalInvetory) + jTruckInvetory.quantity <= invetoryForA[i].capacity
                               ){
                                   console.log('Free A', invetoryForA[i]);
                                   inventoryAMatch = invetoryForA[i];
                                   isMatchedA = true;
                               }else if(isMatchedA === false && typeof  invetoryForA[i-1] !== 'undefined' &&
                                   typeof  invetoryForA[i+1] !== 'undefined' &&
                                   invetoryForA[i].warehouse_id === warehousesLeft &&
                                   invetoryForA[i-1].quantity === 0 &&
                                   invetoryForA[i+1].quantity === 0 &&
                                   this.checkWarehouseCapacity(invetoryForA[i].warehouse_id , TotalInvetory) + jTruckInvetory.quantity <= invetoryForA[i].capacity ){
                                   console.log('Free A', invetoryForA[i])
                                   inventoryAMatch = invetoryForA[i];
                                   isMatchedA = true;
                               }else if (isMatchedA === false &&  typeof invetoryForA[i+1] === 'undefined' &&
                                   invetoryForA[i].warehouse_id === warehousesLeft &&
                                   invetoryForA[i-1].quantity === 0 &&
                                   this.checkWarehouseCapacity(invetoryForA[i].warehouse_id , TotalInvetory) + jTruckInvetory.quantity <= invetoryForA[i].capacity){
                                   console.log('Free A', invetoryForA[i])
                                   inventoryAMatch = invetoryForA[i];
                                   isMatchedA = true;
                               }

                           } // end of for loop of A

                        }
                    });
                    // this is for having generated inventory for the second case
                    TotalInvetory.forEach(warehouseObjectFoundA=>{
                        if(warehouseObjectFoundA.warehouse_id === inventoryAMatch.warehouse_id && warehouseObjectFoundA.type === "A"){
                            warehouseObjectFoundA.quantity += jTruckInvetory.quantity;
                            console.log('total inventory A', warehouseObjectFoundA);
                            // create ticket details and push A
                            let jChemicalATicket = {chemicalType: jTruckInvetory.type, quantity: jTruckInvetory.quantity,
                                warehouse_id:  warehouseObjectFoundA.warehouse_id };
                            jTicketDetails.push(jChemicalATicket);

                        }
                    });
                    break;
                case "B":
                   let isMatchedB = false;
                    let inventoryBMatch ;

                    TotalInvetory.forEach(warehouseObjectA=> {

                        if (isMatchedB === false &&
                            warehouseObjectA.type === "A" &&
                            warehouseObjectA.quantity === 0 &&
                            this.checkWarehouseCapacity(warehouseObjectA.warehouse_id, TotalInvetory ) + jTruckInvetory.quantity <= warehouseObjectA.capacity ) {

                            inventoryBMatch = warehouseObjectA;
                            isMatchedB = true;

                        }
                    });

                    TotalInvetory.forEach(warehouseObjectFoundB=>{
                        if(warehouseObjectFoundB.warehouse_id === inventoryBMatch.warehouse_id && warehouseObjectFoundB.type === "B"){
                            warehouseObjectFoundB.quantity += jTruckInvetory.quantity;
                            console.log('total inventory B', warehouseObjectFoundB);
                            // create ticket details and push B
                            let jChemicalBTicket = {chemicalType: jTruckInvetory.type, quantity: jTruckInvetory.quantity,
                                warehouse_id:  warehouseObjectFoundB.warehouse_id };
                            jTicketDetails.push(jChemicalBTicket);

                        }
            });
                    break;
                case "C":
                    let isMatchedC = false;
                    let inventoryCMatch ;

                    invetoryForB.forEach(warehouseObjectC=>{

                        if( isMatchedC === false &&
                            warehouseObjectC.capacity - this.checkWarehouseCapacity(warehouseObjectC.warehouse_id, TotalInvetory) >= jTruckInvetory.quantity){
                            // console.log('allowed warehouse', warehouseObjectC)
                            inventoryCMatch = warehouseObjectC;
                            isMatchedC = true;
                        }
                    });

                    TotalInvetory.forEach(warehouseObjectFoundC=>{
                        if(warehouseObjectFoundC.warehouse_id === inventoryCMatch.warehouse_id && warehouseObjectFoundC.type === "C"){
                            warehouseObjectFoundC.quantity += jTruckInvetory.quantity;
                            console.log('total inventory C', warehouseObjectFoundC);
                            // create ticket details and push C
                            let jChemicalCTicket = {chemicalType: jTruckInvetory.type, quantity: jTruckInvetory.quantity,
                                warehouse_id:  warehouseObjectFoundC.warehouse_id };
                            jTicketDetails.push(jChemicalCTicket);
                        }
                    });
                    break;
            } // end switch case
        })// end JTruck For each
             return jTicketDetails
} // end CheckForEmpty

    // Check the taken space in the specific warehouse
    checkWarehouseCapacity(warehouse_id, warehouseInvetory){
        let iWarehouseQuantity = 0 ;
        warehouseInvetory.forEach(warehouseObject=>{
            if(warehouseObject.warehouse_id === warehouse_id){
                iWarehouseQuantity += warehouseObject.quantity
            }
        });
        return iWarehouseQuantity
    }


    }// end of time

module.exports = () =>{
  return new warehouse()
};
