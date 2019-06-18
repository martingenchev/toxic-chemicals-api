collaborator = require('../controllers/collaborator')();

let jWarehouseInventory =  [
        {"warehouse_id":1,"type":"B","quantity":0,"capacity":10},
        {"warehouse_id":1,"type":"A","quantity":6,"capacity":10},
        {"warehouse_id":1,"type":"C","quantity":0,"capacity":10},
        {"warehouse_id":2,"type":"C","quantity":3,"capacity":12},
        {"warehouse_id":2,"type":"B","quantity":0,"capacity":12},
        {"warehouse_id":2,"type":"A","quantity":2,"capacity":12},
        {"warehouse_id":3,"type":"C","quantity":1,"capacity":5},
        {"warehouse_id":3,"type":"B","quantity":1,"capacity":5},
        {"warehouse_id":3,"type":"A","quantity":1,"capacity":5},
        {"warehouse_id":4,"type":"C","quantity":0,"capacity":3},
        {"warehouse_id":4,"type":"B","quantity":1,"capacity":3},
        {"warehouse_id":4,"type":"A","quantity":0,"capacity":3},
        {"warehouse_id":5,"type":"C","quantity":3,"capacity":9},
        {"warehouse_id":5,"type":"B","quantity":1,"capacity":9},
        {"warehouse_id":5,"type":"A","quantity":0,"capacity":9}
    ];

test('Should return 1', ()=>{
    returnedChemical = collaborator.returnChemicalID('A');
    expect(returnedChemical).toBe(1);
});

test('Should retrun 2', ()=>{
    returnedChemical = collaborator.returnChemicalID('B');
    expect(returnedChemical).toBe(2);
});

test('Should return 3', ()=>{
    returnedChemical = collaborator.returnChemicalID('C');
    expect(returnedChemical).toBe(3);
});
test('Should fail', ()=>{
    returnedChemical = collaborator.returnChemicalID('D');
    expect(returnedChemical).toBeFalsy();
});

test('Checking warehouse_id 6 capacity should be false' , ()=>{
    returnedCapactity = collaborator.checkWarehouseCapacity(6, jWarehouseInventory);
    expect(returnedCapactity).toBeFalsy();
});

test('Checking warehouse_id 1 capacity' , ()=>{
    returnedCapactity = collaborator.checkWarehouseCapacity(1, [1,2]);
    expect(returnedCapactity).toBeFalsy();
});

test('Checking warehouse_id 1 capacity' , ()=>{
    returnedCapactity = collaborator.checkWarehouseCapacity(1, jWarehouseInventory);
    expect(returnedCapactity).toBe(6);
});
