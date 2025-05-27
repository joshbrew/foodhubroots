import React, { Component } from "react";
import dropin from "braintree-web-drop-in";
import { sComponent, state } from "./components/util/state.component";
import { MerchantAccountResponse } from "../scripts/braintree_datastructures";

const protocol = "https";

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

// -------------------------------------------------------------------
// 1. Create Customer Component (as an sComponent)
// -------------------------------------------------------------------

export class CreateCustomer extends sComponent<{}, {
  firstName: string;
  lastName: string;
  email: string;
  clientToken: string | null;
  dropInInstance: any;
  createdCustomerId: string;
  log: string;
}> {

  state = {
    firstName: "",
    lastName: "",
    email: "",
    clientToken: null as any,
    dropInInstance: null as any,
    createdCustomerId: "",
    log: "",
  };

  async componentDidMount() {
    try {
      // 1) fetch the token
      if (!this.state.clientToken) {
        console.log("CreateCustomer Component getting client token")
        const res = await fetch(`${protocol}://localhost:3000/client-token`);
        const tokenData = await res.json();
        await this.setState({ clientToken: tokenData.clientToken });
        this.initializeDropIn();
      }
    } catch (err: any) {
      console.error("Failed to fetch client token:", err);
      this.setState({ log: "Could not get client token." });
    }
  }


  initializeDropIn() {
    const { clientToken } = this.state;
    if (!clientToken) {
      console.log(clientToken, "No clientToken!");
      return;
    }

    dropin.create(
      {
        authorization: clientToken,
        container: "#dropin-container",
      },
      (createErr, instance) => {
        if (createErr) {
          console.error("Drop-in create error:", createErr);
          return;
        }
        this.setState({ dropInInstance: instance });
      }
    );
  }

  handleCreateCustomer = async () => {
    const { dropInInstance, firstName, lastName, email } = this.state;
    if (!dropInInstance) {
      this.setState({ log: "Drop-in not ready." });
      return;
    }

    try {
      const { nonce } = await dropInInstance.requestPaymentMethod();
      const response = await fetch(`${protocol}://localhost:3000/create-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, paymentMethodNonce: nonce }),
      });
      const data = await response.json();
      if (data.success) {
        this.setState({
          createdCustomerId: data.customerId,
          log: `Customer created: ${data.customerId}`,
        });
      } else {
        this.setState({ log: `Error: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error creating customer:", err);
      this.setState({ log: err.message });
    }
  };

  render() {
    const { firstName, lastName, email, createdCustomerId, log } = this.state;
    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Create Customer</h2>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={e => this.setState({ firstName: e.target.value })}
            style={{ marginRight: "10px" }}
          />
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={e => this.setState({ lastName: e.target.value })}
            style={{ marginRight: "10px" }}
          />
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            style={{ marginRight: "10px" }}
          />
        </div>

        {/* this is where drop-in will attach itself */}
        <div id="dropin-container" style={{ margin: "10px 0" }} />

        <button onClick={this.handleCreateCustomer}>Create Customer</button>

        <div style={{ margin: "5px 0" }}>
          Customer ID: <strong>{createdCustomerId || "None"}</strong>
        </div>
        <div>{log}</div>
      </div>
    );
  }
}

// -------------------------------------------------------------------
// 2. Regular Checkout Component (as an sComponent)
// -------------------------------------------------------------------
export class RegularCheckout extends sComponent {
  state = {
    createdCustomerId: "",
    amount: "10.00",
    log: "",
  };

  constructor(props: any) {
    super(props);
  }

