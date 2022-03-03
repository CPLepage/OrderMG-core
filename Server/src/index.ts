import "@shared/constants";

if(process.env.CONSTANTS_FILE)
    import(process.env.CONSTANTS_FILE);

import "src/Server";

