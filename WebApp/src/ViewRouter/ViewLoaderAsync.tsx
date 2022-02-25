import React from "react";

export default class extends React.Component{
    props:{
        component: () => Promise<any>
    }
    state: {
        loadedApp: any
    } = {
        loadedApp: false
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any) {
        if(prevProps.component !== this.props.component) {
            this.setState({loadedApp: false}, this.loadApp.bind(this));
        }
    }

    componentDidMount() {
        this.loadApp();
    }

    async loadApp(){
        this.setState({loadedApp: await this.props.component()});
    }

    render(){
        return this.state.loadedApp ? <this.state.loadedApp /> : <div>Loading view...</div>
    }
}
