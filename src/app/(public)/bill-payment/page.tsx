"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BillService {
  id: string;
  name: string;
  icon: string;
  desc: string;
  placeholder: string;
  inputType: string;
}

const BILL_SERVICES: BillService[] = [
  {
    id: "electricity",
    name: "Electricity Bill",
    icon: "fa-bolt",
    desc: "Pay your domestic or commercial electricity board bills online instantly.",
    placeholder: "Enter Consumer Number",
    inputType: "text"
  },
  {
    id: "mobile",
    name: "Mobile Recharge",
    icon: "fa-mobile-alt",
    desc: "Prepaid recharges or postpaid bill clearance across all major carriers.",
    placeholder: "Enter 10-digit Mobile Number",
    inputType: "tel"
  },
  {
    id: "dth",
    name: "DTH Connection",
    icon: "fa-satellite-dish",
    desc: "Instantly recharge your satellite TV connection to keep services active.",
    placeholder: "Enter Smartcard / Customer ID",
    inputType: "text"
  },
  {
    id: "broadband",
    name: "Broadband / Landline",
    icon: "fa-wifi",
    desc: "Clear high-speed fiber internet and landline telephone account balances.",
    placeholder: "Enter Account Number / Landline Code",
    inputType: "text"
  },
  {
    id: "water",
    name: "Water Bill Payment",
    icon: "fa-tint",
    desc: "Pay water board utility rates quickly and securely digitally.",
    placeholder: "Enter Customer Reference ID",
    inputType: "text"
  },
  {
    id: "gas",
    name: "LPG Gas / Piped Gas",
    icon: "fa-fire",
    desc: "Book gas cylinders or clear piped gas pipeline consumption metrics.",
    placeholder: "Enter LPG ID / Business Customer Code",
    inputType: "text"
  },
  {
    id: "fastag",
    name: "FASTag Recharge",
    icon: "fa-road",
    desc: "Recharge national highway toll plaza FASTag wallets before traveling.",
    placeholder: "Enter Vehicle Registration Number (e.g. RJ14CC1234)",
    inputType: "text"
  }
];

export default function BillPayment() {
  const [selectedService, setSelectedService] = useState<BillService>(BILL_SERVICES[0] as BillService);
  const [accountInput, setAccountInput] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountInput && amount) {
      setStatus("success");
      setAccountInput("");
      setAmount("");
    } else {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Utility Bill Payments</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Bill Payments</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Hero Header End */}

      {/* Main Billing Portal Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Grid Selection Column */}
            <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.1s">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Utility Payments</p>
              <h2 className="display-6 mb-4">Pay Bills & Recharges Instantly</h2>
              <p className="text-muted mb-4">Select your service, input the required customer IDs, and settle payments instantly through our secure gateway.</p>

              <div className="row g-3">
                {BILL_SERVICES.map((srv) => (
                  <div className="col-md-6" key={srv.id}>
                    <div
                      onClick={() => {
                        setSelectedService(srv);
                        setStatus("idle");
                      }}
                      className={`p-3 border rounded h-100 cursor-pointer d-flex align-items-center ${selectedService.id === srv.id ? "border-primary bg-light" : "bg-white"}`}
                      style={{ cursor: "pointer", transition: "0.3s" }}
                    >
                      <div className="btn-square rounded bg-primary text-white me-3" style={{ width: "50px", height: "50px", minWidth: "50px" }}>
                        <i className={`fa ${srv.icon} fa-lg`}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark fw-semi-bold">{srv.name}</h6>
                        <p className="small text-muted mb-0" style={{ fontSize: "0.75rem" }}>{srv.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Payment Form Sidebar */}
            <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-light p-4 rounded border position-sticky" style={{ top: "100px" }}>
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                  <div className="btn-square rounded bg-primary text-white me-3">
                    <i className={`fa ${selectedService.icon} fa-lg`}></i>
                  </div>
                  <div>
                    <h5 className="mb-0 text-dark">{selectedService.name} Portal</h5>
                    <span className="small text-muted">Sg Pay 4u Secure Gateway</span>
                  </div>
                </div>

                {status === "success" ? (
                  <div className="alert alert-success text-center py-4 mb-0" role="alert">
                    <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
                    <h5 className="alert-heading">Transaction Successful!</h5>
                    <p className="small mb-0">Your request has been processed successfully. Transaction reference ID was generated and sent to your registered contacts.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="btn btn-outline-primary btn-sm mt-3"
                    >
                      Pay Another Bill
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePay}>
                    <div className="mb-3">
                      <label htmlFor="account" className="form-label small fw-medium">{selectedService.name} Detail</label>
                      <input
                        type={selectedService.inputType}
                        className="form-control"
                        id="account"
                        required
                        placeholder={selectedService.placeholder}
                        value={accountInput}
                        onChange={(e) => setAccountInput(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="amount" className="form-label small fw-medium">Bill Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        required
                        min="1"
                        placeholder="Enter payment amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>

                    <div className="p-3 bg-white border rounded mb-4">
                      <div className="d-flex justify-content-between mb-1 small text-muted">
                        <span>Platform Fee</span>
                        <span>₹0.00 (Free)</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small text-muted">
                        <span>Gateway Charge</span>
                        <span>₹0.00 (Free)</span>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-2 fw-bold text-dark">
                        <span>Total Payable</span>
                        <span>₹{Number(amount || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-3">Pay Bill Now</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Billing Portal End */}
    </>
  );
}
