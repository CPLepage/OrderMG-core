import Server from "Server/Server";

export async function init(silent = false){
    new Server();
    await import("./include");
    Server.start(silent);
}
