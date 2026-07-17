"use client";

import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <>
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Privacy Policy</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Privacy Policy</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container" style={{ maxWidth: "800px" }}>
          <p className="text-muted small">Last updated: July 16, 2026</p>
          <p className="lead text-dark">At {APP_CONFIG.appName}, we are committed to protecting your personal information and transactions.</p>
          
          <h5 className="mt-4 text-dark">1. Information We Collect</h5>
          <p className="text-muted small">We collect personal data that you provide directly, such as name, email address, phone number, PAN Card, Aadhaar details, and loan requirements when applying online.</p>

          <h5 className="mt-4 text-dark">2. How We Use Your Information</h5>
          <p className="text-muted small">We use your info to process loan applications, complete Video KYC validations, process utility bill recharges, and contact you for financial consultations.</p>

          <h5 className="mt-4 text-dark">3. Data Security</h5>
          <p className="text-muted small">We implement robust administrative, technical, and physical security measures to protect your sensitive parameters against unauthorized access.</p>
        </div>
      </div>
    </>
  );
}
