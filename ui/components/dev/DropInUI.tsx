// DropInUI.tsx
import React from "react";
import dropin, { Options as DropinOptions, Dropin as DropinInstance } from "braintree-web-drop-in";
import { sComponent } from "../util/state.component";

interface DropInUIProps {
  onReady: (inst: DropinInstance) => void;
  onError: (msg: string) => void;
  containerId?: string;
  /** allow parent to inject any Drop-In options */
  options?: Partial<DropinOptions>;
}

interface DropInUIState {
  clientToken: string | null | Promise<string>;
  customerLog: string;
}

export class DropInUI extends sComponent<DropInUIProps, DropInUIState> {
  static defaultProps = {
    containerId: "customer-dropin",
    options: {}
  };

  state: DropInUIState = {
    clientToken: null,
    customerLog: ""
  };
  __doNotBroadcast = ["customerLog"];

  private instance: DropinInstance | null = null;

  componentDidUpdate(_: {}, prev: DropInUIState) {
    const tok = this.state.clientToken;
    if (typeof tok === "string" && prev.clientToken !== tok && !this.instance) {
      this.initDropIn(tok);
    }
  }

  componentWillUnmount() {
    // teardown is now idempotent
    this.instance?.teardown().catch(() => {});
    this.instance = null;
  }

  private initDropIn(token: string) {
    const { onReady, onError, containerId, options } = this.props;

    dropin
      .create({
        authorization: token,
        container: `#${containerId}`,
        ...options
      })
      .then((inst) => {
        // wrap teardown so it can only run once
        let hasTornDown = false;
        const originalTeardown = inst.teardown.bind(inst);
        inst.teardown = (...args: any[]) => {
          if (hasTornDown) {
            return Promise.resolve();
          }
          hasTornDown = true;
          return originalTeardown(...args);
        };

        this.instance = inst;
        onReady(inst);
        this.forceUpdate();
      })
      .catch((err) => {
        console.error("Drop-in init failed:", err);
        const msg = "Drop-in failed to initialize.";
        this.setState({ customerLog: msg }, () => onError(msg));
      });
  }

  render() {
    return <div id={this.props.containerId} style={{ margin: "10px 0" }} />;
  }
}
