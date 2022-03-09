interface Token {
    accessToken: string,
    refreshToken?:string
}

interface Order {
    id: number,
    [key: string]: any
}

declare enum DataType {
    ARRAY,
    NUMBER,
    STRING,
    BOOLEAN,
    OBJECT
}

declare module "*.png" {
    const value: string;
    export default value;
}
