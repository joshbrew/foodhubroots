import React from 'react';
import { sComponent } from '../util/state.component';

export class StateCheckbox extends sComponent<{
    stateKey: string;
    label?: string;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        const checked = !!this.state[this.props.stateKey];
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => this.setState({ [this.props.stateKey]: !checked })}
                />
                {this.props.label}
            </label>
        );
    }
}
