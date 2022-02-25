interface Token {
    token: string,
    refreshToken?:string
}
declare function login(username: string, password: string): Promise<Token>;
declare function auth(token: Token): Promise<boolean>;
declare function refreshToken(token: Token): Promise<Token>;

interface Order {
    id: Number,
    [key: string]: any
}

declare function getOrders(options: any): Promise<Order[]>;
declare function getOrder(orderID: number): Order;
