import React from "react";
import dropin from "braintree-web-drop-in";
import { sComponent, state } from "./components/util/state.component";

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
        <CreateCustomer />
        <hr />
        <RegularCheckout />
        <hr />
        <CreateSubMerchant />
        <hr />
        <TransactionWithSplit />
        <hr />
        <DataListings />
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
      if(!this.state.clientToken) {
        console.log("CreateCustomer Component getting client token")
        const res = await fetch(`${protocol}://localhost:3000/client-token`);
        const tokenData = await res.json();
        await this.setState({ clientToken:tokenData.clientToken });
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

// -------------------------------------------------------------------
// 3. Create Sub-Merchant Component (as an sComponent)
// -------------------------------------------------------------------
export class CreateSubMerchant extends sComponent {
  state = {
    subMerchantEmail: "",
    subMerchantId: "",
    log: "",
  };

  constructor(props: any) {
    super(props);
  }

  handleCreateSubMerchant = async () => {
    if (!this.state.subMerchantEmail) {
      this.setState({ log: "Please enter an email for the sub-merchant." });
      return;
    }

    try {
      const response = await fetch(protocol + "://localhost:3000/create-submerchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          individual: {
            firstName: "Sub", // Example static value; adjust as needed.
            lastName: "Merchant",
            email: this.state.subMerchantEmail,
            phone: "3125551234",
            dateOfBirth: "10/9/1980",
            address: {
              streetAddress: "123 Credibility St.",
              postalCode: "60606",
              locality: "Chicago",
              region: "IL",
            },
          },
          funding: {
            destination: "bank",
            routingNumber: "071000013",
            accountNumber: "1123581321",
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        this.setState({
          subMerchantId: data.subMerchantAccountId,
          log: `Sub-merchant created successfully! ID: ${data.subMerchantAccountId}`,
        });
      } else {
        this.setState({ log: `Error creating sub-merchant: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error creating sub-merchant:", err);
      this.setState({ log: `Error creating sub-merchant: ${err.message}` });
    }
  };

  render() {
    return (
      <div style={{ margin: "10px 0" }}>
        <h2>Create Sub-Merchant</h2>
        <p>
          This simulates creating a new connected/partner merchant who can receive a
          portion of a transaction split.
        </p>
        <label>Sub-Merchant Email:</label>
        <input
          type="text"
          value={this.state.subMerchantEmail}
          onChange={(e) => this.setState({ subMerchantEmail: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <button onClick={this.handleCreateSubMerchant}>Create Sub-Merchant</button>
        <div style={{ margin: "5px 0" }}>
          Current Sub-Merchant ID: <strong>{this.state.subMerchantId || "None"}</strong>
        </div>
        <div>{this.state.log}</div>
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

  private buildQuery(params: Record<string,string>) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => {
      if (v) qs.set(k, v);
    });
    const str = qs.toString();
    return str ? `?${str}` : "";
  }

  handleFetchTransactions = async () => {
    const q = this.buildQuery({
      startDate: this.state.txStartDate,
      endDate:   this.state.txEndDate,
      status:    this.state.txStatus
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