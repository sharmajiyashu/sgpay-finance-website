"use client";

import React, { useState } from "react";
import { submitPublicEnquiry } from "@/lib/publicEnquiryService";
import { buildEnquiryPayload } from "@/lib/enquiryCatalog";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitPublicEnquiry(
        buildEnquiryPayload("contact", "contact", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          pageUrl: "/contact",
          message: formData.message.trim(),
        })
      );
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Contact</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a className="text-dark" href="/">Home</a></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Contact</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Contact Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Column: Contact Info Details */}
            <div className="col-lg-5">
              <span className="d-inline-block border border-primary text-primary px-3 py-1 rounded-pill mb-3 fw-bold" style={{ fontSize: "14px" }}>
                Contact Details
              </span>
              <h1 className="display-6 mb-4 fw-bold text-dark">We are here to help you</h1>
              <p className="text-muted mb-4">
                Have questions about our financial products or need consultation? Get in touch with our team.
              </p>

              {/* Detail Items */}
              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-map-marker-alt text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Office Address</span>
                  <span className="text-muted small">112/76 Kumbha Marg, Pratap Nagar, Jaipur, RJ 302033</span>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-phone-alt text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Phone Support</span>
                  <span className="text-muted small">+91 98765 43210 / 1800-123-456</span>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-envelope text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Email Address</span>
                  <span className="text-muted small">support@finanza.com</span>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-clock text-primary me-3 fa-lg" style={{ width: "24px" }}></i>
                <div>
                  <span className="text-dark fw-bold d-block">Business Hours</span>
                  <span className="text-muted small">Monday - Saturday: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Form */}
            <div className="col-lg-7">
              <div className="card shadow-sm border rounded-4 p-4 p-md-5 bg-white">
                <h4 className="fw-bold text-dark mb-4">Send Us A Message</h4>
                {submitted && (
                  <div className="alert alert-success mb-4">
                    Thank you! Your enquiry has been submitted successfully.
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger mb-4">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label small fw-bold text-secondary">Your Name</label>
                      <input
                        type="text"
                        className="form-control border py-3"
                        id="name"
                        placeholder="Enter your name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label small fw-bold text-secondary">Your Email</label>
                      <input
                        type="email"
                        className="form-control border py-3"
                        id="email"
                        placeholder="name@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="subject" className="form-label small fw-bold text-secondary">Subject</label>
                      <input
                        type="text"
                        className="form-control border py-3"
                        id="subject"
                        placeholder="What is this about?"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label small fw-bold text-secondary">Message</label>
                      <textarea
                        className="form-control border py-3"
                        id="message"
                        rows={4}
                        placeholder="Leave your message here..."
                        required
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      />
                    </div>
                    <div className="col-12 pt-2">
                      <button
                        className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Map Row */}
          <div className="row mt-5">
            <div className="col-12 wow fadeIn" data-wow-delay="0.5s">
              <div className="rounded-4 overflow-hidden shadow-sm border" style={{ height: "350px" }}>
                <iframe
                  className="w-100 h-100"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14245.241911080966!2d75.82427032936094!3d26.79824096599677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc994025090cd%3A0x32dc61064816df1f!2s112%2F76%2C%20near%20Dispensary%2C%20Kumbha%20Marg%2C%20Sanganer%2C%20Sector%2011%2C%20Pratap%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302033!5e0!3m2!1sen!2sin!4v1784268722674!5m2!1sen!2sin"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </>
  );
}
