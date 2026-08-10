"use client";

import { CREDIT_CARD_PARTNERS, type CreditCardPartner } from "@/lib/config/creditCards";

function PartnerCard({ card }: { card: CreditCardPartner }) {
  return (
    <div className="border rounded bg-white p-4 p-md-5 h-100">
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3 mb-2">
            Partner Offer
          </p>
          <h3 className="h4 mb-1 text-dark">{card.name}</h3>
          <p className="text-muted small mb-0">{card.bank}</p>
        </div>
        <a
          href={card.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary px-4 py-2"
        >
          Apply Now <i className="fa fa-external-link-alt ms-2" aria-hidden="true" />
        </a>
      </div>

      <p className="text-dark mb-3">{card.overview}</p>

      {card.highlights && card.highlights.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {card.highlights.map((item) => (
            <span
              key={item}
              className="border rounded text-primary small fw-medium py-1 px-2 bg-light"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <h5 className="mb-3 text-primary">
            <i className="fa fa-star me-2" aria-hidden="true" />
            Key Features
          </h5>
          <ul className="list-unstyled mb-0">
            {card.features.map((feature) => (
              <li key={feature} className="mb-2 text-dark small">
                <i className="fa fa-check text-primary me-2" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5 className="mb-3 text-primary">
            <i className="fa fa-gift me-2" aria-hidden="true" />
            Key Benefits
          </h5>
          <ul className="list-unstyled mb-0">
            {card.benefits.map((benefit) => (
              <li key={benefit} className="mb-2 text-dark small">
                <i className="fa fa-arrow-right text-primary me-2" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <h6 className="fw-semi-bold text-dark mb-2">
            <i className="fa fa-user-check text-primary me-2" aria-hidden="true" />
            Who Can Apply
          </h6>
          <ul className="list-unstyled mb-0">
            {card.eligibility.map((item) => (
              <li key={item} className="small mb-2 text-muted">
                <i
                  className="fa fa-circle text-primary me-2"
                  style={{ fontSize: "8px" }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h6 className="fw-semi-bold text-dark mb-2">
            <i className="fa fa-file-invoice text-primary me-2" aria-hidden="true" />
            Documents Needed
          </h6>
          <ul className="list-unstyled mb-0">
            {card.documents.map((doc) => (
              <li key={doc} className="small mb-2 text-muted">
                <i
                  className="fa fa-circle text-primary me-2"
                  style={{ fontSize: "8px" }}
                  aria-hidden="true"
                />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-light border rounded p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <p className="mb-1 fw-semi-bold text-dark">Ready to apply for {card.name}?</p>
          <p className="mb-0 small text-muted">
            Click below to open the secure application page and submit your details.
          </p>
        </div>
        <a
          href={card.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary px-4 py-2 flex-shrink-0"
        >
          Apply for {card.name}
        </a>
      </div>
    </div>
  );
}

export function CreditCardPartners() {
  if (CREDIT_CARD_PARTNERS.length === 0) return null;

  return (
    <div className="row mb-5 wow fadeInUp" data-wow-delay="0.2s">
      <div className="col-12">
        <div className="mb-4">
          <h3 className="h4 mb-2">Featured Credit Cards</h3>
          <p className="text-muted mb-0">
            Explore partner bank credit cards and apply online in a few steps.
          </p>
        </div>
        <div className="row g-4">
          {CREDIT_CARD_PARTNERS.map((card) => (
            <div key={card.id} className="col-12">
              <PartnerCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
