"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  SiteSettingsProvider,
  useSiteSettings,
} from "@/components/providers/SiteSettingsContext";

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isAuthStandalone =
    pathname === "/login" ||
    pathname === "/register-agent" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const siteSettings = useSiteSettings();

  useEffect(() => {
    document.title = `${siteSettings.siteName} - Loans, Insurance & Financial Solutions`;

    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.classList.remove("show");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 45);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [siteSettings.siteName]);

  useEffect(() => {
    const collapse = document.getElementById("navbarCollapse");
    const bootstrap = (window as unknown as { bootstrap?: { Collapse: { getInstance: (el: Element) => { hide: () => void } | null } } }).bootstrap;
    if (!collapse || !bootstrap || !collapse.classList.contains("show")) return;
    bootstrap.Collapse.getInstance(collapse)?.hide();
  }, [pathname]);

  useEffect(() => {
    const win = window as unknown as { WOW?: new () => { init: () => void }; __sgWowReady?: boolean };
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (win.__sgWowReady || attempts > 40) {
        window.clearInterval(timer);
        return;
      }
      if (!win.WOW) return;
      try {
        new win.WOW().init();
        win.__sgWowReady = true;
      } catch (e) {
        console.error("WOW initialization failed:", e);
      }
      window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="public-template">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@500;600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
      <link href="/lib/animate/animate.min.css" rel="stylesheet" />
      <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="/css/style.css" rel="stylesheet" />

      {!isAuthStandalone && (
        <>
          <div
            className={`container-fluid fixed-top px-0 wow fadeIn ${scrolled ? "bg-white shadow" : ""}`}
            style={{
              transition: "0.5s",
              top: "0px",
            }}
            data-wow-delay="0.1s"
          >
            <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
              <Link href="/" className="navbar-brand ms-3 ms-lg-0 d-flex align-items-center">
                <img src="/img/logo.png" alt={siteSettings.siteName} className="site-logo" />
              </Link>
              <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto p-4 p-lg-0">
                  <Link href="/" className={`nav-item nav-link ${pathname === "/" ? "active" : ""}`}>Home</Link>

                  <div className="nav-item dropdown">
                    <Link href="/projects" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Projects</Link>
                    <div className="dropdown-menu border-0 shadow-sm m-0">
                      <Link href="/projects" className="dropdown-item fw-bold text-primary border-bottom">View All Projects</Link>
                      <Link href="/projects?filter=Residential" className="dropdown-item">Residential</Link>
                      <Link href="/projects?filter=Commercial" className="dropdown-item">Commercial</Link>
                      <Link href="/projects?filter=Villa" className="dropdown-item">Villas</Link>
                      <Link href="/projects?filter=Plots" className="dropdown-item">Plots</Link>
                      <Link href="/projects?filter=Luxury Homes" className="dropdown-item">Luxury Homes</Link>
                      <Link href="/projects?filter=Farm Houses" className="dropdown-item">Farm Houses</Link>
                    </div>
                  </div>

                  <div className="nav-item dropdown">
                    <Link href="/loans" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Loans</Link>
                    <div className="dropdown-menu border-0 shadow-sm m-0">
                      <Link href="/loans" className="dropdown-item fw-bold text-primary border-bottom">View All Loans</Link>
                      <Link href="/loans/personal-loan" className="dropdown-item">Personal Loan</Link>
                      <Link href="/loans/home-loan" className="dropdown-item">Home Loan</Link>
                      <Link href="/loans/business-loan" className="dropdown-item">Business Loan</Link>
                      <Link href="/loans/education-loan" className="dropdown-item">Education Loan</Link>
                      <Link href="/loans/gold-loan" className="dropdown-item">Gold Loan</Link>
                      <Link href="/loans/vehicle-loan" className="dropdown-item">Vehicle Loan</Link>
                      <Link href="/loans/loan-against-property" className="dropdown-item">Loan Against Property</Link>
                      <Link href="/loans/msme-loan" className="dropdown-item">MSME Loan</Link>
                      <Link href="/loans/working-capital-loan" className="dropdown-item">Working Capital</Link>
                      <Link href="/loans/mortgage-loan" className="dropdown-item">Mortgage Loan</Link>
                    </div>
                  </div>

                  <div className="nav-item dropdown">
                    <Link href="/finance" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Finance</Link>
                    <div className="dropdown-menu border-0 shadow-sm m-0">
                      <Link href="/finance" className="dropdown-item fw-bold text-primary border-bottom">View All Finance</Link>
                      <Link href="/finance/credit-card" className="dropdown-item">Credit Card</Link>
                      <Link href="/finance/mutual-funds" className="dropdown-item">Mutual Funds</Link>
                      <Link href="/finance/sip-investment" className="dropdown-item">SIP Investment</Link>
                      <Link href="/finance/fixed-deposit" className="dropdown-item">Fixed Deposit</Link>
                      <Link href="/finance/financial-planning" className="dropdown-item">Financial Planning</Link>
                      <Link href="/finance/tax-saving" className="dropdown-item">Tax Saving</Link>
                      <Link href="/finance/business-finance" className="dropdown-item">Business Finance</Link>
                      <Link href="/finance/commercial-finance" className="dropdown-item">Commercial Finance</Link>
                      <Link href="/finance/equipment-finance" className="dropdown-item">Equipment Finance</Link>
                    </div>
                  </div>

                  <div className="nav-item dropdown">
                    <Link href="/insurance" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Insurance</Link>
                    <div className="dropdown-menu border-0 shadow-sm m-0">
                      <Link href="/insurance" className="dropdown-item fw-bold text-primary border-bottom">View All Insurance</Link>
                      <Link href="/insurance/health-insurance" className="dropdown-item">Health Insurance</Link>
                      <Link href="/insurance/life-insurance" className="dropdown-item">Term Life Insurance</Link>
                      <Link href="/insurance/vehicle-insurance" className="dropdown-item">Vehicle Insurance</Link>
                      <Link href="/insurance/home-insurance" className="dropdown-item">Home Insurance</Link>
                    </div>
                  </div>

                  <div className="nav-item dropdown">
                    <Link href="/accounts" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Accounts</Link>
                    <div className="dropdown-menu border-0 shadow-sm m-0">
                      <Link href="/accounts" className="dropdown-item fw-bold text-primary border-bottom">View All Accounts</Link>
                      <Link href="/accounts/savings-account" className="dropdown-item">Savings Account</Link>
                      <Link href="/accounts/current-account" className="dropdown-item">Current Account</Link>
                      <Link href="/accounts/salary-account" className="dropdown-item">Salary Account</Link>
                      <Link href="/accounts/zero-balance-account" className="dropdown-item">Zero Balance</Link>
                      <Link href="/accounts/demat-account" className="dropdown-item">Demat Account</Link>
                      <Link href="/accounts/trading-account" className="dropdown-item">Trading Account</Link>
                      <Link href="/accounts/nri-account" className="dropdown-item">NRI Account</Link>
                    </div>
                  </div>

                  <Link href="/emi-calculator" className={`nav-item nav-link ${pathname === "/emi-calculator" ? "active" : ""}`}>EMI Calculator</Link>
                  <Link href="/bill-payment" className={`nav-item nav-link ${pathname === "/bill-payment" ? "active" : ""}`}>Bill Payments</Link>
                  <Link href="/login" className={`nav-item nav-link ${pathname === "/login" ? "active" : ""}`}>Login</Link>
                  <Link href="/check-cibil" className={`nav-item nav-link text-primary fw-bold ${pathname === "/check-cibil" ? "active" : ""}`}>Check CIBIL</Link>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}

      {children}

      {!isAuthStandalone && (
        <>
          <div className="container-fluid bg-dark text-light footer mt-5 py-5">
            <div className="container py-5">
              <div className="row g-5">
                <div className="col-lg-3 col-md-6">
                  <div className="d-flex align-items-center mb-4">
                    <img src="/img/logo.png" alt={siteSettings.siteName} className="site-logo" />
                  </div>
                  <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>{siteSettings.address}</p>
                  <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>{siteSettings.phoneRaw}</p>
                  <p className="mb-2"><i className="fa fa-envelope me-3"></i>{siteSettings.email}</p>
                  <div className="d-flex pt-2">
                    {siteSettings.twitterUrl && (
                      <a className="btn btn-square btn-outline-light rounded-circle me-2" href={siteSettings.twitterUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    )}
                    {siteSettings.facebookUrl && (
                      <a className="btn btn-square btn-outline-light rounded-circle me-2" href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    )}
                    {siteSettings.youtubeUrl && (
                      <a className="btn btn-square btn-outline-light rounded-circle me-2" href={siteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                    )}
                    {siteSettings.linkedinUrl && (
                      <a className="btn btn-square btn-outline-light rounded-circle me-2" href={siteSettings.linkedinUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                    )}
                  </div>
                </div>
                <div className="col-lg-2 col-md-6">
                  <h4 className="text-white mb-4">Quick Links</h4>
                  <Link className="btn btn-link text-decoration-none" href="/about">About Us</Link>
                  <Link className="btn btn-link text-decoration-none" href="/contact">Contact Us</Link>
                  <Link className="btn btn-link text-decoration-none" href="/faq">FAQs</Link>
                  <Link className="btn btn-link text-decoration-none" href="/privacy">Privacy Policy</Link>
                  <Link className="btn btn-link text-decoration-none" href="/terms">Terms & Conditions</Link>
                  <Link className="btn btn-link text-decoration-none" href="/emi-calculator">EMI Calculator</Link>
                  <Link className="btn btn-link text-decoration-none text-primary" href="/check-cibil">Check CIBIL Score</Link>
                </div>
                <div className="col-lg-2 col-md-6">
                  <h4 className="text-white mb-4">Real Estate</h4>
                  <Link className="btn btn-link text-decoration-none" href="/projects">Projects</Link>
                  <Link className="btn btn-link text-decoration-none" href="/projects?filter=Residential">Residential</Link>
                  <Link className="btn btn-link text-decoration-none" href="/projects?filter=Commercial">Commercial</Link>
                  <Link className="btn btn-link text-decoration-none" href="/projects?filter=Plots">Plots</Link>
                </div>
                <div className="col-lg-2 col-md-6">
                  <h4 className="text-white mb-4">Our Services</h4>
                  <Link className="btn btn-link text-decoration-none" href="/loans">Loans</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance">Finance & Wealth</Link>
                  <Link className="btn btn-link text-decoration-none" href="/bill-payment">Bill Payments</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/insurance">Insurance Products</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/credit-card">Credit Cards</Link>
                  <Link className="btn btn-link text-decoration-none" href="/contact">Dealer Website</Link>
                </div>

                <div className="col-lg-3 col-md-6">
                  <h4 className="text-white mb-4">Finance & Insurance</h4>
                  <Link className="btn btn-link text-decoration-none" href="/finance/insurance">Insurance Products</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/credit-card">Credit Cards</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/mutual-funds">Mutual Funds</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/sip-investment">SIP Investments</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/fixed-deposit">Fixed Deposits</Link>
                  <Link className="btn btn-link text-decoration-none" href="/finance/tax-saving">Tax Saving Advice</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid copyright py-4">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  Copyright &copy; 2026 <span className="fw-semi-bold">{siteSettings.siteName.toUpperCase()}</span>. All Rights Reserved.
                </div>
              </div>
            </div>
          </div>

          {siteSettings.phoneRaw && (
            <a
              href={`https://wa.me/${siteSettings.phoneRaw.replace(/\D/g, "")}`}
              className="whatsapp-btn-float shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          )}

          <Script src="https://code.jquery.com/jquery-3.4.1.min.js" strategy="afterInteractive" />
          <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
          <Script src="/lib/wow/wow.min.js" strategy="afterInteractive" />
          <Script src="/lib/easing/easing.min.js" strategy="afterInteractive" />
          <Script src="/lib/waypoints/waypoints.min.js" strategy="afterInteractive" />
          <Script src="/lib/owlcarousel/owl.carousel.min.js" strategy="afterInteractive" />
          <Script src="/js/main.js" strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </SiteSettingsProvider>
  );
}
