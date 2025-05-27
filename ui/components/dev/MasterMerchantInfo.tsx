import React from "react";
import { MerchantAccountResponse } from "../../../scripts/braintree_datastructures";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";


interface MasterMerchantState {
  account: MerchantAccountResponse | null;
  log: string;
}

export class MasterMerchantInfo extends sComponent<{}, MasterMerchantState> {
  state: MasterMerchantState = {
    account: null,
    log: ""
  };

  async componentDidMount() {
    try {
      const res = await fetch(`${clientUrl}/master-merchant`);
      const data = await res.json();
      if (data.account) {
        this.setState({ account: data.account });
      } else {
        this.setState({ log: `Error: ${data.error || "No account returned"}` });
      }
    } catch (err: any) {
      this.setState({ log: `Fetch error: ${err.message}` });
    }
  }

  render() {
    const { account, log } = this.state;

    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Master Merchant Info</h2>
        {account ? (
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "4px",
              maxHeight: "400px",
              overflow: "auto",
              whiteSpace: "pre-wrap"
            }}
          >
            {JSON.stringify(account, null, 2)}
          </pre>
        ) : (
          <p>Loading master merchant data…</p>
        )}
        {log && <div style={{ color: "red" }}>{log}</div>}
      </div>
    );
  }
}
