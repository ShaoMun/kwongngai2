'use client';

import { useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start flipping after the card appears
      const flipTimer = setTimeout(() => {
        setIsFlipped(true);
      }, 1500); // Wait 1.5s before flipping

      return () => clearTimeout(flipTimer);
    } else {
      setIsFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-[600px] h-[350px] perspective-1000"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front Side - Branding */}
          <div
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              background: '#000000',
              opacity: '1',
              animation: 'scaleFadeIn 0.6s ease-out',
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white p-8">
              <div className="mb-6">
                <img
                  src="/logo.jpg"
                  alt="KWONG NGAI Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h2
                className="text-4xl font-bold mb-2 tracking-wider"
                style={{ fontFamily: "'Alfa Slab One', cursive" }}
              >
                KWONG NGAI
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-4"></div>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400">Crafting Excellence</p>
            </div>
          </div>

          {/* Back Side - Details */}
          <div
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#000000',
            }}
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-white">
              <h3
                className="text-2xl font-bold mb-8 tracking-wider"
                style={{ fontFamily: "'Alfa Slab One', cursive" }}
              >
                CONTACT
              </h3>
              <div className="space-y-5 text-center w-full">
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-300">contact@kwongngai.com</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-gray-300">+852 1234 5678</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-300">Hong Kong</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-10 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
