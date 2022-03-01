declare function login(username: string, password: string): Promise<Token>;
declare function logout(tokenObj: Token): Promise<Token>;
declare function auth(token: string): Promise<boolean>;
declare function refreshToken(tokenObj: Token): Promise<Token>;

declare function getOrdersCount(options: any): Promise<number>;
declare function getOrders(options: any): Promise<Order[]>;
declare function getOrder(orderID: number): Order;
