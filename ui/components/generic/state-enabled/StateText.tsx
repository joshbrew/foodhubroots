import React from 'react';
import { sComponent } from '../util/state.component';

export class StateText extends sComponent<{
    stateKey: string;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        return <span>{this.state[this.props.stateKey] || ''}</span>;
    }
}
