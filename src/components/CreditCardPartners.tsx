"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CREDIT_CARD_PARTNERS,
  ROAR_CREDIT_CARD,
  type CreditCardPartner,
} from "@/lib/config/creditCards";
import { submitPublicEnquiry } from "@/lib/publicEnquiryService";
import { buildEnquiryPayload } from "@/lib/enquiryCatalog";

type ApplyFormState = {
  name: string;
  phone: string;
  email: string;
};

const EMPTY_FORM: ApplyFormState = { name: "", phone: "", email: "" };

function PartnerApplyModal({
  card,
  open,
  onClose,
  roarRef,
}: {
  card: CreditCardPartner;
  open: boolean;
  onClose: () => void;
  roarRef?: string;
}) {
  const titleId = useId();
  const [form, setForm] = useState<ApplyFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setError(null);
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const name = form.name.trim();
    const phoneDigits = form.phone.trim();
    const phone = phoneDigits.startsWith("+91") ? phoneDigits : `+91${phoneDigits}`;
    const email = form.email.trim();

    try {
      await submitPublicEnquiry(
        buildEnquiryPayload("finance", card.id, {
          name,
          email,
          phone,
          subject: `${card.name} enquiry`,
          pageUrl: `/finance/credit-card`,
          message: `${card.name} apply enquiry — redirected to partner application link.`,
          metadata: {
            partnerId: card.id,
            partnerName: card.name,
            bank: card.bank,
            applyUrl: card.applyUrl,
            ...(roarRef ? { roarRef } : {}),
          },
        })
      );

      // Partner page cannot be autofilled from our site (cross-origin).
      // Save lead here, then open their form so the user can continue.
      window.open(card.applyUrl, "_blank", "noopener,noreferrer");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ zIndex: 1080, background: "rgba(15, 23, 42, 0.55)" }}
      role="presentation"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="bg-white rounded border shadow-lg w-100"
        style={{ maxWidth: 480 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-start justify-content-between gap-3 border-bottom px-4 py-3">
          <div>
            {card.id === ROAR_CREDIT_CARD.id ? (
              <span className="d-inline-block rounded-pill bg-primary text-white small fw-semibold px-2 py-1 mb-2">
                Roar Bank
              </span>
            ) : null}
            <h4 id={titleId} className="h5 mb-1 text-dark">
              {card.id === ROAR_CREDIT_CARD.id
                ? "Apply for Roar Bank Credit Card"
                : `Apply for ${card.name}`}
            </h4>
            <p className="small text-muted mb-0">
              {card.id === ROAR_CREDIT_CARD.id
                ? "This is the Roar Bank application. Enter your details, then continue to the official apply form."
                : "Enter your details. We will save your enquiry and open the bank application form."}
            </p>
            {roarRef ? (
              <p className="small text-primary fw-medium mb-0 mt-2">
                You opened a staff referral link for Roar Bank.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light border"
            aria-label="Close"
            disabled={loading}
            onClick={onClose}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4">
          <div className="mb-3">
            <label htmlFor={`${card.id}-name`} className="form-label small fw-medium">
              Your Name <span className="text-danger">*</span>
            </label>
            <input
              id={`${card.id}-name`}
              type="text"
              className="form-control"
              required
              autoFocus
              autoComplete="name"
              placeholder="Eg: Ankush Singh"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor={`${card.id}-phone`} className="form-label small fw-medium">
              Your Phone Number <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">+91</span>
              <input
                id={`${card.id}-phone`}
                type="tel"
                className="form-control"
                required
                inputMode="numeric"
                autoComplete="tel-national"
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian mobile number"
                placeholder="900 000 0000"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
                disabled={loading}
              />
            </div>
            <p className="form-text small mb-0">
              We may contact you on this number about your {card.name} application.
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor={`${card.id}-email`} className="form-label small fw-medium">
              Your Email ID <span className="text-danger">*</span>
            </label>
            <input
              id={`${card.id}-email`}
              type="email"
              className="form-control"
              required
              autoComplete="email"
              placeholder="Eg: username@gmail.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <div className="d-flex flex-column flex-sm-row gap-2">
            <button
              type="button"
              className="btn btn-light border"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving…
                </>
              ) : (
                <>
                  Continue to Apply <i className="fa fa-external-link-alt ms-2" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PartnerCard({
  card,
  roarRef,
  autoOpen,
}: {
  card: CreditCardPartner;
  roarRef?: string;
  autoOpen?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const openedOnce = useRef(false);
  const isRoar = card.id === ROAR_CREDIT_CARD.id;

  useEffect(() => {
    if (!autoOpen || openedOnce.current) return;
    openedOnce.current = true;
    setModalOpen(true);
    const timer = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [autoOpen]);

  return (
    <>
      <div
        ref={sectionRef}
        id={isRoar ? "roar-bank" : undefined}
        className={`border rounded bg-white p-4 p-md-5 h-100 ${autoOpen ? "border-primary shadow-sm" : ""}`}
      >
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
          <div>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3 mb-2">
              {isRoar ? "Roar Bank" : "Partner Offer"}
            </p>
            <h3 className="h4 mb-1 text-dark">{card.name}</h3>
            <p className="text-muted small mb-0">{card.bank}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary px-4 py-2"
            onClick={() => setModalOpen(true)}
          >
            Apply Now
          </button>
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
              Share your details first — we save the enquiry, then open the bank apply form.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary px-4 py-2 flex-shrink-0"
            onClick={() => setModalOpen(true)}
          >
            Apply for {card.name}
          </button>
        </div>
      </div>

      <PartnerApplyModal
        card={card}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        roarRef={roarRef}
      />
    </>
  );
}

export function CreditCardPartners() {
  const searchParams = useSearchParams();
  const roarRef = searchParams.get("roarRef")?.trim() || undefined;

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
              <PartnerCard
                card={card}
                roarRef={roarRef}
                autoOpen={Boolean(roarRef) && card.id === ROAR_CREDIT_CARD.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
