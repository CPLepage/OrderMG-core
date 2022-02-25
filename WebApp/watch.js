module.exports = {
    onRebuild: async function(error, result){
        if (error) console.error('watch build failed:', error)
        else {
            console.log("WebApp rebuilt");
        }
    }
};
