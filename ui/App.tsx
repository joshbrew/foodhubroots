import React, { Component, FormEvent, ChangeEvent, MouseEvent } from "react";
import dropin from "braintree-web-drop-in";
import { sComponent, state } from "./components/util/state.component";
import { MerchantAccountResponse } from "../scripts/braintree_datastructures";

import { clientUrl, obtainClientToken } from "../scripts/frontend";
import { DataListings } from "./components/dev/BraintreeData";
import { MasterMerchantInfo } from "./components/dev/MasterMerchantInfo";
import { FindSubmerchant } from "./components/dev/FindSubmerchant";
import { CustomerForm } from "./components/dev/CustomerForm";
import { AddPaymentMethod } from "./components/dev/AddPaymentMethod";
import { RegularCheckout } from "./components/dev/RegularCheckout";
import { CreateSubMerchant } from "./components/dev/CreateSubMerchant";
import { TransactionWithSplit } from "./components/dev/TransactionWithSplit";

//FOR FETCH CALLS: LIMIT REDUNDANT GETS


//sComponents keep a persistent state, you can import "state" from state.component to manipulate/reference state more programatically, 
// tying the system together in a simple manner. state can also sync to localStorage

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
        <CustomerForm />
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

