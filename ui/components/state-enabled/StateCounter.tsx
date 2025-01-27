import React from 'react';
import { sComponent } from '../util/state.component';

export class StateCounter extends sComponent<{
    stateKey: string;
    step?: number;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        const count = this.state[this.props.stateKey] || 0;
        const step = this.props.step || 1;
        return (
            <div>
                <button onClick={() => this.setState({ [this.props.stateKey]: count - step })}>-</button>
                <span>{count}</span>
                <button onClick={() => this.setState({ [this.props.stateKey]: count + step })}>+</button>
            </div>
        );
    }
}
