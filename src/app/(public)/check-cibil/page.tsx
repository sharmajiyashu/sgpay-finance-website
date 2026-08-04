"use client";

import React, { useState } from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import { submitPublicEnquiry } from "@/lib/publicEnquiryService";
import { buildEnquiryPayload } from "@/lib/enquiryCatalog";

export default function CheckCibilScore() {
  const [formData, setFormData] = useState({
    panNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    mobileNumber: "",
    email: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      await submitPublicEnquiry(
        buildEnquiryPayload("cibil", "check-cibil", {
          name: fullName,
          email: formData.email.trim(),
          phone: formData.mobileNumber.trim(),
          pageUrl: "/check-cibil",
          message: `CIBIL score check request for PAN ${formData.panNumber.toUpperCase()}`,
          metadata: {
            panNumber: formData.panNumber.toUpperCase(),
            dob: formData.dob,
            consent: formData.consent,
          },
        })
      );
      // Mock score display until live CIBIL API is integrated
      setScore(Math.floor(Math.random() * (850 - 600 + 1)) + 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit CIBIL request");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColorClass = (scoreValue: number) => {
    if (scoreValue >= 750) return "text-success";
    if (scoreValue >= 650) return "text-warning";
    return "text-danger";
  };

  const getScoreMessage = (scoreValue: number) => {
    if (scoreValue >= 750) return "Excellent! You have a great credit score.";
    if (scoreValue >= 650) return "Good! Your credit score is average.";
    return "Needs Improvement. Your credit score is low.";
  };

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <h1 className="display-3 mb-4 animated slideInDown">Check Your CIBIL Score</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Check CIBIL</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Free CIBIL Check</p>
            <h2 className="display-5 mb-4">Get your detailed credit report securely in just 2 minutes</h2>
            <p className="text-muted">No impact on your credit score.</p>
          </div>

          <div className="row g-5">
            {/* Form Section */}
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="bg-light rounded p-5">
                {!score ? (
                  <>
                    <h3 className="mb-4">Personal Details</h3>
                    {error && (
                      <div className="alert alert-danger" role="alert">{error}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label text-muted">PAN Card Number *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="panNumber"
                            required
                            pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                            title="Enter a valid 10-character PAN number (e.g., ABCDE1234F)"
                            placeholder="ABCDE1234F"
                            value={formData.panNumber}
                            onChange={handleInputChange}
                            style={{ textTransform: "uppercase" }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted">First Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            required
                            placeholder="As per PAN"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted">Last Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            required
                            placeholder="As per PAN"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted">Date of Birth *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted">Mobile Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="mobileNumber"
                            required
                            pattern="[0-9]{10}"
                            title="Enter a valid 10-digit mobile number"
                            placeholder="9876543210"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-muted">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12 mt-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="consent"
                              id="consent"
                              required
                              checked={formData.consent}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label text-muted" htmlFor="consent">
                              I agree to the <Link href="/terms">Terms & Conditions</Link> and consent to fetch my credit information.
                            </label>
                          </div>
                        </div>
                        <div className="col-12 mt-4">
                          <button
                            className="btn btn-primary w-100 py-3"
                            type="submit"
                            disabled={loading || !formData.consent}
                          >
                            {loading ? "Fetching Score..." : "Check Score Now"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-5 animated fadeIn">
                    <h3 className="mb-4">Your CIBIL Score</h3>
                    <div className="mb-4">
                      <h1 className={`display-1 fw-bold ${getScoreColorClass(score)}`} style={{ fontSize: "6rem" }}>
                        {score}
                      </h1>
                      <p className="text-muted">out of 900</p>
                    </div>
                    <h4 className="mb-3">{getScoreMessage(score)}</h4>
                    <p className="text-muted mb-4">Based on your credit history, you have a solid foundation.</p>
                    <button
                      className="btn btn-outline-primary py-2 px-4 me-3"
                      onClick={() => setScore(null)}
                    >
                      Check Another
                    </button>
                    <Link href="/loans" className="btn btn-primary py-2 px-4">
                      Explore Loans
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <div className="h-100 bg-white p-5 border border-light rounded shadow-sm">
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="btn-lg-square bg-primary rounded-circle me-3">
                      <i className="fa fa-shield-alt text-white"></i>
                    </div>
                    <h3 className="mb-0">100% Safe & Secure</h3>
                  </div>
                  <p className="text-muted mb-4">
                    Your data is protected with bank-level security. Checking your own credit score counts as a "soft inquiry" and does not lower your score.
                  </p>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3"><i className="fa fa-check text-primary me-3"></i>No impact on credit score</li>
                    <li className="mb-3"><i className="fa fa-check text-primary me-3"></i>Bank-level 256-bit encryption</li>
                    <li className="mb-3"><i className="fa fa-check text-primary me-3"></i>Detailed credit health report</li>
                    <li><i className="fa fa-check text-primary me-3"></i>Personalized loan offers based on score</li>
                  </ul>
                </div>

                <hr className="my-5" />

                <div>
                  <h4 className="mb-4">Why check your CIBIL score?</h4>
                  <div className="d-flex mb-4">
                    <div className="btn-sm-square bg-light rounded-circle text-primary me-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5>Better Loan Approvals</h5>
                      <p className="text-muted mb-0">A score above 750 significantly increases your chances of fast loan approvals.</p>
                    </div>
                  </div>
                  <div className="d-flex mb-4">
                    <div className="btn-sm-square bg-light rounded-circle text-primary me-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5>Lower Interest Rates</h5>
                      <p className="text-muted mb-0">Banks offer lower interest rates to individuals with excellent credit scores.</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="btn-sm-square bg-light rounded-circle text-primary me-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5>Financial Discipline</h5>
                      <p className="text-muted mb-0">Regularly checking your score helps you maintain healthy financial habits.</p>
                    </div>
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
