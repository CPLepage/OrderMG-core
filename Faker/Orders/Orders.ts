import faker from "@faker-js/faker";

function generateOrder(){
    return {
        id: faker.datatype.number(),
        shippingAddress: {
            postcode: faker.address.zipCode()
        }
    }
}

let cachedFakedOrder;

global.getOrders = function(){
    if(!cachedFakedOrder)
        cachedFakedOrder = new Array(25).fill(null).map(() => generateOrder());

    return cachedFakedOrder;
}


global.getOrder = function(orderID){
    if(!cachedFakedOrder)
        return null;

    for (let i = 0; i < cachedFakedOrder.length; i++) {
        if(orderID === cachedFakedOrder[i].id)
            return cachedFakedOrder[i];
    }
}
