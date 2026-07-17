"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function EMICalculator() {
  const [amount, setAmount] = useState<number>(500000);
  const [rate, setRate] = useState<number>(9.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [interestPercentage, setInterestPercentage] = useState<number>(0);
  const [principalPercentage, setPrincipalPercentage] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<
    Array<{
      month: number;
      principalPaid: number;
      interestPaid: number;
      remainingBalance: number;
    }>
  >([]);

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

      // Calculate percentages for SVG chart
      const interestPct = (calculatedTotalInterest / calculatedTotalPayment) * 100;
      setInterestPercentage(interestPct);
      setPrincipalPercentage(100 - interestPct);

      // Generate a preview of amortization schedule (first 6 months + final summary)
      const scheduleTemp = [];
      let balance = P;
      for (let i = 1; i <= Math.min(n, 12); i++) {
        const interestPaid = balance * r;
        const principalPaid = calculatedEmi - interestPaid;
        balance -= principalPaid;
        scheduleTemp.push({
          month: i,
          principalPaid: Math.round(principalPaid),
          interestPaid: Math.round(interestPaid),
          remainingBalance: Math.max(0, Math.round(balance)),
        });
      }
      setAmortizationSchedule(scheduleTemp);
    } else {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setInterestPercentage(0);
      setPrincipalPercentage(0);
      setAmortizationSchedule([]);
    }
  }, [amount, rate, tenure, tenureType]);

  // SVG Donut Chart calculation constants
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetInterest = circumference - (interestPercentage / 100) * circumference;

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s" style={{ background: "linear-gradient(rgba(0, 41, 102, 0.08), rgba(0, 41, 102, 0.03))", padding: "100px 0" }}>
        <div className="container text-center py-5">
          <span className="d-inline-block border border-primary text-primary px-3 py-1 rounded-pill mb-3 fw-bold">Smart Financial Planning</span>
          <h1 className="display-4 mb-3 fw-bold text-dark">Interactive EMI Calculator</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-decoration-none" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">EMI Calculator</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Hero Header End */}

      {/* Main Interactive Tool Start */}
      <div className="container-xxl py-3">
        <div className="container">
          <div className="row g-5">
            {/* Input Sliders Column */}
            <div className="col-lg-7">
              <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white h-100">
                <div className="d-flex align-items-center mb-4">
                  <div className="btn-square rounded-circle bg-primary-light text-primary me-3" style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(23, 111, 181, 0.1)" }}>
                    <i className="fa fa-calculator fa-lg"></i>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold text-dark">Adjust Your Loan Details</h3>
                    <p className="text-muted mb-0 small">Plan custom parameters for home, car, or personal loans</p>
                  </div>
                </div>

                {/* Loan Amount Range */}
                <div className="mb-4 pt-2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-semi-bold text-secondary">Desired Loan Amount</span>
                    <div className="input-group input-group-sm w-50 justify-content-end">
                      <span className="input-group-text bg-light border-end-0 fw-bold text-primary">₹</span>
                      <input
                        type="number"
                        className="form-control bg-light border-start-0 text-primary fw-bold text-end"
                        style={{ maxWidth: "140px" }}
                        value={amount}
                        min="10000"
                        max="10000000"
                        step="10000"
                        onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    className="form-range custom-slider"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>₹10,000</span>
                    <span>₹50 Lakhs</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                {/* Interest Rate Range */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-semi-bold text-secondary">Interest Rate (% p.a.)</span>
                    <div className="input-group input-group-sm w-25 justify-content-end">
                      <input
                        type="number"
                        className="form-control bg-light border-end-0 text-primary fw-bold text-end"
                        style={{ maxWidth: "80px" }}
                        value={rate}
                        min="1"
                        max="30"
                        step="0.1"
                        onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                      />
                      <span className="input-group-text bg-light border-start-0 fw-bold text-primary">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="form-range custom-slider"
                    min="5"
                    max="25"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>5%</span>
                    <span>15%</span>
                    <span>25%</span>
                  </div>
                </div>

                {/* Tenure Range */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-semi-bold text-secondary">Loan Tenure</span>
                    <div className="d-flex align-items-center">
                      <div className="btn-group btn-group-sm me-3" role="group">
                        <button
                          type="button"
                          className={`btn px-3 ${tenureType === "years" ? "btn-primary" : "btn-outline-primary"}`}
                          style={{ fontSize: "12px" }}
                          onClick={() => {
                            setTenureType("years");
                            setTenure(Math.min(30, Math.max(1, Math.round(tenure / 12) || 1)));
                          }}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          className={`btn px-3 ${tenureType === "months" ? "btn-primary" : "btn-outline-primary"}`}
                          style={{ fontSize: "12px" }}
                          onClick={() => {
                            setTenureType("months");
                            setTenure(Math.min(360, tenure * 12));
                          }}
                        >
                          Months
                        </button>
                      </div>
                      <input
                        type="number"
                        className="form-control form-control-sm bg-light text-primary fw-bold text-end"
                        style={{ width: "70px" }}
                        value={tenure}
                        min="1"
                        max={tenureType === "years" ? 30 : 360}
                        onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    className="form-range custom-slider"
                    min="1"
                    max={tenureType === "years" ? 30 : 360}
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>1 {tenureType === "years" ? "Year" : "Month"}</span>
                    <span>{tenureType === "years" ? "15 Yrs" : "180 Mos"}</span>
                    <span>{tenureType === "years" ? "30 Yrs" : "360 Mos"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations and Donut Chart Column */}
            <div className="col-lg-5">
              <div className="card border rounded-4 bg-white p-4 p-md-5 h-100 shadow-sm">
                <h4 className="text-dark mb-4 fw-bold border-bottom pb-3">Repayment Breakdown</h4>

                {/* Monthly EMI Panel */}
                <div className="text-center mb-4 py-4 bg-light rounded-4 border">
                  <span className="small text-muted d-block mb-1 text-uppercase tracking-wider">Your Monthly Installment (EMI)</span>
                  <h1 className="display-4 text-primary fw-bold mb-0">₹{emi.toLocaleString("en-IN")}</h1>
                </div>

                {/* SVG Donut Chart */}
                <div className="d-flex justify-content-center align-items-center gap-4 mb-4 flex-wrap">
                  <div className="position-relative" style={{ width: "150px", height: "150px" }}>
                    <svg width="100%" height="100%" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                      {/* Base circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="#e9ecef"
                        strokeWidth="14"
                      />
                      {/* Principal circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="#176FB5"
                        strokeWidth="14"
                        strokeDasharray={circumference}
                        strokeDashoffset={(interestPercentage / 100) * circumference}
                        style={{ transition: "stroke-dashoffset 0.3s ease" }}
                      />
                      {/* Interest circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="#6c757d"
                        strokeWidth="14"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffsetInterest}
                        style={{ transition: "stroke-dashoffset 0.3s ease" }}
                      />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <span className="small text-muted d-block" style={{ fontSize: "11px" }}>Total Outgo</span>
                      <strong className="text-dark" style={{ fontSize: "14px" }}>
                        ₹{Math.round(totalPayment / 100000) >= 1 ? `${(totalPayment / 100000).toFixed(1)}L` : `${Math.round(totalPayment / 1000)}k`}
                      </strong>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="text-start">
                    <div className="d-flex align-items-center mb-2">
                      <span className="d-inline-block rounded-circle me-2" style={{ width: "12px", height: "12px", backgroundColor: "#176FB5" }}></span>
                      <div>
                        <span className="d-block small text-muted" style={{ fontSize: "11px" }}>Principal ({principalPercentage.toFixed(0)}%)</span>
                        <strong className="text-dark">₹{amount.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="d-inline-block rounded-circle bg-secondary me-2" style={{ width: "12px", height: "12px" }}></span>
                      <div>
                        <span className="d-block small text-muted" style={{ fontSize: "11px" }}>Interest ({interestPercentage.toFixed(0)}%)</span>
                        <strong className="text-dark">₹{totalInterest.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 text-start mb-4 border">
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Total Repayment</span>
                    <strong className="text-dark">₹{totalPayment.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <Link href="/contact" className="btn btn-primary py-3 rounded-3 fw-bold shadow-sm">
                    Apply Now for This Loan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Interactive Tool End */}

      {/* Amortization Schedule Preview */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <span className="d-inline-block border border-primary text-primary px-3 py-1 rounded-pill mb-2 fw-semi-bold">Payment Schedule</span>
              <h3 className="fw-bold text-dark">First 12 Months Breakdown</h3>
              <p className="text-muted">A monthly projection of your principal repayments and interest contributions.</p>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light text-secondary">
                  <tr>
                    <th scope="col" className="ps-4">Month</th>
                    <th scope="col">Principal Component (A)</th>
                    <th scope="col">Interest Component (B)</th>
                    <th scope="col">Total Payment (A + B)</th>
                    <th scope="col" className="pe-4 text-end">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.map((row) => (
                    <tr key={row.month}>
                      <td className="ps-4 text-dark fw-semi-bold">Month {row.month}</td>
                      <td className="text-dark">₹{row.principalPaid.toLocaleString("en-IN")}</td>
                      <td className="text-dark">₹{row.interestPaid.toLocaleString("en-IN")}</td>
                      <td className="text-dark fw-bold">₹{emi.toLocaleString("en-IN")}</td>
                      <td className="pe-4 text-end text-muted">₹{row.remainingBalance.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content & Details */}
      <div className="container-xxl py-5 bg-light rounded-5 my-5">
        <div className="container py-4">
          <div className="row g-5">
            {/* How EMI is Calculated */}
            <div className="col-lg-6">
              <h4 className="fw-bold text-dark mb-3">How is EMI Calculated?</h4>
              <p className="text-muted">
                An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full.
              </p>
              <p className="text-muted">
                The mathematical formula used to compute the exact monthly installment is:
              </p>
              <div className="bg-white p-3 rounded-4 border text-center my-3 shadow-sm">
                <code className="h5 text-primary fw-bold">EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]</code>
              </div>
              <ul className="text-muted small ps-3">
                <li className="mb-2"><strong>P (Principal):</strong> The actual sum of money borrowed from the lender.</li>
                <li className="mb-2"><strong>R (Interest Rate):</strong> Calculated per month (Annual interest rate divided by 12, then divided by 100).</li>
                <li className="mb-2"><strong>N (Tenure):</strong> Total number of monthly installments over the loan lifetime.</li>
              </ul>
            </div>

            {/* Smart Repayment Tips */}
            <div className="col-lg-6">
              <h4 className="fw-bold text-dark mb-3">Tips to Lower Your Monthly EMI</h4>
              <div className="row g-3">
                <div className="col-12 d-flex">
                  <div className="btn-sm-square bg-success text-white rounded-circle me-3 flex-shrink-0" style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check" style={{ fontSize: "12px" }}></i></div>
                  <div>
                    <h6 className="fw-bold mb-1">Make Part-Prepayments</h6>
                    <p className="text-muted small mb-0">Paying off lump sums towards your principal periodically reduces both your overall interest outgo and future EMI installments.</p>
                  </div>
                </div>
                <div className="col-12 d-flex">
                  <div className="btn-sm-square bg-success text-white rounded-circle me-3 flex-shrink-0" style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check" style={{ fontSize: "12px" }}></i></div>
                  <div>
                    <h6 className="fw-bold mb-1">Choose a Longer Tenure (For lower EMIs)</h6>
                    <p className="text-muted small mb-0">Increasing your tenure decreases your monthly liability but increases the cumulative interest paid. Use our slider to balance these parameters.</p>
                  </div>
                </div>
                <div className="col-12 d-flex">
                  <div className="btn-sm-square bg-success text-white rounded-circle me-3 flex-shrink-0" style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check" style={{ fontSize: "12px" }}></i></div>
                  <div>
                    <h6 className="fw-bold mb-1">Balance Transfer Options</h6>
                    <p className="text-muted small mb-0">Compare interest rates and request balance transfers if another premium financial provider offers significantly lower interest rates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
