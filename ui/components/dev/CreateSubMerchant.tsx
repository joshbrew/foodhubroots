/*──────────────────────────────────────────────────────────
  Create / Update Sub-Merchant (sComponent)
  ──────────────────────────────────────────────────────────*/
import React from "react";
import { clientUrl } from "../../../scripts/frontend";
import { sComponent } from "../util/state.component";

/* ——— data shapes (unchanged) ——— */
interface AddressState { streetAddress: string; locality: string; region: string; postalCode: string; }
interface IndividualState {
  firstName: string; lastName: string; email: string; phone: string;
  dateOfBirth: string; ssn: string; address: AddressState;
}
interface BusinessState {
  legalName: string; dbaName: string; taxId: string; address: AddressState;
}
interface FundingState {
  descriptor: string; destination: "bank" | "mobile";
  email: string; mobilePhone: string; accountNumber: string; routingNumber: string;
}
interface SMState {
    /* shared  */ currentSubMerchantId: string;
    /* private */ id: string; idExists: boolean | null; tosAccepted: boolean;
  individual: IndividualState; useBusiness: boolean; business: BusinessState;
  funding: FundingState; createdAccount: any; uiLog: string;
}

/*─────────────────────────────────────────────────────────*/
export class CreateSubMerchant extends sComponent<{}, SMState> {
  __doNotSubscribe = [
    "id","idExists","tosAccepted","individual","useBusiness","business",
    "funding","createdAccount","uiLog"
  ];

  state: SMState = {
    currentSubMerchantId:"",
    id:"", idExists:null, tosAccepted:false,
    individual:{
      firstName:"", lastName:"", email:"", phone:"",
      dateOfBirth:"", ssn:"",
      address:{ streetAddress:"", locality:"", region:"", postalCode:"" }
    },
    useBusiness:false,
    business:{
      legalName:"", dbaName:"", taxId:"",
      address:{ streetAddress:"", locality:"", region:"", postalCode:"" }
    },
    funding:{
      descriptor:"", destination:"bank",
      email:"", mobilePhone:"", accountNumber:"", routingNumber:""
    },
    createdAccount:null,
    uiLog:""
  };

  /* local (not reactive) */
  private loadedId   = ""; // last successful fetch
  private inFlightId = ""; // id currently being fetched
  private failedId   = ""; // last id that failed to fetch

