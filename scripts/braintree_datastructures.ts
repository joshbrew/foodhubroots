//https://developer.paypal.com/braintree/docs/start/overview/
//https://developer.paypal.com/braintree/docs/start/drop-in


//sample braintree data structures
type MerchantAccountResponse = {
    business: {
      addressDetails: {
        locality: string;
        postalCode: string;
        region: string;
        streetAddress: string;
      };
      dbaName: string;
      legalName: string;
      taxId: string;
    };
    currencyIsoCode: string;
    default: boolean;
    funding: {
      accountNumberLast4: string;
      descriptor: string;
      destination: string;
      email: string;
      mobilePhone: string;
      routingNumber: string;
    };
    id: string;
    individual: {
      addressDetails: {
        locality: string;
        postalCode: string;
        region: string;
        streetAddress: string;
      };
      dateOfBirth: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      ssnLast4: string;
    };
    masterMerchantAccount: object;
    status: "Pending" | "Active" | "Suspended";
  };

  
  enum SubMerchantAccountWebhookKind {
    SubMerchantAccountApproved = "sub_merchant_account_approved",
    SubMerchantAccountDeclined = "sub_merchant_account_declined",
  }
  
  type SubMerchantAccountWebhookNotification = {
    kind: SubMerchantAccountWebhookKind;
    timestamp: Date;
    merchantAccount: MerchantAccountResponse;
    // Additional attributes may be present for "sub_merchant_account_declined"
  };

  type CustomerResponse = {
    addresses: Array<{
      id: string;
      streetAddress?: string;
      locality?: string;
      region?: string;
      postalCode?: string;
      countryCodeAlpha2?: string;
      countryCodeAlpha3?: string;
      countryCodeNumeric?: string;
      countryName?: string;
    }>;
    androidPayCards: Array<object>; // Define a detailed type based on Android Pay card schema if needed
    applePayCards?: Array<object>; // Optional, define if applicable
    masterpassCards: Array<object>; // Define detailed type based on Masterpass card schema if needed
    paymentMethods: Array<object>; // Generalized payment methods, can be detailed further if schema available
    paypalAccounts: Array<object>; // Define a detailed type based on PayPal account schema if needed
    visaCheckoutCards: Array<object>; // Define detailed type as needed
    venmoAccounts: Array<object>; // Define detailed type as needed
    company?: string;
    creditCards?: Array<object>; // Define detailed type as needed
    email?: string;
    fax?: string;
    firstName?: string;
    graphQLId?: string;
    id: string;
    internationalPhone?: {
      countryCode: string;
      nationalNumber: string;
    };
    lastName?: string;
    phone?: string; // Deprecated, prefer internationalPhone
    website?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };


  /**
gateway.customer.create({
  firstName: "Jen",
  lastName: "Smith",
  company: "Braintree",
  email: "jen@example.com",
  phone: "312.555.1234",
  fax: "614.555.5678",
  website: "www.example.com"
}, (err, result) => {
  result.success;
  // true

  result.customer.id;
  // e.g. 494019
});
   */

  type CustomerCreateRequest = {
    company?: string;
    creditCard?: {
      billingAddress?: {
        streetAddress?: string;
        locality?: string;
        region?: string;
        postalCode?: string;
        countryCodeAlpha2?: string;
        countryCodeAlpha3?: string;
        countryCodeNumeric?: string;
        countryName?: string;
        extendedAddress?: string;
      };
      cardholderName?: string;
      cvv?: string;
      expirationDate?: string;
      expirationMonth?: string;
      expirationYear?: string;
      number?: string;
      options?: {
        failOnDuplicatePaymentMethod?: boolean;
        makeDefault?: boolean;
        skipAdvancedFraudChecking?: boolean;
        verificationAmount?: string;
        verificationMerchantAccountId?: string;
        verifyCard?: boolean;
      };
    };
    firstName?: string;
    lastName?: string;
    email?: string;
    fax?: string;
    phone?: string; // Deprecated, prefer internationalPhone
    internationalPhone?: {
      countryCode: string;
      nationalNumber: string;
    };
    id?: string;
    paymentMethodNonce?: string;
    riskData?: {
      customerBrowser?: string;
      customerIp?: string;
    };
    taxIdentifiers?: Array<{
      countryCode: string;
      identifier: string;
    }>;
    threeDSecureAuthenticationId?: string;
    website?: string;
    customFields?: Record<string, any>;
    deviceData?: string;
  };
  
