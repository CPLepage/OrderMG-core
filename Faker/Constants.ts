import constants from "Shared/constants";

constants.ordersPerRequest = 25;
constants.testUser = "ordermg";
constants.testPass = "ordermg";
constants.defaultColumns.push({
    header: "PostCode",
    path: "shippingAddress.postcode"
})
