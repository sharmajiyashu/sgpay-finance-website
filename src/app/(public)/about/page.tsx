"use client";

import React from "react";

export default function AboutPage() {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">About Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a className="text-dark" href="/">Home</a></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">About</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 align-items-end mb-4">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <img className="img-fluid rounded" src="/img/about.png" alt="About" />
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">About Us</p>
              <h1 className="display-5 mb-4">We Guide You Towards Lasting Financial Success</h1>
              <p className="mb-4">
                At Finanza, we combine deep financial expertise with personalized credit and investment options. Whether you are expanding a business, purchasing a home, or securing your family's future, our comprehensive financial suites support your journey every step of the way.
              </p>
              <div className="border rounded p-4">
                <nav>
                  <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                    <button className="nav-link fw-semi-bold active" id="nav-story-tab" data-bs-toggle="tab" data-bs-target="#nav-story" type="button" role="tab" aria-controls="nav-story" aria-selected="true">Story</button>
                    <button className="nav-link fw-semi-bold" id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission" type="button" role="tab" aria-controls="nav-mission" aria-selected="false">Mission</button>
                    <button className="nav-link fw-semi-bold" id="nav-vision-tab" data-bs-toggle="tab" data-bs-target="#nav-vision" type="button" role="tab" aria-controls="nav-vision" aria-selected="false">Vision</button>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-story" role="tabpanel" aria-labelledby="nav-story-tab">
                    <p>Established with a vision to democratize financial resources, Finanza has grown into a trusted advisory and lending platform. We have empowered thousands of families and businesses by bridging the gap between their ambitions and the capital needed to realize them.</p>
                    <p className="mb-0">Our history is defined by customer satisfaction, transparent rates, and tailored planning designed to adapt to an evolving economic landscape.</p>
                  </div>
                  <div className="tab-pane fade" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                    <p>Our mission is to provide accessible, transparent, and highly reliable financial solutions. We strive to offer competitive loan products, secure savings instruments, and specialized consulting to foster financial inclusion and robust wealth creation.</p>
                    <p className="mb-0">We focus on leveraging modern financial technology while preserving dedicated personal care to guide our clients towards sustainable prosperity.</p>
                  </div>
                  <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                    <p>To be the premier financial partner recognized for integrity, customer-centric services, and innovative credit-investment pathways. We envision a financially secure community where individuals and enterprises have immediate access to customized funding.</p>
                    <p className="mb-0">Through continuous improvement and data-driven solutions, we aim to redefine retail banking and asset-management standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded p-4 wow fadeInUp" data-wow-delay="0.1s">
            <div className="row g-4">
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.1s">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-times text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>No Hidden Costs</h4>
                      <span>Complete transparency with clear fee schedules and zero hidden surprises.</span>
                    </div>
                    <div className="border-end d-none d-lg-block"></div>
                  </div>
                  <div className="border-bottom mt-4 d-block d-lg-none"></div>
                </div>
              </div>
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-users text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>Dedicated Experts</h4>
                      <span>Access certified financial advisors and credit specialists for customized guidance.</span>
                    </div>
                    <div className="border-end d-none d-lg-block"></div>
                  </div>
                  <div className="border-bottom mt-4 d-block d-lg-none"></div>
                </div>
              </div>
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.5s">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-phone text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>24/7 Support</h4>
                      <span>Our digital channels and helpdesk are open around the clock to address queries.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}
    </>
  );
}
