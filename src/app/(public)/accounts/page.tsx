"use client";

import React from "react";
import Link from "next/link";
import { ACCOUNT_SERVICES } from "@/data/servicesData";

export default function AccountsPage() {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Our Banking Accounts</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Accounts</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Accounts Grid Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Secure Banking</p>
            <h1 className="display-5 mb-3">Accounts Formulated For Your Transactions</h1>
            <p className="text-muted">Open fully digital bank, demat, and trading accounts securely within 5 minutes with zero physical paperwork.</p>
          </div>
          <div className="row g-4">
            {ACCOUNT_SERVICES.map((acc, idx) => (
              <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 * (idx % 3 + 1)}s`} key={acc.slug}>
                <div className="card h-100 border rounded shadow-sm hover-shadow p-4 bg-white d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="btn-sm-square bg-primary text-white rounded-circle me-3" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-university"></i>
                      </div>
                      <h4 className="mb-0 text-dark">{acc.title}</h4>
                    </div>
                    <p className="text-muted mb-3" style={{ fontSize: "14px", height: "60px", overflow: "hidden" }}>{acc.overview}</p>
                    <div className="mb-4">
                      {acc.features.slice(0, 3).map((feat, fIdx) => (
                        <div className="d-flex align-items-center mb-2" key={fIdx}>
                          <i className="fa fa-check text-primary me-2" style={{ fontSize: "12px" }}></i>
                          <span style={{ fontSize: "13px" }} className="text-secondary">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Link href={`/accounts/${acc.slug}`} className="btn btn-primary w-100 rounded-pill mt-3 py-2 fw-bold">
                      Open Account Online
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Accounts Grid End */}
    </>
  );
}