/*
gateway.customer.find("theCustomerId", function(err, customer) {
});
*/

/*
gateway.customer.delete("theCustomerId", (err) => {
  err;
  // null
});
*/

/*
const stream = gateway.customer.search((search) => {
  search.id().is("the_customer_id");
}, (err, response) => {
  response.each((err, customer) => {
    console.log(customer.firstName);
  });
});
*/

/*
gateway.customer.update("theCustomerId", {
  firstName: "New First Name",
  lastName: "New Last Name"
}, (err, result) => {
});
*/


  type TransactionResponse = {
    achReturnCode?: string;
    acquirerReferenceNumber?: string;
    addOns?: any[];
    additionalProcessorResponse?: string;
    amount: string;
    androidPayCard?: object;
    applePayCard?: object;
    authorizationAdjustments?: any[];
    authorizationExpiresAt?: string;
    avsErrorResponseCode?: "S" | "E" | null;
    avsPostalCodeResponseCode?: "M" | "N" | "U" | "I" | "A" | "B";
    avsStreetAddressResponseCode?: "M" | "N" | "U" | "I" | "A" | "B";
    billing?: {
      company?: string;
      countryCodeAlpha2?: string;
      countryCodeAlpha3?: string;
      countryCodeNumeric?: string;
      countryName?: string;
      extendedAddress?: string;
      firstName?: string;
      id?: string;
      internationalPhone?: {
        countryCode: string;
        nationalNumber: string;
      };
      lastName?: string;
      locality?: string;
      postalCode?: string;
      region?: string;
      streetAddress?: string;
    };
    channel?: string;
    createdAt: Date;
    currencyIsoCode: string;
    customFields?: Record<string, any>;
    customer?: {
      company?: string;
      email?: string;
      fax?: string;
      firstName?: string;
      id?: string;
      internationalPhone?: {
        countryCode: string;
        nationalNumber: string;
      };
      lastName?: string;
      website?: string;
    };
    cvvResponseCode?: "M" | "N" | "U" | "I" | "S" | "A" | "B";
    descriptor?: {
      name?: string;
      phone?: string;
      url?: string;
    };
    disbursementDetails?: {
      disbursementDate?: Date;
      fundsHeld?: boolean;
      settlementAmount?: string;
      settlementBaseCurrencyExchangeRate?: string;
      settlementCurrencyExchangeRate?: string;
      settlementCurrencyIsoCode?: string;
      success?: boolean;
    };
    discountAmount?: string;
    escrowStatus?: "hold_pending" | "held" | "release_pending" | "released" | "refunded";
    facilitatedDetails?: {
      merchantId: string;
      merchantName: string;
      paymentMethodNonce?: string;
    };
    gatewayRejectionReason?:
      | "application_incomplete"
      | "avs"
      | "avs_and_cvv"
      | "cvv"
      | "duplicate"
      | "fraud"
      | "risk_threshold"
      | "three_d_secure"
      | "token_issuance";
    graphQLId?: string;
    id: string;
    merchantAccountId: string;
    orderId?: string;
    paymentInstrumentType: string;
    paymentReceipt?: object;
    planId?: string;
    processorAuthorizationCode?: string;
    processorResponseCode?: string;
    processorResponseText?: string;
    processorResponseType?: "approved" | "soft_declined" | "hard_declined";
    processorSettlementResponseCode?: string;
    processorSettlementResponseText?: string;
    purchaseOrderNumber?: string;
    recurring?: boolean;
    refundedTransactionId?: string;
    responseEmvData?: string;
    retriedTransactionId?: string;
    retrievalReferenceNumber?: string;
    riskData?: {
      decision?: "Not Evaluated" | "Approve" | "Review" | "Decline";
      decisionReasons?: string[];
      deviceDataCaptured?: boolean;
      fraudServiceProvider?: string;
      id?: string;
      liabilityShift?: {
        conditions?: string[];
        responsibleParty?: string;
      };
      transactionRiskScore?: string;
    };
    shippingAmount?: string;
    shipping?: {
      company?: string;
      countryCodeAlpha2?: string;
      countryCodeAlpha3?: string;
      countryCodeNumeric?: string;
      countryName?: string;
      extendedAddress?: string;
      firstName?: string;
      id?: string;
      internationalPhone?: {
        countryCode: string;
        nationalNumber: string;
      };
      lastName?: string;
      locality?: string;
      postalCode?: string;
      region?: string;
      streetAddress?: string;
      shippingMethod?: string;
    };
    status:
      | "authorizationExpired"
      | "authorized"
      | "authorizing"
      | "settlementPending"
      | "settlementDeclined"
      | "failed"
      | "gatewayRejected"
      | "processorDeclined"
      | "settled"
      | "settling"
      | "submittedForSettlement"
      | "voided";
    subMerchantAccountId?: string;
    transactionFeeAmount?: string;
    transactionFeeCurrencyIsoCode?: string;
    type?: string;
    updatedAt?: Date;
    // You can extend with more payment-specific methods like `creditCard`, `paypalAccount`, etc.
  };

  
