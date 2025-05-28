/**********************************************************************
 *  Three standalone tables                                            *
 *    • <TransactionsTable/>                                           *
 *    • <CustomersTable/>                                              *
 *    • <SubmerchantsTable/>                                           *
 *                                                                     *
 *  A light wrapper (<DataListings/>) simply stacks them on the page.  *
 *********************************************************************/

import React from "react";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";

/*───────────────────────────────────────────────────────────*
 *  Helpers
 *───────────────────────────────────────────────────────────*/
const buildQuery = (params: Record<string, string>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
  const str = qs.toString();
  return str ? `?${str}` : "";
};

/*───────────────────────────────────────────────────────────*
 *  TransactionsTable
 *───────────────────────────────────────────────────────────*/
type TxStatus = "Authorized" | "SubmittedForSettlement" | "Settled" | string;


interface TxState {
  list: any[];
  log: string;
  txStartDate: string;
  txEndDate: string;
  txStatus: TxStatus;

  currentTxId: string | null;    // selected ID
  currentTx: any | null;         // fetched JSON
}

export class TransactionsTable extends sComponent<{}, TxState> {
  __doNotBroadcast = [
    "list","log","txStartDate","txEndDate","txStatus",
    // we DO want to broadcast currentTxId to other components
    // so it is NOT in doNotBroadcast
    "currentTx"
  ];

  state: TxState = {
    list: [],
    log: "",
    txStartDate: "",
    txEndDate: "",
    txStatus: "",

    currentTxId: null,
    currentTx: null
  };

  private fetchList = async () => {
    const { txStartDate, txEndDate, txStatus } = this.state;
    try {
      const r   = await fetch(`${clientUrl}/transactions${buildQuery({
        startDate: txStartDate,
        endDate:   txEndDate,
        status:    txStatus
      })}`, { method: "GET" });
      const res = await r.json();
      if (res.transactions) {
        this.setState({ list: res.transactions, log: "Loaded." });
      } else {
        this.setState({ log: res.error || "Error." });
      }
    } catch (e: any) {
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };

  private selectTransaction = async (id: string) => {
    // 1) store selected ID
    this.setState({ currentTxId: id, currentTx: null, log: "" });

    // 2) fetch its JSON
    try {
      const r   = await fetch(`${clientUrl}/get-transaction`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ transactionId: id })
      });
      const res = await r.json();
      if (res.transaction) {
        this.setState({ currentTx: res.transaction });
      } else {
        this.setState({ log: res.error || "Not found." });
      }
    } catch (e: any) {
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };

  render() {
    const {
      list, log, txStartDate, txEndDate, txStatus,
      currentTxId, currentTx
    } = this.state;

    const table = (
      <>
        <div>
          <label>Start:
            <input type="date" value={txStartDate}
              onChange={e => this.setState({ txStartDate: e.target.value })} />
          </label>{" "}
          <label>End:
            <input type="date" value={txEndDate}
              onChange={e => this.setState({ txEndDate: e.target.value })} />
          </label>{" "}
          <label>Status:
            <input placeholder="Settled…" value={txStatus}
              onChange={e => this.setState({ txStatus: e.target.value })} />
          </label>{" "}
          <button onClick={this.fetchList}>Refresh</button>
        </div>

        <table border={1} cellPadding={4} style={{ marginTop: 8, width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th><th>Status</th><th>Amount</th><th>Created</th><th/>
            </tr>
          </thead>
          <tbody>
            {list.length ? list.map((t,i) => (
              <tr key={i}>
                <td>{t.id}</td>
                <td>{t.status}</td>
                <td>{t.amount}</td>
                <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}</td>
                <td>
                  <button onClick={() => this.selectTransaction(t.id)}>
                    Select
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5}>No data</td></tr>
            )}
          </tbody>
        </table>
        {log && <small>{log}</small>}
      </>
    );

    const detail = (
      <div style={{
        flex: 1,
        marginLeft: 16,
        background: "#f9f9f9",
        padding: 8,
        borderRadius: 4,
        maxHeight: 400,
        overflow: "auto"
      }}>
        {currentTxId
          ? (currentTx
              ? <pre>{JSON.stringify(currentTx, null, 2)}</pre>
              : <p>Loading {currentTxId}…</p>
            )
          : <p>Select a transaction to view its JSON here.</p>
        }
      </div>
    );

    return (
      <fieldset style={{ marginBottom: 24 }}>
        <legend><strong>Transactions</strong></legend>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>{table}</div>
          {detail}
        </div>
      </fieldset>
    );
  }
}

