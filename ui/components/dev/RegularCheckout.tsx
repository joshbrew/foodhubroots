import React from "react";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";


interface CheckoutState {
  /* ❶  shared across components */
  currentCustomerId: string | null;

  /* ❷  local-only (don’t broadcast) */
  amount: string;
  log: string;
}

export class RegularCheckout extends sComponent<{}, CheckoutState> {
  /** mark keys that should stay local to this component */
  __doNotBroadcast = ["amount", "log"];

  state: CheckoutState = {
    currentCustomerId: null,   // will hydrate from global state if present
    amount: "10.00",
    log: ""
  };

  /*──────── helpers ────────*/
  private handleCheckout = async () => {
    const { currentCustomerId, amount } = this.state;

    if (!currentCustomerId) {
      return this.setState({ log: "Select or create a customer first." });
    }

    try {
      const r = await fetch(`${clientUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: currentCustomerId, amount })
      });
      const res = await r.json();

      if (res.success) {
        this.setState({ log: `✅  Success – Txn ID: ${res.transactionId}` });
      } else {
        this.setState({ log: `❌  ${res.error || "Checkout failed"}` });
      }
    } catch (e: any) {
      this.setState({ log: `❌  Network error: ${e.message}` });
    }
  };

  /*──────── render ────────*/
  render() {
    const { currentCustomerId, amount, log } = this.state;

    return (
      <div style={{ margin: 20 }}>
        <h2>Regular Checkout</h2>

        <p>
          Current&nbsp;Customer&nbsp;ID:&nbsp;
          <strong>{currentCustomerId ?? "— none —"}</strong>
        </p>

        <label>
          Amount:&nbsp;
          <input
            value={amount}
            onChange={e => this.setState({ amount: e.target.value })}
            style={{ width: 100, marginRight: 8 }}
          />
        </label>

        <button onClick={this.handleCheckout}>Checkout</button>

        {log && (
          <div style={{ marginTop: 12, color: log.startsWith("✅") ? "green" : "red" }}>
            {log}
          </div>
        )}
      </div>
    );
  }
}