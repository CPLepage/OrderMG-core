const {execSync} = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {

    // get current git hash
    getCurrentGITHash: function() {
        return execSync("git rev-parse HEAD").toString().trim();
    },

    // get version from package.json
    getCurrentVersion: function() {
        const packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), {encoding: "utf-8"}));
        return packageJSON.version;
    }

}
