import React, { ChangeEvent, FormEvent } from "react";
import { clientUrl, obtainClientToken } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";
import dropin from "braintree-web-drop-in";


interface BillingAddress {
  streetAddress: string;
  extendedAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  countryCodeAlpha2: string;
}

/*────────────────────────────────────────────
  SHARED STATE  (anything you want visible
  in every other sComponent goes in here)
────────────────────────────────────────────*/
interface PMGlobalState {
  /** shared: fetched once – used by any Drop-in */
  clientToken: string | null | Promise<string>;
  /** shared: the customer we are currently working with */
  currentCustomerId: string | null;

  /** this key name is unique, so it will NOT collide with
      another component’s log. (Every sComponent gets every
      update, but unused keys are simply ignored.)            */
  pmLog: string;
}

/*────────────────────────────────────────────
  AddPaymentMethod  as an sComponent
────────────────────────────────────────────*/
export class AddPaymentMethod extends sComponent<{}, PMGlobalState> {
  state: PMGlobalState = {
    clientToken: null,
    currentCustomerId: null,
    pmLog: ""
  };

  __doNotBroadcast = ['pmLog'];

  /* local-only pieces that shouldn’t propagate */
  private dropinInstance: any | null = null;
  private newToken: string | null = null;
  private billing: BillingAddress = {
    streetAddress: "",
    extendedAddress: "",
    locality: "",
    region: "",
    postalCode: "",
    countryCodeAlpha2: ""
  };

  /*──────── LIFECYCLE ────────*/
  async componentDidMount() {
    try {
      const token = await obtainClientToken();
      this.setState({ clientToken: token });
    } catch (e: any) {
      this.setState({ pmLog: `Token error: ${e.message}` });
    }
  }

  /* kick Drop-in once token is ready */
  componentDidUpdate(_: {}, prev: PMGlobalState) {
    if (
      typeof this.state.clientToken === "string" &&
      prev.clientToken !== this.state.clientToken
    ) {
      this.initDropIn();
    }
  }

  componentWillUnmount() {
    this.dropinInstance?.teardown?.();
  }

  /*──────── Drop-in ────────*/
  private initDropIn() {
    if (this.dropinInstance) return;
    if (typeof this.state.clientToken !== "string") return;

    dropin.create(
      { authorization: this.state.clientToken, container: "#pm-dropin" },
      (err, inst) => {
        if (err) {
          this.setState({ pmLog: "Drop-in init failed" });
        } else {
          this.dropinInstance = inst;
          this.forceUpdate();
        }
      }
    );
  }

  /*──────── HANDLERS ────────*/
  private handleText =
    (field: keyof BillingAddress | "currentCustomerId") =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (field === "currentCustomerId") {
          /* broadcast customer selection */
          this.setState({ currentCustomerId: value });
        } else {
          this.billing[field] = value;
          this.forceUpdate();
        }
      };

  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!this.dropinInstance)
      return this.setState({ pmLog: "Drop-in not ready." });
    if (!this.state.currentCustomerId)
      return this.setState({ pmLog: "Select / create a customer first." });

    this.setState({ pmLog: "Vaulting payment method…" });

    try {
      const { nonce } = await this.dropinInstance.requestPaymentMethod();
      const res = await fetch(`${clientUrl}/create-payment-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: this.state.currentCustomerId,
          paymentMethodNonce: nonce,
          billingAddress: this.billing,
          options: { makeDefault: true }
        })
      });
      const data = await res.json();
      if (data.success) {
        this.newToken = data.token;
        this.setState({ pmLog: "Payment method created!" });
      } else {
        this.setState({ pmLog: `Error: ${data.error}` });
      }
    } catch (err: any) {
      this.setState({ pmLog: `Error: ${err.message}` });
    }
  };

  /*──────── RENDER ────────*/
  render() {
    const { currentCustomerId, pmLog } = this.state;
    const B = this.billing;   // shorthand

    return (
      <form onSubmit={this.handleSubmit} style={{ margin: 20 }}>
        <h2>Add Payment Method</h2>

        <label>
          Customer&nbsp;ID:
          <input
            name="currentCustomerId"
            required
            value={currentCustomerId || ""}
            onChange={this.handleText("currentCustomerId")}
            style={{ marginLeft: 8 }}
          />
        </label>

        <hr />
        <div id="pm-dropin" style={{ margin: "10px 0" }} />

        <h3>Billing Address</h3>
        <input
          placeholder="Street"
          required
          value={B.streetAddress}
          onChange={this.handleText("streetAddress")}
          style={{ width: 280 }}
        />
        <br />
        <input
          placeholder="Extended"
          value={B.extendedAddress}
          onChange={this.handleText("extendedAddress")}
          style={{ width: 280 }}
        />
        <br />
        <input
          placeholder="City"
          required
          value={B.locality}
          onChange={this.handleText("locality")}
        />
        <input
          placeholder="Region"
          required
          value={B.region}
          onChange={this.handleText("region")}
          style={{ marginLeft: 8, width: 60 }}
        />
        <input
          placeholder="Postal"
          required
          value={B.postalCode}
          onChange={this.handleText("postalCode")}
          style={{ marginLeft: 8, width: 80 }}
        />
        <br />
        <input
          placeholder="Country (α-2)"
          required
          maxLength={2}
          value={B.countryCodeAlpha2}
          onChange={this.handleText("countryCodeAlpha2")}
          style={{ width: 48 }}
        />

        <hr />
        <button type="submit" disabled={!this.dropinInstance}>
          Vault Payment Method
        </button>

        {this.newToken && (
          <div style={{ marginTop: 12 }}>
            New Token:&nbsp;<strong>{this.newToken}</strong>
          </div>
        )}
        {pmLog && <div style={{ marginTop: 12, color: "red" }}>{pmLog}</div>}
      </form>
    );
  }
}