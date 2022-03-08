import Server from "src/Server";

export async function init(silent = false){
    new Server();
    await import("./include");
    Server.start(silent);
}
