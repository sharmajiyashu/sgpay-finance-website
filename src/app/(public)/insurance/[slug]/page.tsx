"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { INSURANCE_SERVICES } from "@/data/servicesData";
import { notFound } from "next/navigation";

export default function InsuranceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const plan = INSURANCE_SERVICES.find((item) => item.slug === slug);

  if (!plan) {
    notFound();
  }

  // Insurance Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    nominee: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", age: "", nominee: "" });
  };

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">{plan.title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link className="text-dark" href="/insurance">Insurance</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">{plan.title}</li>
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
                <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Secure Tomorrow</p>
                <h2 className="display-6 mb-4">Protect Your Future Digitally</h2>
                <p className="lead text-dark mb-4">{plan.overview}</p>
              </div>

              {/* Onboarding Timeline Process */}
              {plan.process && plan.process.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-4 text-primary"><i className="fa fa-route me-2"></i>How to Onboard & Apply</h4>
                  <div className="row g-3">
                    {plan.process.map((step, i) => (
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
                      {plan.features.map((feature, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-check text-primary me-2"></i>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-gift me-2"></i>Benefits</h5>
                    <ul className="list-unstyled mb-0">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-arrow-right text-primary me-2"></i>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eligibility & Documents */}
              <div className="border rounded p-4 mb-5">
                <h4 className="mb-4 text-primary border-bottom pb-2">Eligibility & Documentation</h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-user-check text-primary me-2"></i>Eligibility</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {plan.eligibility.map((el, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{el}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-file-invoice text-primary me-2"></i>Documents Required</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {plan.documents.map((doc, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h4 className="mb-4 text-primary"><i className="fa fa-question-circle me-2"></i>Frequently Asked Questions</h4>
                <div className="accordion" id="faqAccordion">
                  {plan.faqs.map((faq, i) => (
                    <div className="accordion-item border rounded mb-2" key={i}>
                      <h2 className="accordion-header" id={`heading${i}`}>
                        <button className="accordion-button collapsed fw-semi-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${i}`} aria-expanded="false" aria-controls={`collapse${i}`}>
                          {faq.q}
                        </button>
                      </h2>
                      <div id={`collapse${i}`} className="accordion-collapse collapse" aria-labelledby={`heading${i}`} data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-muted small">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-light p-5 rounded shadow-sm border position-sticky" style={{ top: "100px" }}>
                <h3 className="mb-4 text-dark text-center">Get a Quick Quote</h3>
                {submitted ? (
                  <div className="alert alert-success text-center py-4">
                    <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
                    <h5>Application Submitted!</h5>
                    <p className="mb-0 text-muted small mt-2">Our insurance underwriters will call you within 15 minutes to finalize your premium details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <label>Full Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <label>Email Address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <label>Mobile Number</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Age of Primary Insured"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                      <label>Age of Insured</label>
                    </div>
                    <div className="form-floating mb-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nominee Full Name"
                        required
                        value={formData.nominee}
                        onChange={(e) => setFormData({ ...formData, nominee: e.target.value })}
                      />
                      <label>Nominee Name</label>
                    </div>
                    <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" type="submit">
                      Calculate Premium &rarr;
                    </button>
                  </form>
                )}
                <div className="text-center mt-4">
                  <span className="text-muted small"><i className="fa fa-lock text-primary me-2"></i>256-Bit Encrypted Secure Form</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Details End */}
    </>
  );
}
