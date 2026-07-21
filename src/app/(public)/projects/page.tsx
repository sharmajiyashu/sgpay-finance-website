"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { mockProjects } from "@/data/projects";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  
  const [filter, setFilter] = useState(filterParam || "All");
  const [cityFilter, setCityFilter] = useState("All");
  const [citySearch, setCitySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [filterParam]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extract unique cities from mockProjects
  const uniqueCities = useMemo(() => {
    const cities = new Set(mockProjects.map(p => p.city));
    return Array.from(cities).sort();
  }, []);

  const filteredCities = uniqueCities.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredProjects = mockProjects.filter((p) => {
    // Custom filter logic based on the string
    let matchesType = false;
    if (filter === "All") matchesType = true;
    else if (filter === "Residential") matchesType = p.projectType === "Residential";
    else if (filter === "Commercial") matchesType = p.projectType === "Commercial";
    else if (filter === "Plots") matchesType = p.propertyType === "Plot";
    else if (filter === "Luxury Homes") matchesType = p.luxury === true;
    else if (filter === "Farm Houses") matchesType = p.propertyType === "Farm House";
    else matchesType = p.propertyType === filter || p.projectType === filter;

    const matchesCity = cityFilter === "All" || p.city === cityFilter;
    return matchesType && matchesCity;
  });

  return (
    <>
      {/* Page Header */}
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <h1 className="display-3 mb-4 animated slideInDown">Real Estate Projects</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Projects</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Projects Listing Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Projects</p>
            <h1 className="display-5 mb-5">Explore Premium Real Estate</h1>
          </div>

          <div className="row mb-5 wow fadeInUp align-items-center" data-wow-delay="0.1s" style={{ position: 'relative', zIndex: 10 }}>
            <div className="col-md-9 text-center text-md-start mb-3 mb-md-0">
              <ul className="list-inline mb-0" id="portfolio-flters">
                <li className={`btn btn-outline-primary mx-1 mb-2 ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>All</li>
                <li className={`btn btn-outline-primary mx-1 mb-2 ${filter === "Residential" ? "active" : ""}`} onClick={() => setFilter("Residential")}>Residential</li>
                <li className={`btn btn-outline-primary mx-1 mb-2 ${filter === "Commercial" ? "active" : ""}`} onClick={() => setFilter("Commercial")}>Commercial</li>
                <li className={`btn btn-outline-primary mx-1 mb-2 ${filter === "Plots" ? "active" : ""}`} onClick={() => setFilter("Plots")}>Plots</li>
                <li className={`btn btn-outline-primary mx-1 mb-2 ${filter === "Luxury Homes" ? "active" : ""}`} onClick={() => setFilter("Luxury Homes")}>Luxury Homes</li>
                <li className={`btn btn-outline-primary mx-1 mb-2 ${filter === "Farm Houses" ? "active" : ""}`} onClick={() => setFilter("Farm Houses")}>Farm Houses</li>
              </ul>
            </div>
            
            <div className="col-md-3 text-center text-md-end">
              {/* City Dropdown with Search */}
              <div className="dropdown d-inline-block w-100" ref={dropdownRef} style={{position: 'relative'}}>
                <button 
                  className="btn btn-outline-primary dropdown-toggle px-4 w-100" 
                  type="button" 
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <i className="fa fa-map-marker-alt me-2"></i>
                  {cityFilter === "All" ? "Search by City" : cityFilter}
                </button>
                {showDropdown && (
                  <div className="dropdown-menu show p-2 shadow w-100 text-start" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1000 }}>
                    <input 
                      type="text" 
                      className="form-control mb-2" 
                      placeholder="Search City..." 
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      autoFocus
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <button 
                        className={`dropdown-item ${cityFilter === "All" ? 'active bg-primary text-white' : ''}`}
                        onClick={() => { setCityFilter("All"); setShowDropdown(false); setCitySearch(""); }}
                      >
                        All Cities
                      </button>
                      {filteredCities.length > 0 ? filteredCities.map(city => (
                        <button 
                          key={city}
                          className={`dropdown-item ${cityFilter === city ? 'active bg-primary text-white' : ''}`}
                          onClick={() => { setCityFilter(city); setShowDropdown(false); setCitySearch(""); }}
                        >
                          {city}
                        </button>
                      )) : (
                        <div className="text-muted p-2 text-center small">No cities found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row g-4 portfolio-container wow fadeInUp" data-wow-delay="0.3s">
            {filteredProjects.length > 0 ? filteredProjects.map((project, index) => (
              <div key={project.id} className="col-lg-4 col-md-6 portfolio-item">
                <ProjectCard project={project} index={index} />
              </div>
            )) : (
              <div className="col-12 text-center py-5">
                <h4>No projects found for the selected criteria.</h4>
                <button className="btn btn-primary mt-3" onClick={() => {setFilter("All"); setCityFilter("All");}}>Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Projects Listing End */}
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center">Loading Projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
