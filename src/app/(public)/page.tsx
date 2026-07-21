"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export default function HomePage() {
  useEffect(() => {
    // Dynamically trigger Bootstrap Carousel initialization to guarantee autoplay works in React
    if (typeof window !== "undefined" && (window as any).bootstrap) {
      const carouselEl = document.getElementById("header-carousel");
      if (carouselEl) {
        new (window as any).bootstrap.Carousel(carouselEl, {
          interval: 5000,
          ride: "carousel",
          wrap: true
        });
      }
    }
  }, []);

  return (
    <>
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            {/* Slide 1: Loans */}
            <div className="carousel-item active">
              <img className="w-100" src="/img/Loan.png" alt="Loans Banner" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-8">
                      <p className="d-inline-block border border-white rounded text-primary fw-semi-bold py-1 px-3 animated slideInDown">
                        Welcome to {APP_CONFIG.appName}
                      </p>
                      <h1 className="display-1 mb-4 animated slideInDown">Empowering Loans & Flexible Credits</h1>
                      <p className="fs-5 text-white mb-4 pb-2 animated slideInDown">Apply online for personal, home, or business loans with interest rates starting from 7.99% p.a. and fast digital disbursals.</p>
                      <Link href="/loans" className="btn btn-primary py-3 px-5 animated slideInDown">Apply For A Loan &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 2: Finance */}
            <div className="carousel-item">
              <img className="w-100" src="/img/finance.png" alt="Finance Banner" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <p className="d-inline-block border border-white rounded text-primary fw-semi-bold py-1 px-3 animated slideInDown">
                        Welcome to {APP_CONFIG.appName}
                      </p>
                      <h1 className="display-1 mb-4 animated slideInDown">Strategic Wealth & Growth Planning</h1>
                      <p className="fs-5 text-white mb-4 pb-2 animated slideInDown">Invest in high-yield mutual funds, systematic investment plans (SIP), or fixed deposits guided by certified advisors.</p>
                      <Link href="/finance" className="btn btn-primary py-3 px-5 animated slideInDown">Invest Smartly &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 3: Insurance */}
            <div className="carousel-item">
              <img className="w-100" src="/img/Insurance.png" alt="Insurance Banner" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <p className="d-inline-block border border-white rounded text-primary fw-semi-bold py-1 px-3 animated slideInDown">
                        Welcome to {APP_CONFIG.appName}
                      </p>
                      <h1 className="display-1 mb-4 animated slideInDown">Complete Health & Family Protection</h1>
                      <p className="fs-5 text-white mb-4 pb-2 animated slideInDown">Secure cashless hospitalization, term life, vehicle, and home covers to safeguard your family's future.</p>
                      <Link href="/insurance" className="btn btn-primary py-3 px-5 animated slideInDown">Explore Insurance &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 4: Accounts */}
            <div className="carousel-item">
              <img className="w-100" src="/img/opening account.png" alt="Accounts Banner" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <p className="d-inline-block border border-white rounded text-primary fw-semi-bold py-1 px-3 animated slideInDown">
                        Welcome to {APP_CONFIG.appName}
                      </p>
                      <h1 className="display-1 mb-4 animated slideInDown">Zero Paperwork Digital Bank Accounts</h1>
                      <p className="fs-5 text-white mb-4 pb-2 animated slideInDown">Open savings, current, demat, or trading accounts in just 5 minutes with zero paperwork and instant activation.</p>
                      <Link href="/accounts" className="btn btn-primary py-3 px-5 animated slideInDown">Open Account Online &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}

      {/* Services Section Start (Moved to Top) */}
      <div className="container-xxl service py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Core Offerings</p>
            <h1 className="display-5 mb-3">Comprehensive Financial Solutions For You</h1>
            <p className="text-muted">Explore our complete range of customized credit facilities, secure savings, insurance plans, and instant utility bill pay services.</p>
          </div>

          {/* Quick Portal Cards Grid */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-card p-4 border rounded text-center bg-light h-100 shadow-sm">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa fa-hand-holding-usd fa-2x"></i>
                </div>
                <h4 className="mb-3">Instant Loans</h4>
                <p className="text-muted mb-3" style={{ fontSize: "14px" }}>Get personal, home, business, education, or gold loans starting from 7.99% p.a. with fast online processing.</p>
                <Link href="/loans" className="btn btn-outline-primary rounded-pill btn-sm px-4">Apply Now</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
              <div className="service-card p-4 border rounded text-center bg-light h-100 shadow-sm">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa fa-shield-alt fa-2x"></i>
                </div>
                <h4 className="mb-3">Secure Insurance</h4>
                <p className="text-muted mb-3" style={{ fontSize: "14px" }}>Protect your health, life, family, vehicle, and property assets with our comprehensive, low-premium covers.</p>
                <Link href="/finance" className="btn btn-outline-primary rounded-pill btn-sm px-4">Explore Plans</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-card p-4 border rounded text-center bg-light h-100 shadow-sm">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa fa-university fa-2x"></i>
                </div>
                <h4 className="mb-3">Instant Accounts</h4>
                <p className="text-muted mb-3" style={{ fontSize: "14px" }}>Open instant digital savings accounts, current accounts, demat accounts, or trading accounts in just 5 minutes.</p>
                <Link href="/accounts" className="btn btn-outline-primary rounded-pill btn-sm px-4">Open Account</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.4s">
              <div className="service-card p-4 border rounded text-center bg-light h-100 shadow-sm">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa fa-file-invoice-dollar fa-2x"></i>
                </div>
                <h4 className="mb-3">Bill Payments</h4>
                <p className="text-muted mb-3" style={{ fontSize: "14px" }}>Pay electricity, water, gas, broadband bills, and recharge mobile numbers securely in seconds.</p>
                <Link href="/bill-payment" className="btn btn-outline-primary rounded-pill btn-sm px-4">Pay Now</Link>
              </div>
            </div>
          </div>

          <div className="row g-4">
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
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-3" data-bs-toggle="pill" data-bs-target="#tab-pane-6" type="button">
                  <h5 className="m-0"><i className="fa fa-laptop-code text-primary me-3"></i>Dealer Website</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-3 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-7" type="button">
                  <h5 className="m-0"><i className="fa fa-building text-primary me-3"></i>Real Estate</h5>
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tab-content w-100">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/loans_service.png" style={{ objectFit: "cover" }} alt="Loans" />
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
                        <img className="position-absolute rounded w-100 h-100" src="/img/finance_wealth.png" style={{ objectFit: "cover" }} alt="Finance" />
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
                        <img className="position-absolute rounded w-100 h-100" src="/img/utility_bills.png" style={{ objectFit: "cover" }} alt="Bill Payments" />
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
                        <img className="position-absolute rounded w-100 h-100" src="/img/insurance_solutions.png" style={{ objectFit: "cover" }} alt="Insurance" />
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
                        <img className="position-absolute rounded w-100 h-100" src="/img/credit_cards.png" style={{ objectFit: "cover" }} alt="Credit Cards" />
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
                        <img className="position-absolute rounded w-100 h-100" src="/img/dealer_website.png" style={{ objectFit: "cover" }} alt="Dealer Website" />
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
                <div className="tab-pane fade" id="tab-pane-7">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/projects/carousel-1.jpg" style={{ objectFit: "cover" }} alt="Real Estate Projects" onError={(e) => (e.currentTarget.src = "/img/loans_service.png")} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Premium Real Estate Projects</h3>
                      <p className="mb-4">Explore luxury villas, modern apartments, and commercial spaces tailored to your lifestyle. We connect you with verified builders and exclusive properties.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Verified Builders</p>
                      <p><i className="fa fa-check text-primary me-3"></i>RERA Approved Properties</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Luxury & Commercial Spaces</p>
                      <Link href="/projects" className="btn btn-primary py-3 px-5 mt-3">View Projects &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Services Section End */}

      {/* Real Estate Featured Section Start */}
      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Real Estate & Properties</p>
            <h2 className="display-5 mb-4 fw-bold">Explore Premium Real Estate Types</h2>
            <p className="text-muted fs-5">Whether you're looking for a dream home, a lucrative commercial space, or a long-term investment, we have curated the best properties for you.</p>
          </div>

          <div className="row g-4 justify-content-center mb-5">
            {/* Residential */}
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="property-type-card bg-white rounded shadow-sm overflow-hidden h-100 position-relative" style={{ transition: "all 0.3s ease" }}>
                <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                  <img src="/img/projects/carousel-1.jpg" alt="Residential" className="w-100 h-100" style={{ objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "/img/loans_service.png")} />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: "0.2" }}></div>
                  <div className="position-absolute bottom-0 start-0 p-3">
                    <span className="badge bg-primary rounded-pill mb-2 px-3 py-2 shadow-sm">Popular</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="btn-square bg-primary text-white rounded-circle mx-auto mb-3 shadow" style={{ width: "70px", height: "70px", marginTop: "-55px", position: "relative", zIndex: 1, border: "5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa fa-home fa-2x"></i>
                  </div>
                  <h4 className="mb-3 fw-bold text-dark">Residential</h4>
                  <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Luxury villas, modern apartments, and cozy independent houses tailored to fit your family's lifestyle.</p>
                  <ul className="list-unstyled text-start mb-4 text-muted small px-2">
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> 2/3/4 BHK Apartments</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Independent Villas</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Gated Communities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Commercial */}
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
              <div className="property-type-card bg-white rounded shadow-sm overflow-hidden h-100 position-relative" style={{ transition: "all 0.3s ease" }}>
                <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                  <img src="/img/finance.png" alt="Commercial" className="w-100 h-100" style={{ objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "/img/loans_service.png")} />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: "0.2" }}></div>
                  <div className="position-absolute bottom-0 start-0 p-3">
                    <span className="badge bg-danger rounded-pill mb-2 px-3 py-2 shadow-sm">High ROI</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="btn-square bg-primary text-white rounded-circle mx-auto mb-3 shadow" style={{ width: "70px", height: "70px", marginTop: "-55px", position: "relative", zIndex: 1, border: "5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa fa-building fa-2x"></i>
                  </div>
                  <h4 className="mb-3 fw-bold text-dark">Commercial</h4>
                  <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Premium office spaces, retail shops, and co-working spaces in prime business districts.</p>
                  <ul className="list-unstyled text-start mb-4 text-muted small px-2">
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> IT Parks & Offices</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Retail Shops & Malls</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Warehouses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Plots & Land */}
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="property-type-card bg-white rounded shadow-sm overflow-hidden h-100 position-relative" style={{ transition: "all 0.3s ease" }}>
                <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                  <img src="/img/projects/carousel-1.jpg" alt="Plots" className="w-100 h-100" style={{ objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "/img/loans_service.png")} />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: "0.2" }}></div>
                </div>
                <div className="p-4 text-center">
                  <div className="btn-square bg-primary text-white rounded-circle mx-auto mb-3 shadow" style={{ width: "70px", height: "70px", marginTop: "-55px", position: "relative", zIndex: 1, border: "5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa fa-map-marked-alt fa-2x"></i>
                  </div>
                  <h4 className="mb-3 fw-bold text-dark">Plots & Land</h4>
                  <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Invest in open residential plots, agricultural land, or industrial plots for long-term secure wealth generation.</p>
                  <ul className="list-unstyled text-start mb-4 text-muted small px-2">
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Residential Plots</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Agricultural Land</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Industrial Land</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Luxury Properties */}
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.4s">
              <div className="property-type-card bg-white rounded shadow-sm overflow-hidden h-100 position-relative" style={{ transition: "all 0.3s ease" }}>
                <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                  <img src="/img/finance_wealth.png" alt="Luxury" className="w-100 h-100" style={{ objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "/img/loans_service.png")} />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: "0.2" }}></div>
                  <div className="position-absolute bottom-0 start-0 p-3">
                    <span className="badge bg-warning text-dark rounded-pill mb-2 px-3 py-2 shadow-sm">Premium</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="btn-square bg-primary text-white rounded-circle mx-auto mb-3 shadow" style={{ width: "70px", height: "70px", marginTop: "-55px", position: "relative", zIndex: 1, border: "5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa fa-crown fa-2x"></i>
                  </div>
                  <h4 className="mb-3 fw-bold text-dark">Luxury Estates</h4>
                  <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Exclusive penthouses, farmhouses, and ultra-luxury estates with world-class amenities and breathtaking views.</p>
                  <ul className="list-unstyled text-start mb-4 text-muted small px-2">
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Sea-facing Penthouses</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Premium Farmhouses</li>
                    <li className="mb-2"><i className="fa fa-check-circle text-primary me-2"></i> Smart Homes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 text-center">
            <div className="col-12 wow fadeInUp" data-wow-delay="0.5s">
              <Link href="/projects" className="btn btn-primary py-3 px-5 rounded-pill shadow-sm fw-bold">
                View All Property Listings <i className="fa fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Real Estate Featured Section End */}

      {/* Loans Showcase Section Start */}
      <div className="container-fluid bg-white py-5">
        <div className="container py-5">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Loan Products</p>
            <h2 className="display-6 mb-4">Borrow Safely & Responsibly</h2>
            <p className="text-muted">Quick funding options with competitive interest rates and customizable repayment tenure options.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 wow fadeInUp" data-wow-delay="0.1s">
              <div className="p-4 bg-light rounded shadow-sm h-100 border">
                <h5>Personal Loans</h5>
                <p className="text-muted">Unsecured, collateral-free credit for personal emergencies, medical needs, or travel.</p>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <span className="text-primary fw-bold">From 10.5% p.a.</span>
                  <Link href="/loans/personal-loan" className="btn btn-link p-0 text-decoration-none">Details &rarr;</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 wow fadeInUp" data-wow-delay="0.2s">
              <div className="p-4 bg-light rounded shadow-sm h-100 border">
                <h5>Home Loans</h5>
                <p className="text-muted">Fulfill your homeownership dreams with long terms up to 30 years and floating interest rates.</p>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <span className="text-primary fw-bold">From 8.40% p.a.</span>
                  <Link href="/loans/home-loan" className="btn btn-link p-0 text-decoration-none">Details &rarr;</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 wow fadeInUp" data-wow-delay="0.3s">
              <div className="p-4 bg-light rounded shadow-sm h-100 border">
                <h5>Business Loans</h5>
                <p className="text-muted">Capitalize your retail outlet, buy inventory, or expand workspace with zero collateral.</p>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <span className="text-primary fw-bold">From 12.0% p.a.</span>
                  <Link href="/loans/business-loan" className="btn btn-link p-0 text-decoration-none">Details &rarr;</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loans Showcase Section End */}

      {/* Insurance Showcase Section Start */}
      <div className="container-xxl py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <img className="img-fluid rounded shadow" src="/img/insurance_solutions.png" alt="Insurance Solutions" />
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.3s">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Insurance Solutions</p>
              <h2 className="display-6 mb-4">Complete Safety Net For Your Family</h2>
              <p className="mb-4">Sg Pay 4u provides highly reliable insurance covers customized to align with your specific risk requirements and protection needs.</p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check"></i></div>
                    <Link href="/insurance/life-insurance" className="fw-semi-bold text-dark text-decoration-none hover-primary">Term Life Insurance</Link>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check"></i></div>
                    <Link href="/insurance/health-insurance" className="fw-semi-bold text-dark text-decoration-none hover-primary">Health Insurance</Link>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check"></i></div>
                    <Link href="/insurance/vehicle-insurance" className="fw-semi-bold text-dark text-decoration-none hover-primary">Vehicle Insurance</Link>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa fa-check"></i></div>
                    <Link href="/insurance/home-insurance" className="fw-semi-bold text-dark text-decoration-none hover-primary">Home & Asset Covers</Link>
                  </div>
                </div>
              </div>
              <Link href="/insurance" className="btn btn-primary py-3 px-5 mt-4">Browse Insurance Policies</Link>
            </div>
          </div>
        </div>
      </div>
      {/* Insurance Showcase Section End */}

      {/* Account Opening Guide Start */}
      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Instant Onboarding</p>
            <h2 className="display-6 mb-4">Open Your Account in 3 Easy Steps</h2>
            <p className="text-muted">A completely paperless digital onboarding process setup to save your valuable time.</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 text-center wow fadeInUp" data-wow-delay="0.1s">
              <div className="p-4 bg-white rounded shadow-sm h-100">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
                <h5>Select Account Type</h5>
                <p className="text-muted mb-0">Choose Savings, Current, Demat or trading accounts matching your goals.</p>
              </div>
            </div>
            <div className="col-lg-4 text-center wow fadeInUp" data-wow-delay="0.3s">
              <div className="p-4 bg-white rounded shadow-sm h-100">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
                <h5>Upload KYC Details</h5>
                <p className="text-muted mb-0">Provide basic details like PAN card, Aadhaar number, and signature photo.</p>
              </div>
            </div>
            <div className="col-lg-4 text-center wow fadeInUp" data-wow-delay="0.5s">
              <div className="p-4 bg-white rounded shadow-sm h-100">
                <div className="btn-lg-square rounded-circle bg-primary text-white mx-auto mb-4" style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
                <h5>Verify & Activate</h5>
                <p className="text-muted mb-0">Complete instant OTP verification and start transacting securely immediately.</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link href="/accounts/savings-account" className="btn btn-primary py-3 px-5">Get Started Online</Link>
          </div>
        </div>
      </div>
      {/* Account Opening Guide End */}

      {/* Bill Payments Start */}
      <div className="container-xxl py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Utility Bill Payments</p>
              <h2 className="display-6 mb-4">Fast, Instant & Reliable Bill Settlement</h2>
              <p className="mb-4">Never miss a payment deadline. Sg Pay 4u supports direct recharges and payment pipelines across thousands of utility service providers in the country.</p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fa fa-bolt text-primary me-3 fa-lg"></i>
                    <span>Electricity Bills</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="fa fa-tint text-primary me-3 fa-lg"></i>
                    <span>Water Settlements</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fa fa-mobile-alt text-primary me-3 fa-lg"></i>
                    <span>Mobile Recharges</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="fa fa-wifi text-primary me-3 fa-lg"></i>
                    <span>Broadband & Wifi</span>
                  </div>
                </div>
              </div>
              <Link href="/bill-payment" className="btn btn-primary py-3 px-5 mt-4">Open Payment Portal</Link>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.3s">
              <img className="img-fluid rounded shadow" src="/img/utility_bills.png" alt="Utility Bill Payments" />
            </div>
          </div>
        </div>
      </div>
      {/* Bill Payments End */}

      {/* Expanded About Us Section (Moved to Bottom) */}
      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="position-relative overflow-hidden rounded shadow-lg bg-white p-3">
                <img className="img-fluid rounded" src="/img/about.png" alt="About Sg Pay 4u" style={{ objectFit: "cover", width: "100%" }} />
                <div
                  className="position-absolute bg-primary text-white p-4 rounded"
                  style={{
                    bottom: "30px",
                    right: "30px",
                    maxWidth: "240px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  <h3 className="text-white mb-1 fw-bold">10+ Years</h3>
                  <p className="mb-0 text-white-50" style={{ fontSize: "14px" }}>Of Trustworthy Financial Planning & Lending Services</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.3s">
              <span className="d-inline-block border border-primary text-primary px-3 py-1 rounded-pill mb-3 fw-bold" style={{ fontSize: "14px" }}>
                About Sg Pay 4u
              </span>
              <h2 className="display-5 mb-4 fw-bold text-dark">
                Your Trustworthy Partner in Financial Prosperity
              </h2>

              <p className="lead text-secondary mb-4" style={{ fontSize: "18px" }}>
                At Sg Pay 4u, we are dedicated to helping our customers navigate the complex world of finance with clarity and confidence. We believe that financial security should not be a privilege.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa fa-check"></i>
                    </div>
                    <span className="fw-semi-bold text-dark">100% Safe & Secure Portal</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa fa-check"></i>
                    </div>
                    <span className="fw-semi-bold text-dark">Zero Hidden Overhead Charges</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa fa-check"></i>
                    </div>
                    <span className="fw-semi-bold text-dark">Fast-track KYC Approvals</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa fa-check"></i>
                    </div>
                    <span className="fw-semi-bold text-dark">Dedicated Advisory Support</span>
                  </div>
                </div>
              </div>

              <div className="border bg-white rounded p-4 mb-4 shadow-sm">
                <nav>
                  <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                    <button className="nav-link fw-semi-bold active" id="nav-story-tab" data-bs-toggle="tab" data-bs-target="#nav-story" type="button" role="tab" aria-controls="nav-story" aria-selected="true">Story</button>
                    <button className="nav-link fw-semi-bold" id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission" type="button" role="tab" aria-controls="nav-mission" aria-selected="false">Mission</button>
                    <button className="nav-link fw-semi-bold" id="nav-vision-tab" data-bs-toggle="tab" data-bs-target="#nav-vision" type="button" role="tab" aria-controls="nav-vision" aria-selected="false">Vision</button>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-story" role="tabpanel" aria-labelledby="nav-story-tab">
                    <p className="mb-0 text-muted">Established with a vision to democratize financial resources, Sg Pay 4u has grown into a trusted advisory and lending platform. We have empowered thousands of families and businesses by bridging the gap between their ambitions and the capital needed to realize them.</p>
                  </div>
                  <div className="tab-pane fade" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                    <p className="mb-0 text-muted">Our mission is to provide accessible, transparent, and highly reliable financial solutions. We strive to offer competitive loan products, secure savings instruments, and specialized consulting to foster financial inclusion and robust wealth creation.</p>
                  </div>
                  <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                    <p className="mb-0 text-muted">To be the premier financial partner recognized for integrity, customer-centric services, and innovative credit-investment pathways. We envision a financially secure community where individuals and enterprises have immediate access to customized funding.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Us End */}

      {/* Features Showcase Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="border rounded p-4 wow fadeInUp" data-wow-delay="0.1s">
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-times text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>No Hidden Costs</h4>
                      <span>Complete transparency with clear fee schedules and zero hidden surprises.</span>
                    </div>
                    <div className="border-end d-none d-lg-block"></div>
                  </div>
                  <div className="border-bottom mt-4 d-block d-lg-none"></div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-users text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>Dedicated Experts</h4>
                      <span>Access certified financial advisors and credit specialists for customized guidance.</span>
                    </div>
                    <div className="border-end d-none d-lg-block"></div>
                  </div>
                  <div className="border-bottom mt-4 d-block d-lg-none"></div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-phone text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>24/7 Support</h4>
                      <span>Our digital channels and helpdesk are open around the clock to address queries.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features Showcase End */}

      {/* Contact Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Column: Contact Info Details */}
            <div className="col-lg-5">
              <span className="d-inline-block border border-primary text-primary px-3 py-1 rounded-pill mb-3 fw-bold" style={{ fontSize: "14px" }}>
                Contact Details
              </span>
              <h1 className="display-6 mb-4 fw-bold text-dark">We are here to help you</h1>
              <p className="text-muted mb-4">
                Have questions about our financial products or need consultation? Get in touch with our team.
              </p>

              {/* Detail Items */}
              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-map-marker-alt text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Office Address</span>
                  <span className="text-muted small">112/76 Kumbha Marg, Pratap Nagar, Jaipur, RJ 302033</span>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-phone-alt text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Phone Support</span>
                  <span className="text-muted small">+91 98765 43210 / 1800-123-456</span>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-envelope text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Email Address</span>
                  <span className="text-muted small">support@finanza.com</span>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-clock text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Business Hours</span>
                  <span className="text-muted small">Monday - Saturday: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Form */}
            <div className="col-lg-7">
              <div className="card shadow-sm border rounded-4 p-4 p-md-5 bg-white">
                <h4 className="fw-bold text-dark mb-4">Send Us A Message</h4>
                <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your query has been submitted."); }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="home-name" className="form-label small fw-bold text-secondary">Your Name</label>
                      <input type="text" className="form-control border py-3" id="home-name" placeholder="Enter your name" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="home-email" className="form-label small fw-bold text-secondary">Your Email</label>
                      <input type="email" className="form-control border py-3" id="home-email" placeholder="name@example.com" required />
                    </div>
                    <div className="col-12">
                      <label htmlFor="home-subject" className="form-label small fw-bold text-secondary">Subject</label>
                      <input type="text" className="form-control border py-3" id="home-subject" placeholder="What is this about?" required />
                    </div>
                    <div className="col-12">
                      <label htmlFor="home-message" className="form-label small fw-bold text-secondary">Message</label>
                      <textarea className="form-control border py-3" id="home-message" rows={4} placeholder="Leave your message here..." required></textarea>
                    </div>
                    <div className="col-12 pt-2">
                      <button className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm" type="submit">Submit Request</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Map Row */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="rounded-4 overflow-hidden shadow-sm border" style={{ height: "350px" }}>
                <iframe
                  className="w-100 h-100"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14245.241911080966!2d75.82427032936094!3d26.79824096599677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc994025090cd%3A0x32dc61064816df1f!2s112%2F76%2C%20near%20Dispensary%2C%20Kumbha%20Marg%2C%20Sanganer%2C%20Sector%2011%2C%20Pratap%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302033!5e0!3m2!1sen!2sin!4v1784268722674!5m2!1sen!2sin"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </>
  );
}
