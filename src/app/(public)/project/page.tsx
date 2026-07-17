"use client";

import React, { useEffect } from "react";

export default function ProjectPage() {
  useEffect(() => {
    // Programmatically initialize jQuery Owl Carousel to guarantee it works on React hydration
    if (typeof window !== "undefined" && (window as any).$ && (window as any).$.fn.owlCarousel) {
      const initCarousel = () => {
        (window as any).$(".project-carousel").owlCarousel({
          autoplay: true,
          smartSpeed: 1000,
          margin: 25,
          loop: true,
          center: true,
          dots: false,
          nav: true,
          navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
          ],
          responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });
      };

      // Delay slightly to ensure DOM is fully ready
      const timer = setTimeout(initCarousel, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center text-dark py-5">
          <h1 className="display-4 mb-3">Projects</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a className="text-dark" href="/">Home</a></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Projects</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Projects Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Projects</p>
            <h1 className="display-5 mb-5">We Have Completed Latest Projects</h1>
          </div>
          <div className="owl-carousel project-carousel wow fadeInUp" data-wow-delay="0.3s">
            <div className="project-item pe-5 pb-5">
              <div className="project-img mb-3">
                <img className="img-fluid rounded" src="/img/service-1.jpg" alt="Project 1" />
                <a href=""><i className="fa fa-link fa-3x text-primary"></i></a>
              </div>
              <div className="project-title">
                <h4 className="mb-0">Financial Planning</h4>
              </div>
            </div>
            <div className="project-item pe-5 pb-5">
              <div className="project-img mb-3">
                <img className="img-fluid rounded" src="/img/service-2.jpg" alt="Project 2" />
                <a href=""><i className="fa fa-link fa-3x text-primary"></i></a>
              </div>
              <div className="project-title">
                <h4 className="mb-0">Cash Investment</h4>
              </div>
            </div>
            <div className="project-item pe-5 pb-5">
              <div className="project-img mb-3">
                <img className="img-fluid rounded" src="/img/service-3.jpg" alt="Project 3" />
                <a href=""><i className="fa fa-link fa-3x text-primary"></i></a>
              </div>
              <div className="project-title">
                <h4 className="mb-0">Financial Consultancy</h4>
              </div>
            </div>
            <div className="project-item pe-5 pb-5">
              <div className="project-img mb-3">
                <img className="img-fluid rounded" src="/img/service-4.jpg" alt="Project 4" />
                <a href=""><i className="fa fa-link fa-3x text-primary"></i></a>
              </div>
              <div className="project-title">
                <h4 className="mb-0">Business Loans</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Projects End */}
    </>
  );
}
