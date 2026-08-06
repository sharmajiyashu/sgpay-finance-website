"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { LOAN_PRODUCTS } from "@/data/servicesData";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { submitPublicEnquiry } from "@/lib/publicEnquiryService";
import { buildEnquiryPayload } from "@/lib/enquiryCatalog";

export default function LoanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const loan = LOAN_PRODUCTS.find((item) => item.slug === slug);

  if (!loan) {
    notFound();
  }

  // Lead Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const amountLine = formData.amount ? `Required amount: ₹${formData.amount}. ` : "";
      await submitPublicEnquiry(
        buildEnquiryPayload("loans", slug, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          pageUrl: `/loans/${slug}`,
          message: `${amountLine}${formData.message.trim() || `Enquiry for ${loan.title}`}`,
        })
      );
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", amount: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">{loan.title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link className="text-dark" href="/loans">Loans</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">{loan.title}</li>
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
                <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Overview</p>
                <h2 className="display-6 mb-4">Flexible Financing Mapped To Your Needs</h2>
                <p className="lead text-dark mb-4">{loan.overview}</p>
              </div>

              {/* Features & Benefits */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-star me-2"></i>Key Features</h5>
                    <ul className="list-unstyled mb-0">
                      {loan.features.map((feature, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-check text-primary me-2"></i>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-gift me-2"></i>Product Benefits</h5>
                    <ul className="list-unstyled mb-0">
                      {loan.benefits.map((benefit, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-arrow-right text-primary me-2"></i>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eligibility & Documents */}
              <div className="border rounded p-4 mb-5">
                <h4 className="mb-4 text-primary border-bottom pb-2">Eligibility & Documentation Checklist</h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-user-check text-primary me-2"></i>Eligibility Criteria</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {loan.eligibility.map((el, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{el}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-file-invoice text-primary me-2"></i>Documents Required</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {loan.documents.map((doc, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Rates, Processing & EMI Example */}
              <div className="row g-4 mb-5 text-center">
                {loan.interestRate && (
                  <div className="col-sm-4">
                    <div className="p-3 border rounded">
                      <h6 className="text-muted mb-1">Interest Rate</h6>
                      <h4 className="text-primary mb-0">{loan.interestRate}</h4>
                    </div>
                  </div>
                )}
                {loan.processingTime && (
                  <div className="col-sm-4">
                    <div className="p-3 border rounded">
                      <h6 className="text-muted mb-1">Processing Time</h6>
                      <h4 className="text-primary mb-0">{loan.processingTime}</h4>
                    </div>
                  </div>
                )}
                {loan.emiExample && (
                  <div className="col-sm-4">
                    <div className="p-3 border rounded">
                      <h6 className="text-muted mb-1">EMI Benchmark</h6>
                      <h6 className="text-primary mb-0" style={{ fontSize: "0.85rem" }}>{loan.emiExample}</h6>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Accordion */}
              <div>
                <h4 className="mb-4">Frequently Asked Questions</h4>
                <div className="accordion" id="faqAccordion">
                  {loan.faqs.map((faq, i) => (
                    <div className="accordion-item mb-2 border rounded" key={i}>
                      <h2 className="accordion-header" id={`heading-${i}`}>
                        <button
                          className={`accordion-button ${activeFaqIndex === i ? "" : "collapsed"} fw-medium text-dark py-3`}
                          type="button"
                          onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}
                          aria-expanded={activeFaqIndex === i ? "true" : "false"}
                          aria-controls={`collapse-${i}`}
                        >
                          {faq.q}
                        </button>
                      </h2>
                      <div
                        id={`collapse-${i}`}
                        className={`accordion-collapse collapse ${activeFaqIndex === i ? "show" : ""}`}
                        aria-labelledby={`heading-${i}`}
                      >
                        <div className="accordion-body text-muted small bg-light">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Application Form Sidebar */}
            <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
              <div className="position-sticky bg-light p-4 rounded border" style={{ top: "100px" }}>
                <h4 className="mb-3 text-center">Apply for {loan.title}</h4>
                <p className="text-muted text-center small mb-4">Submit your basic details, and our loans expert will contact you within 24 hours.</p>

                {submitted ? (
                  <div className="alert alert-success text-center py-4" role="alert">
                    <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
                    <h5 className="alert-heading">Application Submitted!</h5>
                    <p className="small mb-0">Thank you for choosing us. We have received your query and will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label small fw-medium">Your Name</label>
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
                      <label htmlFor="phone" className="form-label small fw-medium">Phone Number</label>
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
                      <label htmlFor="amount" className="form-label small fw-medium">Required Loan Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="e.g. 500000"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label small fw-medium">Any Message / Remarks</label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Optional remarks..."
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-3">Submit Application</button>
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

