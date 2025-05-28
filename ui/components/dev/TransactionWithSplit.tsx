// TransactionWithSplit.tsx
import React, { ChangeEvent } from "react";
import { clientUrl }         from "../../../scripts/frontend";
import { sComponent }        from "../util/state.component";

interface SplitState {
  currentCustomerId:    string | null;
  currentSubMerchantId: string | null;
  amount:               string;  // full amount
  serviceFeePercent:    string;  // as “2” for 2%
  txnLog:               string;
}

export class TransactionWithSplit extends sComponent<{}, SplitState> {
  __doNotBroadcast = ["amount","serviceFeePercent","txnLog"];

  state: SplitState = {
    currentCustomerId:    null,
    currentSubMerchantId: null,
    amount:               "50.00",
    serviceFeePercent:    "2.0",
    txnLog:               ""
  };

  private submitSplit = async () => {
    const {
      currentCustomerId,
      currentSubMerchantId,
      amount,
      serviceFeePercent
    } = this.state;

    if (!currentSubMerchantId) {
      return this.setState({ txnLog: "Select / create a sub-merchant first." });
    }
    if (!currentCustomerId) {
      return this.setState({ txnLog: "Select / create a customer first." });
    }

    this.setState({ txnLog: "Processing…" });

    // Build payload: send percent rather than hard-coding 2%
    const body = {
      customerId:           currentCustomerId,
      subMerchantAccountId: currentSubMerchantId,
      amount,
      serviceFeePercent:    serviceFeePercent.trim()
    };

    try {
      const r   = await fetch(`${clientUrl}/split-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:   JSON.stringify(body)
      });
      const res = await r.json();

      if (res.success) {
        this.setState({
          txnLog: `✅ Success – Txn ID: ${res.transactionId}  
  Sub-merchant earned ${res.subMerchantEarnings}, master earned ${res.masterMerchantEarnings}`
        });
      } else {
        this.setState({ txnLog: `❌ ${res.error || "Split failed"}` });
      }
    } catch (e:any) {
      this.setState({ txnLog: `❌ Network error: ${e.message}` });
    }
  };

  private onChange =
    (field: "amount" | "serviceFeePercent") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      this.setState({ [field]: e.target.value } as any);
    };

  render() {
    const {
      currentCustomerId,
      currentSubMerchantId,
      amount,
      serviceFeePercent,
      txnLog
    } = this.state;

    return (
      <div style={{ margin:20 }}>
        <h2>Transaction with Split</h2>

        <p>
          Customer ID:&nbsp;
          <strong>{currentCustomerId ?? "— none —"}</strong><br/>
          Sub-Merchant ID:&nbsp;
          <strong>{currentSubMerchantId ?? "— none —"}</strong>
        </p>

        <label>
          Amount:&nbsp;
          <input
            value={amount}
            onChange={this.onChange("amount")}
            style={{ width:100, marginRight:8 }}
          />
        </label>

        <label>
          Service Fee %:&nbsp;
          <input
            value={serviceFeePercent}
            onChange={this.onChange("serviceFeePercent")}
            style={{ width:50, marginRight:8 }}
          />
        </label>

        <button onClick={this.submitSplit}>
          Pay &amp; Split
        </button>

        {txnLog && (
          <div style={{
            marginTop:12,
            whiteSpace:"pre-wrap",
            color: txnLog.startsWith("✅") ? "green" : "red"
          }}>
            {txnLog}
          </div>
        )}
      </div>
    );
  }
}
