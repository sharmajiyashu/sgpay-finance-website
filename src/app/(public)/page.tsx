"use client";

import React, { useEffect } from "react";
import { APP_CONFIG } from "@/lib/constants";

export default function HomePage() {
  useEffect(() => {
    // Dynamically trigger Bootstrap Carousel initialization to guarantee autoplay works in React
    if (typeof window !== "undefined" && (window as any).bootstrap) {
      const carouselEl = document.getElementById("header-carousel");
      if (carouselEl) {
        new (window as any).bootstrap.Carousel(carouselEl, {
          interval: 5000,
          ride: "carousel",
          wrap: true
        });
      }
    }
  }, []);

  return (
    <>
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="/img/carousel-1.jpg" alt="Carousel 1" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-8">
                      <p className="d-inline-block border border-white rounded text-primary fw-semi-bold py-1 px-3 animated slideInDown">
                        Welcome to {APP_CONFIG.appName}
                      </p>
                      <h1 className="display-1 mb-4 animated slideInDown">Your Financial Status Is Our Goal</h1>
                      <a href="" className="btn btn-primary py-3 px-5 animated slideInDown">Explore More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="/img/carousel-2.jpg" alt="Carousel 2" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <p className="d-inline-block border border-white rounded text-primary fw-semi-bold py-1 px-3 animated slideInDown">
                        Welcome to {APP_CONFIG.appName}
                      </p>
                      <h1 className="display-1 mb-4 animated slideInDown">True Financial Support For You</h1>
                      <a href="" className="btn btn-primary py-3 px-5 animated slideInDown">Explore More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}

      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 align-items-end mb-4">
            <div className="col-lg-6">
              <img className="img-fluid rounded" src="/img/about.jpg" alt="About" />
            </div>
            <div className="col-lg-6">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">About Us</p>
              <h1 className="display-5 mb-4">We Help Our Clients To Grow Their Business</h1>
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat
                ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
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
                    <p>Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.</p>
                    <p className="mb-0">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit</p>
                  </div>
                  <div className="tab-pane fade" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                    <p>Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.</p>
                    <p className="mb-0">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit</p>
                  </div>
                  <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                    <p>Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.</p>
                    <p className="mb-0">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded p-4">
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-times text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>No Hidden Cost</h4>
                      <span>Clita erat ipsum lorem sit sed stet duo justo</span>
                    </div>
                    <div className="border-end d-none d-lg-block"></div>
                  </div>
                  <div className="border-bottom mt-4 d-block d-lg-none"></div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-users text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>Dedicated Team</h4>
                      <span>Clita erat ipsum lorem sit sed stet duo justo</span>
                    </div>
                    <div className="border-end d-none d-lg-block"></div>
                  </div>
                  <div className="border-bottom mt-4 d-block d-lg-none"></div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="h-100">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="fa fa-phone text-white"></i>
                    </div>
                    <div className="ps-3">
                      <h4>24/7 Available</h4>
                      <span>Clita erat ipsum lorem sit sed stet duo justo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Service Start */}
      <div className="container-xxl service py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Services</p>
            <h1 className="display-5 mb-5">Awesome Financial Services For Business</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="nav nav-pills d-flex flex-column justify-content-between w-100 h-100">
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4 active" data-bs-toggle="pill" data-bs-target="#tab-pane-1" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Financial Planning</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-2" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Cash Investment</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-3" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Financial Consultancy</h5>
                </button>
                <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-4" type="button">
                  <h5 className="m-0"><i className="fa fa-bars text-primary me-3"></i>Business Loans</h5>
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tab-content w-100">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-1.jpg" style={{ objectFit: "cover" }} alt="Service 1" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">25 Years Of Experience In Financial Support</h3>
                      <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo erat amet.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Secured Loans</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Credit Facilities</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Cash Advanced</p>
                      <a href="" className="btn btn-primary py-3 px-5 mt-3">Read More</a>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-2">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-2.jpg" style={{ objectFit: "cover" }} alt="Service 2" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">25 Years Of Experience In Financial Support</h3>
                      <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo erat amet.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Secured Loans</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Credit Facilities</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Cash Advanced</p>
                      <a href="" className="btn btn-primary py-3 px-5 mt-3">Read More</a>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-3">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-3.jpg" style={{ objectFit: "cover" }} alt="Service 3" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">25 Years Of Experience In Financial Support</h3>
                      <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo erat amet.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Secured Loans</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Credit Facilities</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Cash Advanced</p>
                      <a href="" className="btn btn-primary py-3 px-5 mt-3">Read More</a>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-pane-4">
                  <div className="row g-4">
                    <div className="col-md-6" style={{ minHeight: "350px" }}>
                      <div className="position-relative h-100">
                        <img className="position-absolute rounded w-100 h-100" src="/img/service-4.jpg" style={{ objectFit: "cover" }} alt="Service 4" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-4">25 Years Of Experience In Financial Support</h3>
                      <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo erat amet.</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Secured Loans</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Credit Facilities</p>
                      <p><i className="fa fa-check text-primary me-3"></i>Cash Advanced</p>
                      <a href="" className="btn btn-primary py-3 px-5 mt-3">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}

      {/* Projects Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Projects</p>
            <h1 className="display-5 mb-5">We Have Completed Latest Projects</h1>
          </div>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="project-item pe-3 pb-3">
                <div className="project-img mb-3">
                  <img className="img-fluid rounded" src="/img/service-1.jpg" alt="Project 1" />
                </div>
                <div className="project-title">
                  <h4 className="mb-0">Financial Planning</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="project-item pe-3 pb-3">
                <div className="project-img mb-3">
                  <img className="img-fluid rounded" src="/img/service-2.jpg" alt="Project 2" />
                </div>
                <div className="project-title">
                  <h4 className="mb-0">Cash Investment</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="project-item pe-3 pb-3">
                <div className="project-img mb-3">
                  <img className="img-fluid rounded" src="/img/service-3.jpg" alt="Project 3" />
                </div>
                <div className="project-title">
                  <h4 className="mb-0">Financial Consultancy</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="project-item pe-3 pb-3">
                <div className="project-img mb-3">
                  <img className="img-fluid rounded" src="/img/service-4.jpg" alt="Project 4" />
                </div>
                <div className="project-title">
                  <h4 className="mb-0">Business Loans</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Projects End */}

      {/* Contact Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Contact</p>
              <h1 className="display-5 mb-4">If You Have Any Query, Please Contact Us</h1>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="name" placeholder="Your Name" />
                      <label htmlFor="name">Your Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="email" className="form-control" id="email" placeholder="Your Email" />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="subject" placeholder="Subject" />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: "100px" }}></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary py-3 px-5" type="submit">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6" style={{ minHeight: "450px" }}>
              <div className="position-relative rounded overflow-hidden h-100">
                <iframe
                  className="position-relative w-100 h-100"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                  frameBorder="0"
                  style={{ minHeight: "450px", border: 0 }}
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
