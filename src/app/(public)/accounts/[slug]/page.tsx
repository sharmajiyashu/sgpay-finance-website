"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { ACCOUNT_SERVICES } from "@/data/servicesData";
import { notFound } from "next/navigation";

export default function AccountDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const account = ACCOUNT_SERVICES.find((item) => item.slug === slug);

  if (!account) {
    notFound();
  }

  // Onboarding Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    aadhaar: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", pan: "", aadhaar: "" });
  };

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">{account.title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link className="text-dark" href="/service">Services</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">{account.title}</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Hero Header End */}

      {/* Main Details Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Content Column */}
            <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.1s">
              <div className="mb-5">
                <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Account Opening</p>
                <h2 className="display-6 mb-4">Start Your Banking Journey Digitally</h2>
                <p className="lead text-dark mb-4">{account.overview}</p>
              </div>

              {/* Onboarding Timeline Process */}
              {account.process && account.process.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-4 text-primary"><i className="fa fa-route me-2"></i>Account Opening Process</h4>
                  <div className="row g-3">
                    {account.process.map((step, i) => (
                      <div className="col-12" key={i}>
                        <div className="d-flex align-items-start p-3 border rounded bg-light">
                          <span className="badge bg-primary text-white rounded-circle p-2 me-3" style={{ width: "30px", height: "30px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            {i + 1}
                          </span>
                          <div>
                            <p className="mb-0 text-dark font-weight-bold" style={{ fontSize: "0.95rem" }}>{step}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features & Benefits */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-star me-2"></i>Features</h5>
                    <ul className="list-unstyled mb-0">
                      {account.features.map((feature, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-check text-primary me-2"></i>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-gift me-2"></i>Benefits</h5>
                    <ul className="list-unstyled mb-0">
                      {account.benefits.map((benefit, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-arrow-right text-primary me-2"></i>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eligibility & Documents */}
              <div className="border rounded p-4 mb-5">
                <h4 className="mb-4 text-primary border-bottom pb-2">Requirement Checklist</h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-user-check text-primary me-2"></i>Eligibility Criteria</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {account.eligibility.map((el, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{el}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-file-invoice text-primary me-2"></i>KYC Documents Required</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {account.documents.map((doc, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              {account.faqs && account.faqs.length > 0 && (
                <div>
                  <h4 className="mb-4">Frequently Asked Questions</h4>
                  <div className="accordion" id="faqAccordion">
                    {account.faqs.map((faq, i) => (
                      <div className="accordion-item mb-2 border rounded" key={i}>
                        <h2 className="accordion-header" id={`heading-${i}`}>
                          <button
                            className="accordion-button collapsed fw-medium text-dark py-3"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${i}`}
                            aria-expanded="false"
                            aria-controls={`collapse-${i}`}
                          >
                            {faq.q}
                          </button>
                        </h2>
                        <div
                          id={`collapse-${i}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading-${i}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body text-muted small bg-light">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Application Form Sidebar */}
            <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
              <div className="position-sticky bg-light p-4 rounded border" style={{ top: "100px" }}>
                <h4 className="mb-3 text-center">Open Account Online</h4>
                <p className="text-muted text-center small mb-4">Complete your paperless Video KYC registration form to open your account instantly.</p>

                {submitted ? (
                  <div className="alert alert-success text-center py-4" role="alert">
                    <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
                    <h5 className="alert-heading">Registration Submitted!</h5>
                    <p className="small mb-0">Your temporary reference ID has been generated. Our executive will reach out to schedule your online Video-KYC verification.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label small fw-medium">Full Name (As per Aadhaar)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label small fw-medium">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label small fw-medium">Mobile Number (Aadhaar linked)</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98871 XXXXX"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="pan" className="form-label small fw-medium">PAN Card Number</label>
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        id="pan"
                        required
                        value={formData.pan}
                        onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="aadhaar" className="form-label small fw-medium">Aadhaar Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="aadhaar"
                        required
                        value={formData.aadhaar}
                        onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                        maxLength={12}
                        placeholder="1234 5678 9012"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-3">Submit & Start Video KYC</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Details End */}
    </>
  );
}
