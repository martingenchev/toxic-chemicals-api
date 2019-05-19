const  router = require('express').Router();
// remember that we are exporting a function from the modules warehouse
// so put () after require
TicketController = require('../controllers/tickets')();
WarehouseController = require('../controllers/warehouse')();
//api/Data
router.get("/get-capacity", function(req,res,next){
    WarehouseController.getAllInventory().then( (result,reject)=>{
        res.json(result)
    }).catch(next);
});
//localhost:3000/api/PutData
router.post('/check-warehouse', function(req,res,next){
    TicketController.checkAvaibleSpaceInWarehouse(req.body).then((result,reject)=>{
        res.json(result);
    } ).catch(next)
});

router.post('/create-ticket', (req,res,next)=>{
    TicketController.createTicketDetails(req.body).then(result => {
      res.json(result);
    }).catch(next);
});

router.post('/update-warehouse-inventory', (req,res,next)=>{
    WarehouseController.updateInventory(req.body).then( result=>{
        res.json(result);
    }).catch(next)
});
module.exports = router;