/**********************************************************************
 *           CUSTOMERS   (paging + “Set current” button)              *
 *********************************************************************/
interface CustState {
  list: any[];
  page: number;
  pageSize: number;
  total: number;
  emailFilter: string;
  log: string;

  currentCustomerId: string | null;
  currentCustomer: any | null;
}

export class CustomersTable extends sComponent<{}, CustState> {
  __doNotBroadcast = [
    "list","page","pageSize","total","emailFilter","log",
    // we broadcast currentCustomerId so omit it
    "currentCustomer"
  ];

  state: CustState = {
    list: [], page:0, pageSize:25, total:0,
    emailFilter:"", log:"",

    currentCustomerId: null,
    currentCustomer: null
  };

  private fetchList = async () => {
    const { page, pageSize, emailFilter } = this.state;
    const r   = await fetch(`${clientUrl}/customers${buildQuery({
      email: emailFilter, page: String(page), limit: String(pageSize)
    })}`, { method: "GET" });
    const res = await r.json();
    this.setState({
      list:  res.customers ?? [],
      total: res.total     ?? 0,
      log:   r.ok ? "Loaded." : (res.error || "Error")
    });
  };

  private selectCustomer = async (id: string) => {
    this.setState({ currentCustomerId: id, currentCustomer: null, log: "" });
    try {
      const r   = await fetch(`${clientUrl}/get-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ customerId: id })
      });
      const res = await r.json();
      if (res.customer) {
        this.setState({ currentCustomer: res.customer });
        console.log(res.customer);
      } else {
        this.setState({ log: res.error || "Not found." });
      }
    } catch (e: any) {
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };

  render() {
    const {
      list, page, pageSize, total, emailFilter, log,
      currentCustomerId, currentCustomer
    } = this.state;
    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);

    const table = (
      <>
        <div>
          <label>Email contains:
            <input value={emailFilter}
              onChange={e => this.setState({ emailFilter: e.target.value })}/>
          </label>{" "}
          <button onClick={this.fetchList}>Refresh</button>
        </div>

        <table border={1} cellPadding={4} style={{ marginTop: 8, width: "100%" }}>
          <thead>
            <tr><th>ID</th><th>Email</th><th/></tr>
          </thead>
          <tbody>
            {list.length ? list.map((c,i) => (
              <tr key={i}>
                <td>{c.id}</td>
                <td>{c.email}</td>
                <td>
                  <button onClick={() => this.selectCustomer(c.id)}>
                    Select
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={3}>No data</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 4 }}>
          <button disabled={page===0}
            onClick={() => this.setState({ page: page-1 }, this.fetchList)}>
            Prev
          </button>
          <span style={{ margin: "0 8px" }}>{page+1}/{maxPage+1}</span>
          <button disabled={page===maxPage}
            onClick={() => this.setState({ page: page+1 }, this.fetchList)}>
            Next
          </button>
          {log && <small style={{ marginLeft: 8 }}>{log}</small>}
        </div>
      </>
    );

    const detail = (
      <div style={{
        flex: 1,
        marginLeft: 16,
        background: "#f9f9f9",
        padding: 8,
        borderRadius: 4,
        maxHeight: 400,
        overflow: "auto"
      }}>
        {currentCustomerId
          ? (currentCustomer
              ? <pre>{JSON.stringify(currentCustomer, null, 2)}</pre>
              : <p>Loading {currentCustomerId}…</p>
            )
          : <p>Select a customer to view its JSON here.</p>
        }
      </div>
    );

    return (
      <fieldset style={{ marginBottom: 24 }}>
        <legend><strong>Customers</strong></legend>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>{table}</div>
          {detail}
        </div>
      </fieldset>
    );
  }
}

/**********************************************************************
 *           SUB-MERCHANTS          *
 *********************************************************************/
interface SubState {
  list: any[];
  page: number;
  pageSize: number;
  total: number;
  log: string;

  currentSubMerchantId: string | null;
  currentSub: any | null;
}

export class SubmerchantsTable extends sComponent<{}, SubState> {
  __doNotBroadcast = [
    "list","page","pageSize","total","log",
    // broadcast currentSubId so omit from doNotBroadcast
    "currentSub"
  ];

  state: SubState = {
    list: [], page:0, pageSize:25, total:0, log:"",
    currentSubMerchantId: null,
    currentSub: null
  };

  private fetchList = async () => {
    try {
      const r    = await fetch(`${clientUrl}/get-all-merchants`);
      const text = await r.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e: any) {
        return this.setState({ log: `Invalid JSON: ${e.message}` });
      }
      if (!r.ok) {
        return this.setState({ log: data.error || `Status ${r.status}` });
      }
      const all = Array.isArray(data.merchants) ? data.merchants : [];
      this.setState(({ page, pageSize }) => ({
        total: all.length,
        list:  all.slice(page*pageSize, page*pageSize + pageSize),
        log:   "Loaded."
      }));
    } catch (e: any) {
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };

  private selectSubmerchant = async (id: string) => {
    this.setState({ currentSubMerchantId: id, currentSub: null, log: "" });
    try {
      const r   = await fetch(`${clientUrl}/get-submerchant`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ merchantAccountId: id })
      });
      const res = await r.json();
      if (res.subMerchant) {
        this.setState({ currentSub: res.subMerchant });
      } else {
        this.setState({ log: res.error || "Not found." });
      }
    } catch (e: any) {
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };

  render() {
    const {
      list, page, pageSize, total, log,
      currentSubMerchantId, currentSub
    } = this.state;
    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);

    const table = (
      <>
        <button onClick={this.fetchList}>Refresh List</button>
        <table border={1} cellPadding={4} style={{ marginTop: 8, width: "100%" }}>
          <thead>
            <tr><th>ID</th><th>Status</th><th/></tr>
          </thead>
          <tbody>
            {list.length ? list.map((s,i) => {
              const id     = s.id ?? s.merchantAccount?.id;
              const status = s.status ?? s.merchantAccount?.status;
              return (
                <tr key={i}>
                  <td>{id}</td>
                  <td>{status}</td>
                  <td>
                    <button onClick={() => this.selectSubmerchant(id)}>
                      Select
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={3}>No data</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: 4 }}>
          <button disabled={page===0}
            onClick={() => this.setState({ page: page-1 }, this.fetchList)}>
            Prev
          </button>
          <span style={{ margin: "0 8px" }}>
            {page+1}/{maxPage+1}
          </span>
          <button disabled={page===maxPage}
            onClick={() => this.setState({ page: page+1 }, this.fetchList)}>
            Next
          </button>
          {log && <small style={{ marginLeft: 8 }}>{log}</small>}
        </div>
      </>
    );

    const detail = (
      <div style={{
        flex:1,
        marginLeft:16,
        background:"#f9f9f9",
        padding:8,
        borderRadius:4,
        maxHeight:400,
        overflow:"auto"
      }}>
        {currentSubMerchantId
          ? (currentSub
              ? <pre>{JSON.stringify(currentSub, null, 2)}</pre>
              : <p>Loading {currentSubMerchantId}…</p>
            )
          : <p>Select a merchant to view its JSON here.</p>
        }
      </div>
    );

    return (
      <fieldset style={{ marginBottom: 24 }}>
        <legend><strong>Sub-Merchants</strong></legend>
        <div style={{ display: "flex" }}>
          <div style={{ flex:1 }}>{table}</div>
          {detail}
        </div>
      </fieldset>
    );
  }
}


/**********************************************************************
 *           Wrapper component  (unchanged elsewhere)                 *
 *********************************************************************/
export const DataListings: React.FC = () => (
  <div style={{ margin: "10px 0" }}>
    <h2>Data Listings</h2>
    <TransactionsTable />
    <CustomersTable />
    <SubmerchantsTable />
  </div>
);