/**************************************************************************
 *  Create / Edit / Delete Customer  (sComponent)
 *  ------------------------------------------------
 *  • create-mode   → no `currentCustomerId`
 *  • edit-mode     → `currentCustomerId` present
 *      – fetch once, pre-populate, allow update & delete
 *
 *  Shared keys:
 *     clientToken          ← fetched once, reused everywhere
 *     currentCustomerId    ← “working with this customer”
 *
 *  Local-only:
 *     customerLog, firstName…website, dropinInstance, loadedId,
 *     fetchInFlight (promise guard)
 **************************************************************************/

import React, { ChangeEvent, FormEvent } from "react";
import dropin          from "braintree-web-drop-in";
import { clientUrl,
         obtainClientToken     
        }              from "../../../scripts/frontend";
import { sComponent }  from "../util/state.component";

/*────────── shared slice of global state ──────────*/
interface CustomerGlobalState {
  clientToken:        string | null | Promise<string>;
  currentCustomerId:  string | null;
  customerLog:        string;      // NOT propagated – see __doNotBroadcast
}

/*────────── sComponent ──────────*/
export class CustomerForm extends sComponent<{}, CustomerGlobalState>
{
  /*────────────────── CONFIG ──────────────────*/
  state: CustomerGlobalState = {
    clientToken:       null,
    currentCustomerId: null,
    customerLog:       ""
  };
  __doNotBroadcast = ["customerLog"];

  /*────────────────── LOCAL FIELDS ──────────────────*/
  private dropinInstance: any | null = null;

  private firstName = "";
  private lastName  = "";
  private email     = "";
  private company   = "";
  private phone     = "";
  private fax       = "";
  private website   = "";

  private loadedId      = "";              // which id is hydrated
  private fetchInFlight : Promise<void> | null = null; // guard

  /*────────────────── LIFE-CYCLE ──────────────────*/
  async componentDidMount() {
    try {
      /* deduped helper returns cached string or shared promise */
      const token = await obtainClientToken();
      this.setState({ clientToken: token });       // broadcast resolved
    } catch (e:any) {
      this.setState({ customerLog: `Token error: ${e.message}` });
    }
  }

  componentDidUpdate(_: {}, prev: CustomerGlobalState) {
    /* ── 1) Token turned into a real string → build Drop-in once (create-mode only) */
    if (
      typeof this.state.clientToken === "string" &&
      prev.clientToken             !== this.state.clientToken &&
      !this.state.currentCustomerId &&           // only while creating
      !this.dropinInstance
    ) {
      this.initDropIn();
    }

    /* ── 2) new customer id broadcast → fetch exactly ONCE          */
    if (
      this.state.currentCustomerId &&                    // we HAVE an id
      this.state.currentCustomerId !== this.loadedId &&  // not loaded yet
      !this.fetchInFlight                                 // not already fetching
    ) {
      this.fetchInFlight = this.fetchCustomer(this.state.currentCustomerId)
        .finally(()=>{ this.fetchInFlight = null; });
    }
  }

  componentWillUnmount() { this.dropinInstance?.teardown?.(); }

  /*────────────────── DROP-IN (create-mode) ──────────────────*/
  private initDropIn() {
    if (this.dropinInstance) return;
    if (typeof this.state.clientToken !== "string") return;

    dropin.create(
      { authorization: this.state.clientToken, container: "#customer-dropin" },
      (err, inst) => {
        if (err) {
          this.setState({ customerLog: "Drop-in failed to initialise." });
        } else {
          this.dropinInstance = inst;
          this.forceUpdate();
        }
      }
    );
  }

