"use client";

import React, { useState } from "react";
import Link from "next/link";

const GENERAL_FAQS = [
  {
    q: "How can I apply for a loan with Sg Pay 4u?",
    a: "You can apply online by visiting the specific Loan Product detail page and filling out the instant online application form, or by contacting our team via the Contact Us page."
  },
  {
    q: "What are the key documents needed for opening an account?",
    a: "For most savings, current, and zero-balance accounts, you only need your Aadhaar Card and PAN Card. Business accounts require company registration details and active GST proofs."
  },
  {
    q: "How does the digital Video KYC work?",
    a: "Video KYC is a paperless digital verification process. Upon submitting your form, you will start a secure live video call with our representative, show your physical PAN card, and verify details online in real-time."
  },
  {
    q: "Are there any hidden platform charges for paying utility bills?",
    a: "No. Sg Pay 4u offers completely free utility bill payments and mobile/DTH recharges with zero processing fees."
  },
  {
    q: "How long does it take for loan approval?",
    a: "Gold loans are disbursed in 30-45 minutes. Personal loans are approved in 24-48 hours, while secured loans (Home/Property) may take 5 to 10 working days."
  },
  {
    q: "Is my personal data and transaction information secure?",
    a: "Absolutely. Sg Pay 4u uses high-grade SSL encryption and secure banking gateway integrations to protect your data and transactions."
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* Hero Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Frequently Asked Questions</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" href="/">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">FAQs</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Hero Header End */}

      {/* FAQs List Start */}
      <div className="container-xxl py-5">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Help Center</p>
            <h2 className="display-6 mb-4">Got Questions? We Have Answers</h2>
          </div>

          <div className="accordion wow fadeInUp" data-wow-delay="0.3s" id="faqPageAccordion">
            {GENERAL_FAQS.map((faq, i) => (
              <div className="accordion-item mb-3 border rounded" key={i}>
                <h2 className="accordion-header" id={`heading-page-${i}`}>
                  <button
                    className={`accordion-button ${activeIndex === i ? "" : "collapsed"} fw-medium text-dark py-3`}
                    type="button"
                    onClick={() => toggleAccordion(i)}
                    aria-expanded={activeIndex === i ? "true" : "false"}
                    aria-controls={`collapse-page-${i}`}
                  >
                    {faq.q}
                  </button>
                </h2>
                <div
                  id={`collapse-page-${i}`}
                  className={`accordion-collapse collapse ${activeIndex === i ? "show" : ""}`}
                  aria-labelledby={`heading-page-${i}`}
                >
                  <div className="accordion-body text-muted small bg-light">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 p-4 border rounded bg-light wow fadeInUp" data-wow-delay="0.5s">
            <h5 className="mb-3 text-dark">Still have questions?</h5>
            <p className="small text-muted mb-4">Our dedicated support representatives are ready to assist you 24/7 with any financial questions.</p>
            <Link href="/contact" className="btn btn-primary py-3 px-5">Contact Us</Link>
          </div>
        </div>
      </div>
      {/* FAQs List End */}
    </>
  );
}
