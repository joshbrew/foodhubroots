import React from 'react';
import { sComponent } from '../util/state.component';

export class StateInput extends sComponent<{
    stateKey: string; // Key in the global state to bind the input value
    placeholder?: string; // Optional placeholder text
    onChange?: (value: string) => void; // Callback for when the input value changes
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey); // Subscribe to changes in the state key
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey); // Unsubscribe from the state key
    }

    render() {
        return (
            <input
                type="text"
                value={this.state[this.props.stateKey] || ''} // Bind input value to the state key
                placeholder={this.props.placeholder} // Display placeholder text if provided
                onChange={(e) => {
                    const newValue = e.target.value;
                    this.setState({ [this.props.stateKey]: newValue }); // Update global state
                    if (this.props.onChange) {
                        this.props.onChange(newValue); // Trigger external onChange callback
                    }
                }}
            />
        );
    }
}
