import React, { Component, FormEvent, ChangeEvent, MouseEvent } from "react";
import dropin from "braintree-web-drop-in";
import { sComponent, state } from "./components/util/state.component";
import { MerchantAccountResponse } from "../scripts/braintree_datastructures";

const protocol = "https";

let _tokenValue: string | null = null;
let _tokenPromise: Promise<string> | null = null;


export function obtainClientToken(): Promise<string> {
  if (_tokenValue) return Promise.resolve(_tokenValue);   // cached
  if (_tokenPromise) return _tokenPromise;                  // in-flight

  _tokenPromise = fetch(`${protocol}://localhost:3000/client-token`)
    .then(r => r.json())
    .then(({ clientToken }) => {
      _tokenValue = clientToken;     // cache for everyone else
      _tokenPromise = null;
      return clientToken;
    });

  return _tokenPromise;
}
/* helper to test “is this a promise?” */
const isPromise = (x: any): x is Promise<any> =>
  x && typeof x === "object" && typeof x.then === "function";


//sComponents keep a persistent state, you can import "state" from state.component to manipulate/reference state more programatically, 
// tying the system together in a simple manner. state can also to localStorage

// -------------------------------------------------------------------
// Main App Component: Fetches client token and initializes Drop-In UI
// -------------------------------------------------------------------
export class App extends sComponent {

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <h1>Braintree Sandbox Test</h1>
        {/* Pass the dropInInstance prop to CreateCustomer */}
        <DataListings />
        <hr />
        <MasterMerchantInfo />
        <hr />
        <FindSubmerchant />
        <hr />
        <CreateCustomer />
        <AddPaymentMethod />
        <hr />
        <RegularCheckout />
        <hr />
        <CreateSubMerchant />
        <hr />
        <TransactionWithSplit />
        <hr />
      </div>
    );
  }
}


/*────────────────────────────────────────────
  Keys we WANT to broadcast to every sComponent
────────────────────────────────────────────*/
interface CustomerGlobalState {
  clientToken: string | null | Promise<string>;  // fetched once, reused everywhere
  currentCustomerId: string | null;  // “selected / just-created” customer
  customerLog: string;         // unique log key for this feature
}

/*────────────────────────────────────────────
  Create Customer  –  shared bits in state,
  everything else kept private on the class.
────────────────────────────────────────────*/
export class CreateCustomer extends sComponent<{}, CustomerGlobalState> {
  /* shared */
  state: CustomerGlobalState = {
    clientToken: null,
    currentCustomerId: null,
    customerLog: ""
  };

  __doNotBroadcast = ['customerLog'];

  /* local-only fields (no cross-component need) */
  private dropinInstance: any | null = null;
  private firstName = "";
  private lastName = "";
  private email = "";
  private company = "";
  private phone = "";
  private fax = "";
  private website = "";

  /*──────── LIFECYCLE ────────*/
  async componentDidMount() {
    /* one & only fetch (deduped globally) */
    try {
      const token = await obtainClientToken();
      this.setState({ clientToken: token });   // broadcast resolved string
    } catch (e: any) {
      this.setState({ customerLog: `Could not fetch client token: ${e.message}` });
    }
  }

  /* whenever clientToken becomes a real string, spin-up Drop-in */
  componentDidUpdate(_: {}, prevState: CustomerGlobalState) {
    if (
      typeof this.state.clientToken === "string" &&
      prevState.clientToken !== this.state.clientToken
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

  /*──────── HANDLERS ────────*/
  private handleText =
    (key: any) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        (this as any)[key] = e.target.value;
        this.forceUpdate();
      };

  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!this.dropinInstance)
      return this.setState({ customerLog: "Drop-in not ready." });

    this.setState({ customerLog: "Creating customer…" });

    try {
      const { nonce } = await this.dropinInstance.requestPaymentMethod();

      const payload = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        company: this.company,
        phone: this.phone,
        fax: this.fax,
        website: this.website,
        paymentMethodNonce: nonce
      };

