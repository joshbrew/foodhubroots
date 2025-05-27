import React from 'react';
import { sComponent } from '../util/state.component';

export class StateAccordion extends sComponent<{
    stateKey: string;
    items: { title: string; content: string }[];
}> {
    componentDidMount() {
        this.__subscribeComponent(this.props.stateKey);
    }

    componentWillUnmount() {
        this.__unsubscribeComponent(this.props.stateKey);
    }

    render() {
        const activeIndex = this.state[this.props.stateKey] || 0;
        return (
            <div>
                {this.props.items.map((item, index) => (
                    <div key={index}>
                        <h4
                            onClick={() => this.setState({ [this.props.stateKey]: index })}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.title}
                        </h4>
                        {activeIndex === index && <p>{item.content}</p>}
                    </div>
                ))}
            </div>
        );
    }
}
