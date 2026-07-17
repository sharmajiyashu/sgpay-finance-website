"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/lib/constants";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Set document title
    document.title = `${APP_CONFIG.appName} - Financial Services Website Template`;

    // Hide spinner
    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.classList.remove("show");
    }

    // Scroll listener for sticky navbar
    const handleScroll = () => {
      if (window.scrollY > 45) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Re-initialize WOW animations whenever route changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).WOW) {
      try {
        new (window as any).WOW().init();
      } catch (e) {
        console.error("WOW initialization failed:", e);
      }
    }
  }, [pathname]);

  return (
    <div className="public-template">
      {/* Dynamic Link stylesheets */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@500;600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet" />  
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
      <link href="/lib/animate/animate.min.css" rel="stylesheet" />
      <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
      <link href="/css/bootstrap.min.css" rel="stylesheet" />
      <link href="/css/style.css" rel="stylesheet" />

      {/* Navbar Start */}
      <div 
        className={`container-fluid fixed-top px-0 wow fadeIn ${scrolled ? "bg-white shadow" : ""}`} 
        style={{ 
          transition: "0.5s", 
          top: scrolled ? "-45px" : "0px"
        }}
        data-wow-delay="0.1s"
      >
        <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
          <div className="col-lg-6 px-5 text-start">
            <small><i className="fa fa-map-marker-alt text-primary me-2"></i>{APP_CONFIG.address.split(",").slice(0, 5).join(",")}</small>
            <small style={{ marginLeft: "1.5rem" }}><i className="fa fa-clock text-primary me-2"></i>{APP_CONFIG.workingHours}</small>
          </div>
          <div className="col-lg-6 px-5 text-end">
            <small><i className="fa fa-envelope text-primary me-2"></i>{APP_CONFIG.email}</small>
            <small style={{ marginLeft: "1.5rem" }}><i className="fa fa-phone-alt text-primary me-2"></i>{APP_CONFIG.phone}</small>
          </div>
        </div>

        <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
          <Link href="/" className="navbar-brand ms-4 ms-lg-0 d-flex align-items-center">
            <img src="/img/logo.png" alt={APP_CONFIG.appName} style={{ height: "55px", objectFit: "contain" }} />
          </Link>
          <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0">
              <Link href="/" className={`nav-item nav-link ${pathname === "/" ? "active" : ""}`}>Home</Link>
              <Link href="/about" className={`nav-item nav-link ${pathname === "/about" ? "active" : ""}`}>About</Link>
              
              {/* Loans Dropdown */}
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Loans</a>
                <div className="dropdown-menu border-0 shadow-sm m-0">
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

              {/* Finance Dropdown */}
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Finance</a>
                <div className="dropdown-menu border-0 shadow-sm m-0">
                  <Link href="/finance/credit-card" className="dropdown-item">Credit Card</Link>
                  <Link href="/finance/insurance" className="dropdown-item">Insurance</Link>
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

              {/* Accounts Dropdown */}
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Accounts</a>
                <div className="dropdown-menu border-0 shadow-sm m-0">
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
              <Link href="/contact" className={`nav-item nav-link ${pathname === "/contact" ? "active" : ""}`}>Contact</Link>
            </div>
            <div className="d-none d-lg-flex ms-2">
              <a className="btn btn-light btn-sm-square rounded-circle ms-3" href={APP_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer">
                <small className="fab fa-facebook-f text-primary"></small>
              </a>
              <a className="btn btn-light btn-sm-square rounded-circle ms-3" href={APP_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer">
                <small className="fab fa-twitter text-primary"></small>
              </a>
              <a className="btn btn-light btn-sm-square rounded-circle ms-3" href={APP_CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer">
                <small className="fab fa-linkedin-in text-primary"></small>
              </a>
            </div>
          </div>
        </nav>
      </div>
      {/* Navbar End */}

      {children}

      {/* Footer Start */}
      <div className="container-fluid bg-dark text-light footer mt-5 py-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center mb-4">
                <img src="/img/logo.png" alt={APP_CONFIG.appName} style={{ height: "80px", objectFit: "contain" }} />
              </div>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>{APP_CONFIG.address}</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>{APP_CONFIG.phoneRaw}</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>{APP_CONFIG.email}</p>
              <div className="d-flex pt-2">
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href={APP_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href={APP_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href={APP_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href={APP_CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Services</h4>
              <Link className="btn btn-link" href="/service">Financial Planning</Link>
              <Link className="btn btn-link" href="/service">Cash Investment</Link>
              <Link className="btn btn-link" href="/service">Financial Consultancy</Link>
              <Link className="btn btn-link" href="/service">Business Loans</Link>
              <Link className="btn btn-link" href="/service">Business Analysis</Link>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Quick Links</h4>
              <Link className="btn btn-link" href="/about">About Us</Link>
              <Link className="btn btn-link" href="/contact">Contact Us</Link>
              <Link className="btn btn-link" href="/faq">FAQs</Link>
              <Link className="btn btn-link" href="/privacy">Privacy Policy</Link>
              <Link className="btn btn-link" href="/terms">Terms & Condition</Link>
              <Link className="btn btn-link" href="/emi-calculator">EMI Calculator</Link>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Newsletter</h4>
              <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
              <div className="position-relative w-100">
                <input className="form-control bg-white border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Copyright Start */}
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="#">{APP_CONFIG.appName}</a>, All Right Reserved.
            </div>
            <div className="col-md-6 text-center text-md-end">
              Designed By <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}

      {/* Script imports using Next.js Script for correct load order */}
      <Script src="https://code.jquery.com/jquery-3.4.1.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <Script src="/lib/wow/wow.min.js" strategy="beforeInteractive" onReady={() => {
        if (typeof window !== "undefined" && (window as any).WOW) {
          try {
            new (window as any).WOW().init();
          } catch (e) {
            console.error("WOW onReady init failed:", e);
          }
        }
      }} />
      <Script src="/lib/easing/easing.min.js" strategy="beforeInteractive" />
      <Script src="/lib/waypoints/waypoints.min.js" strategy="beforeInteractive" />
      <Script src="/lib/owlcarousel/owl.carousel.min.js" strategy="beforeInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </div>
  );
}