      const r = await fetch(`${protocol}://localhost:3000/create-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const res = await r.json();

      if (res.success) {
        /* broadcast the freshly created customer ID */
        this.setState({
          currentCustomerId: res.customerId,
          customerLog: "Customer created!"
        });
      } else {
        this.setState({ customerLog: `Error: ${res.error}` });
      }
    } catch (err: any) {
      this.setState({ customerLog: `Network error: ${err.message}` });
    }
  };

  /*──────── RENDER ────────*/
  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ margin: 20 }}>
        <h2>Create Customer</h2>

        <label>
          First&nbsp;Name:
          <input
            required
            value={this.firstName}
            onChange={this.handleText("firstName")}
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />

        <label>
          Last&nbsp;Name:
          <input
            required
            value={this.lastName}
            onChange={this.handleText("lastName")}
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />

        <label>
          Email:
          <input
            type="email"
            required
            value={this.email}
            onChange={this.handleText("email")}
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />

        <label>
          Company:
          <input
            value={this.company}
            onChange={this.handleText("company")}
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />

        <label>
          Phone:
          <input
            value={this.phone}
            onChange={this.handleText("phone")}
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />

        <label>
          Fax:
          <input
            value={this.fax}
            onChange={this.handleText("fax")}
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />

        <label>
          Website:
          <input
            type="url"
            value={this.website}
            onChange={this.handleText("website")}
            style={{ marginLeft: 8 }}
          />
        </label>

        <hr />
        <div id="customer-dropin" style={{ margin: "10px 0" }} />

        <button type="submit" disabled={!this.dropinInstance}>
          Create Customer
        </button>

        {this.state.currentCustomerId && (
          <div style={{ marginTop: 12 }}>
            Customer&nbsp;ID:&nbsp;
            <strong>{this.state.currentCustomerId}</strong>
          </div>
        )}
        {this.state.customerLog && (
          <div style={{ marginTop: 12, color: "red" }}>
            {this.state.customerLog}
          </div>
        )}
      </form>
    );
  }
}



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
      const res = await fetch(`${protocol}://localhost:3000/create-payment-method`, {
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
      const r = await fetch(`${protocol}://localhost:3000/checkout`, {
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


interface AddressState {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
}

interface IndividualState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;  // YYYY-MM-DD
  ssn: string;  // last4
  address: AddressState;
}

interface BusinessState {
  legalName: string;
  dbaName: string;
  taxId: string;
  address: AddressState;
}

interface FundingState {
  descriptor: string;
  destination: "bank" | "mobile";
  email: string;
  mobilePhone: string;
  accountNumber: string;
  routingNumber: string;
}

interface SMState {
  /* ─── shared ─── */
  currentSubMerchantId: string;   // published globally

  /* ─── local-only ─── */
  id: string;
  idExists: boolean | null;
  tosAccepted: boolean;
  individual: IndividualState;
  useBusiness: boolean;
  business: BusinessState;
  funding: FundingState;
  createdAccount: any;
  uiLog: string;
}

export class CreateSubMerchant extends sComponent<{}, SMState> {
  /* Tell the EventHandler which keys NOT to announce to every component */
  __doNotSubscribe = [
    "id", "idExists", "tosAccepted",
    "individual", "useBusiness", "business", "funding",
    "createdAccount", "uiLog"
  ];

  /* --------------------------------------------------------------------- */
  state: SMState = {
    /* shared */
    currentSubMerchantId: "",

    /* local-only defaults (not broadcast) */
    id: "",
    idExists: null,
    tosAccepted: false,
    individual: {
      firstName: "", lastName: "", email: "", phone: "",
      dateOfBirth: "", ssn: "",
      address: { streetAddress: "", locality: "", region: "", postalCode: "" }
    },
    useBusiness: false,
    business: {
      legalName: "", dbaName: "", taxId: "",
      address: { streetAddress: "", locality: "", region: "", postalCode: "" }
    },
    funding: {
      descriptor: "", destination: "bank",
      email: "", mobilePhone: "", accountNumber: "", routingNumber: ""
    },
    createdAccount: null,
    uiLog: ""
  };

  /* --------------------------------------------------------------------- */
  /** Generic field handler – supports nested names like "funding.email" */
  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.currentTarget as any;
    const val = type === "checkbox" ? checked : value;
    this.setState(prev => {
      const next: any = structuredClone(prev);
      let ref = next as any;
      const parts = name.split(".");
      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
      ref[parts.at(-1)!] = val;
      return next;
    });
  };

  /* --------------------------------------------------------------------- */
  checkId = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { id } = this.state;
    if (!id.trim()) {
      this.setState({ uiLog: "Enter an ID first", idExists: null });
      return;
    }
    try {
      const r = await fetch(
        `${protocol}://localhost:3000/get-submerchant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchantAccountId: id.trim() })
        }
      );
      this.setState({
        idExists: r.ok,
        uiLog: r.ok ? `ID "${id}" already exists.` : `ID "${id}" is available.`
      });
    } catch (err: any) {
      this.setState({ idExists: false, uiLog: `Lookup error: ${err.message}` });
    }
  };

  /* --------------------------------------------------------------------- */
  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const { id, tosAccepted, individual, useBusiness, business, funding } =
      this.state;

    const payload: any = { individual, funding, tosAccepted };
    if (id.trim()) payload.id = id.trim();
    if (useBusiness) payload.business = business;

    /* optimistic UI */
    this.setState({ uiLog: "Creating sub-merchant…" });
    try {
      const res = await fetch(
        `${protocol}://localhost:3000/create-submerchant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const data = await res.json();
      if (res.ok && data.success && data.subMerchantAccount) {
        /* success – publish the new ID globally, keep everything else local */
        const newId = data.subMerchantAccount.id;
        this.setState({
          currentSubMerchantId: newId,
          createdAccount: data.subMerchantAccount,
          uiLog: "Sub-merchant created!"
        });
      } else {
        this.setState({ uiLog: `Error: ${data.error || "Unknown error"}` });
      }
    } catch (err: any) {
      this.setState({ uiLog: `Network error: ${err.message}` });
    }
  };

  render() {
    const {
      id,
      idExists,
      tosAccepted,
      individual,
      useBusiness,
      business,
      funding,
      createdAccount,
      uiLog
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit} style={{ margin: 20 }}>
        <h2>Create Sub-Merchant</h2>

        {/* ID + Check */}
        <div>
          <label>
            Custom ID:
            <input
              name="id"
              type="text"
              required
              value={id}
              onChange={this.handleInputChange}
              placeholder="blue_ladders_store"
              style={{ marginLeft: 8 }}
            />
          </label>
          <button onClick={this.checkId} style={{ marginLeft: 8 }}>
            Check ID
          </button>
          {idExists === true && <span style={{ color: "orange", marginLeft: 8 }}>⚠️ Exists</span>}
          {idExists === false && <span style={{ color: "green", marginLeft: 8 }}>✔️ Available</span>}
        </div>

        <hr />

        {/* Individual */}
        <h3>Individual</h3>
        <div>
          <input
            name="individual.firstName"
            required
            placeholder="First Name"
            value={individual.firstName}
            onChange={this.handleInputChange}
          />
          <input
            name="individual.lastName"
            required
            placeholder="Last Name"
            value={individual.lastName}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <input
            name="individual.email"
            type="email"
            required
            placeholder="Email"
            value={individual.email}
            onChange={this.handleInputChange}
          />
          <input
            name="individual.phone"
            required
            placeholder="Phone"
            value={individual.phone}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <input
            name="individual.dateOfBirth"
            type="date"
            required
            value={individual.dateOfBirth}
            onChange={this.handleInputChange}
          />
          <input
            name="individual.ssn"
            required
            maxLength={4}
            placeholder="SSN (last4)"
            value={individual.ssn}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <input
            name="individual.address.streetAddress"
            required
            placeholder="Street Address"
            value={individual.address.streetAddress}
            onChange={this.handleInputChange}
            style={{ width: 300 }}
          />
        </div>
        <div>
          <input
            name="individual.address.locality"
            required
            placeholder="City"
            value={individual.address.locality}
            onChange={this.handleInputChange}
          />
          <input
            name="individual.address.region"
            required
            placeholder="Region"
            value={individual.address.region}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8, width: 60 }}
          />
          <input
            name="individual.address.postalCode"
            required
            placeholder="Postal Code"
            value={individual.address.postalCode}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8, width: 100 }}
          />
        </div>

        <hr />

        {/* Business toggle */}
        <label>
          <input
            name="useBusiness"
            type="checkbox"
            checked={useBusiness}
            onChange={this.handleInputChange}
          />{" "}
          Add Business Details
        </label>

        {useBusiness && (
          <>
            <h3>Business</h3>
            <div>
              <input
                name="business.legalName"
                required
                placeholder="Legal Name"
                value={business.legalName}
                onChange={this.handleInputChange}
              />
              <input
                name="business.dbaName"
                required
                placeholder="DBA Name"
                value={business.dbaName}
                onChange={this.handleInputChange}
                style={{ marginLeft: 8 }}
              />
            </div>
            <div>
              <input
                name="business.taxId"
                required
                placeholder="Tax ID"
                value={business.taxId}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <input
                name="business.address.streetAddress"
                required
                placeholder="Street Address"
                value={business.address.streetAddress}
                onChange={this.handleInputChange}
                style={{ width: 300 }}
              />
            </div>
            <div>
              <input
                name="business.address.locality"
                required
                placeholder="City"
                value={business.address.locality}
                onChange={this.handleInputChange}
              />
              <input
                name="business.address.region"
                required
                placeholder="Region"
                value={business.address.region}
                onChange={this.handleInputChange}
                style={{ marginLeft: 8, width: 60 }}
              />
              <input
                name="business.address.postalCode"
                required
                placeholder="Postal Code"
                value={business.address.postalCode}
                onChange={this.handleInputChange}
                style={{ marginLeft: 8, width: 100 }}
              />
            </div>
          </>
        )}

        <hr />

        {/* Funding */}
        <h3>Funding</h3>
        <div>
          <input
            name="funding.descriptor"
            required
            placeholder="Descriptor"
            value={funding.descriptor}
            onChange={this.handleInputChange}
          />
          <select
            name="funding.destination"
            required
            value={funding.destination}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}
          >
            <option value="bank">Bank</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        <div>
          <input
            name="funding.email"
            required
            placeholder="Funding Email"
            value={funding.email}
            onChange={this.handleInputChange}
          />
          <input
            name="funding.mobilePhone"
            required
            placeholder="Mobile Phone"
            value={funding.mobilePhone}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <input
            name="funding.accountNumber"
            required
            placeholder="Account Number"
            value={funding.accountNumber}
            onChange={this.handleInputChange}
          />
          <input
            name="funding.routingNumber"
            required
            placeholder="Routing Number"
            value={funding.routingNumber}
            onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}
          />
        </div>

        <hr />

        {/* TOS */}
        <div>
          <label>
            <input
              name="tosAccepted"
              type="checkbox"
              required
              checked={tosAccepted}
              onChange={this.handleInputChange}
            />{" "}
            I accept the <a href="#">Terms of Service</a>
          </label>
        </div>

        <button type="submit" style={{ marginTop: 12 }}>
          Create Sub-Merchant
        </button>

        {uiLog && <div style={{ marginTop: 12, color: "red" }}>{uiLog}</div>}

        {createdAccount && (
          <pre
            style={{
              background: "#f0f0f0",
              padding: 10,
              borderRadius: 4,
              marginTop: 12,
              maxHeight: 200,
              overflow: "auto",
              whiteSpace: "pre-wrap"
            }}
          >
            {JSON.stringify(createdAccount, null, 2)}
          </pre>
        )}
      </form>
    );
  }
}
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
      const r = await fetch(`${protocol}://localhost:3000/split-transaction`, {
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


type TransactionStatus = "Authorized" | "SubmittedForSettlement" | "Settled" | /* …etc*/ string;

interface DLState {
  transactions: any[];
  customers: any[];
  submerchants: any[];
  log: string;

  // filter fields
  txStartDate: string;
  txEndDate: string;
  txStatus: TransactionStatus;
  custEmail: string;
}

export class DataListings extends sComponent<{}, DLState> {
  state: DLState = {
    transactions: [],
    customers: [],
    submerchants: [],
    log: "",

    txStartDate: "",
    txEndDate: "",
    txStatus: "",
    custEmail: ""
  };

  private buildQuery(params: Record<string, string>) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    const str = qs.toString();
    return str ? `?${str}` : "";
  }

  handleFetchTransactions = async () => {
    const q = this.buildQuery({
      startDate: this.state.txStartDate,
      endDate: this.state.txEndDate,
      status: this.state.txStatus
    });
    try {
      const res = await fetch(`${protocol}://localhost:3000/transactions${q}`);
      const data = await res.json();
      if (data.transactions) {
        this.setState({ transactions: data.transactions, log: "Transactions fetched successfully" });
      } else {
        this.setState({ log: "Error fetching transactions" });
      }
    } catch (err: any) {
      this.setState({ log: "Error fetching transactions: " + err.message });
    }
  };

  handleFetchCustomers = async () => {
    const q = this.buildQuery({ email: this.state.custEmail });
    try {
      const res = await fetch(`${protocol}://localhost:3000/customers${q}`);
      const data = await res.json();
      if (data.customers) {
        this.setState({ customers: data.customers, log: "Customers fetched successfully" });
      } else {
        this.setState({ log: "Error fetching customers" });
      }
    } catch (err: any) {
      this.setState({ log: "Error fetching customers: " + err.message });
    }
  };

  handleFetchSubmerchants = async () => {
    try {
      const res = await fetch(`${protocol}://localhost:3000/submerchants`);
      const data = await res.json();
      if (data.submerchants) {
        this.setState({ submerchants: data.submerchants, log: "Submerchants fetched successfully" });
      } else {
        this.setState({ log: "Error fetching submerchants" });
      }
    } catch (err: any) {
      this.setState({ log: "Error fetching submerchants: " + err.message });
    }
  };

  render() {
    const {
      transactions, customers, submerchants, log,
      txStartDate, txEndDate, txStatus, custEmail
    } = this.state;

    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Data Listings</h2>

        {/* ───── Filters ───── */}
        <div style={{ marginBottom: "1em" }}>
          <fieldset style={{ display: "inline-block", marginRight: "1em" }}>
            <legend>Transaction Filters</legend>
            <label>
              Start date:{" "}
              <input
                type="date"
                value={txStartDate}
                onChange={(e) => this.setState({ txStartDate: e.target.value })}
              />
            </label>
            <br />
            <label>
              End date:{" "}
              <input
                type="date"
                value={txEndDate}
                onChange={(e) => this.setState({ txEndDate: e.target.value })}
              />
            </label>
            <br />
            <label>
              Status:{" "}
              <input
                placeholder="Settled, Authorized…"
                value={txStatus}
                onChange={(e) => this.setState({ txStatus: e.target.value })}
              />
            </label>
            <br />
            <button onClick={this.handleFetchTransactions}>Refresh Transactions</button>
          </fieldset>

          <fieldset style={{ display: "inline-block", marginRight: "1em" }}>
            <legend>Customer Filters</legend>
            <label>
              Email contains:{" "}
              <input
                type="email"
                placeholder="alice@example.com"
                value={custEmail}
                onChange={(e) => this.setState({ custEmail: e.target.value })}
              />
            </label>
            <br />
            <button onClick={this.handleFetchCustomers}>Refresh Customers</button>
          </fieldset>

          <fieldset style={{ display: "inline-block" }}>
            <legend>Sub-merchants</legend>
            <button onClick={this.handleFetchSubmerchants}>Refresh Submerchants</button>
          </fieldset>
        </div>

        {/* ───── Transactions Table ───── */}
        <h3>Transactions</h3>
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length
              ? transactions.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.id}</td>
                  <td>{tx.status}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ""}</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={4}>No transactions found</td>
                </tr>
              )}
          </tbody>
        </table>

        {/* ───── Customers Table ───── */}
        <h3>Customers</h3>
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.length
              ? customers.map((c, i) => (
                <tr key={i}>
                  <td>{c.id}</td>
                  <td>{c.email}</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={2}>No customers found</td>
                </tr>
              )}
          </tbody>
        </table>

        {/* ───── Sub-merchants Table ───── */}
        <h3>Submerchants</h3>
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submerchants.length
              ? submerchants.map((sub, i) => (
                <tr key={i}>
                  <td>{sub.id || sub.merchantAccount?.id}</td>
                  <td>{sub.status || sub.merchantAccount?.status || "N/A"}</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={2}>No submerchants found</td>
                </tr>
              )}
          </tbody>
        </table>

        <div style={{ marginTop: "1em", fontStyle: "italic" }}>{log}</div>
      </div>
    );
  }
}



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
      const res = await fetch(`${protocol}://localhost:3000/master-merchant`);
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
        `${protocol}://localhost:3000/get-submerchant`,
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