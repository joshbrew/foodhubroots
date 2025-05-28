// CustomerForm.tsx
import React, { ChangeEvent, FormEvent } from "react";
import { clientUrl, obtainClientToken } from "../../../scripts/frontend";
import { sComponent }                from "../util/state.component";
import { DropInUI }                  from "./DropInUI";

interface CustomerGlobalState {
  clientToken:       string | null | Promise<string>;
  currentCustomerId: string | null;
  customerLog:       string;
}

interface PaymentMethodUpdate {
  expirationMonth: string;
  expirationYear:  string;
}

export class CustomerForm extends sComponent<{}, CustomerGlobalState> {
  state: CustomerGlobalState = {
    clientToken:       null,
    currentCustomerId: null,
    customerLog:       ""
  };
  __doNotBroadcast = ["customerLog"];

  /*── Local fields ──*/
  private dropinAddInstance: any          = null;  // for “Add Payment Method”
  private firstName        = "";
  private lastName         = "";
  private email            = "";
  private company          = "";
  private phone            = "";
  private fax              = "";
  private website          = "";

  private loadedId        = "";
  private fetchInFlight: Promise<void> | null = null;

  // vaulted methods + update form state
  private vaultedMethods: any[] = [];
  private pmUpdates: Record<string, PaymentMethodUpdate> = {};
  private newPmToken: string | null = null;

  async componentDidMount() {
    // fetch clientToken once
    try {
      const token = await obtainClientToken();
      this.setState({ clientToken: token });
    } catch (e: any) {
      this.setState({ customerLog: `Token error: ${e.message}` });
    }
  }

