"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {project.featured && (
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
              Featured
            </span>
          )}
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-dark text-xs font-bold rounded-full shadow-lg">
            {project.status}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white p-1 rounded-md shadow-lg">
          <img src={project.builderLogo} alt={project.builder} className="h-8 object-contain" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-2xl font-bold mb-1 text-white">{project.name}</h3>
          <p className="text-sm flex items-center gap-2">
            <i className="fa fa-map-marker-alt text-primary"></i> {project.location}, {project.city}
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Starting Price</p>
            <p className="text-xl font-bold text-primary">{project.priceRange}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Property Type</p>
            <p className="font-semibold">{project.propertyType}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-5 text-sm text-gray-600">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <i className="fa fa-bed text-primary"></i>
            <span>{project.configurations.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <i className="fa fa-ruler-combined text-primary"></i>
            <span>{project.areaRange}</span>
          </div>
        </div>

        <Link href={`/projects/${project.slug}`} className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-colors font-semibold">
          View Details
          <i className="fa fa-arrow-right"></i>
        </Link>
      </div>
    </motion.div>
  );
}
