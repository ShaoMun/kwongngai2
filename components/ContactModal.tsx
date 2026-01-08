'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const [hideDetails, setHideDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start flipping after the card appears
      const flipTimer = setTimeout(() => {
        setIsFlipped(true);
      }, 600); // Shorter delay - 0.6s

      // Show buttons after flip completes
      const buttonsTimer = setTimeout(() => {
        setShowButtons(true);
      }, 1600); // 0.6s initial + 1s flip duration

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(buttonsTimer);
      };
    } else {
      setIsFlipped(false);
      setShowButtons(false);
      setShowQR(false);
      setIsShrunk(false);
      setHideButtons(false);
      setHideDetails(false);
    }
  }, [isOpen]);

  const handleDetailClick = () => {
    // Hide buttons immediately
    setHideButtons(true);

    // Hide details content immediately along with buttons
    setHideDetails(true);

    // Start shrinking after buttons hide (200ms fade)
    setTimeout(() => {
      setIsShrunk(true);
    }, 0);

    // Show QR after shrinking starts and completes (500ms shrink duration)
    setTimeout(() => {
      setShowQR(true);
    }, 330);
  };

  const handleBackToDetails = () => {
    // Hide QR first
    setShowQR(false);

    // Show details immediately when QR disappears
    setHideDetails(false);

    // Start expanding after details appear (200ms fade)
    setTimeout(() => {
      setIsShrunk(false);
    },0);

    // Show buttons after expansion completes (500ms expand duration)
    setTimeout(() => {
      setHideButtons(false);
    }, 300);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KwongNgai - Jason Tan',
          text: 'Contact Jason Tan',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const saveVCF = () => {
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:KwongNgai - Jason Tan
TEL;TYPE=CELL:+60123638359
EMAIL:jason@kwongngai.com
ADR;TYPE=HOME:;;139, Jalan Sri Ehsan 7, Taman Sri Ehsan\\, 52100 Kuala Lumpur\\, Selangor;;;;
END:VCARD`;

    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kwongngai_jason_tan.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 py-8"
      onClick={showQR ? handleBackToDetails : onClose}
    >
      {/* Close button */}
      <button
        onClick={showQR ? handleBackToDetails : onClose}
        className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content wrapper to ensure centering */}
      <div className="relative flex flex-col items-center justify-center">
        <div
          className={`relative perspective-1000 transition-all duration-500 ease-in-out ${
            isShrunk ? 'w-[350px] h-[450px]' : 'w-[600px] h-[350px]'
          }`}
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
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#000000',
            }}
            onClick={handleDetailClick}
          >
            <div className="flex h-full">
              {/* Left side - Image */}
              <div className={`w-1/2 flex items-center justify-center bg-black transition-all duration-500 ${
                isShrunk ? 'p-0' : 'p-6'
              }`}>
                <img
                  src="/jasontan.png"
                  alt="Jason Tan"
                  className={`w-40 h-40 object-cover rounded-xl transition-opacity duration-200 ${
                    hideDetails ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>

              {/* Right side - Contact Info */}
              <div className={`w-1/2 flex flex-col justify-center text-white transition-all duration-500 transition-opacity duration-200 ${
                hideDetails ? 'opacity-0' : 'opacity-100'
              } ${isShrunk ? 'p-0' : 'p-6'}`}>
                <h3
                  className="text-2xl font-bold mb-6 tracking-wider"
                  style={{ fontFamily: "'Alfa Slab One', cursive" }}
                >
                  Jason Tan
                  <span className="block text-lg text-gray-400 font-normal">(陈总)</span>
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-300">+60 12-363 8359</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-300">jason@kwongngai.com</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      139, Jalan Sri Ehsan 7,<br />
                      Taman Sri Ehsan, 52100<br />
                      Kuala Lumpur, Selangor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Buttons */}
      {showButtons && (
        <div
          className={`w-[600px] space-y-5 transition-opacity duration-200 ${
            hideButtons ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${showQR ? 'absolute' : 'mt-8'}`}
          style={showQR ? { top: 'calc(50% + ' + (isShrunk ? '275' : '175') + 'px)' } : {}}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={saveVCF}
            className="w-full py-3 bg-gray-200 text-black rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2"
            style={{
              opacity: hideButtons ? 0 : 1,
              transform: hideButtons ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'all 0.2s ease-out 0s',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save Contact</span>
          </button>

          <a
            href="https://wa.me/60123638359"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gray-200 text-black rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2"
            style={{
              opacity: hideButtons ? 0 : 1,
              transform: hideButtons ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'all 0.2s ease-out 0.05s',
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          <a
            href="https://www.instagram.com/kwong_ngai_malaysia/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gray-200 text-black rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2"
            style={{
              opacity: hideButtons ? 0 : 1,
              transform: hideButtons ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'all 0.2s ease-out 0.1s',
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      )}

      {/* QR Code Container */}
      {showQR && (
        <div
          className="absolute space-y-4"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-[350px] bg-black rounded-2xl shadow-2xl p-8 flex flex-col items-center"
          >
            <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: "'Alfa Slab One', cursive" }}>
              Scan to Visit
            </h3>

            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : ''}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="flex space-x-3 mt-6 w-full">
              <button
                onClick={copyLink}
                className="flex-1 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Link</span>
              </button>

              <button
                onClick={shareLink}
                className="flex-1 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
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

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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
