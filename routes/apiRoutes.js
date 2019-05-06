const  router = require('express').Router();
// remember that we are exporting a function from the modules warehouse
// so put () after require
WarehouseController = require('../Controllers/warehouse')();

router.get("/Data", function(req,res){
    WarehouseController.getData().then( (result,reject)=>{
        res.json(result)
    });
});

module.exports = router;