  handleCheckout = async () => {
    if (!this.state.createdCustomerId) {
      this.setState({ log: "No customer has been created yet." });
      return;
    }

    try {
      const response = await fetch(protocol + "://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: this.state.createdCustomerId,
          amount: this.state.amount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        this.setState({ log: `Checkout successful! Transaction ID: ${data.transactionId}` });
      } else {
        this.setState({ log: `Error in checkout: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error in checkout:", err);
      this.setState({ log: `Error in checkout: ${err.message}` });
    }
  };

  render() {
    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Regular Checkout</h2>
        <p>
          Created Customer ID:{" "}
          <strong>{this.state.createdCustomerId || "Not yet created"}</strong>
        </p>
        <label>Amount:</label>
        <input
          type="text"
          value={this.state.amount}
          onChange={(e) => this.setState({ amount: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <button onClick={this.handleCheckout}>Checkout</button>
        <div>{this.state.log}</div>
      </div>
    );
  }
}



interface AddressState {
  streetAddress: string;
  locality:      string;
  region:        string;
  postalCode:    string;
}

interface IndividualState {
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  dateOfBirth: string;  // YYYY-MM-DD
  ssn:         string;  // last4 or full
  address:     AddressState;
}

interface BusinessState {
  legalName: string;
  dbaName:   string;
  taxId:     string;
  address:   AddressState;
}

interface FundingState {
  descriptor:    string;
  destination:   "bank" | "mobile";
  email:         string;
  mobilePhone:   string;
  accountNumber: string;
  routingNumber: string;
}

interface State {
  id:                  string;
  idExists:            boolean | null;
  tosAccepted:         boolean;
  individual:          IndividualState;
  useBusiness:         boolean;
  business:            BusinessState;
  funding:             FundingState;
  createdAccount:      any;
  log:                 string;
}

export class CreateSubMerchant extends Component<{}, State> {
  state: State = {
    id: "",
    idExists: null,
    tosAccepted: false,
    individual: {
      firstName:   "",
      lastName:    "",
      email:       "",
      phone:       "",
      dateOfBirth: "",
      ssn:         "",
      address: {
        streetAddress: "",
        locality:      "",
        region:        "",
        postalCode:    ""
      }
    },
    useBusiness: false,
    business: {
      legalName: "",
      dbaName:   "",
      taxId:     "",
      address: {
        streetAddress: "",
        locality:      "",
        region:        "",
        postalCode:    ""
      }
    },
    funding: {
      descriptor:    "",
      destination:   "bank",
      email:         "",
      mobilePhone:   "",
      accountNumber: "",
      routingNumber: ""
    },
    createdAccount: null,
    log: ""
  };

  private handleChange(path: string, value: any) {
    this.setState((prev) => {
      const next: any = { ...prev };
      let cur = next as any;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  private checkId = async () => {
    const { id } = this.state;
    if (!id.trim()) {
      this.setState({ idExists: null, log: "Please enter an ID first." });
      return;
    }
    try {
      const res = await fetch(`${protocol}://localhost:3000/get-submerchant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantAccountId: id.trim() })
      });
      if (res.ok) {
        await res.json(); // we just need to know it exists
        this.setState({ idExists: true, log: `ID "${id}" already exists.` });
      } else {
        this.setState({ idExists: false, log: `ID "${id}" is available.` });
      }
    } catch (err: any) {
      this.setState({ idExists: false, log: `Lookup error: ${err.message}` });
    }
  };

  private handleSubmit = async () => {
    const { id, individual, business, useBusiness, funding, tosAccepted } = this.state;
    if (!tosAccepted) {
      this.setState({ log: "You must accept the terms." });
      return;
    }
    this.setState({ log: "Creating sub-merchant..." });

    const body: any = {
      individual,
      funding,
      tosAccepted
    };
    if (id.trim()) body.id = id.trim();
    if (useBusiness) body.business = business;

    try {
      const res = await fetch(`${protocol}://localhost:3000/create-submerchant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success && data.subMerchantAccount) {
        this.setState({
          createdAccount: data.subMerchantAccount,
          log: "Sub-merchant created!"
        });
      } else {
        this.setState({ log: `Error: ${data.error}` });
      }
    } catch (err: any) {
      this.setState({ log: `Fetch error: ${err.message}` });
    }
  };

  render() {
    const {
      id, idExists, tosAccepted,
      individual, useBusiness, business,
      funding, createdAccount, log
    } = this.state;

    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Create Sub-Merchant</h2>

        {/* ── Override ID & Check ── */}
        <div>
          <label>
            Override ID:{" "}
            <input
              required
              type="text"
              value={id}
              onChange={e => this.handleChange("id", e.target.value)}
              placeholder="blue_ladders_store"
              style={{ width: 300 }}
            />
          </label>
          <button onClick={this.checkId} style={{ marginLeft: 8 }}>
            Check ID
          </button>
          {idExists === true && <span style={{ color: "green", marginLeft: 8 }}>✔️ Exists</span>}
          {idExists === false && <span style={{ color: "orange", marginLeft: 8 }}>⚠️ Available</span>}
        </div>
        <hr />

        {/* ── Individual ── */}
        <h3>Individual Details</h3>
        <div>
          <input
            required placeholder="First Name"
            value={individual.firstName}
            onChange={e => this.handleChange("individual.firstName", e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            required placeholder="Last Name"
            value={individual.lastName}
            onChange={e => this.handleChange("individual.lastName", e.target.value)}
          />
        </div>
        <div>
          <input
            required type="email" placeholder="Email"
            value={individual.email}
            onChange={e => this.handleChange("individual.email", e.target.value)}
            style={{ marginRight: 8, width: 250 }}
          />
          <input
            required placeholder="Phone"
            value={individual.phone}
            onChange={e => this.handleChange("individual.phone", e.target.value)}
          />
        </div>
        <div>
          <input
            required type="date"
            value={individual.dateOfBirth}
            onChange={e => this.handleChange("individual.dateOfBirth", e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            required maxLength={4} placeholder="SSN (last4)"
            value={individual.ssn}
            onChange={e => this.handleChange("individual.ssn", e.target.value)}
          />
        </div>
        <div>
          <input
            required placeholder="Street Address"
            value={individual.address.streetAddress}
            onChange={e => this.handleChange("individual.address.streetAddress", e.target.value)}
            style={{ width: 400, marginTop: 4 }}
          />
        </div>
        <div>
          <input
            required placeholder="City"
            value={individual.address.locality}
            onChange={e => this.handleChange("individual.address.locality", e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            required placeholder="Region"
            value={individual.address.region}
            onChange={e => this.handleChange("individual.address.region", e.target.value)}
            style={{ marginRight: 8, width: 60 }}
          />
          <input
            required placeholder="Postal Code"
            value={individual.address.postalCode}
            onChange={e => this.handleChange("individual.address.postalCode", e.target.value)}
            style={{ width: 100 }}
          />
        </div>

        {/* ── Business toggle ── */}
        <hr />
        <label>
          <input
            type="checkbox" checked={useBusiness}
            onChange={e => this.handleChange("useBusiness", e.target.checked)}
          />{" "}
          Add Business Details
        </label>
        {useBusiness && (
          <>
            <h3>Business Details</h3>
            <div>
              <input
                required placeholder="Legal Name"
                value={business.legalName}
                onChange={e => this.handleChange("business.legalName", e.target.value)}
                style={{ marginRight: 8, width: 250 }}
              />
              <input
                required placeholder="DBA Name"
                value={business.dbaName}
                onChange={e => this.handleChange("business.dbaName", e.target.value)}
              />
            </div>
            <div>
              <input
                required placeholder="Tax ID"
                value={business.taxId}
                onChange={e => this.handleChange("business.taxId", e.target.value)}
              />
            </div>
            <div>
              <input
                required placeholder="Street Address"
                value={business.address.streetAddress}
                onChange={e => this.handleChange("business.address.streetAddress", e.target.value)}
                style={{ width: 400, marginTop: 4 }}
              />
            </div>
            <div>
              <input
                required placeholder="City"
                value={business.address.locality}
                onChange={e => this.handleChange("business.address.locality", e.target.value)}
                style={{ marginRight: 8 }}
              />
              <input
                required placeholder="Region"
                value={business.address.region}
                onChange={e => this.handleChange("business.address.region", e.target.value)}
                style={{ marginRight: 8, width: 60 }}
              />
              <input
                required placeholder="Postal Code"
                value={business.address.postalCode}
                onChange={e => this.handleChange("business.address.postalCode", e.target.value)}
                style={{ width: 100 }}
              />
            </div>
          </>
        )}

        {/* ── Funding ── */}
        <hr />
        <h3>Funding Details</h3>
        <div>
          <input
            required placeholder="Descriptor"
            value={funding.descriptor}
            onChange={e => this.handleChange("funding.descriptor", e.target.value)}
            style={{ marginRight: 8 }}
          />
          <select
            required value={funding.destination}
            onChange={e => this.handleChange("funding.destination", e.target.value)}
          >
            <option value="bank">Bank</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        <div>
          <input
            required placeholder="Funding Email"
            value={funding.email}
            onChange={e => this.handleChange("funding.email", e.target.value)}
            style={{ marginRight: 8, width: 250 }}
          />
          <input
            required placeholder="Mobile Phone"
            value={funding.mobilePhone}
            onChange={e => this.handleChange("funding.mobilePhone", e.target.value)}
          />
        </div>
        <div>
          <input
            required placeholder="Account Number"
            value={funding.accountNumber}
            onChange={e => this.handleChange("funding.accountNumber", e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            required placeholder="Routing Number"
            value={funding.routingNumber}
            onChange={e => this.handleChange("funding.routingNumber", e.target.value)}
          />
        </div>

        {/* ── TOS & Submit ── */}
        <hr />
        <label>
          <input
            required type="checkbox" checked={tosAccepted}
            onChange={e => this.handleChange("tosAccepted", e.target.checked)}
          />{" "}
          I accept the <a href="#">Terms of Service</a>
        </label>
        <div style={{ marginTop: 10 }}>
          <button onClick={this.handleSubmit}>Create Sub-Merchant</button>
        </div>

        {log && <div style={{ marginTop: 8, color: "red" }}>{log}</div>}

        {createdAccount && (
          <pre
            style={{
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "10px",
              maxHeight: "300px",
              overflow: "auto",
              whiteSpace: "pre-wrap"
            }}
          >
            {JSON.stringify(createdAccount, null, 2)}
          </pre>
        )}
      </div>
    );
  }
}
// -------------------------------------------------------------------
// 4. Transaction with Split Component (as an sComponent)
// -------------------------------------------------------------------
export class TransactionWithSplit extends sComponent {
  state = {
    subMerchantId: "",
    createdCustomerId: "",
    splitAmount: "50.00",
    log: "",
  };

  constructor(props: any) {
    super(props);
  }

  handleTransactionWithSplit = async () => {
    if (!this.state.subMerchantId) {
      this.setState({ log: "No sub-merchant has been created yet." });
      return;
    }
    if (!this.state.createdCustomerId) {
      this.setState({ log: "No customer has been created yet." });
      return;
    }

    try {
      const response = await fetch(protocol + "://localhost:3000/split-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subMerchantAccountId: this.state.subMerchantId,
          customerId: this.state.createdCustomerId,
          amount: this.state.splitAmount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        this.setState({ log: `Transaction with split successful! Transaction ID: ${data.transactionId}` });
      } else {
        this.setState({ log: `Error in split transaction: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error in split transaction:", err);
      this.setState({ log: `Error in split transaction: ${err.message}` });
    }
  };

  render() {
    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Transaction with 98/2 Split</h2>
        <p>
          This simulates charging the existing customer while sending 98% to the
          sub-merchant and 2% to your master account.
        </p>
        <p>
          Sub-Merchant ID: <strong>{this.state.subMerchantId || "Not yet created"}</strong>
        </p>
        <label>Split Transaction Amount:</label>
        <input
          type="text"
          value={this.state.splitAmount}
          onChange={(e) => this.setState({ splitAmount: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <button onClick={this.handleTransactionWithSplit}>Pay Sub-Merchant (98%)</button>
        <div>{this.state.log}</div>
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