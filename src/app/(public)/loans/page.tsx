"use client";

import React from "react";
import Link from "next/link";
import { LOAN_PRODUCTS } from "@/data/servicesData";

export default function LoansPage() {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Our Loan Products</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Loans</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Loans Grid Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Borrow Safely</p>
            <h1 className="display-5 mb-3">Credit Solutions Tailored For Your Dreams</h1>
            <p className="text-muted">Compare our lending options and apply for instant, transparent funding with flexible repayment plans.</p>
          </div>
          <div className="row g-4">
            {LOAN_PRODUCTS.map((loan, idx) => (
              <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 * (idx % 3 + 1)}s`} key={loan.slug}>
                <div className="card h-100 border rounded shadow-sm hover-shadow p-4 bg-white d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-hand-holding-usd"></i>
                      </div>
                      <h4 className="mb-0 text-dark">{loan.title}</h4>
                    </div>
                    <p className="text-muted mb-3" style={{ fontSize: "14px", height: "60px", overflow: "hidden" }}>{loan.overview}</p>
                    <div className="mb-4">
                      {loan.features.slice(0, 3).map((feat, fIdx) => (
                        <div className="d-flex align-items-center mb-2" key={fIdx}>
                          <i className="fa fa-check text-primary me-2" style={{ fontSize: "12px" }}></i>
                          <span style={{ fontSize: "13px" }} className="text-secondary">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    {loan.interestRate && (
                      <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                        <span className="text-muted small">Interest Rate:</span>
                        <span className="text-primary fw-bold" style={{ fontSize: "15px" }}>{loan.interestRate}</span>
                      </div>
                    )}
                    <Link href={`/loans/${loan.slug}`} className="btn btn-primary w-100 rounded-pill mt-3 py-2 fw-bold">
                      View Details & Onboard
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Loans Grid End */}
    </>
  );
}