  /* ---------- lifecycle ---------- */
  componentDidUpdate(_: {}, prevState: Readonly<SMState>) {
    const id = this.state.currentSubMerchantId;
  
    /* 1️⃣   Short-circuit if the ID itself never changed.
           This avoids another pass every time we call setState elsewhere. */
    if (id === prevState.currentSubMerchantId) return;
  
    /* 2️⃣   “Nothing selected” — reset once, then bail. */
    if (!id) {
      if (this.loadedId || this.failedId) this.resetForm();
      return;                               /* ← EARLY EXIT */
    }
  
    /* 3️⃣   Already fetched / failed / in-flight?  Ignore. */
    if (id === this.loadedId || id === this.failedId || id === this.inFlightId) return;
  
    /* 4️⃣   Brand-new candidate → fire exactly one request. */
    this.inFlightId = id;
    this.loadSubMerchant(id).finally(() => { this.inFlightId = ""; });
  }
  /* ---------- fetch helper ---------- */
  private async loadSubMerchant(id: string) {
    try {
      const r = await fetch(`${clientUrl}/get-submerchant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantAccountId: id })
      });
      if (!r.ok) throw new Error("Not found");
  
      const { subMerchant } = await r.json();
  
      /* 5️⃣  Mark success *before* setState so the next render is a no-op. */
      this.loadedId = id;
      this.failedId = "";
  
      this.setState(s => ({
        ...s,
        id: subMerchant.id ?? "",
        individual:{
          ...s.individual,
          firstName:   subMerchant.individual?.firstName   ?? "",
          lastName:    subMerchant.individual?.lastName    ?? "",
          email:       subMerchant.individual?.email       ?? "",
          phone:       subMerchant.individual?.phone       ?? "",
          dateOfBirth: subMerchant.individual?.dateOfBirth ?? "",
          ssn:         subMerchant.individual?.ssnLast4    ?? "",
          address:{
            streetAddress: subMerchant.individual?.address?.streetAddress ?? "",
            locality:      subMerchant.individual?.address?.locality      ?? "",
            region:        subMerchant.individual?.address?.region        ?? "",
            postalCode:    subMerchant.individual?.address?.postalCode    ?? ""
          }
        },
        useBusiness: !!subMerchant.business,
        business:{
          legalName: subMerchant.business?.legalName ?? "",
          dbaName:   subMerchant.business?.dbaName   ?? "",
          taxId:     subMerchant.business?.taxId     ?? "",
          address:{
            streetAddress: subMerchant.business?.address?.streetAddress ?? "",
            locality:      subMerchant.business?.address?.locality      ?? "",
            region:        subMerchant.business?.address?.region        ?? "",
            postalCode:    subMerchant.business?.address?.postalCode    ?? ""
          }
        },
        funding:{
          descriptor:    subMerchant.funding?.descriptor    ?? "",
          destination:   subMerchant.funding?.destination   ?? "bank",
          email:         subMerchant.funding?.email         ?? "",
          mobilePhone:   subMerchant.funding?.mobilePhone   ?? "",
          accountNumber: subMerchant.funding?.accountNumber ?? "",
          routingNumber: subMerchant.funding?.routingNumber ?? ""
        },
        createdAccount: subMerchant,
        uiLog: "Sub-merchant loaded."
      }));
    } catch (e: any) {
      /* 6️⃣  Remember the failure so we never hammer this ID again. */
      this.failedId = id;
      this.loadedId = "";           // paranoia - make absolutely sure it’s not “loaded”
      this.setState({ uiLog: `Fetch error: ${e.message}` });
    }
  }

  /* ---------- reset to pristine create-mode ---------- */
  private resetForm() {
    this.loadedId = "";
    this.failedId = "";
    this.setState({
      id:"", idExists:null, tosAccepted:false,
      individual:{
        firstName:"", lastName:"", email:"", phone:"",
        dateOfBirth:"", ssn:"",
        address:{ streetAddress:"", locality:"", region:"", postalCode:"" }
      },
      useBusiness:false,
      business:{
        legalName:"", dbaName:"", taxId:"",
        address:{ streetAddress:"", locality:"", region:"", postalCode:"" }
      },
      funding:{
        descriptor:"", destination:"bank",
        email:"", mobilePhone:"", accountNumber:"", routingNumber:""
      },
      createdAccount:null,
      uiLog:""
    });
  }

  /* ---------- generic field handler ---------- */
  handleInputChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
    const { name, type, value, checked } = e.currentTarget as any;
    const val = type==="checkbox" ? checked : value;
    this.setState(prev=>{
      const next:any = structuredClone(prev);
      let ptr:any = next;
      const parts = name.split(".");
      for (let i=0; i<parts.length-1; i++) ptr = ptr[parts[i]];
      ptr[parts.at(-1)!] = val;
      return next;
    });
  };

  /* ---------- ID availability check ---------- */
  checkId = async (e:React.MouseEvent)=>{
    e.preventDefault();
    if (!this.state.id.trim())
      return this.setState({ uiLog:"Enter an ID first", idExists:null });
    try {
      const r = await fetch(`${clientUrl}/get-submerchant`,{
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ merchantAccountId:this.state.id.trim() })
      });
      this.setState({
        idExists:r.ok,
        uiLog:r.ok
          ? `ID "${this.state.id}" exists.`
          : `ID "${this.state.id}" available.`
      });
    } catch (err:any) {
      this.setState({ idExists:false, uiLog:`Lookup error: ${err.message}` });
    }
  };

  /* ---------- create / update submit ---------- */
  private submit = async(mode:"create"|"update")=>{
    const { id,tosAccepted,individual,useBusiness,business,funding } = this.state;
    const payload:any = { individual,funding,tosAccepted };
    if (id.trim())      payload.id = id.trim();
    if (useBusiness)    payload.business = business;
    if (mode==="update")payload.isUpdate = true;

    this.setState({ uiLog: mode==="create" ? "Creating…" : "Updating…" });
    try {
      const r  = await fetch(`${clientUrl}/upsert-submerchant`,{
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload)
      });
      const res = await r.json();
      if (r.ok && res.success) {
        const newId = res.subMerchantAccount.id;
        this.loadedId = newId;
        this.failedId = "";
        this.setState({
          currentSubMerchantId:newId,
          createdAccount:res.subMerchantAccount,
          uiLog: mode==="create" ? "Created!" : "Updated!"
        });
      } else {
        this.setState({ uiLog:`Error: ${res.error || "Unknown"}` });
      }
    } catch (e:any) {
      this.setState({ uiLog:`Network error: ${e.message}` });
    }
  };

  /*──────────────────────── render ───────────────────────*/
  render() {
    const {
      id, idExists, tosAccepted, individual, useBusiness, business,
      funding, createdAccount, uiLog, currentSubMerchantId
    } = this.state;

    const editing = !!currentSubMerchantId;

    return (
      <form style={{ margin: 20 }}>
        <h2>{editing ? "Edit Sub-Merchant" : "Create Sub-Merchant"}</h2>

        {/* ---------- ID + Check ---------- */}
        <div>
          <label>
            Custom&nbsp;ID:
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
          <button onClick={this.checkId} style={{ marginLeft: 8 }}>Check&nbsp;ID</button>
          {idExists === true && <span style={{ color: "orange", marginLeft: 8 }}>⚠️ Exists</span>}
          {idExists === false && <span style={{ color: "green", marginLeft: 8 }}>✔️ Available</span>}
        </div>

        <hr />

        {/* ---------- Individual ---------- */}
        <h3>Individual</h3>
        <div>
          <input name="individual.firstName" required placeholder="First Name"
            value={individual.firstName} onChange={this.handleInputChange} />
          <input name="individual.lastName" required placeholder="Last Name"
            value={individual.lastName} onChange={this.handleInputChange}
            style={{ marginLeft: 8 }} />
        </div>
        <div>
          <input name="individual.email" type="email" required placeholder="Email"
            value={individual.email} onChange={this.handleInputChange} />
          <input name="individual.phone" required placeholder="Phone"
            value={individual.phone} onChange={this.handleInputChange}
            style={{ marginLeft: 8 }} />
        </div>
        <div>
          <input name="individual.dateOfBirth" type="date" required
            value={individual.dateOfBirth} onChange={this.handleInputChange} />
          <input name="individual.ssn" required maxLength={4} placeholder="SSN (last4)"
            value={individual.ssn} onChange={this.handleInputChange}
            style={{ marginLeft: 8 }} />
        </div>
        <div>
          <input name="individual.address.streetAddress" required placeholder="Street Address"
            value={individual.address.streetAddress} onChange={this.handleInputChange}
            style={{ width: 300 }} />
        </div>
        <div>
          <input name="individual.address.locality" required placeholder="City"
            value={individual.address.locality} onChange={this.handleInputChange} />
          <input name="individual.address.region" required placeholder="Region"
            value={individual.address.region} onChange={this.handleInputChange}
            style={{ marginLeft: 8, width: 60 }} />
          <input name="individual.address.postalCode" required placeholder="Postal Code"
            value={individual.address.postalCode} onChange={this.handleInputChange}
            style={{ marginLeft: 8, width: 100 }} />
        </div>

        <hr />

        {/* ---------- Business toggle ---------- */}
        <label>
          <input name="useBusiness" type="checkbox"
            checked={useBusiness} onChange={this.handleInputChange} /> Add Business Details
        </label>

        {useBusiness && (
          <>
            <h3>Business</h3>
            <div>
              <input name="business.legalName" required placeholder="Legal Name"
                value={business.legalName} onChange={this.handleInputChange} />
              <input name="business.dbaName" required placeholder="DBA Name"
                value={business.dbaName} onChange={this.handleInputChange}
                style={{ marginLeft: 8 }} />
            </div>
            <div>
              <input name="business.taxId" required placeholder="Tax ID"
                value={business.taxId} onChange={this.handleInputChange} />
            </div>
            <div>
              <input name="business.address.streetAddress" required placeholder="Street Address"
                value={business.address.streetAddress} onChange={this.handleInputChange}
                style={{ width: 300 }} />
            </div>
            <div>
              <input name="business.address.locality" required placeholder="City"
                value={business.address.locality} onChange={this.handleInputChange} />
              <input name="business.address.region" required placeholder="Region"
                value={business.address.region} onChange={this.handleInputChange}
                style={{ marginLeft: 8, width: 60 }} />
              <input name="business.address.postalCode" required placeholder="Postal Code"
                value={business.address.postalCode} onChange={this.handleInputChange}
                style={{ marginLeft: 8, width: 100 }} />
            </div>
          </>
        )}

        <hr />

        {/* ---------- Funding ---------- */}
        <h3>Funding</h3>
        <div>
          <input name="funding.descriptor" required placeholder="Descriptor"
            value={funding.descriptor} onChange={this.handleInputChange} />
          <select name="funding.destination" required
            value={funding.destination} onChange={this.handleInputChange}
            style={{ marginLeft: 8 }}>
            <option value="bank">Bank</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        <div>
          <input name="funding.email" required placeholder="Funding Email"
            value={funding.email} onChange={this.handleInputChange} />
          <input name="funding.mobilePhone" required placeholder="Mobile Phone"
            value={funding.mobilePhone} onChange={this.handleInputChange}
            style={{ marginLeft: 8 }} />
        </div>
        <div>
          <input name="funding.accountNumber" required placeholder="Account Number"
            value={funding.accountNumber} onChange={this.handleInputChange} />
          <input name="funding.routingNumber" required placeholder="Routing Number"
            value={funding.routingNumber} onChange={this.handleInputChange}
            style={{ marginLeft: 8 }} />
        </div>

        <hr />

        {/* ---------- TOS ---------- */}
        <div>
          <label>
            <input name="tosAccepted" type="checkbox" required
              checked={tosAccepted} onChange={this.handleInputChange} />
            &nbsp;I accept the&nbsp;<a href="#">Terms of Service</a>
          </label>
        </div>

        <hr />
        {/* ---------- Action buttons ---------- */}
        <button type="button"
          onClick={() => this.submit("create")}
          style={{ marginRight: 8 }}>
          Create Sub-Merchant
        </button>

        <button type="button"
          disabled={!editing}
          onClick={() => this.submit("update")}>
          Update Existing
        </button>

        {/* ---------- Log & preview ---------- */}
        {uiLog && <div style={{ marginTop: 12, color: "red" }}>{uiLog}</div>}
        {createdAccount && (
          <pre style={{
            background: "#f0f0f0", padding: 10, borderRadius: 4, marginTop: 12,
            maxHeight: 200, overflow: "auto", whiteSpace: "pre-wrap"
          }}>
            {JSON.stringify(createdAccount, null, 2)}
          </pre>
        )}
      </form>
    );
  }
}
