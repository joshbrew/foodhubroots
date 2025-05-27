import React from "react";
import { MerchantAccountResponse } from "../../../scripts/braintree_datastructures";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";

interface FindSubmerchantState {
    merchantAccountId: string;
    subMerchantAccount: MerchantAccountResponse | null;
    subMerchantLog: string;
  }
  
  export class FindSubmerchant extends sComponent<{}, FindSubmerchantState> {
    state: FindSubmerchantState = {
      merchantAccountId: "",
      subMerchantAccount: null,
      subMerchantLog: ""
    };
  
    handleLookup = async () => {
      const { merchantAccountId } = this.state;
      if (!merchantAccountId.trim()) {
        this.setState({ subMerchantLog: "Please enter an account ID." });
        return;
      }
  
      try {
        const res = await fetch(
          `${clientUrl}/get-submerchant`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ merchantAccountId })
          }
        );
        const data = await res.json();
        if (res.ok && data.subMerchant) {
          this.setState({ subMerchantAccount: data.subMerchant, subMerchantLog: "" });
        } else {
          this.setState({
            subMerchantAccount: null,
            subMerchantLog: data.error || "Submerchant not found"
          });
        }
      } catch (err: any) {
        this.setState({ subMerchantAccount: null, subMerchantLog: err.message });
      }
    };
  
    render() {
      const { merchantAccountId, subMerchantAccount, subMerchantLog: log } = this.state;
  
      return (
        <div style={{ margin: "10px 0" }}>
          <h2>Find Submerchant by ID</h2>
          <div>
            <input
              type="text"
              placeholder="Enter merchant account ID"
              value={merchantAccountId}
              onChange={(e) =>
                this.setState({ merchantAccountId: e.target.value })
              }
              style={{ marginRight: "10px", width: "300px" }}
            />
            <button onClick={this.handleLookup}>Lookup</button>
          </div>
  
          {log && (
            <div style={{ marginTop: "8px", color: "red" }}>
              {log}
            </div>
          )}
  
          {subMerchantAccount && (
            <pre
              style={{
                background: "#fafafa",
                padding: "10px",
                borderRadius: "4px",
                maxHeight: "300px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                marginTop: "10px"
              }}
            >
              {JSON.stringify(subMerchantAccount, null, 2)}
            </pre>
          )}
        </div>
      );
    }
  }