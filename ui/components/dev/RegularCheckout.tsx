// RegularCheckout.tsx
import React, { ChangeEvent } from "react";
import { clientUrl }         from "../../../scripts/frontend";
import { sComponent }        from "../util/state.component";

interface CheckoutState {
  currentCustomerId:        string | null;
  currentSubMerchantId: string | null;   // ← new!
  amount:                   string;
  log:                      string;
}

export class RegularCheckout extends sComponent<{}, CheckoutState> {
  __doNotBroadcast = ["amount","log"];
  state: CheckoutState = {
    currentCustomerId:        null,
    currentSubMerchantId: null,   // ← initialise
    amount:                   "10.00",
    log:                      ""
  };

  private handleCheckout = async () => {
    const { currentCustomerId, currentSubMerchantId, amount } = this.state;

    if (!currentCustomerId) {
      return this.setState({ log: "Select/create a customer first." });
    }

    // build the sale request
    const saleRequest: any = {
      customerId: currentCustomerId,
      amount,
      options: { submitForSettlement: true }
    };

    // if a merchantAccountId is in your global state, include it
    if (currentSubMerchantId) {
      saleRequest.merchantAccountId = currentSubMerchantId; //defaults to master merchant
    }

    try {
      const r   = await fetch(`${clientUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleRequest)
      });
      const res = await r.json();

      if (res.success) {
        this.setState({ log: `✅ Success – Txn ID: ${res.transactionId}` });
      } else {
        this.setState({ log: `❌ ${res.error || "Checkout failed"}` });
      }
    } catch (e: any) {
      this.setState({ log: `❌ Network error: ${e.message}` });
    }
  };

  render() {
    const { currentCustomerId, currentSubMerchantId, amount, log } = this.state;

    return (
      <div style={{ margin: 20 }}>
        <h2>Regular Checkout</h2>

        <p>
          Customer ID:&nbsp;
          <strong>{currentCustomerId ?? "— none —"}</strong>
        </p>

        <p>
          Merchant Account ID:&nbsp;
          <strong>{currentSubMerchantId ?? "— none —"}</strong>
        </p>

        <label>
          Amount:&nbsp;
          <input
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.setState({ amount: e.target.value })
            }
            style={{ width: 100, marginRight: 8 }}
          />
        </label>

        <button onClick={this.handleCheckout}>Checkout</button>

        {log && (
          <div
            style={{
              marginTop: 12,
              color: log.startsWith("✅") ? "green" : "red"
            }}
          >
            {log}
          </div>
        )}
      </div>
    );
  }
}
