declare function login(username: string, password: string): Promise<Token>;
declare function auth(token: Token): Promise<boolean>;
declare function refreshToken(token: Token): Promise<Token>;

declare function getOrders(options: any): Promise<Order[]>;
declare function getOrder(orderID: number): Order;
