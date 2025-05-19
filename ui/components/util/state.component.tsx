import React, { Component } from 'react';
import { EventHandler } from './EventHandler';

export const state = new EventHandler(); //import this anywhere for direct manipulation of state components from script

export class sComponent<P = {} & {
    state?: EventHandler;
    doNotSubscribe?: string[]; // can skip certain props
}, S = {}> extends Component<P, S> {

    state = {} as any;

    __statemgr = state as EventHandler;
    __state_subs: { [key: string]: number } = {};
    __updated: any[] = [];
    __unique = `component${Math.floor(Math.random() * 1000000000000000)}`;

    //@ts-ignore
    setState(
        partialState: Partial<S>,
        callback?: () => void
    ): Promise<void> {
        return new Promise(resolve => {
            // 1) call the real React setState with a callback
            super.setState(partialState as any, () => {
                // 2) relay to your EventHandler
                this.__statemgr.setState(partialState);

                // 3) user‐supplied callback
                if (callback) callback();

                // 4) resolve the promise so callers can await
                resolve();
            });
        });
    }


    constructor(
        props: P & {
            state?: EventHandler;
            doNotSubscribe?: string[]; // can skip certain props
        } = {} as P & {
            state?: EventHandler; // can apply a new state other than the global state so you can have states for certain pages, for example
        }
    ) {
        super(props);

        if (props.state) // synced with global state
            this.__statemgr = props.state;


        let found: Partial<S> = {};
        for (const prop in this.state) { // for all props in state, subscribe to changes in the global state
            if (props?.doNotSubscribe && props.doNotSubscribe.indexOf(prop) > -1) continue;
            if (prop in this.__statemgr.data) found[prop as keyof S] = this.__statemgr.data[prop];
        }
        if (Object.keys(found).length > 0) {
            Object.assign(this.state, found);
        }

        if (this.__statemgr.useLocalStorage) {
            this.__restoreLocalStorage();
        }

        setTimeout(() => {
            for (const prop in this.state) { // for all props in state, subscribe to changes in the global state
                if (props?.doNotSubscribe && props.doNotSubscribe.indexOf(prop) > -1) continue;
                if (prop in this.__statemgr.data) found[prop as keyof S] = this.__statemgr.data[prop];
                this.__subscribeComponent(prop);
            }
            if (Object.keys(found).length > 0) super.setState(found as any); // override defaults
        }, 0.001);
    }

    __subscribeComponent(prop: string, onEvent?: (value: any) => void) {
        let sub = this.__statemgr.subscribeEvent(prop, (res) => {
            let c = this;
            if (typeof c === 'undefined') { // the class will be garbage collected by react and this will work to unsubscribe
                this.__statemgr.unsubscribeEvent(prop, sub);
            } else {
                if (onEvent) onEvent(res);
                let wasupdated = this.__updated.indexOf(prop);
                if (wasupdated > -1) {
                    this.__updated.splice(wasupdated, 1);
                } else {
                    super.setState({ [prop]: res } as Pick<S, keyof S>); // only updates one prop at a time rn
                }
            }
        });
        this.__state_subs[prop] = sub as number;

        return sub;
    }

    __unsubscribeComponent(prop?: string) {
        if (!prop) {
            for (const key in this.__state_subs) {
                this.__statemgr.unsubscribeEvent(key, this.__state_subs[key]);
            }
        } else this.__statemgr.unsubscribeEvent(prop, this.__state_subs[prop]);
    }

    //should only have to run this once on a component and it will propagate to all others with the same state manager
    __setUseLocalStorage(bool: boolean) {
        this.__statemgr.useLocalStorage = bool;
        this.__restoreLocalStorage();
    }

    __restoreLocalStorage() {
        let result = this.__statemgr.restoreLocalStorage(Object.keys(this.state));
        if (result) {
            Object.assign(this.state, result);
        }
    }
}
