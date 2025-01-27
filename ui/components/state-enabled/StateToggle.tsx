import React from 'react';
import { sComponent } from '../util/state.component';

export class StateToggle extends sComponent<{
    stateKey: string;
    onToggle?: (state: boolean) => void;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        const isActive = !!this.state[this.props.stateKey];
        return (
            <button
                onClick={() => {
                    const newState = !isActive;
                    this.setState({ [this.props.stateKey]: newState });
                    if (this.props.onToggle) this.props.onToggle(newState);
                }}
            >
                {isActive ? 'On' : 'Off'}
            </button>
        );
    }
}
