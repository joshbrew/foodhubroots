
import React from "react";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";


/*────────────────────────────────────────────
  TransactionWithSplit – sComponent version
────────────────────────────────────────────*/

interface SplitState {
  /* ❶ shared across components */
  currentCustomerId: string | null;
  currentSubMerchantId: string | null;

  /* ❷ local-only */
  splitAmount: string;
  txnLog: string;
}

export class TransactionWithSplit extends sComponent<{}, SplitState> {
  /** don’t broadcast these two keys */
  __doNotBroadcast = ["splitAmount", "txnLog"];

  state: SplitState = {
    currentCustomerId: null,  // auto-hydrates from EventHandler.data
    currentSubMerchantId: null,
    splitAmount: "50.00",
    txnLog: ""
  };

  /*──────── helpers ────────*/
  private submitSplit = async () => {
    const { currentCustomerId, currentSubMerchantId, splitAmount } = this.state;

    if (!currentSubMerchantId) {
      return this.setState({ txnLog: "Select or create a sub-merchant first." });
    }
    if (!currentCustomerId) {
      return this.setState({ txnLog: "Select or create a customer first." });
    }

    this.setState({ txnLog: "Processing…" });

    try {
      const r = await fetch(`${clientUrl}/split-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subMerchantAccountId: currentSubMerchantId,
          customerId: currentCustomerId,
          amount: splitAmount
        })
      });
      const res = await r.json();

      if (res.success) {
        this.setState({ txnLog: `✅  Success – Txn ID: ${res.transactionId}` });
      } else {
        this.setState({ txnLog: `❌  ${res.error || "Split failed"}` });
      }
    } catch (e: any) {
      this.setState({ txnLog: `❌  Network error: ${e.message}` });
    }
  };

  /*──────── render ────────*/
  render() {
    const { currentSubMerchantId, currentCustomerId, splitAmount, txnLog } = this.state;

    return (
      <div style={{ margin: 20 }}>
        <h2>Transaction with 98 / 2 Split</h2>

        <p>
          Customer&nbsp;ID:&nbsp;<strong>{currentCustomerId ?? "— none —"}</strong><br />
          Sub-Merchant&nbsp;ID:&nbsp;<strong>{currentSubMerchantId ?? "— none —"}</strong>
        </p>

        <label>
          Amount:&nbsp;
          <input
            value={splitAmount}
            onChange={e => this.setState({ splitAmount: e.target.value })}
            style={{ width: 100, marginRight: 8 }}
          />
        </label>

        <button onClick={this.submitSplit}>Pay Sub-Merchant&nbsp;(98%)</button>

        {txnLog && (
          <div style={{ marginTop: 12, color: txnLog.startsWith("✅") ? "green" : "red" }}>
            {txnLog}
          </div>
        )}
      </div>
    );
  }
}
