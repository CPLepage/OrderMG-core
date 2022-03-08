interface Token {
    accessToken: string,
    refreshToken?:string
}

interface Order {
    id: number,
    [key: string]: any
}