  componentDidUpdate(_: {}, prev: CustomerGlobalState) {
    // when customerId appears, fetch customer + vaulted methods once
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

  private async fetchCustomer(id: string) {
    // load customer details
    try {
      const r = await fetch(`${clientUrl}/get-customer`, {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ customerId: id })
      });
      if (!r.ok) throw new Error("Not found");
      const { customer } = await r.json();

      this.firstName = customer.firstName ?? "";
      this.lastName  = customer.lastName  ?? "";
      this.email     = customer.email     ?? "";
      this.company   = customer.company   ?? "";
      this.phone     = customer.phone     ?? "";
      this.fax       = customer.fax       ?? "";
      this.website   = customer.website   ?? "";

      this.loadedId = id;
      this.forceUpdate();
    } catch (e:any) {
      this.setState({ customerLog: `Fetch error: ${e.message}` });
    }
  }

  private async fetchPaymentMethods() {
    // load vaulted methods
    if (!this.state.currentCustomerId) return;
    try {
      const r    = await fetch(`${clientUrl}/payment-methods`, {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ customerId: this.state.currentCustomerId })
      });
      const data = await r.json();
      this.vaultedMethods = data.paymentMethods ?? [];

      // init pmUpdates for cards
      this.pmUpdates = {};
      this.vaultedMethods.forEach((pm:any) => {
        if ("expirationMonth" in pm) {
          this.pmUpdates[pm.token] = {
            expirationMonth: pm.expirationMonth,
            expirationYear:  pm.expirationYear
          };
        }
      });

      this.forceUpdate();
    } catch (e:any) {
      this.setState({ customerLog: `Fetch methods error: ${e.message}` });
    }
  }

  private async deletePaymentMethod(token: string) {
    try {
      await fetch(`${clientUrl}/delete-payment-method`, {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ token })
      });
      await this.fetchPaymentMethods();
    } catch (e:any) {
      this.setState({ customerLog: `Delete error: ${e.message}` });
    }
  }

  private async updatePaymentMethod(token: string) {
    const upd = this.pmUpdates[token];
    if (!upd) return;
    if (!upd.expirationMonth || !upd.expirationYear) {
      return this.setState({ customerLog: "Enter both month & year." });
    }
    const expirationDate = `${upd.expirationMonth}/${upd.expirationYear}`;
    try {
      const r   = await fetch(`${clientUrl}/update-payment-method`, {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ token, expirationDate })
      });
      const res = await r.json();
      if (res.success) {
        this.setState({ customerLog: "Payment method updated!" });
        await this.fetchPaymentMethods();
      } else {
        this.setState({ customerLog: `Error: ${res.error}` });
      }
    } catch (e:any) {
      this.setState({ customerLog: `Error: ${e.message}` });
    }
  }

  private handlePMUpdateChange =
    (token: string, field: keyof PaymentMethodUpdate) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      this.pmUpdates[token][field] = e.target.value;
      this.forceUpdate();
    };

  private async addPaymentMethod() {
    if (!this.dropinAddInstance || !this.state.currentCustomerId) {
      return this.setState({ customerLog: "Drop-in not ready." });
    }
    this.setState({ customerLog: "Vaulting payment method…" });
    try {
      const { nonce } = await this.dropinAddInstance.requestPaymentMethod();
      const r   = await fetch(`${clientUrl}/create-payment-method`, {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          customerId:         this.state.currentCustomerId,
          paymentMethodNonce: nonce,
          options:            { makeDefault: false }
        })
      });
      const data = await r.json();
      if (data.success) {
        this.newPmToken = data.token;
        this.setState({ customerLog: "Payment method vaulted!" });
        await this.fetchPaymentMethods();
      } else {
        this.setState({ customerLog: `Error: ${data.error}` });
      }
    } catch (e:any) {
      this.setState({ customerLog: `Error: ${e.message}` });
    }
  }

  private describePM(pm: any): { kind: string; label: string } {
    if ("last4" in pm && "cardType" in pm) {
      return { kind: "Credit Card", label: `${pm.cardType} ending in ${pm.last4}` };
    } else if ("email" in pm && "payerId" in pm) {
      return { kind: "PayPal Account", label: pm.email };
    } else if ("username" in pm) {
      return { kind: "Venmo Account", label: pm.username };
    }
    return { kind: "Payment Method", label: pm.token };
  }

  private txt = (field: keyof this) => (e: ChangeEvent<HTMLInputElement>) => {
    (this as any)[field] = e.target.value;
    this.forceUpdate();
  };

  private deleteCustomer = async () => {
    if (!this.state.currentCustomerId || !confirm("Delete?")) return;
    try {
      const r = await fetch(`${clientUrl}/delete-customer`, {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ customerId: this.state.currentCustomerId })
      });
      if (!r.ok) throw new Error("Delete failed");
      this.setState({ currentCustomerId: null, customerLog: "Customer deleted." });
      this.loadedId = "";
      this.dropinAddInstance = null;
      this.forceUpdate();
    } catch (e:any) {
      this.setState({ customerLog: `Error: ${e.message}` });
    }
  };

  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const base = {
      firstName: this.firstName,
      lastName:  this.lastName,
      email:     this.email,
      company:   this.company,
      phone:     this.phone,
      fax:       this.fax,
      website:   this.website
    };

    // CREATE vs UPDATE
    if (!this.state.currentCustomerId) {
      if (!this.dropinAddInstance)
        return this.setState({ customerLog: "Drop-in not ready." });
      this.setState({ customerLog: "Creating…" });
      try {
        const { nonce } = await this.dropinAddInstance.requestPaymentMethod();
        const r   = await fetch(`${clientUrl}/create-customer`, {
          method: "POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ ...base, paymentMethodNonce: nonce })
        });
        const res = await r.json();
        if (res.success) {
          this.setState({ currentCustomerId: res.customerId, customerLog: "Customer created!" });
          await this.dropinAddInstance.teardown();
          this.dropinAddInstance = null;
          await this.fetchPaymentMethods();
        } else {
          this.setState({ customerLog: `Error: ${res.error}` });
        }
      } catch (err:any) {
        this.setState({ customerLog: `Net error: ${err.message}` });
      }
      return;
    }

    // UPDATE CUSTOMER
    this.setState({ customerLog: "Updating…" });
    try {
      const r   = await fetch(`${clientUrl}/update-customer`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ customerId:this.state.currentCustomerId, ...base })
      });
      const res = await r.json();
      if (res.success) {
        this.setState({ customerLog: "Customer updated." });
      } else {
        this.setState({ customerLog: `Error: ${res.error}` });
      }
    } catch (err:any) {
      this.setState({ customerLog: `Net error: ${err.message}` });
    }
  };

  render() {
    const { currentCustomerId, customerLog, clientToken } = this.state;
    const editing = !!currentCustomerId;

    return (
      <form onSubmit={this.handleSubmit} style={{ margin: 20, maxWidth: 480 }}>
        <h2>{editing ? "Edit Customer" : "Create Customer"}</h2>

        {/* ── Customer fields ─────────────────────── */}
        <label>First Name: <input required value={this.firstName} onChange={this.txt("firstName")} /></label><br/>
        <label>Last Name:  <input required value={this.lastName}  onChange={this.txt("lastName")}  /></label><br/>
        <label>Email:      <input required value={this.email}     onChange={this.txt("email")}     /></label><br/>
        <label>Company:    <input value={this.company}            onChange={this.txt("company")}   /></label><br/>
        <label>Phone:      <input value={this.phone}              onChange={this.txt("phone")}     /></label><br/>
        <label>Fax:        <input value={this.fax}                onChange={this.txt("fax")}       /></label><br/>
        <label>Website:    <input value={this.website}            onChange={this.txt("website")}   /></label>

        {!editing && (
          <>
            <hr/>
            <DropInUI
              key="new-dropin"
              options={{
                card: true,
                paypal:       { flow:"vault", commit:true },
                paypalCredit: { flow:"vault", commit:true },
                paymentOptionPriority: ["paypal","paypalCredit","card"]
              }}
              onReady={inst => { this.dropinAddInstance = inst; this.forceUpdate(); }}
              onError={msg => this.setState({ customerLog: msg })}
            />
          </>
        )}

        <hr/>
        <button type="submit" disabled={!editing && !this.dropinAddInstance}>
          {editing ? "Save Changes" : "Create Customer"}
        </button>
        {editing && (
          <button type="button" onClick={()=>this.deleteCustomer()}
                  style={{marginLeft:12,color:"crimson"}}>
            Delete Customer
          </button>
        )}

        {/* ── Add Payment Method ────────────────── */}
        {editing && clientToken && typeof clientToken==="string" && (
          <>
            <hr/>
            <h3>Add Payment Method</h3>
            <DropInUI
              key={`add-pm-${currentCustomerId}`}
              options={{
                card: true,
                paypal:       { flow:"vault", commit:true },
                paypalCredit: { flow:"vault", commit:true },
                paymentOptionPriority: ["paypal","paypalCredit","card"]
              }}
              onReady={inst => { this.dropinAddInstance = inst; this.forceUpdate(); }}
              onError={msg => this.setState({ customerLog: msg })}
            />
            <button
              type="button"
              disabled={!this.dropinAddInstance}
              onClick={() => this.addPaymentMethod()}
              style={{ marginTop:8 }}
            >
              Vault New Payment Method
            </button>
            {this.newPmToken && (
              <div style={{ marginTop:8 }}>
                New Token: <strong>{this.newPmToken}</strong>
              </div>
            )}
          </>
        )}

        {/* ── Vaulted Methods List ────────────────── */}
        {editing && (
          <>
            <hr/>
            <h3>Payment Methods</h3>
            {this.vaultedMethods.length
              ? this.vaultedMethods.map(pm => {
                  const { kind, label } = this.describePM(pm);
                  return (
                    <div key={pm.token} style={{ border:"1px solid #ddd", padding:8, marginBottom:8 }}>
                      <p>
                        <strong>Method:</strong> {kind} — {label}<br/>
                        <strong>Token:</strong> {pm.token}
                      </p>
                      {"expirationMonth" in pm && (
                        <>
                          <label>
                            Exp Month:&nbsp;
                            <input
                              value={this.pmUpdates[pm.token]?.expirationMonth||""}
                              onChange={this.handlePMUpdateChange(pm.token,"expirationMonth")}
                              style={{ width:50 }}
                            />
                          </label>
                          <label style={{marginLeft:8}}>
                            Exp Year:&nbsp;
                            <input
                              value={this.pmUpdates[pm.token]?.expirationYear||""}
                              onChange={this.handlePMUpdateChange(pm.token,"expirationYear")}
                              style={{ width:60 }}
                            />
                          </label>
                          <button
                            onClick={()=>this.updatePaymentMethod(pm.token)}
                            style={{marginLeft:8}}
                          >
                            Update
                          </button>
                        </>
                      )}
                      <button
                        onClick={()=>this.deletePaymentMethod(pm.token)}
                        style={{marginLeft:8,color:"crimson"}}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              : <p>No vaulted payment methods</p>
            }
          </>
        )}

        {currentCustomerId && (
          <p style={{ marginTop:10 }}>
            Customer ID: <strong>{currentCustomerId}</strong>
          </p>
        )}
        {customerLog && (
          <p style={{ color:"red", marginTop:10 }}>
            {customerLog}
          </p>
        )}
      </form>
    );
  }
}
