const childProcess = require("child_process");

module.exports = {
    onRebuild: async function(error, result){
        if (error) console.error('watch build failed:', error)
        else {
            console.log("Server rebuilt");
            console.log(childProcess.execSync("docker-compose -p ordermg-core restart -t 0 node").toString());
        }
    }
};
