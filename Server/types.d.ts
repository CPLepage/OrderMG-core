declare interface Token {
    token: string,
    refreshToken?:string
}

declare interface Order {
    id: Number,
    [key: string]: any
}
