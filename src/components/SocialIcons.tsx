import React from 'react';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const DribbbleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
    <path d="M8.5 2.5c3.7 4.2 6.5 9.8 7.5 18" />
  </svg>
);

export const BehanceIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.9 11.3c.8-.3 1.3-.9 1.3-1.8 0-1.5-1.2-2-2.6-2H1.5v8.9h4.3c1.7 0 2.9-.8 2.9-2.4 0-1.3-.7-2.3-1.8-2.7zm-3.2-2.3h1.7c.6 0 1.1.2 1.1.8 0 .6-.4.9-1.1.9H3.7V9zm1.9 4.8H3.7v-2h1.9c.8 0 1.3.3 1.3 1 0 .7-.5 1-1.3 1zm12.9-2.9c-.1-1.8-1.4-3.1-3.3-3.1-2 0-3.4 1.4-3.4 3.4 0 2.1 1.4 3.5 3.5 3.5 1.5 0 2.6-.7 3.1-1.9h-1.9c-.3.5-.7.7-1.2.7-.9 0-1.5-.6-1.6-1.5h4.6c0-.2 0-.3-.1-1.1zm-4.7-.5c.1-.8.6-1.4 1.4-1.4.8 0 1.3.5 1.4 1.4h-2.8zm-.1-3.6h3.2v.9h-3.2v-.9z" />
  </svg>
);
