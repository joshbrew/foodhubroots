import React from 'react';
import { sComponent } from '../util/state.component';

export class StateList extends sComponent<{
    stateKey: string;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        const items = this.state[this.props.stateKey] || [];
        return (
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    }
}
