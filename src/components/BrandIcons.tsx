import React from 'react';

interface IconProps {
  className?: string;
}

export const InstagramIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const BehanceIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 8h4.5a2.5 2.5 0 0 1 0 5H3V8zm0 5h5a2.5 2.5 0 0 1 0 5H3v-5z" />
    <path d="M14 13h7a3.5 3.5 0 0 0-7 0v1a3.5 3.5 0 0 0 7 0" />
    <line x1="15" y1="8" x2="20" y2="8" />
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.508-.678-.517-.176-.009-.376-.009-.577-.009-.2 0-.527.075-.803.376-.276.301-1.054 1.029-1.054 2.509 0 1.48 1.079 2.909 1.23 3.11.15.2 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.23 1.377.197 1.896.12.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.351zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.764.46 3.486 1.334 5.006L2 22l5.12-1.343c1.468.801 3.125 1.223 4.92 1.223 5.524 0 10.012-4.488 10.012-10.012C22.052 6.488 17.564 2 12.04 2zm0 18.334c-1.57 0-3.11-.422-4.453-1.22l-.32-.19-3.308.868.883-3.224-.208-.331a8.31 8.31 0 0 1-1.274-4.225c0-4.606 3.748-8.354 8.472-8.354 2.264 0 4.392.883 5.992 2.483a8.433 8.433 0 0 1 2.481 5.99c0 4.606-3.748 8.354-8.472 8.354z" />
  </svg>
);
