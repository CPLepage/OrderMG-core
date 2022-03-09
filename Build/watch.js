const childProcess = require("child_process");
const postBuildWebApp = require("./postBuildWebApp");

module.exports = (outdir) => ({
    server: {
        onRebuild: async function(error, result){
            if (error) console.error('watch build failed:', error)
            else {
                console.log("Server rebuilt");
                console.log(childProcess.execSync("docker-compose -p ordermg-core restart -t 0 node").toString());
            }
        }
    },
    webapp: {
        onRebuild: async function(error, result){
            if (error) console.error('watch build failed:', error)
            else {
                postBuildWebApp(outdir)
                console.log("WebApp rebuilt");
            }
        }
    }
});
