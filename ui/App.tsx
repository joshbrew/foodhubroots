import React, { useState } from "react";
import dropin from "braintree-web-drop-in";
import { sComponent } from "./components/util/state.component";

// https://developer.paypal.com/braintree/docs/start/overview/
// https://developer.paypal.com/braintree/docs/start/drop-in

const protocol = "https";

// -------------------------------------------------------------------
// Main App Component: Fetches client token and initializes Drop-In UI
// -------------------------------------------------------------------
export class App extends sComponent {
  state = {
    // Braintree Drop-In state
    clientToken: null as string | null,
    dropInInstance: null as any,
  };

  async componentDidMount() {
    try {
      // Fetch a client token from your server
      const tokenRes = await fetch(protocol + "://localhost:3000/client-token");
      const tokenData = await tokenRes.json();
      // Store the client token and initialize the Drop-In UI
      this.setState({ clientToken: tokenData.clientToken });
      
      this.initializeDropIn();
    
    } catch (err: any) {
      console.error("Failed to fetch client token:", err);
    }
  }

  initializeDropIn() {
    const { clientToken } = this.state;
    if (!clientToken) return;

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

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <h1>Braintree Sandbox Test</h1>
        {/* Pass the dropInInstance prop to CreateCustomer */}
        <CreateCustomer dropInInstance={this.state.dropInInstance} />
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
// 1. Create Customer Component (with its own handler)
// -------------------------------------------------------------------
interface CreateCustomerProps {
  dropInInstance: any;
}

const CreateCustomer: React.FC<CreateCustomerProps> = ({ dropInInstance }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [createdCustomerId, setCreatedCustomerId] = useState("");
  const [log, setLog] = useState("");

  const handleCreateCustomer = async () => {
    if (!dropInInstance) {
      setLog("Drop-in not ready yet.");
      return;
    }

    try {
      // Request the payment nonce from the Drop-In UI
      const { nonce } = await dropInInstance.requestPaymentMethod();

      // Call the /create-customer endpoint with customer details and the nonce
      const response = await fetch(protocol + "://localhost:3000/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          paymentMethodNonce: nonce,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCreatedCustomerId(data.customerId);
        setLog(`Customer created successfully! ID: ${data.customerId}`);
      } else {
        setLog(`Error creating customer: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error creating customer:", err);
      setLog(`Error creating customer: ${err.message}`);
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <h2>Create Customer</h2>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px" }}
        />
      </div>
      {/* Braintree Drop-In UI container */}
      <div id="dropin-container" style={{ margin: "10px 0" }}></div>
      <button onClick={handleCreateCustomer}>Create Customer</button>
      <div style={{ margin: "5px 0" }}>
        Current Customer ID: <strong>{createdCustomerId || "None"}</strong>
      </div>
      <div>{log}</div>
    </div>
  );
};

// -------------------------------------------------------------------
// 2. Regular Checkout Component (with its own handler)
// -------------------------------------------------------------------
const RegularCheckout: React.FC = () => {
  const [createdCustomerId, setCreatedCustomerId] = useState("");
  const [amount, setAmount] = useState("10.00");
  const [log, setLog] = useState("");

  const handleCheckout = async () => {
    if (!createdCustomerId) {
      setLog("No customer has been created yet.");
      return;
    }

    try {
      const response = await fetch(protocol + "://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: createdCustomerId, amount }),
      });

      const data = await response.json();
      if (data.success) {
        setLog(`Checkout successful! Transaction ID: ${data.transactionId}`);
      } else {
        setLog(`Error in checkout: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error in checkout:", err);
      setLog(`Error in checkout: ${err.message}`);
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <h2>Regular Checkout</h2>
      <p>
        Created Customer ID:{" "}
        <strong>{createdCustomerId || "Not yet created"}</strong>
      </p>
      <label>Amount:</label>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleCheckout}>Checkout</button>
      <div>{log}</div>
    </div>
  );
};

// -------------------------------------------------------------------
// 3. Create Sub-Merchant Component (with its own handler)
// -------------------------------------------------------------------
const CreateSubMerchant: React.FC = () => {
  const [subMerchantEmail, setSubMerchantEmail] = useState("");
  const [subMerchantId, setSubMerchantId] = useState("");
  const [log, setLog] = useState("");

  const handleCreateSubMerchant = async () => {
    if (!subMerchantEmail) {
      setLog("Please enter an email for the sub-merchant.");
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
            email: subMerchantEmail,
            phone: "3125551234",
            dateOfBirth: "10/9/1980",
            ssn: "1234",
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
        setSubMerchantId(data.subMerchantAccountId);
        setLog(`Sub-merchant created successfully! ID: ${data.subMerchantAccountId}`);
      } else {
        setLog(`Error creating sub-merchant: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error creating sub-merchant:", err);
      setLog(`Error creating sub-merchant: ${err.message}`);
    }
  };

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
        value={subMerchantEmail}
        onChange={(e) => setSubMerchantEmail(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleCreateSubMerchant}>Create Sub-Merchant</button>
      <div style={{ margin: "5px 0" }}>
        Current Sub-Merchant ID: <strong>{subMerchantId || "None"}</strong>
      </div>
      <div>{log}</div>
    </div>
  );
};

// -------------------------------------------------------------------
// 4. Transaction with Split Component (with its own handler)
// -------------------------------------------------------------------
const TransactionWithSplit: React.FC = () => {
  const [subMerchantId, setSubMerchantId] = useState("");
  const [createdCustomerId, setCreatedCustomerId] = useState("");
  const [splitAmount, setSplitAmount] = useState("50.00");
  const [log, setLog] = useState("");

  const handleTransactionWithSplit = async () => {
    if (!subMerchantId) {
      setLog("No sub-merchant has been created yet.");
      return;
    }
    if (!createdCustomerId) {
      setLog("No customer has been created yet.");
      return;
    }

    try {
      const response = await fetch(protocol + "://localhost:3000/split-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subMerchantAccountId: subMerchantId,
          customerId: createdCustomerId,
          amount: splitAmount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLog(`Transaction with split successful! Transaction ID: ${data.transactionId}`);
      } else {
        setLog(`Error in split transaction: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error in split transaction:", err);
      setLog(`Error in split transaction: ${err.message}`);
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <h2>Transaction with 98/2 Split</h2>
      <p>
        This simulates charging the existing customer while sending 98% to the
        sub-merchant and 2% to your master account.
      </p>
      <p>
        Sub-Merchant ID: <strong>{subMerchantId || "Not yet created"}</strong>
      </p>
      <label>Split Transaction Amount:</label>
      <input
        type="text"
        value={splitAmount}
        onChange={(e) => setSplitAmount(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleTransactionWithSplit}>Pay Sub-Merchant (98%)</button>
      <div>{log}</div>
    </div>
  );
};

// -------------------------------------------------------------------
// 5. Data Listings Component (with its own refresh handlers)
// -------------------------------------------------------------------
const DataListings: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [submerchants, setSubmerchants] = useState<any[]>([]);
  const [log, setLog] = useState("");

  const handleFetchTransactions = async () => {
    try {
      const response = await fetch(protocol + "://localhost:3000/transactions");
      const data = await response.json();
      if (data.transactions) {
        setTransactions(data.transactions);
        setLog("Transactions fetched successfully");
      } else {
        setLog("Error fetching transactions");
      }
    } catch (err: any) {
      setLog("Error fetching transactions: " + err.message);
    }
  };

  const handleFetchCustomers = async () => {
    try {
      const response = await fetch(protocol + "://localhost:3000/customers");
      const data = await response.json();
      if (data.customers) {
        setCustomers(data.customers);
        setLog("Customers fetched successfully");
      } else {
        setLog("Error fetching customers");
      }
    } catch (err: any) {
      setLog("Error fetching customers: " + err.message);
    }
  };

  const handleFetchSubmerchants = async () => {
    try {
      const response = await fetch(protocol + "://localhost:3000/submerchants");
      const data = await response.json();
      if (data.submerchants) {
        setSubmerchants(data.submerchants);
        setLog("Submerchants fetched successfully");
      } else {
        setLog("Error fetching submerchants");
      }
    } catch (err: any) {
      setLog("Error fetching submerchants: " + err.message);
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <h2>Data Listings</h2>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleFetchTransactions}>Refresh Transactions</button>
        <button onClick={handleFetchCustomers} style={{ marginLeft: "10px" }}>
          Refresh Customers
        </button>
        <button onClick={handleFetchSubmerchants} style={{ marginLeft: "10px" }}>
          Refresh Submerchants
        </button>
      </div>

      {/* Transactions Table */}
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
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>{tx.id}</td>
                <td>{tx.status}</td>
                <td>{tx.amount}</td>
                <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ""}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Customers Table */}
      <h3>Customers</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((cust, idx) => (
              <tr key={idx}>
                <td>{cust.id}</td>
                <td>{cust.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No customers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Submerchants Table */}
      <h3>Submerchants</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {submerchants.length > 0 ? (
            submerchants.map((sub, idx) => (
              <tr key={idx}>
                <td>{sub.id || sub.merchantAccount?.id}</td>
                <td>{sub.status || sub.merchantAccount?.status || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No submerchants found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>{log}</div>
    </div>
  );
};
