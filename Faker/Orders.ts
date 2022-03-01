import faker from "@faker-js/faker";

function generateOrder(){
    return {
        id: faker.datatype.number(),
        shippingAddress: {
            postcode: faker.address.zipCode()
        }
    }
}

const ordersCount = 25;
let cachedFakedOrder;

global.getOrders = function(){
     return ordersCount;
}

global.getOrders = function(){
    if(!cachedFakedOrder)
        cachedFakedOrder = new Array(ordersCount).fill(null).map(() => generateOrder());

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
