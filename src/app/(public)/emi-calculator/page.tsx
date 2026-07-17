"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function EMICalculator() {
  const [amount, setAmount] = useState<number>(500000);
  const [rate, setRate] = useState<number>(10.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = tenureType === "years" ? tenure * 12 : tenure;

    if (P > 0 && r > 0 && n > 0) {
      const calculatedEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const calculatedTotalPayment = calculatedEmi * n;
      const calculatedTotalInterest = calculatedTotalPayment - P;

      setEmi(Math.round(calculatedEmi));
      setTotalPayment(Math.round(calculatedTotalPayment));
      setTotalInterest(Math.round(calculatedTotalInterest));
    } else {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  }, [amount, rate, tenure, tenureType]);

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">EMI Calculator</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">EMI Calculator</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Hero Header End */}

      {/* Calculator Section Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Left Sliders Column */}
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Calculate Now</p>
              <h2 className="display-6 mb-4">Plan Your Loan Repayments</h2>
              <p className="text-muted mb-4">Adjust the sliders to estimate your monthly installments (EMI), total interest outgo, and overall repayment amount.</p>

              <div className="bg-light p-4 rounded border">
                {/* Loan Amount */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semi-bold text-dark">Loan Amount</span>
                    <span className="text-primary fw-bold">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>Min: ₹10k</span>
                    <span>Max: ₹1 Cr</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semi-bold text-dark">Interest Rate (% p.a.)</span>
                    <span className="text-primary fw-bold">{rate}%</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="5"
                    max="25"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>Min: 5%</span>
                    <span>Max: 25%</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semi-bold text-dark">Loan Tenure</span>
                    <div className="d-flex align-items-center">
                      <span className="text-primary fw-bold me-3">
                        {tenure} {tenureType === "years" ? (tenure === 1 ? "Year" : "Years") : (tenure === 1 ? "Month" : "Months")}
                      </span>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className={`btn ${tenureType === "years" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => {
                            setTenureType("years");
                            setTenure(Math.min(tenure, 30));
                          }}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          className={`btn ${tenureType === "months" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => {
                            setTenureType("months");
                            setTenure(Math.min(tenure * 12, 360));
                          }}
                        >
                          Months
                        </button>
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max={tenureType === "years" ? 30 : 360}
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>Min: 1 {tenureType === "years" ? "Yr" : "Mo"}</span>
                    <span>Max: {tenureType === "years" ? "30 Yrs" : "360 Mos"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Calculations Summary Column */}
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="p-5 border rounded text-center" style={{ background: "linear-gradient(135deg, #176FB5 0%, #0F5287 100%)", color: "#ffffff" }}>
                <h4 className="text-white mb-4">Repayment Estimate</h4>

                <div className="mb-4 pb-4 border-bottom border-light">
                  <span className="small text-light d-block mb-1">YOUR MONTHLY INSTALLMENT (EMI)</span>
                  <h1 className="display-4 text-white font-weight-bold mb-0">₹{emi.toLocaleString("en-IN")}</h1>
                </div>

                <div className="row g-4 mb-4 text-start">
                  <div className="col-6">
                    <span className="small text-light d-block mb-1">Principal Amount</span>
                    <h5 className="text-white mb-0">₹{amount.toLocaleString("en-IN")}</h5>
                  </div>
                  <div className="col-6">
                    <span className="small text-light d-block mb-1">Total Interest Outgo</span>
                    <h5 className="text-white mb-0">₹{totalInterest.toLocaleString("en-IN")}</h5>
                  </div>
                </div>

                <div className="p-3 bg-white bg-opacity-10 rounded text-start mb-4">
                  <span className="small text-light d-block mb-1">Total Repayment Amount (Principal + Interest)</span>
                  <h4 className="text-white mb-0">₹{totalPayment.toLocaleString("en-IN")}</h4>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <Link href="/contact" className="btn btn-light py-3 px-4">Contact Specialist</Link>
                  <Link href="/service" className="btn btn-outline-light py-3 px-4">View Loan Products</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Calculator Section End */}
    </>
  );
}
