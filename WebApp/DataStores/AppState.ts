import DataStore from "WebApp/DataStores/DataStore";

export default class AppState extends DataStore {
    private state: any = {};

    setState(state: any){
        this.state = {
            ...this.state,
            ...state
        }

        this.notifySubscribers();
    }

    getState(key: string, expectedType: DataType = null){
        let stateValue = this.state[key];

        if(!expectedType === null)
            return stateValue;

        switch (expectedType){
            case DataType.ARRAY:{
                return !stateValue || !Array.isArray(stateValue) ? [] : stateValue;
            }
            case DataType.NUMBER: {
                if(stateValue === undefined || stateValue === null)
                    return 0;

                if(typeof stateValue !== 'number')
                    stateValue = parseFloat(stateValue);

                return isNaN(stateValue) ? 0 : stateValue;
            }
            case DataType.STRING:{
                if(stateValue === undefined || stateValue === null)
                    return "";

                if(typeof stateValue !== 'string')
                    return stateValue.toString();

                return stateValue;
            }
            case DataType.BOOLEAN:{
                return Boolean(stateValue);
            }
            case DataType.OBJECT:{
                if(stateValue === undefined || stateValue === null)
                    return {};

                if(typeof stateValue !== 'object')
                    return {};

                return stateValue;
            }
            default:
                return stateValue;
        }
    }
}
