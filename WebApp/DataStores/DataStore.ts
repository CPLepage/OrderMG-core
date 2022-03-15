export default abstract class DataStore {
    public static instance: DataStore;
    protected subscribers: Set<() => void> = new Set();

    subscribe(callback: () => void) {
        this.subscribers.add(callback);
    }

    protected notifySubscribers(){
        this.subscribers.forEach(subscriber => subscriber());
    }
}
