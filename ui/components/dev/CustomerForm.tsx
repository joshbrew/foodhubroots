// CustomerForm.tsx
import React, { ChangeEvent, FormEvent } from "react";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";
import { DropInUI } from "./DropInUI";

interface CustomerGlobalState {
  clientToken: string | null | Promise<string>;
  currentCustomerId: string | null;
  customerLog: string;
}

interface PaymentMethodUpdate {
  expirationMonth: string;
  expirationYear: string;
}

export class CustomerForm extends sComponent<{}, CustomerGlobalState> {
  state: CustomerGlobalState = {
    clientToken: null,
    currentCustomerId: null,
    customerLog: ""
  };
  __doNotBroadcast = ["customerLog"];

  // Local fields:
  private dropinInstance: any = null;
  private firstName = "";
  private lastName = "";
  private email = "";
  private company = "";
  private phone = "";
  private fax = "";
  private website = "";

  private loadedId = "";
  private fetchInFlight: Promise<void> | null = null;

  // new: vaulted methods + per-token update form state
  stateVault = {
    paymentMethods: [] as any[],
    pmUpdates: {} as Record<string, PaymentMethodUpdate>
  };

  /*────────────────── LIFE-CYCLE ──────────────────*/
  componentDidUpdate(_: {}, prev: CustomerGlobalState) {
    if (
      this.state.currentCustomerId &&
      this.state.currentCustomerId !== this.loadedId &&
      !this.fetchInFlight
    ) {
      this.fetchInFlight = this.fetchCustomer(this.state.currentCustomerId)
        .then(() => this.fetchPaymentMethods())
        .finally(() => { this.fetchInFlight = null; });
    }
  }

