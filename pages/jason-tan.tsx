'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { QRCodeSVG } from 'qrcode.react';

export default function JasonTanPage() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const [hideDetails, setHideDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);

  useEffect(() => {
    // Start flipping after the card appears
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
    }, 1200); // Flip starts at 1.2s

    // Flip duration is 1000ms, so it completes at 2200ms
    // Start buttons appearing right after flip completes
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true);
    }, 2200); // 1.2s initial + 1s flip duration

    // Gradually show buttons one by one, starting immediately after flip
    const buttonStaggerTimers = [
      setTimeout(() => setVisibleButtons(1), 2200),   // First button - right when flip completes
      setTimeout(() => setVisibleButtons(2), 2250),   // Second button
      setTimeout(() => setVisibleButtons(3), 2300),   // Third button
      setTimeout(() => setVisibleButtons(4), 2350),   // Fourth button
    ];

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(buttonsTimer);
      buttonStaggerTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

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
    }, 0);

    // Show buttons after expansion completes (500ms expand duration)
    setTimeout(() => {
      setHideButtons(false);
    }, 300);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
EMAIL:editour741@gmail.com
ADR;TYPE=HOME:;;139, Jalan Sri Ehsan 7, Taman Sri Ehsan\\, 52100 Kuala Lumpur\\, Selangor;;;;
END:VCARD`;

    // Create a blob and encode it as base64 for the data URI
    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      // Create a data URI that will trigger the contact app
      window.location.href = base64data as string;
    };
    reader.readAsDataURL(blob);
  };

  return (
    <>
      <Head>
        <title>KwongNgai - Jason Tan</title>

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kwongngai.vercel.app/jason-tan" />
        <meta property="og:title" content="KwongNgai - Jason Tan" />
        <meta property="og:image" content="https://kwongngai.vercel.app/jasontan-card-back.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://kwongngai.vercel.app/jason-tan" />
        <meta name="twitter:title" content="KwongNgai - Jason Tan" />
        <meta name="twitter:image" content="https://kwongngai.vercel.app/jasontan-card-back.png" />
      </Head>

      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center py-8 relative overflow-hidden">
      {/* Backdrop watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <img
          src="/logo-white.jpg"
          alt="KWONG NGAI Watermark"
          className="w-[80vw] h-[80vh] object-contain"
        />
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-50 w-10 h-10 flex items-center justify-center text-purple-900 hover:text-purple-700 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Content wrapper to ensure centering */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg px-4 sm:px-0">
        <div
          className={`relative perspective-1000 transition-all duration-500 ease-in-out ${
            isShrunk ? 'w-full max-w-[350px] h-0 opacity-0' : 'w-full max-w-[600px] h-[250px] sm:h-[300px] md:h-[350px]'
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
            <div className="flex flex-col items-center justify-center h-full text-white p-4 sm:p-6 md:p-8">
              <div className="mb-3 sm:mb-4 md:mb-6">
                <img
                  src="/logo.jpg"
                  alt="KWONG NGAI Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
                />
              </div>
              <h2
                className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 tracking-wider text-center"
                style={{ fontFamily: "'Alfa Slab One', cursive" }}
              >
                KWONG NGAI
              </h2>
              <div className="w-12 sm:w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-2 sm:mb-3 md:mb-4"></div>
              <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase text-gray-400 text-center">Enjoy The Show</p>
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
            <div className="flex flex-row h-full">
              {/* Left side - Image */}
              <div className={`w-1/2 flex items-center justify-center bg-black transition-all duration-500 ${
                isShrunk ? 'p-0' : 'p-2 sm:p-3 md:p-4'
              }`}>
                <img
                  src="/jasontan.png"
                  alt="Jason Tan"
                  className={`w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-xl transition-opacity duration-200 ${
                    hideDetails ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>

              {/* Right side - Contact Info */}
              <div className={`w-1/2 flex flex-col justify-center text-white transition-all duration-500 transition-opacity duration-200 ${
                hideDetails ? 'opacity-0' : 'opacity-100'
              } ${isShrunk ? 'p-0' : 'p-3 sm:p-4 md:p-6'}`}>
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-wider"
                  style={{ fontFamily: "'Alfa Slab One', cursive" }}
                >
                  Jason Tan
                  <span className="block text-sm sm:text-base md:text-lg text-gray-400 font-normal">(陈总)</span>
                </h3>

                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-2 md:space-x-3">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm">+60 12-363 8359</p>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-2 md:space-x-3">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm break-all">editour741@gmail.com</p>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-2 md:space-x-3">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-300 text-[10px] sm:text-[10px] md:text-xs leading-snug">
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
          className={`w-full max-w-[600px] space-y-5 sm:space-y-3 md:space-y-5 transition-opacity duration-200 ${
            hideButtons ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${showQR ? 'absolute' : 'mt-4 sm:mt-6 md:mt-8'}`}
          style={showQR ? { top: 'calc(50% + ' + (isShrunk ? '275' : '175') + 'px)' } : {}}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={saveVCF}
            className="w-full py-3 sm:py-3.5 md:py-4 bg-purple-300 text-black rounded-xl font-semibold hover:bg-purple-400 transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base"
            style={{
              opacity: hideButtons ? 0 : (visibleButtons >= 1 ? 1 : 0),
              transform: hideButtons ? 'translateY(-10px)' : (visibleButtons >= 1 ? 'translateY(0)' : 'translateY(20px)'),
              transition: 'all 0.3s ease-out',
            }}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save Contact</span>
          </button>

          <a
            href="https://wa.me/60123638359"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 sm:py-3.5 md:py-4 bg-purple-300 text-black rounded-xl font-semibold hover:bg-purple-400 transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base"
            style={{
              opacity: hideButtons ? 0 : (visibleButtons >= 2 ? 1 : 0),
              transform: hideButtons ? 'translateY(-10px)' : (visibleButtons >= 2 ? 'translateY(0)' : 'translateY(20px)'),
              transition: 'all 0.3s ease-out',
            }}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          <a
            href="https://www.instagram.com/kwong_ngai_malaysia/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 sm:py-3.5 md:py-4 bg-purple-300 text-black rounded-xl font-semibold hover:bg-purple-400 transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base"
            style={{
              opacity: hideButtons ? 0 : (visibleButtons >= 3 ? 1 : 0),
              transform: hideButtons ? 'translateY(-10px)' : (visibleButtons >= 3 ? 'translateY(0)' : 'translateY(20px)'),
              transition: 'all 0.3s ease-out',
            }}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://www.facebook.com/Kwongngailiondance/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 sm:py-3.5 md:py-4 bg-purple-300 text-black rounded-xl font-semibold hover:bg-purple-400 transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base"
            style={{
              opacity: hideButtons ? 0 : (visibleButtons >= 4 ? 1 : 0),
              transform: hideButtons ? 'translateY(-10px)' : (visibleButtons >= 4 ? 'translateY(0)' : 'translateY(20px)'),
              transition: 'all 0.3s ease-out',
            }}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
            <span>Facebook</span>
          </a>
        </div>
      )}

      {/* QR Code Container */}
      {showQR && (
        <div
          className="absolute space-y-2 sm:space-y-3 md:space-y-4 px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="relative w-full max-w-[280px] sm:max-w-[320px] md:w-[350px] bg-black rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center cursor-pointer"
            onClick={handleBackToDetails}
          >
            <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-center" style={{ fontFamily: "'Alfa Slab One', cursive" }}>
              Scan to Visit
            </h3>

            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl">
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : ''}
                size={150}
                level="H"
              />
            </div>

            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 mt-4 sm:mt-6 md:mt-8 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyLink();
                }}
                className={`flex-1 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-2.5 md:space-x-3 text-xs sm:text-xs md:text-sm ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shareLink();
                }}
                className="flex-1 py-2 sm:py-2.5 md:py-3 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2 sm:space-x-2.5 md:space-x-3 text-xs sm:text-xs md:text-sm"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </>
  );
}
