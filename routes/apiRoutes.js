const  router = require('express').Router();
// remember that we are exporting a function from the modules warehouse
// so put () after require
WarehouseController = require('../Controllers/warehouse')();

router.get("/Data", function(req,res,next){
    WarehouseController.getData().then( (result,reject)=>{
        res.json(result)
    }).catch(next);
});

router.post('/putData', function(req,res,next){
    WarehouseController.InsertData(req.body).then((result,reject)=>{
        res.json(result);
    } ).catch(next)
});

module.exports = router;
