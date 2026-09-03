"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { fetchPublishedPropertyBySlug } from "@/lib/publicPropertyService";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { submitPublicEnquiry } from "@/lib/publicEnquiryService";
import { buildEnquiryPayload } from "@/lib/enquiryCatalog";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project, isLoading } = useQuery({
    queryKey: ["public-property", slug],
    queryFn: () => fetchPublishedPropertyBySlug(slug),
    enabled: Boolean(slug),
  });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setLoading(true);
    setError(null);
    try {
      await submitPublicEnquiry(
        buildEnquiryPayload("projects", slug, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.mobile.trim(),
          pageUrl: `/projects/${slug}`,
          message: formData.message.trim() || `Enquiry for ${project.name}`,
          metadata: { projectName: project.name, builder: project.builder },
        })
      );
      setSubmitted(true);
      setFormData({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <h2>Loading project...</h2>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h2>Project not found</h2>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <h1 className="display-3 mb-4 animated slideInDown">{project.name}</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
              <li className="breadcrumb-item active" aria-current="page">{project.name}</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden mb-5 shadow-lg w-100">
                <img src="/img/premium-hero-light.png" alt={project.name} className="w-100 object-cover project-detail-hero" />
              </motion.div>

              <div className="d-flex align-items-center mb-4">
                <img src={project.builderLogo} alt={project.builder} style={{ width: "60px", height: "60px", objectFit: "contain" }} className="rounded-circle bg-light border p-1 me-3 shadow-sm" />
                <div>
                  <h2 className="mb-1">{project.name}</h2>
                  <p className="text-muted mb-0">by <span className="text-primary fw-bold">{project.builder}</span></p>
                </div>
              </div>

              <div className="bg-light p-4 rounded mb-5 border-start border-4 border-primary">
                <h5 className="mb-3">About the Builder</h5>
                <p className="mb-0 text-muted">{project.builderDescription || `${project.builder} is a renowned real estate developer committed to delivering premium quality projects.`}</p>
              </div>

              <h3 className="mb-4">Project Overview</h3>
              <p className="mb-4 text-gray-600">
                Experience unparalleled luxury and comfort at {project.name}, a premium {project.propertyType} project.
                Located strategically in {project.location}, {project.city}, this project offers state-of-the-art amenities and world-class infrastructure.
              </p>

              <h3 className="mb-4">Key Specifications</h3>
              <div className="row g-4 mb-5">
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-home me-2 text-primary"></i>Property Type</p>
                    <h6 className="mb-0">{project.projectType} / {project.propertyType}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-check-circle me-2 text-primary"></i>Status</p>
                    <h6 className="mb-0">{project.status}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-file-contract me-2 text-primary"></i>RERA Number</p>
                    <h6 className="mb-0">{project.reraNumber}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-rupee-sign me-2 text-primary"></i>Price Range</p>
                    <h6 className="mb-0">{project.priceRange}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-ruler-combined me-2 text-primary"></i>Area Range</p>
                    <h6 className="mb-0">{project.areaRange}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-calendar-alt me-2 text-primary"></i>Possession By</p>
                    <h6 className="mb-0">{project.possessionDate}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-bed me-2 text-primary"></i>Configurations</p>
                    <h6 className="mb-0">{(project.configurations || []).join(", ") || "—"}</h6>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="bg-white rounded p-3 border shadow-sm h-100 transition-shadow hover:shadow-md">
                    <p className="text-muted mb-1 small"><i className="fa fa-rocket me-2 text-primary"></i>Launch Date</p>
                    <h6 className="mb-0">{project.launchDate}</h6>
                  </div>
                </div>
              </div>

              {/* Additional Property Details */}
              <h3 className="mb-4">Property & Document Details</h3>
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="d-flex bg-white border p-3 rounded shadow-sm h-100">
                    <div className="btn-square bg-primary rounded-circle me-3 flex-shrink-0">
                      <i className="fa fa-map-marker-alt text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Specific Landmark</h6>
                      <p className="mb-0 text-muted small">{project.landmark || project.address}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex bg-white border p-3 rounded shadow-sm h-100">
                    <div className="btn-square bg-primary rounded-circle me-3 flex-shrink-0">
                      <i className="fa fa-file-contract text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Document Information</h6>
                      <p className="mb-0 text-muted small">{project.documentInfo || "Clear title, RERA approved, All NOCs available."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="mb-4">Premium Amenities</h3>
              <div className="row g-3 mb-5">
                {(project.amenities || []).map((amenity, idx) => (
                  <div key={idx} className="col-sm-6">
                    <div className="d-flex align-items-center p-3 bg-white border rounded shadow-sm hover:shadow-md transition-shadow">
                      <div className="btn-square bg-primary rounded-circle me-3 flex-shrink-0">
                        <i className="fa fa-check text-white"></i>
                      </div>
                      <span className="fw-semi-bold">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery Section */}
              {project.images && project.images.length > 1 && (
                <>
                  <h3 className="mb-4">Project Gallery</h3>
                  <div className="row g-3 mb-5">
                    {project.images.map((img, idx) => (
                      <div key={idx} className="col-md-4">
                        <div
                          className="rounded overflow-hidden shadow-sm position-relative project-gallery-tile"
                          style={{ cursor: "pointer" }}
                          onClick={() => setLightboxIndex(idx)}
                        >
                          <img src={img} alt={`${project.name} Gallery ${idx + 1}`} className="w-100 h-100 object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Videos Section */}
              {project.videos && project.videos.length > 0 && (
                <>
                  <h3 className="mb-4">Project Walkthrough</h3>
                  <div className="row g-3 mb-5">
                    {project.videos.map((vid, idx) => (
                      <div key={idx} className="col-12">
                        <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                           <video src={vid} controls className="w-100 h-100 object-cover"></video>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Floor Plans Section */}
              {project.floorPlans && project.floorPlans.length > 0 && (
                <>
                  <h3 className="mb-4">Floor & Master Plans</h3>
                  <div className="row g-3 mb-5">
                    {project.floorPlans.map((plan, idx) => (
                      <div key={idx} className="col-md-6">
                        <div className="rounded overflow-hidden shadow-sm project-plan-tile">
                          <img src={plan} alt="Floor Plan" className="w-100 h-100 object-cover" />
                        </div>
                      </div>
                    ))}
                    {project.masterPlan && (
                      <div className="col-md-6">
                        <div className="rounded overflow-hidden shadow-sm project-plan-tile">
                          <img src={project.masterPlan} alt="Master Plan" className="w-100 h-100 object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Location Section */}
              <h3 className="mb-4">Location Map</h3>
              <div className="rounded overflow-hidden mb-5 shadow-sm project-map-embed">
                <iframe 
                  src={`https://maps.google.com/maps?q=${project.latitude},${project.longitude}&hl=en&z=14&output=embed`} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  aria-hidden="false" 
                  tabIndex={0}
                ></iframe>
              </div>

            </div>

            {/* Sidebar Sticky Enq Form */}
            <div className="col-lg-4 order-first order-lg-last wow fadeInUp" data-wow-delay="0.3s">
              <div className="position-sticky" style={{ top: "100px" }}>
                
                {/* Pricing Widget */}
                <div className="bg-primary text-white p-4 rounded shadow-sm mb-4 text-center">
                  <p className="mb-1 text-white-50 fw-semi-bold">Starting Price</p>
                  <h2 className="text-white mb-2">{project.priceRange?.split('-')[0]?.trim() || "Price on Request"}</h2>
                  <p className="mb-0 text-white-50 small">EMI from {project.emi}</p>
                </div>

                <div className="bg-light p-5 rounded shadow-sm border border-2 border-white">
                  <h4 className="mb-4 text-center text-primary">Enquire Now</h4>
                  {submitted && (
                    <div className="alert alert-success small" role="alert">
                      Thank you! Our team will contact you shortly.
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger small" role="alert">{error}</div>
                  )}
                  <form onSubmit={handleEnquirySubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Your Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          />
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Your Email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          />
                          <label htmlFor="email">Your Email</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="mobile"
                            placeholder="Mobile Number"
                            required
                            value={formData.mobile}
                            onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                          />
                          <label htmlFor="mobile">Mobile Number</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            placeholder="Leave a message here"
                            id="message"
                            style={{ height: "100px" }}
                            value={formData.message}
                            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                          />
                          <label htmlFor="message">Message</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                          {loading ? "Submitting..." : "Submit Enquiry"}
                        </button>
                      </div>
                      <div className="col-12 mt-3 text-center">
                        <a href={`https://wa.me/919999999999?text=I am interested in ${project.name}`} target="_blank" className="btn btn-success w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                          <i className="fab fa-whatsapp fs-5"></i> Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && project && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.9)' }}
        >
          <button 
            className="position-absolute top-0 end-0 m-4 btn btn-outline-light rounded-circle"
            onClick={() => setLightboxIndex(null)}
          >
            <i className="fa fa-times fa-lg"></i>
          </button>
          
          <button 
            className="position-absolute start-0 ms-2 ms-md-4 btn btn-outline-light rounded-circle project-lightbox-nav"
            onClick={() => setLightboxIndex(prev => (prev === null || prev === 0) ? project.images.length - 1 : prev - 1)}
          >
            <i className="fa fa-chevron-left fa-lg"></i>
          </button>

          <img 
            src={project.images[lightboxIndex]} 
            alt="Gallery Fullscreen" 
            style={{ maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain' }} 
            className="shadow-lg rounded"
          />

          <button 
            className="position-absolute end-0 me-2 me-md-4 btn btn-outline-light rounded-circle project-lightbox-nav"
            onClick={() => setLightboxIndex(prev => (prev === null || prev === project.images.length - 1) ? 0 : prev + 1)}
          >
            <i className="fa fa-chevron-right fa-lg"></i>
          </button>
          
          <div className="position-absolute bottom-0 mb-4 text-white">
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </>
  );
}
