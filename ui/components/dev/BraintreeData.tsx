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
}

class TransactionsTable extends sComponent<{}, TxState> {
  __doNotBroadcast = ["list", "log", "txStartDate", "txEndDate", "txStatus"];

  state: TxState = {
    list: [],
    log: "",
    txStartDate: "",
    txEndDate: "",
    txStatus: ""
  };

  private fetch = async () => {
    const { txStartDate, txEndDate, txStatus } = this.state;
    try {
      const r = await fetch(`${clientUrl}/transactions${buildQuery({
        startDate: txStartDate, endDate: txEndDate, status: txStatus
      })}`);
      const res = await r.json();
      if (res.transactions) {
        this.setState({ list: res.transactions, log: "Loaded." });
      } else { this.setState({ log: res.error || "Error." }); }
    } catch (e: any) {
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };

  render() {
    const { list, log, txStartDate, txEndDate, txStatus } = this.state;
    return (
      <fieldset style={{ marginBottom: 24 }}>
        <legend><strong>Transactions</strong></legend>

        {/* Filters */}
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
        <button onClick={this.fetch}>Refresh</button>

        {/* Table */}
        <table border={1} cellPadding={4} style={{ marginTop: 8 }}>
          <thead><tr><th>ID</th><th>Status</th><th>Amount</th><th>Created</th></tr></thead>
          <tbody>
            {list.length
              ? list.map((t, i) => (
                <tr key={i}>
                  <td>{t.id}</td><td>{t.status}</td><td>{t.amount}</td>
                  <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}</td>
                </tr>
              ))
              : <tr><td colSpan={4}>No data</td></tr>}
          </tbody>
        </table>
        {log && <small>{log}</small>}
      </fieldset>
    );
  }
}

/**********************************************************************
 *           CUSTOMERS   (paging + “Set current” button)              *
 *********************************************************************/
class CustomersTable extends sComponent<{}, {
  list: any[]; page: number; pageSize: number; total: number;
  emailFilter: string; log: string; currentCustomerId: string | null;
}> {

  state = {
    list: [] as any, page: 0, pageSize: 25, total: 0,
    emailFilter: "", log: "",
    currentCustomerId: null
  };

  __doNotBroadcast = ["list", "page", "pageSize", "total", "emailFilter", "log"];

  private fetch = async () => {
    const { page, pageSize, emailFilter } = this.state;
    const r = await fetch(`${clientUrl}/customers${buildQuery({
      email: emailFilter, page: String(page), limit: String(pageSize)
    })}`);
    const res = await r.json();
    this.setState({
      list: res.customers ?? [],
      total: res.total ?? 0,
      log: r.ok ? "Loaded." : (res.error || "Error")
    });
  };

  private useCustomer = (id: string) =>
    this.setState({ currentCustomerId: id });

  render() {
    const { list, page, pageSize, total, emailFilter, log } = this.state;
    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
    return (
      <fieldset style={{ marginBottom: 24 }}>
        <legend><strong>Customers</strong></legend>

        <label>Email contains:
          <input value={emailFilter}
            onChange={e => this.setState({ emailFilter: e.target.value })} />
        </label>{" "}
        <button onClick={this.fetch}>Refresh</button>

        <table border={1} cellPadding={4} style={{ marginTop: 8 }}>
          <thead><tr><th>ID</th><th>Email</th><th /></tr></thead>
          <tbody>
            {list.length ? list.map((c, i) => (
              <tr key={i}>
                <td>{c.id}</td><td>{c.email}</td>
                <td>
                  <button onClick={() => this.useCustomer(c.id)}>Set current</button>
                </td>
              </tr>
            )) : <tr><td colSpan={3}>No data</td></tr>}
          </tbody>
        </table>

        <div style={{ marginTop: 4 }}>
          <button disabled={page === 0} onClick={() => this.setState({ page: page - 1 }, this.fetch)}>Prev</button>
          <span style={{ margin: "0 8px" }}>{page + 1}/{maxPage + 1}</span>
          <button disabled={page === maxPage} onClick={() => this.setState({ page: page + 1 }, this.fetch)}>Next</button>
          {log && <small style={{ marginLeft: 8 }}>{log}</small>}
        </div>
      </fieldset>
    );
  }
}

/**********************************************************************
 *           SUB-MERCHANTS          *
 *********************************************************************/
class SubmerchantsTable extends sComponent<{}, {
  list: any[];
  page: number;
  pageSize: number;
  total: number;
  log: string;
  currentSubMerchantId: string | null;
}> {
  state = {
    list: [] as any[],
    page: 0,
    pageSize: 25,
    total: 0,
    log: "",
    currentSubMerchantId: null
  };
  __doNotBroadcast = ["list", "page", "pageSize", "total", "log"];

  private fetch = async () => {
    try {
      const r = await fetch(`${clientUrl}/get-all-merchants`);
      console.log(r);
      const text = await r.text();        // always grab the raw payload
      let data: any;

      // try to parse JSON, otherwise surface the raw text
      try {
        data = JSON.parse(text);
      } catch (e: any) {
        return this.setState({
          log: `Invalid JSON response: ${e.message}`
        });
      }

      // handle HTTP errors
      if (!r.ok) {
        const msg = data.error || `Server returned ${r.status}`;
        return this.setState({ log: msg });
      }

      // pull out the array safely
      const all = Array.isArray(data.merchants) ? data.merchants : [];
      this.setState(({ page, pageSize }) => ({
        total: all.length,
        list: all.slice(
          page * pageSize,
          page * pageSize + pageSize
        ),
        log: "Loaded."
      }));
    } catch (e: any) {
      // network / fetch-level error
      this.setState({ log: `Fetch error: ${e.message}` });
    }
  };


  private useSub = (id: string) =>
    this.setState({ currentSubMerchantId: id }, () => {
      /* you could also broadcast this change to your global state here */
    });

  render() {
    const { list, page, pageSize, total, log } = this.state;
    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);

    return (
      <fieldset style={{ marginBottom: 24 }}>
        <legend><strong>Sub-Merchants</strong></legend>
        <button onClick={this.fetch}>Refresh List</button>

        <table border={1} cellPadding={4} style={{ marginTop: 8 }}>
          <thead>
            <tr><th>ID</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {list.length ? list.map((s, i) => {
              const id = s.id ?? s.merchantAccount?.id;
              const status = s.status ?? s.merchantAccount?.status;
              return (
                <tr key={i}>
                  <td>{id}</td>
                  <td>{status ?? "N/A"}</td>
                  <td>
                    <button onClick={() => this.useSub(id)}>Set current</button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={3}>No data</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 4 }}>
          <button disabled={page === 0} onClick={() => this.setState({ page: page - 1 }, this.fetch)}>Prev</button>
          <span style={{ margin: "0 8px" }}>{page + 1}/{maxPage + 1}</span>
          <button disabled={page === maxPage} onClick={() => this.setState({ page: page + 1 }, this.fetch)}>Next</button>
          {log && <small style={{ marginLeft: 8 }}>{log}</small>}
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