  /*────────────────── FETCH CUSTOMER ──────────────────*/
  private async fetchCustomer(id: string) {
    try {
      const r = await fetch(`${clientUrl}/get-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id })
      });
      if (!r.ok) throw new Error("Not found");
      const { customer } = await r.json();

      this.firstName = customer.firstName ?? "";
      this.lastName = customer.lastName ?? "";
      this.email = customer.email ?? "";
      this.company = customer.company ?? "";
      this.phone = customer.phone ?? "";
      this.fax = customer.fax ?? "";
      this.website = customer.website ?? "";

      this.loadedId = id;
      this.forceUpdate();
    } catch (e: any) {
      this.setState({ customerLog: `Fetch error: ${e.message}` });
    }
  }

  /*────────────────── TEXT HANDLER ──────────────────*/
  private txt = (field: keyof this) => (e: ChangeEvent<HTMLInputElement>) => {
    (this as any)[field] = e.target.value;
    this.forceUpdate();
  };

  /*────────── Vaulted Methods CRUD ──────────*/
  private async fetchPaymentMethods() {
    if (!this.state.currentCustomerId) return;
    try {
      const r = await fetch(`${clientUrl}/payment-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: this.state.currentCustomerId })
      });
      const data = await r.json();
      const methods = data.paymentMethods ?? [];
      // initialize update-form state for cards
      const pmUpdates: Record<string, PaymentMethodUpdate> = {};
      methods.forEach((pm: any) => {
        if (pm.expirationMonth) {
          pmUpdates[pm.token] = {
            expirationMonth: pm.expirationMonth,
            expirationYear: pm.expirationYear
          };
        }
      });
      this.stateVault = { paymentMethods: methods, pmUpdates };
      this.forceUpdate();
    } catch (e: any) {
      this.setState({ customerLog: `Fetch methods error: ${e.message}` });
    }
  }

  private async deletePaymentMethod(token: string) {
    try {
      await fetch(`${clientUrl}/delete-payment-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      this.fetchPaymentMethods();
    } catch (e: any) {
      this.setState({ customerLog: `Delete error: ${e.message}` });
    }
  }

  private async updatePaymentMethod(token: string) {
    // pull the two fields out of your pmUpdates
    const upd = this.stateVault.pmUpdates[token];
    if (!upd) return;

    const { expirationMonth, expirationYear } = upd;
    // require both
    if (!expirationMonth || !expirationYear) {
      return this.setState({ customerLog: "Please enter both month & year." });
    }

    // build a single expirationDate string
    const expirationDate = `${expirationMonth}/${expirationYear}`;

    try {
      const r = await fetch(`${clientUrl}/update-payment-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, expirationDate })
      });
      const res = await r.json();
      if (res.success) {
        this.setState({ customerLog: "Payment method updated!" });
        await this.fetchPaymentMethods();
      } else {
        this.setState({ customerLog: `Error: ${res.error}` });
      }
    } catch (e: any) {
      this.setState({ customerLog: `Error: ${e.message}` });
    }
  }

  private handlePMUpdateChange =
    (token: string, field: keyof PaymentMethodUpdate) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        this.stateVault.pmUpdates[token] = {
          ...this.stateVault.pmUpdates[token],
          [field]: v
        };
        this.forceUpdate();
      };

  /** 
* Look at the shape of `pm` and return a type + label. 
*/
  private describePM(pm: any): { kind: string; label: string } {
    if ("last4" in pm && "cardType" in pm) {
      // Credit Card
      return {
        kind: "Credit Card",
        label: `${pm.cardType} ending in ${pm.last4}`,
      };
    } else if ("email" in pm && "payerId" in pm) {
      // PayPal
      return {
        kind: "PayPal Account",
        label: pm.email,
      };
    } else if ("username" in pm) {
      // Venmo
      return {
        kind: "Venmo Account",
        label: pm.username,
      };
    }
    // fallback
    return {
      kind: "Payment Method",
      label: pm.token,
    };
  }

  /*────────────────── DELETE CUSTOMER ──────────────────*/
  private async deleteCustomer() {
    if (!this.state.currentCustomerId) return;
    if (!confirm("Delete this customer permanently?")) return;
    try {
      const r = await fetch(`${clientUrl}/delete-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: this.state.currentCustomerId })
      });
      if (!r.ok) throw new Error("Delete failed");

      this.setState({
        currentCustomerId: null,
        customerLog: "Customer deleted."
      });
      this.loadedId = "";
      this.dropinInstance = null;
      this.forceUpdate();
    } catch (e: any) {
      this.setState({ customerLog: `Error: ${e.message}` });
    }
  }

  /*────────────────── SUBMIT (create OR update) ──────────────────*/
  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const base = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      company: this.company,
      phone: this.phone,
      fax: this.fax,
      website: this.website
    };

    if (!this.state.currentCustomerId) {
      if (!this.dropinInstance)
        return this.setState({ customerLog: "Drop-in not ready." });
      this.setState({ customerLog: "Creating…" });
      try {
        const { nonce } = await this.dropinInstance.requestPaymentMethod();
        const r = await fetch(`${clientUrl}/create-customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...base, paymentMethodNonce: nonce })
        });
        const res = await r.json();
        if (res.success) {
          this.setState({
            currentCustomerId: res.customerId,
            customerLog: "Customer created!"
          });
          await this.dropinInstance.teardown();
          this.dropinInstance = null;
        } else {
          this.setState({ customerLog: `Error: ${res.error}` });
        }
      } catch (err: any) {
        this.setState({ customerLog: `Net error: ${err.message}` });
      }
      return;
    }

    this.setState({ customerLog: "Updating…" });
    try {
      const r = await fetch(`${clientUrl}/update-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: this.state.currentCustomerId, ...base })
      });
      const res = await r.json();
      if (res.success) {
        this.setState({ customerLog: "Customer updated." });
      } else {
        this.setState({ customerLog: `Error: ${res.error}` });
      }
    } catch (err: any) {
      this.setState({ customerLog: `Net error: ${err.message}` });
    }
  };

  /*────────────────── RENDER ──────────────────*/
  render() {
    const { currentCustomerId, customerLog, clientToken } = this.state;
    const editing = !!currentCustomerId;
    const { paymentMethods, pmUpdates } = this.stateVault;

    return (
      <form onSubmit={this.handleSubmit} style={{ margin: 20, maxWidth: 480 }}>
        <h2>{editing ? "Edit Customer" : "Create Customer"}</h2>

        <label>
          First&nbsp;Name:&nbsp;
          <input
            required
            value={this.firstName}
            onChange={this.txt("firstName")}
          />
        </label>
        <br />
        <label>
          Last&nbsp;Name:&nbsp;
          <input
            required
            value={this.lastName}
            onChange={this.txt("lastName")}
          />
        </label>
        <br />
        <label>
          Email:&nbsp;
          <input
            type="email"
            required
            value={this.email}
            onChange={this.txt("email")}
          />
        </label>
        <br />
        <label>
          Company:&nbsp;
          <input
            value={this.company}
            onChange={this.txt("company")}
          />
        </label>
        <br />
        <label>
          Phone:&nbsp;
          <input
            value={this.phone}
            onChange={this.txt("phone")}
          />
        </label>
        <br />
        <label>
          Fax:&nbsp;
          <input
            value={this.fax}
            onChange={this.txt("fax")}
          />
        </label>
        <br />
        <label>
          Website:&nbsp;
          <input
            value={this.website}
            onChange={this.txt("website")}
          />
        </label>

        {!editing && (
          <>
            <hr />
            <DropInUI
              key={currentCustomerId || "new"}
              options={{
                card: true,
                paypal: { flow: "vault", commit: true },
                paypalCredit: { flow: "vault", commit: true },
                paymentOptionPriority: ["paypal", "paypalCredit", "card"]
              }}
              onReady={inst => { this.dropinInstance = inst; this.forceUpdate(); }}
              onError={msg => this.setState({ customerLog: msg })}
            />
          </>
        )}

        <hr />
        <button type="submit" disabled={!editing && !this.dropinInstance}>
          {editing ? "Save Changes" : "Create Customer"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => this.deleteCustomer()}
            style={{ marginLeft: 12, color: "crimson" }}
          >
            Delete Customer
          </button>
        )}

        {editing && (
          <>
            <h3 style={{ marginTop: 20 }}>Payment Methods</h3>
            {paymentMethods.length ? paymentMethods.map(pm => {
              const { kind, label } = this.describePM(pm);

              return (
                <div key={pm.token} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
                  {/* Show a single “Method: Kind — label” line */}
                  <p>
                    <strong>Method:</strong> {kind} — {label}<br />
                    <strong>Token:</strong> {pm.token}
                  </p>

                  {/* only cards have exp fields */}
                  {"expirationMonth" in pm && (
                    <>
                      <label>
                        Exp Month:&nbsp;
                        <input
                          value={this.stateVault.pmUpdates[pm.token]?.expirationMonth || ""}
                          onChange={this.handlePMUpdateChange(pm.token, "expirationMonth")}
                          style={{ width: 50 }}
                        />
                      </label>
                      <label style={{ marginLeft: 8 }}>
                        Exp Year:&nbsp;
                        <input
                          value={this.stateVault.pmUpdates[pm.token]?.expirationYear || ""}
                          onChange={this.handlePMUpdateChange(pm.token, "expirationYear")}
                          style={{ width: 60 }}
                        />
                      </label>
                      <button
                        onClick={() => this.updatePaymentMethod(pm.token)}
                        style={{ marginLeft: 8 }}
                      >
                        Update
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => this.deletePaymentMethod(pm.token)}
                    style={{ marginLeft: 8, color: "crimson" }}
                  >
                    Delete
                  </button>
                </div>
              );
            }) : (
              <p>No vaulted payment methods</p>
            )}
          </>
        )}

        {this.state.currentCustomerId && (
          <p style={{ marginTop: 10 }}>
            Customer&nbsp;ID:&nbsp;
            <strong>{currentCustomerId}</strong>
          </p>
        )}
        {customerLog && (
          <p style={{ color: "red", marginTop: 10 }}>{customerLog}</p>
        )}
      </form>
    );
  }
}
