"use client";

import React from "react";
import Link from "next/link";

export default function ServicePage() {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Services</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Services</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Service Start */}
      <div className="container-xxl service py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Services</p>
            <h1 className="display-5 mb-5">Premium Financial Services For Your Personal & Business Needs</h1>
          </div>
          <div className="row g-4 wow fadeInUp" data-wow-delay="0.3s">
            <div className="col-lg-4">
              <div className="nav nav-pills d-flex flex-column justify-content-between w-100 h-100">
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-3 active" data-bs-toggle="pill" data-bs-target="#tab-pane-1" type="button">
                  <h5 className="m-0"><i className="fa fa-hand-holding-usd text-primary me-3"></i>Loans</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-3" data-bs-toggle="pill" data-bs-target="#tab-pane-2" type="button">
                  <h5 className="m-0"><i className="fa fa-chart-line text-primary me-3"></i>Finance & Wealth</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-3" data-bs-toggle="pill" data-bs-target="#tab-pane-3" type="button">
                  <h5 className="m-0"><i className="fa fa-file-invoice-dollar text-primary me-3"></i>Bill Payments</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-3" data-bs-toggle="pill" data-bs-target="#tab-pane-4" type="button">
                  <h5 className="m-0"><i className="fa fa-shield-alt text-primary me-3"></i>Insurance</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-3" data-bs-toggle="pill" data-bs-target="#tab-pane-5" type="button">
                  <h5 className="m-0"><i className="fa fa-credit-card text-primary me-3"></i>Credit Cards</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-6" type="button">
                  <h5 className="m-0"><i className="fa fa-laptop-code text-primary me-3"></i>Dealer Website</h5>
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tab-content w-100">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-4.jpg" style={{ objectFit: "cover" }} alt="Loans" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Personal & Commercial Loans</h3>
                      <p className="mb-4">Flexible financing mapped to your dreams. Get personal, home, business, education, or gold loans starting from 7.99% p.a. with minimal document checks.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>No Collateral Loans</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Long Repayment terms</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Quick Digital Disbursal</p>
                      <Link href="/loans" className="btn btn-primary py-3 px-5 mt-3">Read More &rarr;</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-2">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-1.jpg" style={{ objectFit: "cover" }} alt="Finance" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Strategic Finance & Wealth Growth</h3>
                      <p className="mb-4">Put your capital to work with high-yield mutual funds, monthly SIP plans, fixed deposits, and professional portfolio rebalancing guided by certified advisors.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Systematic Investment Plans (SIP)</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Fixed Deposits (FD)</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Tax Saving Portfolios</p>
                      <Link href="/finance" className="btn btn-primary py-3 px-5 mt-3">Read More &rarr;</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-3">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-2.jpg" style={{ objectFit: "cover" }} alt="Bill Payments" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Instant Utility Bill Settlement</h3>
                      <p className="mb-4">Pay electricity, water, gas, broadband bills, and complete mobile recharges securely in just a few clicks. Connect with thousands of billers instantly.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Fast UPI Integrations</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Automatic Due Alerts</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Secure Transaction Log</p>
                      <Link href="/bill-payment" className="btn btn-primary py-3 px-5 mt-3">Read More &rarr;</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-4">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/carousel-2.jpg" style={{ objectFit: "cover" }} alt="Insurance" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Comprehensive Insurance Coverages</h3>
                      <p className="mb-4">Safeguard your family's future and protect your valuable assets. We offer low-premium health, term life, vehicle, and property insurance policies.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Cashless Hospitalization</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Instant Claim Approvals</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Term Life up to 1 Crore</p>
                      <Link href="/finance/insurance" className="btn btn-primary py-3 px-5 mt-3">Read More &rarr;</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-5">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-3.jpg" style={{ objectFit: "cover" }} alt="Credit Cards" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Premium & Reward Credit Cards</h3>
                      <p className="mb-4">Unlock premium lifestyle privileges, global contactless payments, free airport lounge access, and up to 5% cashback rewards on your daily spends.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>50 Days Interest-Free</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Easy Transaction EMIs</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Contactless Tap & Pay</p>
                      <Link href="/finance/credit-card" className="btn btn-primary py-3 px-5 mt-3">Read More &rarr;</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-6">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/carousel-1.jpg" style={{ objectFit: "cover" }} alt="Dealer Website" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Automated Dealer Website Solutions</h3>
                      <p className="mb-4">Empower your auto or retail dealership with customized dealer websites. Integrate instant financing options, inventory management, and direct customer onboarding tools.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Integrated Loan Calculators</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Real-Time Inventory Sync</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Digital Onboarding Form</p>
                      <Link href="/contact" className="btn btn-primary py-3 px-5 mt-3">Get Started &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}
    </>
  );
}
