import React from 'react';
import { sComponent } from '../util/state.component';

export class StateLoader extends sComponent<{
    stateKey: string;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        return this.state[this.props.stateKey] ? <div>Loading...</div> : null;
    }
}
