interface Token {
    accessToken: string,
    refreshToken?:string
}

interface Order {
    id: Number,
    [key: string]: any
}
