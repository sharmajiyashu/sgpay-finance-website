"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { FINANCE_SERVICES } from "@/data/servicesData";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { submitPublicEnquiry } from "@/lib/publicEnquiryService";
import { buildEnquiryPayload } from "@/lib/enquiryCatalog";
import { CreditCardPartners } from "@/components/CreditCardPartners";
const ChoiceCreditCardWidget = dynamic(
  () =>
    import("@/components/choice-connect/ChoiceConnectWebsiteApply").then(
      (mod) => mod.ChoiceConnectWebsiteApply
    ),
  { ssr: false }
);

export default function FinanceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = FINANCE_SERVICES.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  // Lead Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      await submitPublicEnquiry(
        buildEnquiryPayload("finance", slug, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          pageUrl: `/finance/${slug}`,
          message: formData.message.trim() || `Enquiry for ${service.title}`,
        })
      );
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
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
          <h1 className="display-4 mb-3">{service.title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link className="text-dark" href="/service">Services</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">{service.title}</li>
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
            <div className={slug === "credit-card" ? "col-lg-12 wow fadeInUp" : "col-lg-7 wow fadeInUp"} data-wow-delay="0.1s">
              <div className="mb-5">
                <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Finance Services</p>
                <h2 className="display-6 mb-4">Secure & Optimize Your Financial Assets</h2>
                <p className="lead text-dark mb-4">{service.overview}</p>
              </div>

              {/* Features & Benefits */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-star me-2"></i>Key Features</h5>
                    <ul className="list-unstyled mb-0">
                      {service.features.map((feature, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-check text-primary me-2"></i>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h-100 p-4 border rounded bg-light">
                    <h5 className="mb-3 text-primary"><i className="fa fa-gift me-2"></i>Key Benefits</h5>
                    <ul className="list-unstyled mb-0">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="mb-2 text-dark"><i className="fa fa-arrow-right text-primary me-2"></i>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eligibility & Documents */}
              <div className="border rounded p-4 mb-5">
                <h4 className="mb-4 text-primary border-bottom pb-2">Onboarding & Qualification Guidelines</h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-user-check text-primary me-2"></i>Who Can Apply</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {service.eligibility.map((el, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{el}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-semi-bold text-dark"><i className="fa fa-file-invoice text-primary me-2"></i>Documents Needed</h6>
                    <ul className="list-unstyled mt-2 mb-0">
                      {service.documents.map((doc, i) => (
                        <li key={i} className="small mb-2 text-muted"><i className="fa fa-circle text-primary me-2" style={{ fontSize: "8px" }}></i>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div>
                  <h4 className="mb-4">Frequently Asked Questions</h4>
                  <div className="accordion" id="faqAccordion">
                    {service.faqs.map((faq, i) => (
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
              )}
            </div>

            {/* Right Application Form Sidebar */}
            {slug !== "credit-card" && (
              <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
                <div className="position-sticky bg-light p-4 rounded border" style={{ top: "100px" }}>
                  <h4 className="mb-3 text-center">Inquire / Consult</h4>
                  <p className="text-muted text-center small mb-4">Request a consultation with our financial advisory team regarding {service.title}.</p>

                  {submitted ? (
                    <div className="alert alert-success text-center py-4" role="alert">
                      <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
                      <h5 className="alert-heading">Inquiry Submitted!</h5>
                      <p className="small mb-0">Thank you. An advisor will review your profile and reach out within 24 hours.</p>
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
                      <div className="mb-4">
                        <label htmlFor="message" className="form-label small fw-medium">Message / Detail Requirement</label>
                        <textarea
                          className="form-control"
                          id="message"
                          rows={4}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please describe your financial goals or questions..."
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary w-100 py-3">Submit Consultation Request</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Partner credit cards (e.g. Roar Credit Card) + Choice Connect widget */}
          {slug === "credit-card" && (
            <>
              <CreditCardPartners />
              <div className="row mt-2 wow fadeInUp" data-wow-delay="0.5s">
                <div className="col-12">
                  <div className="bg-light p-4 rounded border">
                    <h4 className="mb-3 text-center">Apply for Credit Card</h4>
                    <p className="text-muted text-center small mb-4">
                      Complete your application securely via Choice Connect.
                    </p>
                    <ChoiceCreditCardWidget />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Main Details End */}
    </>
  );
}
