const  router = require('express').Router();
// remember that we are exporting a function from the modules warehouse
// so put () after require
WarehouseController = require('../Controllers/warehouse')();
//api/Data
router.get("/Data", function(req,res,next){
    WarehouseController.getData().then( (result,reject)=>{
        res.json(result)
    }).catch(next);
});
//localhost:3000/api/PutData
router.post('/putData', function(req,res,next){
    WarehouseController.InsertData(req.body).then((result,reject)=>{
        res.json(result);
    } ).catch(next)
});

module.exports = router;