  /*────────────────── API HELPERS ──────────────────*/
  private async fetchCustomer(id: string) {
    try {
      console.log('fetching customer');
      const r = await fetch(`${clientUrl}/get-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id })
      });
      if (!r.ok) throw new Error("Not found");
      const { customer } = await r.json();

      /* hydrate local fields */
      this.firstName = customer.firstName  ?? "";
      this.lastName  = customer.lastName   ?? "";
      this.email     = customer.email      ?? "";
      this.company   = customer.company    ?? "";
      this.phone     = customer.phone      ?? "";
      this.fax       = customer.fax        ?? "";
      this.website   = customer.website    ?? "";

      this.loadedId  = id;
      /* editing-mode – ensure Drop-in is removed */
      if (this.dropinInstance) {
        await this.dropinInstance.teardown();
        this.dropinInstance = null;
      }
      this.forceUpdate();
    } catch (e:any) {
      this.setState({ customerLog: `Fetch error: ${e.message}` });
    }
  }

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

      /* clear global id, reset local form, re-enable create mode */
      this.setState({
        currentCustomerId: null,
        customerLog:       "Customer deleted."
      });

      this.loadedId  = "";
      this.firstName = this.lastName = this.email =
      this.company  = this.phone    = this.fax   = this.website = "";

      this.initDropIn();                     // bring back Drop-in
    } catch (e:any) {
      this.setState({ customerLog: `Error: ${e.message}` });
    }
  }

  /*────────────────── SUBMIT (create OR update) ──────────────────*/
  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const base = {
      firstName: this.firstName, lastName: this.lastName, email: this.email,
      company:   this.company,   phone:    this.phone,    fax:   this.fax,
      website:   this.website
    };

    /* ── CREATE ───────────────────────────────────────*/
    if (!this.state.currentCustomerId) {
      if (!this.dropinInstance)
        return this.setState({ customerLog: "Drop-in not ready." });

      this.setState({ customerLog: "Creating…" });

      try {
        const { nonce } = await this.dropinInstance.requestPaymentMethod();
        const r   = await fetch(`${clientUrl}/create-customer`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...base, paymentMethodNonce: nonce })
        });
        const res = await r.json();

        if (res.success) {
          this.setState({
            currentCustomerId: res.customerId,
            customerLog:       "Customer created!"
          });
          /* teardown drop-in now that we are in edit-mode */
          await this.dropinInstance.teardown();
          this.dropinInstance = null;
        } else {
          this.setState({ customerLog: `Error: ${res.error}` });
        }
      } catch (err:any) {
        this.setState({ customerLog: `Net error: ${err.message}` });
      }
      return;
    }

    /* ── UPDATE ───────────────────────────────────────*/
    this.setState({ customerLog: "Updating…" });

    try {
      const r = await fetch(`${clientUrl}/update-customer`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: this.state.currentCustomerId, ...base })
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

  /*────────────────── helpers ──────────────────*/
  private txt =
    (field: keyof this) =>
      (e: ChangeEvent<HTMLInputElement>) =>
        { (this as any)[field] = e.target.value; this.forceUpdate(); };

  /*────────────────── RENDER ──────────────────*/
  render() {
    const editing = !!this.state.currentCustomerId;

    return (
      <form onSubmit={this.handleSubmit} style={{ margin: 20, maxWidth: 480 }}>
        <h2>{editing ? "Edit Customer" : "Create Customer"}</h2>

        <label>First&nbsp;Name:
          <input required value={this.firstName} onChange={this.txt("firstName")} />
        </label><br/>
        <label>Last&nbsp;Name:
          <input required value={this.lastName} onChange={this.txt("lastName")} />
        </label><br/>
        <label>Email:
          <input type="email" required value={this.email} onChange={this.txt("email")} />
        </label><br/>
        <label>Company:
          <input value={this.company} onChange={this.txt("company")} />
        </label><br/>
        <label>Phone:
          <input value={this.phone} onChange={this.txt("phone")} />
        </label><br/>
        <label>Fax:
          <input value={this.fax} onChange={this.txt("fax")} />
        </label><br/>
        <label>Website:
          <input type="url" value={this.website} onChange={this.txt("website")} />
        </label>

        {!editing && (
          <>
            <hr/>
            <div id="customer-dropin" style={{ margin:"10px 0" }} />
          </>
        )}

        <hr/>
        <button type="submit" disabled={!editing && !this.dropinInstance}>
          {editing ? "Save Changes" : "Create Customer"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={()=>this.deleteCustomer()}
            style={{ marginLeft:12,color:"crimson" }}>
            Delete Customer
          </button>
        )}

        {this.state.currentCustomerId && (
          <p style={{ marginTop:10 }}>
            Customer&nbsp;ID:&nbsp;<strong>{this.state.currentCustomerId}</strong>
          </p>
        )}
        {this.state.customerLog && (
          <p style={{ color:"red", marginTop:10 }}>{this.state.customerLog}</p>
        )}
      </form>
    );
  }
}
