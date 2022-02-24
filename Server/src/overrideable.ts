global.overrideable = async function (method: Function) {
    const value = method();

    if(value instanceof Promise)
        return await value;

    return value;
}
