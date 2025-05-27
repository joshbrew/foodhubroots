import React from 'react';
import { sComponent } from '../util/state.component';

export class StateSelect extends sComponent<{
    stateKey: string;
    options: string[];
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        return (
            <select
                value={this.state[this.props.stateKey] || ''}
                onChange={(e) => this.setState({ [this.props.stateKey]: e.target.value })}
            >
                {this.props.options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }
}
