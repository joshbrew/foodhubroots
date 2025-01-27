import React, { Component } from 'react';
import { sComponent } from '../util/state.component'; // Base component with state synchronization
import { Button } from 'react-bootstrap'; // Bootstrap button component

// Stopwatch Component
export class Stopwatch extends sComponent<{
    stateKey?: string; // Unique state key for managing multiple stopwatches
    onStart?: (timestamp: number) => void; // Callback when the stopwatch starts
    onStop?: (duration: number, timestamp: number) => void; // Callback when the stopwatch stops
    onFrame?: (duration: number, timestamp: number) => void; // Callback for every animation frame
    onClear?: (duration: number, timestamp: number) => void; // Callback when the stopwatch is cleared
}> {
    // Local component state
    state = {
        running: false,
    };

    // Unique identifier for this stopwatch instance
    unique = 'stopwatch' + Math.floor(Math.random() * 10000000000000);

    // State key prefix (can be overridden via props)
    stateKey = 'timer_';

    constructor(props) {
        super(props);

        // Use the provided state key or default to 'timer_'
        if (props.stateKey) this.stateKey = props.stateKey;

        // Initialize global state keys if they do not already exist
        const { data } = this.__statemgr;
        if (!(this.stateKey + 'timeRunning' in data)) data[this.stateKey + 'timeRunning'] = 0;
        if (!(this.stateKey + 'timeStart' in data)) data[this.stateKey + 'timeStart'] = 0;
        if (!(this.stateKey + 'running' in data)) data[this.stateKey + 'running'] = false;
    }

    componentWillUnmount(): void {
        // Clean up animation loop if necessary
        // Uncomment if animationLoop cleanup is needed:
        // if (this.__statemgr.data[this.stateKey + 'animationLoop'])
        //     cancelAnimationFrame(this.__statemgr.data[this.stateKey + 'animationLoop']);
    }

    // Start the stopwatch
    startTimer() {
        const { data } = this.__statemgr;

        if (!data[this.stateKey + 'animationLoop']) {
            // Set the start time in the global state
            data[this.stateKey + 'timeStart'] = performance.now();
            if (this.props.onStart) this.props.onStart(Date.now()); // Trigger onStart callback

            // Recursive function to update the elapsed time
            const getTime = () => {
                const now = performance.now();
                data[this.stateKey + 'timeRunning'] = now - data[this.stateKey + 'timeStart'];

                // Update the displayed time
                const elm = document.getElementById(this.stateKey + 'time') as HTMLElement;
                if (elm) elm.innerText = hhmmssms(data[this.stateKey + 'timeRunning']);

                if (this.props.onFrame) this.props.onFrame(data[this.stateKey + 'timeRunning'], Date.now());

                data[this.stateKey + 'animationLoop'] = requestAnimationFrame(getTime); // Schedule next frame
            };

            getTime(); // Start the animation loop
        }

        data[this.stateKey + 'running'] = true; // Mark as running
        this.setState({}); // Trigger re-render
    }

    // Stop the stopwatch
    stopTimer() {
        const { data } = this.__statemgr;

        if (this.props.onStop) this.props.onStop(data[this.stateKey + 'timeRunning'], Date.now());
        if (data[this.stateKey + 'animationLoop']) cancelAnimationFrame(data[this.stateKey + 'animationLoop']);
        data[this.stateKey + 'animationLoop'] = undefined; // Clear animation loop reference
        data[this.stateKey + 'running'] = false; // Mark as not running
        this.setState({}); // Trigger re-render
    }

    // Clear the stopwatch
    clearTimer() {
        const { data } = this.__statemgr;

        if (this.props.onClear) this.props.onClear(data[this.stateKey + 'timeRunning'], Date.now());
        data[this.stateKey + 'timeStart'] = performance.now(); // Reset start time
        data[this.stateKey + 'timeRunning'] = 0; // Reset elapsed time
        this.setState({}); // Trigger re-render
    }

    render() {
        const { data } = this.__statemgr;

        return (
            <span>
                {/* Render Start/Stop buttons based on the running state */}
                {data[this.stateKey + 'running'] ? (
                    <Button onClick={() => this.stopTimer()}>Stop</Button>
                ) : (
                    <Button onClick={() => this.startTimer()}>Start</Button>
                )}

                {/* Render Clear button if running or time is greater than 0 */}
                {(data[this.stateKey + 'running'] || data[this.stateKey + 'timeRunning'] > 0) && (
                    <Button onClick={() => this.clearTimer()}>Clear</Button>
                )}

                {/* Display formatted time */}
                <span id={this.stateKey + 'time'}>{hhmmssms(data[this.stateKey + 'timeRunning'])}</span>
            </span>
        );
    }
}

// Utility function to format milliseconds into HH:mm:ss,ms format
export function hhmmssms(timeInMs) {
    let pad = function(num, size) { return ('000' + num).slice(size * -1); };
    let time = timeInMs / 1000;
    let hours = Math.floor(time / 60 / 60);
    let minutes = Math.floor(time / 60) % 60;
    let seconds = Math.floor(time - minutes * 60);
    let milliseconds = time.toFixed(3).slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ',' + pad(milliseconds, 3);
}


/**
import React from 'react';
import { Stopwatch } from './Stopwatch'; // Import the Stopwatch component

const App = () => {
    // Callback for when a stopwatch starts
    const handleStart = (timestamp: number) => {
        console.log('Stopwatch started at:', new Date(timestamp).toLocaleTimeString());
    };

    // Callback for when a stopwatch stops
    const handleStop = (duration: number, timestamp: number) => {
        console.log(`Stopwatch stopped. Duration: ${duration}ms at ${new Date(timestamp).toLocaleTimeString()}`);
    };

    // Callback for each animation frame
    const handleFrame = (duration: number, timestamp: number) => {
        console.log(`Elapsed time: ${duration}ms at ${new Date(timestamp).toLocaleTimeString()}`);
    };

    // Callback for when a stopwatch is cleared
    const handleClear = (duration: number, timestamp: number) => {
        console.log(`Stopwatch cleared. Duration before reset: ${duration}ms`);
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Global State Stopwatch Example</h1>
            <div style={{ marginBottom: '20px' }}>
                <h3>Stopwatch 1</h3>
                <Stopwatch
                    stateKey="stopwatch1" // Unique state key for this stopwatch
                    onStart={handleStart}
                    onStop={handleStop}
                    onFrame={handleFrame}
                    onClear={handleClear}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <h3>Stopwatch 2</h3>
                <Stopwatch
                    stateKey="stopwatch2" // Unique state key for a second stopwatch
                    onStart={handleStart}
                    onStop={handleStop}
                    onFrame={handleFrame}
                    onClear={handleClear}
                />
            </div>
        </div>
    );
};

export default App;

 */