type TransactionLineItem = {
    commodityCode?: string;
    description?: string;
    discountAmount?: string;
    kind: "debit" | "credit";
    name: string;
    productCode?: string;
    quantity: string;
    taxAmount?: string;
    totalAmount: string;
    unitAmount: string;
    unitOfMeasure?: string;
    unitTaxAmount?: string;
    upcCode?: string;
    upcType?: "UPC-A" | "UPC-B" | "UPC-C" | "UPC-D" | "UPC-E" | "UPC-2" | "UPC-5";
    url?: string;
  };

  
  
  
  type SubscriptionResponse = {
    addOns: any[];
    balance: string;
    billingDayOfMonth: number;
    billingPeriodEndDate: string;
    billingPeriodStartDate: string;
    createdAt: Date;
    currentBillingCycle: number;
    daysPastDue: number;
    description?: string;
    descriptor?: {
      name?: string;
      phone?: string;
      url?: string;
    };
    discounts: any[];
    failureCount: number;
    firstBillingDate: Date;
    id: string;
    merchantAccountId: string;
    neverExpires: boolean;
    nextBillingDate: Date;
    nextBillingPeriodAmount: string;
    numberOfBillingCycles: number;
    paidThroughDate?: Date | null;
    paymentMethodToken: string;
    planId: string;
    price: string;
    status:
      | "Active"
      | "Canceled"
      | "Expired"
      | "PastDue"
      | "Pending";
    statusHistory: SubscriptionHistory[];
    transactions: TransactionResponse[];
    trialDuration?: number;
    trialDurationUnit?: "day" | "month";
    trialPeriod: boolean;
    updatedAt: Date;
  };
  
  type SubscriptionHistory = {
    balance: string;
    price: string;
    status: "Active" | "Canceled" | "Expired" | "PastDue" | "Pending";
    subscriptionSource: "api" | "control_panel" | "recurring";
  };

  

  type DiscountResponse = {
    amount: string;
    createdAt: Date;
    currentBillingCycle?: number | null;
    description?: string | null;
    id: string;
    kind?: string | null;
    name: string;
    neverExpires: boolean;
    numberOfBillingCycles: number;
    quantity?: number | null;
    updatedAt: Date;
  };
  

  type DisputeResponse = {
    amountDisputed: string;
    amountWon: string;
    caseNumber: string;
    chargebackProtectionLevel: string;
    createdAt: Date;
    currencyIsoCode: string;
    evidence: Array<{
      comment?: string;
      createdAt: Date;
      id: string;
      sentToProcessorAt?: Date;
      url?: string;
    }>;
    graphqlId: string;
    id: string;
    kind: "CHARGEBACK" | "PRE_ARBITRATION" | "RETRIEVAL";
    merchantAccountId: string;
    originalDisputeId?: string;
    paypalMessages?: Array<{
      message: string;
      sentAt: Date;
      sender: string;
    }>;
    preDisputeProgram?: string;
    processorComments?: string;
    reason:
      | "cancelled_recurring_transaction"
      | "credit_not_processed"
      | "duplicate"
      | "fraud"
      | "general"
      | "invalid_account"
      | "not_recognized"
      | "product_not_received"
      | "product_unsatisfactory"
      | "transaction_amount_differs";
    reasonCode: string;
    reasonDescription: string;
    receivedDate: Date;
    referenceNumber?: string;
    replyByDate?: Date;
    status: "ACCEPTED" | "AUTO_ACCEPTED" | "DISPUTED" | "EXPIRED" | "OPEN" | "LOST" | "WON";
    statusHistory: Array<{
      disbursementDate?: Date;
      effectiveDate: Date;
      status: string;
      timestamp: Date;
    }>;
    transaction: {
      amount: string;
      createdAt: Date;
      id: string;
      orderId?: string;
      paymentInstrumentSubtype?: string;
      purchaseOrderNumber?: string;
      updatedAt: Date;
    };
  };
  
  type AddressResponse = {
    company?: string;
    countryCodeAlpha2?: string;
    countryCodeAlpha3?: string;
    countryCodeNumeric?: string;
    countryName?: string;
    createdAt: Date;
    customerId: string;
    extendedAddress?: string;
    firstName?: string;
    id: string;
    internationalPhone?: {
      countryCode: string;
      nationalNumber: string;
    };
    lastName?: string;
    locality?: string;
    postalCode?: string;
    region?: string;
    streetAddress?: string;
    updatedAt: Date;
  };
  

  type ClientTokenRequest = {
    customerId?: string;
    merchantAccountId?: string;
    options?: {
      failOnDuplicatePaymentMethod?: boolean;
      failOnDuplicatePaymentMethodForCustomer?: boolean;
      makeDefault?: boolean;
      verifyCard?: boolean;
    };
    version?: "1" | "2" | "3";
  };
  
  type CreditCardCreateRequest = {
    billingAddress?: {
      company?: string;
      countryCodeAlpha2?: string;
      countryCodeAlpha3?: string;
      countryCodeNumeric?: string;
      countryName?: string;
      extendedAddress?: string;
      firstName?: string;
      internationalPhone?: {
        countryCode: string;
        nationalNumber: string;
      };
      lastName?: string;
      locality?: string;
      postalCode?: string;
      region?: string;
      streetAddress?: string;
    };
    billingAddressId?: string;
    cardholderName?: string;
    customerId: string;
    cvv?: string;
    expirationDate?: string;
    expirationMonth?: string;
    expirationYear?: string;
    number?: string;
    options?: {
      failOnDuplicatePaymentMethod?: boolean;
      failOnDuplicatePaymentMethodForCustomer?: boolean;
      makeDefault?: boolean;
      skipAdvancedFraudChecking?: boolean;
      verificationAmount?: string;
      verificationMerchantAccountId?: string;
      verifyCard?: boolean;
    };
    paymentMethodNonce?: string;
    threeDSecureAuthenticationId?: string;
    threeDSecurePassThru?: {
      cavv?: string;
      dsTransactionId?: string;
      eciFlag?: "00" | "01" | "02" | "04" | "07" | "06" | "05";
      threeDSecureVersion?: string;
      xid?: string;
    };
    token?: string;
  };
  
  type CreditCardVerificationRequest = {
    creditCard: {
      billingAddress?: {
        company?: string;
        countryCodeAlpha2?: string;
        countryCodeAlpha3?: string;
        countryCodeNumeric?: string;
        countryName?: string;
        extendedAddress?: string;
        firstName?: string;
        internationalPhone?: {
          countryCode: string;
          nationalNumber: string;
        };
        lastName?: string;
        locality?: string;
        postalCode?: string;
        region?: string;
        streetAddress?: string;
      };
      cardholderName?: string;
      cvv?: string;
      expirationDate?: string;
      expirationMonth?: string;
      expirationYear?: string;
      number?: string;
    };
    externalVault?: {
      previousNetworkTransactionId?: string;
      status?: "vaulted" | "will_vault";
    };
    options?: {
      amount?: string;
      merchantAccountId?: string;
    };
    paymentMethodNonce?: string;
    riskData?: {
      customerBrowser?: string;
      customerIp?: string;
    };
    threeDSecureAuthenticationId?: string;
    threeDSecurePassThru?: {
      cavv?: string;
      dsTransactionId?: string;
      eciFlag?: "00" | "01" | "02" | "04" | "07" | "06" | "05";
      threeDSecureVersion?: string;
      xid?: string;
    };
  };
  
  type CreditCardResponse = {
    billingAddress?: {
      streetAddress?: string;
      locality?: string;
      region?: string;
      postalCode?: string;
      countryCodeAlpha2?: string;
    };
    bin: string;
    cardType: string;
    cardholderName?: string;
    commercial: "Yes" | "No" | "Unknown";
    countryOfIssuance: string;
    createdAt: Date;
    customerId: string;
    customerLocation: "International" | "US";
    debit: "Yes" | "No" | "Unknown";
    default: boolean;
    durbinRegulated: "Yes" | "No" | "Unknown";
    expirationDate: string;
    expirationMonth: string;
    expirationYear: string;
    expired: boolean;
    granteeDetails?: {
      merchantId: string;
      merchantName: string;
    };
    grantorDetails?: {
      oauthApplicationClientId: string;
      oauthApplicationName: string;
      sourcePaymentMethodToken: string;
    };
    healthcare: "Yes" | "No" | "Unknown";
    imageUrl: string;
    isNetworkTokenized: boolean;
    issuingBank: string;
    last4: string;
    maskedNumber: string;
    payroll: "Yes" | "No" | "Unknown";
    prepaid: "Yes" | "No" | "Unknown";
    productId?: string;
    subscriptions?: string[];
    token: string;
    uniqueNumberIdentifier: string;
    updatedAt: Date;
    verification?: object;
  };

  type VisaCheckoutCardResponse = {
    billingAddress?: {
      streetAddress?: string;
      locality?: string;
      region?: string;
      postalCode?: string;
      countryCodeAlpha2?: string;
    };
    bin: string;
    callId: string;
    cardType: "American Express" | "Discover" | "MasterCard" | "Visa";
    cardholderName?: string;
    commercial: "Yes" | "No" | "Unknown";
    countryOfIssuance: string;
    createdAt: Date;
    customerId: string;
    customerLocation: "International" | "US";
    debit: "Yes" | "No" | "Unknown";
    default: boolean;
    durbinRegulated: "Yes" | "No" | "Unknown";
    expirationDate: string;
    expirationMonth: string;
    expirationYear: string;
    expired: boolean;
    healthcare: "Yes" | "No" | "Unknown";
    imageUrl: string;
    issuingBank: string;
    last4: string;
    maskedNumber: string;
    payroll: "Yes" | "No" | "Unknown";
    prepaid: "Yes" | "No" | "Unknown";
    productId?: string;
    subscriptions?: string[];
    token: string;
    uniqueNumberIdentifier: string;
    updatedAt: Date;
  };

  type VenmoAccountResponse = {
    createdAt: Date;
    customerId: string;
    default: boolean;
    imageUrl: string;
    sourceDescription: string;
    subscriptions?: string[];
    token: string;
    updatedAt: Date;
    username: string;
    venmoUserId: string;
  };

  type UsBankAccountResponse = {
    accountHolderName: string;
    accountType: "business_checking" | "business_savings" | "checking" | "savings";
    achMandate?: string;
    bankName?: string;
    businessName?: string;
    createdAt: Date;
    customerId: string;
    description?: string;
    firstName?: string;
    last4: string;
    lastName?: string;
    ownerId: string;
    ownershipType: "business" | "personal";
    plaidVerifiedAt?: Date;
    routingNumber: string;
    token: string;
    updatedAt: Date;
    verifiable: boolean;
    verified: boolean;
  };


  type UsBankAccountVerificationResponse = {
    additionalProcessorResponse?: string;
    createdAt: Date;
    gatewayRejectionReason?: "too_many_confirmation_attempts";
    id: string;
    merchantAccountId: string;
    processorResponseCode: string;
    processorResponseText: string;
    status: "failed" | "gateway_rejected" | "pending" | "processor_declined" | "verified" | "verifying";
    updatedAt: Date;
    usBankAccount: {
      accountHolderName: string;
      accountType: "business_checking" | "business_savings" | "checking" | "savings";
      bankName: string;
      last4: string;
      ownershipType: "business" | "personal";
      routingNumber: string;
      token: string;
      verified: string;
    };
    verificationDeterminedAt: Date;
    verificationMethod: "independent_check" | "micro_transfers" | "network_check" | "tokenized_check";
  };

  type SepaDebitAccountResponse = {
    bankReferenceToken: string;
    createdAt: Date;
    customerId: string;
    default: boolean;
    globalId: string;
    last4: string;
    mandateType: "ONE_OFF" | "RECURRENT";
    merchantAccountId: string;
    merchantOrPartnerCustomerId?: string;
    subscriptions?: string[];
    token: string;
    updatedAt: Date;
    viewMandateUrl: string;
  };
  

export { 
    AddressResponse, DisputeResponse, CustomerResponse, TransactionResponse,
    SubscriptionResponse, DiscountResponse, CreditCardResponse, VenmoAccountResponse, 
    UsBankAccountResponse, MerchantAccountResponse, SepaDebitAccountResponse, VisaCheckoutCardResponse,
    UsBankAccountVerificationResponse, ClientTokenRequest, CustomerCreateRequest,
    CreditCardCreateRequest, CreditCardVerificationRequest, SubMerchantAccountWebhookNotification, TransactionLineItem
}