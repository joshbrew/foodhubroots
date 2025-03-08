import React from "react";
import dropin from "braintree-web-drop-in";
import { sComponent } from "./components/util/state.component";

export class App extends sComponent {
  state = {
    // Braintree Drop-In
    clientToken: null as string | null,
    dropInInstance: null as any,

    // Customer creation
    firstName: "",
    lastName: "",
    email: "",
    createdCustomerId: "",
    amount: "10.00",

    // Sub-merchant creation
    subMerchantEmail: "",
    subMerchantId: "",

    // Transaction with split
    splitAmount: "50.00", // Example default
    log: "",
  };

  async componentDidMount() {
    try {
      // 1) Fetch a client token from your server
      const tokenRes = await fetch("http://localhost:3000/client-token");
      const tokenData = await tokenRes.json();

      // Store client token in state
      this.setState({ clientToken: tokenData.clientToken });
      this.initializeDropIn();
    } catch (err: any) {
      console.error("Failed to fetch client token:", err);
      this.setState({ log: `Failed to fetch client token: ${err.message}` });
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
          this.setState({ log: "Drop-in create error: " + createErr.message });
          return;
        }
        this.setState({ dropInInstance: instance });
      }
    );
  }

  // -----------------------------
  // 2) Create a Customer
  // -----------------------------
  handleCreateCustomer = async () => {
    const { dropInInstance, firstName, lastName, email } = this.state;
    if (!dropInInstance) {
      this.setState({ log: "Drop-in not ready yet." });
      return;
    }

    try {
      // Request the payment nonce from the Drop-In UI
      const { nonce } = await dropInInstance.requestPaymentMethod();

      // Call your /create-customer endpoint with customer details and the nonce
      const response = await fetch("http://localhost:3000/create-customer", {
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
        this.setState({
          createdCustomerId: data.customerId,
          log: `Customer created successfully! ID: ${data.customerId}`,
        });
      } else {
        this.setState({ log: `Error creating customer: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error creating customer:", err);
      this.setState({ log: `Error creating customer: ${err.message}` });
    }
  };

  // -----------------------------
  // 3) Regular Checkout
  // -----------------------------
  handleCheckout = async () => {
    const { createdCustomerId, amount } = this.state;
    if (!createdCustomerId) {
      this.setState({ log: "No customer has been created yet." });
      return;
    }

    try {
      // Call your /checkout endpoint
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: createdCustomerId,
          amount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        this.setState({
          log: `Checkout successful! Transaction ID: ${data.transactionId}`,
        });
      } else {
        this.setState({ log: `Error in checkout: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error in checkout:", err);
      this.setState({ log: `Error in checkout: ${err.message}` });
    }
  };

  // -----------------------------
  // 4) Create a Sub-Merchant
  // -----------------------------
  handleCreateSubMerchant = async () => {
    const { subMerchantEmail } = this.state;
    if (!subMerchantEmail) {
      this.setState({ log: "Please enter an email for the sub-merchant." });
      return;
    }

    try {
      // Send a structured payload with "individual" and "funding" objects as required.
      const response = await fetch("http://localhost:3000/create-submerchant", {
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
              region: "IL"
            }
          },
          funding: {
            destination: "bank",
            routingNumber: "071000013",
            accountNumber: "1123581321"
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Map the returned "subMerchantAccountId" to our state variable "subMerchantId"
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

  // -----------------------------
  // 5) Transaction with 98/2 Split
  // -----------------------------
  handleTransactionWithSplit = async () => {
    const { subMerchantId, splitAmount, createdCustomerId } = this.state;
    if (!subMerchantId) {
      this.setState({ log: "No sub-merchant has been created yet." });
      return;
    }
    if (!createdCustomerId) {
      this.setState({ log: "No customer has been created yet." });
      return;
    }

    try {
      // Updated endpoint URL to "/split-transaction" to match backend
      const response = await fetch("http://localhost:3000/split-transaction", {
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
        this.setState({
          log: `Transaction with split successful! Transaction ID: ${data.transactionId}`,
        });
      } else {
        this.setState({ log: `Error in split transaction: ${data.error}` });
      }
    } catch (err: any) {
      console.error("Error in split transaction:", err);
      this.setState({ log: `Error in split transaction: ${err.message}` });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      amount,
      createdCustomerId,
      subMerchantEmail,
      subMerchantId,
      splitAmount,
      log,
    } = this.state;

    return (
      <div style={{ margin: "20px" }}>
        <h1>Braintree Sandbox Test</h1>

        {/* ========================
            (A) CREATE CUSTOMER
        ========================= */}
        <div style={{ margin: "10px 0" }}>
          <h2>Create Customer</h2>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => this.setState({ firstName: e.target.value })}
              style={{ marginRight: "10px" }}
            />
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => this.setState({ lastName: e.target.value })}
              style={{ marginRight: "10px" }}
            />
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
              style={{ marginRight: "10px" }}
            />
          </div>

          {/* Braintree Drop-In UI container */}
          <div id="dropin-container" style={{ margin: "10px 0" }}></div>

          <button onClick={this.handleCreateCustomer}>Create Customer</button>
          <div style={{ margin: "5px 0" }}>
            Current Customer ID: <strong>{createdCustomerId || "None"}</strong>
          </div>
        </div>

        <hr />

        {/* ========================
            (B) CHECKOUT
        ========================= */}
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
            onChange={(e) => this.setState({ amount: e.target.value })}
            style={{ marginRight: "10px" }}
          />
          <button onClick={this.handleCheckout}>Checkout</button>
        </div>

        <hr />

        {/* ========================
            (C) CREATE SUB-MERCHANT
        ========================= */}
        <div style={{ margin: "10px 0" }}>
          <h2>Create Sub-Merchant</h2>
          <p>
            This simulates creating a new connected/partner merchant who can receive a portion of a transaction split.
          </p>
          <label>Sub-Merchant Email:</label>
          <input
            type="text"
            value={subMerchantEmail}
            onChange={(e) => this.setState({ subMerchantEmail: e.target.value })}
            style={{ marginRight: "10px" }}
          />
          <button onClick={this.handleCreateSubMerchant}>Create Sub-Merchant</button>
          <div style={{ margin: "5px 0" }}>
            Current Sub-Merchant ID: <strong>{subMerchantId || "None"}</strong>
          </div>
        </div>

        <hr />

        {/* ========================
            (D) TRANSACTION w/ SPLIT
        ========================= */}
        <div style={{ margin: "10px 0" }}>
          <h2>Transaction with 98/2 Split</h2>
          <p>
            This simulates charging the existing customer while sending 98% to the sub-merchant and 2% to your master account.
          </p>
          <p>
            Sub-Merchant ID: <strong>{subMerchantId || "Not yet created"}</strong>
          </p>
          <label>Split Transaction Amount:</label>
          <input
            type="text"
            value={splitAmount}
            onChange={(e) => this.setState({ splitAmount: e.target.value })}
            style={{ marginRight: "10px" }}
          />
          <button onClick={this.handleTransactionWithSplit}>
            Pay Sub-Merchant (98%)
          </button>
        </div>

        <hr />

        {/* ========================
            (E) LOG OUTPUT
        ========================= */}
        <div style={{ margin: "10px 0" }}>
          <h3>Log Output</h3>
          <pre>{log}</pre>
        </div>
      </div>
    );
  }
}
