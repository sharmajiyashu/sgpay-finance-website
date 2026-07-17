"use client";

import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export default function TermsPage() {
  return (
    <>
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Terms & Conditions</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Terms & Conditions</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container" style={{ maxWidth: "800px" }}>
          <p className="text-muted small">Last updated: July 16, 2026</p>
          <p className="lead text-dark">Please read these terms and conditions carefully before using the services of {APP_CONFIG.appName}.</p>
          
          <h5 className="mt-4 text-dark">1. Acceptance of Terms</h5>
          <p className="text-muted small">By accessing our website and applying for our financial products (Loans, Accounts, Bill Payments), you agree to comply with and be bound by these Terms and Conditions.</p>

          <h5 className="mt-4 text-dark">2. Accuracy of Information</h5>
          <p className="text-muted small">You warrant that all details submitted for digital KYC or loan lead capture forms are accurate, current, and legally valid.</p>

          <h5 className="mt-4 text-dark">3. Limitation of Liability</h5>
          <p className="text-muted small">{APP_CONFIG.appName} is not responsible for any direct or indirect commercial damages arising from transactions, rates changes, or delays in loan approvals.</p>
        </div>
      </div>
    </>
  );
}
