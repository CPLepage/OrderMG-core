import faker from "@faker-js/faker";

function generateOrder(){
    return {
        id: faker.datatype.number(),
    }
}

global.getAllOrders = function(){
    return [generateOrder()];
}
