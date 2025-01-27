import React from 'react';
import { sComponent } from '../util/state.component';

export class StateProgressBar extends sComponent<{
    stateKey: string;
    max: number;
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        const value = this.state[this.props.stateKey] || 0;
        return (
            <div>
                <progress value={value} max={this.props.max}></progress>
                <span>{Math.round((value / this.props.max) * 100)}%</span>
            </div>
        );
    }
}
