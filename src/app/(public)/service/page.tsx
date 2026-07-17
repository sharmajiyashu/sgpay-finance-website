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
            <h1 className="display-5 mb-5">Awesome Financial Services For Business</h1>
          </div>
          <div className="row g-4 wow fadeInUp" data-wow-delay="0.3s">
            <div className="col-lg-4">
              <div className="nav nav-pills d-flex flex-column justify-content-between w-100 h-100">
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4 active" data-bs-toggle="pill" data-bs-target="#tab-pane-1" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Financial Planning</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-2" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Cash Investment</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-3" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Financial Consultancy</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-4" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Business Loans</h5>
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tab-content w-100">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-1.jpg" style={{ objectFit: "cover" }} alt="Service 1" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Professional Financial Planning Services</h3>
                      <p className="mb-4">Fulfill your life goals with customized portfolios, tax advisory, and disciplined wealth creation structures designed by certified planners.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Tax Saving ELSS Planning</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Retirement Corpus Building</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Portfolio Rebalancing</p>
                      <Link href="/finance/financial-planning" className="btn btn-primary py-3 px-5 mt-3">Read More</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-2">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-2.jpg" style={{ objectFit: "cover" }} alt="Service 2" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Strategic Cash & Wealth Investments</h3>
                      <p className="mb-4">Access mutual funds, high-interest fixed deposits, and monthly SIP structures to safeguard and grow your surplus capital.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Mutual Funds & SIPs</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Guaranteed Return FDs</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Liquidity-optimized accounts</p>
                      <Link href="/finance/sip-investment" className="btn btn-primary py-3 px-5 mt-3">Read More</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-3">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-3.jpg" style={{ objectFit: "cover" }} alt="Service 3" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Corporate & Retail Financial Consultancy</h3>
                      <p className="mb-4">Get custom advisory on capital structures, B2B commercial finance, and equipment leasing from our sector specialists.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Commercial Finance Audit</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Equipment Leasing Models</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Trade Bank Guarantees</p>
                      <Link href="/finance/financial-planning" className="btn btn-primary py-3 px-5 mt-3">Read More</Link>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-4">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-4.jpg" style={{ objectFit: "cover" }} alt="Service 4" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">Flexible Small & Medium Business Loans</h3>
                      <p className="mb-4">Fuel business operations with unsecured and secured loans, cash credit facilities, and government scheme alignments.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Unsecured Business Capital</p>
                      <p><i className="fa fa-check text-primary me-3"></i>CGTMSE MSME Loans</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Overdraft & CC lines</p>
                      <Link href="/loans/business-loan" className="btn btn-primary py-3 px-5 mt-3">Read More</Link>
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
