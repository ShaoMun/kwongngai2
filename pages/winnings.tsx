'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

interface Award {
  date: string;
  title: string;
  result: string;
}

// Helper function to sort awards by date (descending - most recent first)
const sortAwardsByDate = (awards: Award[]) => {
  return [...awards].sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('/'));
    const dateB = new Date(b.date.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });
};

// National Level Awards
const nationalAwards: Award[] = [
  { date: '11/01/2003', title: 'Plaza Low Yat Lion Dance Competition', result: 'Champion' },
  { date: '26/10/2003', title: '11th Malaysia Lion Dance Competition in Genting Highlands', result: 'Champion' },
  { date: '24/04/2004', title: '11th Selangor Invitation Lion Dance Competition', result: 'Champion' },
  { date: '10/12/2004', title: '2nd National Dragon and Lion Dance Competition', result: '1st Runner-Up' },
  { date: '15/12/2005', title: '3th National Dragon and Lion Dance Competition', result: '1st Runner-Up' },
  { date: '26/11/2006', title: 'Malaysia & Singapore Lion Dance Competition in Johor', result: '1st Runner-Up' },
  { date: '27/01/2007', title: 'Malaysia Acrobatic Lion Dance Competition', result: '1st Runner-Up' },
  { date: '21/12/2008', title: 'Malaysia Acrobatic Lion Dance Competition in Pesta Pulau Penang', result: 'Champion' },
  { date: '04/01/2009', title: 'Malaysia Acrobatic Lion Dance Competition in Times Square KL (Team A)', result: 'Champion' },
  { date: '04/01/2009', title: 'Malaysia Acrobatic Lion Dance Competition in Times Square KL (Team B)', result: '1st Runner-Up' },
  { date: '02/05/2009', title: '2nd Cash Sweep Sarawak Open Dragon and Lion Dance Championship', result: 'Champion' },
  { date: '06/06/2009', title: 'National Acrobatic Lion Dance Competition in Johor', result: 'Champion' },
  { date: '20/11/2009', title: '14th Malaysia Lion Dance Competition in Genting Highlands', result: '1st Runner-Up' },
  { date: '24/01/2010', title: '1st Malaysia Invitation Acrobatic Lion Dance Competition in Melacca', result: 'Champion' },
  { date: '17/07/2010', title: '6th Malaysia Open Traditional Lion Dance Competition in Penang', result: 'Champion' },
  { date: '04/12/2010', title: 'Malaysia Open Lion Dance Competition in Johor', result: 'Champion' },
  { date: '16/01/2011', title: '2nd Malaysia Acrobatic Lion Dance Competition in Melacca (Team A)', result: 'Champion' },
  { date: '16/01/2011', title: '2nd Malaysia Acrobatic Lion Dance Competition in Melacca (Team B)', result: '1st Runner-Up' },
  { date: '01/06/2012', title: '7th Malaysia Open Traditional Lion Dance Competition in Johor (Team A)', result: 'Champion' },
  { date: '03/06/2012', title: '7th Malaysia Open Acrobatic Lion Dance Competition in Johor (Team A)', result: 'Champion' },
  { date: '23/09/2012', title: 'Long-Shi.com Invitation Acrobatic Lion Dance Competition in Johor', result: 'Champion' },
  { date: '01/09/2013', title: '3rd Malaysia Acrobatic Lion Dance Competition in Kajang (Team B)', result: '2nd Runner-Up' },
  { date: '14/09/2013', title: '3rd Malaysia Acrobatic Lion Dance Competition in Johor (Team A)', result: 'Champion' },
  { date: '14/09/2013', title: '3rd Malaysia Acrobatic Lion Dance Competition in Johor (Team B)', result: '2nd Runner-Up' },
  { date: '21/09/2013', title: '4th Malaysia Acrobatic Lion Dance Competition in Butterworth - Penang', result: 'Champion' },
  { date: '06/10/2013', title: 'NTV7 圆游会 Malaysia Traditional Lion Dance Competition in Johor (Tai Tong White Crane Troup)', result: 'Champion' },
  { date: '30/11/2013', title: '6th Malaysia Acrobatic Lion Dance Competition in Penang', result: 'Champion' },
  { date: '25/05/2014', title: '7th Malaysia Acrobatic Lion Dance Competition in Penang', result: 'Champion' },
  { date: '31/08/2014', title: 'Plaza Low Yat Acrobatic Lion Dance Competition', result: 'Champion' },
  { date: '18/01/2015', title: 'Dpulze Shopping Centre Cyberjaya Acrobatic Lion Dance Competition', result: 'Champion' },
  { date: '26/07/2015', title: '4th Malaysia Traditional Lion Dance Competition (YB Ean Yong Hian Wah Cup)', result: 'Champion' },
  { date: '14/11/2015', title: '17th Malaysia Lion Dance Competition in Genting Highlands', result: '1st Runner-Up' },
  { date: '14/11/2015', title: '17th Malaysia Lion Dance Competition in Genting Highlands', result: '4th Place' },
  { date: '09/01/2016', title: '2nd Malaysia and Singapore Acrobatic Lion Dance Competition in Johor', result: 'Champion' },
  { date: '31/08/2016', title: 'Mahkota Parade (Melaka) Traditional Lion Dance Competition', result: '1st Runner-Up' },
  { date: '16/09/2016', title: 'Village Mall Sg Petani (Kedah) Traditional Lion Dance Competition', result: 'Champion' },
  { date: '13/11/2016', title: 'Acrobatic Lion Dance Competition ~ Sutera Mall Johor', result: 'Champion' },
  { date: '13/11/2016', title: 'Acrobatic Lion Dance Competition ~ Sutera Mall Johor', result: '1st Runner-Up' },
  { date: '13/11/2016', title: 'Acrobatic Lion Dance Competition ~ Sutera Mall Johor', result: '2nd Runner-Up' },
  { date: '16/12/2016', title: '9th National Open Traditional/Acrobatic Lion Dance Competition ~ Sutera Mall Johor', result: 'Champion' },
  { date: '26/03/2017', title: 'Pertandingan Tarian Singa Jemputan Kebangsaan 2017 (Acrobatic) Di Bawah Program Local Agenda 21 (Negeri Sembilan)', result: 'Johan' },
  { date: '31/03/2017', title: 'Penang Malaysia High-Stilts Lion Dance Championship Lot33 Trophy', result: 'Champion' },
  { date: '31/03/2017', title: 'Penang Malaysia High-Stilts Lion Dance Championship Lot33 Trophy', result: '2nd Runner-Up' },
  { date: '31/03/2017', title: 'Penang Malaysia High-Stilts Lion Dance Championship Lot33 Trophy', result: '4th Place' },
  { date: '14/12/2018', title: '10th National Traditional Lion Dance Competition at OCM', result: 'Champion' },
  { date: '14/12/2018', title: '10th National Acrobatic Lion Dance Competition at OCM', result: '1st Runner-Up' },
  { date: '14/12/2018', title: '10th National Traditional / Acrobatic Lion Dance Competition at OCM ~ overall', result: 'Champion' },
  { date: '22/09/2019', title: '1st Piala YB Seputeh: Tarian Singa 2019 (Acrobatic Lion Dance Competition)', result: 'Champion' },
  { date: '22/09/2019', title: '1st Piala YB Seputeh: Tarian Singa 2019 (Acrobatic Lion Dance Competition)', result: '1st Runner-Up' },
  { date: '29/09/2019', title: '1st National Traditional Lion Dance Championship (Balakong)', result: 'Champion' },
  { date: '29/09/2019', title: '1st National Traditional Lion Dance Championship (Balakong)', result: '2nd Runner-Up' },
  { date: '29/09/2019', title: '1st National Traditional Lion Dance Championship (Balakong)', result: '4th Place' },
  { date: '30/11/2019', title: '1st National Water Stilt Lion Dance Championship (Bukit Jalil)', result: 'Champion' },
  { date: '30/11/2019', title: '1st National Water Stilt Lion Dance Championship (Bukit Jalil)', result: '1st Runner-Up' },
  { date: '12/03/2023', title: '10th Kulai IOI Mall Malaysia Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '05/10/2024', title: 'Putarajaya, Kuala Lumpur and Selangor Traditional / Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '27/10/2024', title: '2nd PINNACLE SRI PETALING MALL Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '27/10/2024', title: '2nd PINNACLE SRI PETALING MALL Acrobatic Lion Dance Championship', result: '1st Runner-Up' },
  { date: '22/11/2024', title: '12th National Dragon and Lion Dance Championship 2024 Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '07/12/2024', title: '1st National Traditional Lion Dance Championship Guan Yu Tang at Batu Pahat Mall', result: 'Champion' },
];

// World & International Level Awards
const internationalAwards: Award[] = [
  { date: '18/06/2004', title: 'World Acrobatic Lion Dance Competition in China (WuXi)', result: 'Champion' },
  { date: '09/07/2004', title: '6th World Acrobatic Lion Dance Championship in Genting Highlands', result: '2nd Runner-Up' },
  { date: '23/09/2006', title: 'Taiwan International Dragon and Lion Dance Competition (KaoShiung)', result: 'Champion' },
  { date: '26/11/2006', title: 'Malaysia & Singapore Lion Dance Competition in Johor', result: '1st Runner-Up' },
  { date: '20/10/2007', title: 'Taiwan International Lion Dance Competition (Tainan)', result: 'Champion' },
  { date: '15/06/2008', title: 'Asia Dragon & Lion Dance Elite Competition in China Macau', result: 'Gold Medal' },
  { date: '02/01/2009', title: 'World Acrobatic Lion Dance Competition in Singapore', result: '2nd Runner-Up' },
  { date: '31/10/2009', title: 'Taiwan International Acrobatic Lion Dance Competition (Taipei ~TaiShan)', result: 'Gold Medal' },
  { date: '23/07/2010', title: '9th World Acrobatic Lion Dance Championship in Genting Highlands', result: '1st Runner-Up' },
  { date: '31/10/2010', title: 'Taiwan International Acrobatic Lion Dance Competition (Taipei ~TaiShan)', result: 'Champion' },
  { date: '12/10/2012', title: 'Taiwan International Acrobatic Lion Dance Competition (Kao Shiung)', result: '1st Runner-Up' },
  { date: '16/10/2012', title: '2nd Asia Dragon & Lion Dance Competition in Indonesia', result: '1st Runner-Up' },
  { date: '10/11/2012', title: '4th MGM MACAU International Lion Dance Championship', result: '2nd Runner-Up' },
  { date: '30/04/2013', title: 'Thailand International Lion Dance Competition (Sg. Golok)', result: 'Champion' },
  { date: '22/09/2013', title: '4th International Acrobatic Lion Dance Competition in Butterworth Penang', result: 'Champion' },
  { date: '01/12/2013', title: '6th International Acrobatic Lion Dance Competition in Penang', result: 'Champion' },
  { date: '11/01/2014', title: 'World Hong Kong Luminous Dragon & Lion Dance Championship', result: 'World Champion' },
  { date: '26/05/2014', title: '7th International Acrobatic Lion Dance Competition in Penang', result: 'Champion' },
  { date: '01/10/2014', title: 'Asean Acrobatic Lion Dance Competition in China (GuangXi – Qin Zhou)', result: 'Champion' },
  { date: '09/11/2014', title: '5th MGM MACAU International Lion Dance Championship', result: 'Champion' },
  { date: '20/09/2015', title: 'Hong Kong International Lion Dance Championship', result: 'Champion' },
  { date: '26/04/2016', title: 'Thailand International Lion Dance Competition (Sg. Golok) (Tai Tong)', result: 'Champion' },
  { date: '01/04/2017', title: 'Penang International High-Stilts Lion Dance Championship Lot33 Trophy', result: '1st Runner-Up' },
  { date: '09/08/2017', title: '4th Asia Dragon & Lion Dance Competition in Macau (Acrobatic & Traditional)', result: 'Champion' },
  { date: '20/01/2018', title: 'World Hong Kong Luminous Dragon & Lion Dance Championship', result: 'Champion' },
  { date: '16/06/2018', title: 'Malaysia World Dragon & Lion Dance Championship 2018 (Traditional)', result: 'Champion' },
  { date: '17/06/2018', title: 'Malaysia World Dragon & Lion Dance Championship 2018 (Acrobatic)', result: '1st Runner-Up' },
  { date: '18/08/2018', title: 'International Traditional Lion Dance Invitational Competition (Holiday Plaza JB)', result: 'Champion' },
  { date: '19/08/2018', title: 'Asian Traditional Lion Dance of Primary and Secondary School Championship JB', result: 'Champion' },
  { date: '10/11/2018', title: '7th MGM MACAU International Lion Dance Championship', result: '1st Runner-Up' },
  { date: '06/01/2019', title: 'KBJ International Lion Dance Championship 2019 Popularity Award Contest (Penang)', result: 'Champion' },
  { date: '30/10/2019', title: '5th Asia Dragon & Lion Dance Competition in China Chong Qing', result: 'Champion' },
  { date: '01/12/2019', title: '1st International Water Stilt Lion Dance Championship (Bukit Jalil)', result: '1st Runner-Up' },
  { date: '12/03/2023', title: '10th Kulai IOI Mall International Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '05/10/2024', title: 'Putrajaya, Kuala Lumpur and Selangor Traditional / Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '27/10/2024', title: '2nd PINNACLE SRI PETALING MALL Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '27/10/2024', title: '2nd PINNACLE SRI PETALING MALL Acrobatic Lion Dance Championship', result: '1st Runner-Up' },
  { date: '22/11/2024', title: '12th National Dragon and Lion Dance Championship 2024 Acrobatic Lion Dance Championship', result: 'Champion' },
  { date: '07/12/2024', title: '1st National Traditional Lion Dance Championship Guan Yu Tang at Batu Pahat Mall', result: 'Champion' },
  { date: '14/12/2024', title: '4th National Acrobatic Lion Dance Championship (Luen Sheng Cup) at MyTown', result: 'Champion' },
  { date: '15/12/2024', title: 'Traditional Lion Dance Competition (Magnum Cup) at Centrepoint Seremban', result: 'Champion' },
  { date: '15/12/2024', title: 'Traditional Lion Dance Competition (Magnum Cup) at Centrepoint Seremban', result: '1st Runner-Up' },
  { date: '03/01/2025', title: '1st National Traditional Lion Dance Championship (Long Yi Cup) at Pavilion Bukt Jalil', result: 'Champion' },
  { date: '03/01/2025', title: '1st National Traditional Lion Dance Championship (Long Yi Cup) at Pavilion Bukit Jalil', result: '1st Runner-Up' },
  { date: '04/01/2025', title: '1st National Acrobatic Lion Dance Championship (Long Yi Cup) at Pavilion Bukit Jalil', result: 'Champion' },
  { date: '05/01/2025', title: '1st International Acrobatic Lion Dance Championship (Long Yi Cup) at Pavilion Bukit Jalil', result: '1st Runner-Up' },
  { date: '20/07/2025', title: 'YB Along Cup Acrobatic Lion Dance Championship at Melaka', result: 'Champion' },
  { date: '16/08/2025', title: '1st Invitational National Cultural Acrobatic Lion Dance Championship 2025 at Summit USJ', result: '1st Runner-Up' },
  { date: '20/09/2025', title: 'The 3rd Traditional Sports International Festival at WuXi China – Acrobatic Lion Dance', result: 'Champion' },
  { date: '19/10/2025', title: 'The 7th ASIAN Dragon & Lion Dance Championship Acrobatic JABABEKA - INDONESIA', result: 'Champion' },
  { date: '26/10/2025', title: 'Kejohanan Tarian Singa Akrobatik 2025 Negeri Sembilan - Kwong Ngai KL', result: 'Champion' },
  { date: '26/10/2025', title: 'Kejohanan Tarian Singa Akrobatik 2025 Negeri Sembilan - Kwong Ngai Putrajaya', result: '1st Runner-Up' },
  { date: '09/11/2025', title: '14th Penang International High-Poles Lion Dance Invitation Competition 2025', result: '1st Runner-Up' },
  { date: '15/11/2025', title: 'Taiwan International Acrobatic Lion Dance Competition Water and Land (Kao Shiung)', result: 'Champion' },
  { date: '26/12/2025', title: '50th Anniversary Tien Nam Shi Temple, Kinarut Town Sabah KK Invitation World Acrobatic Lion Dance Championship', result: 'Champion' },
];

// Gallery images for Page 3
const galleryImages = [
  '/winnings-1.jpeg',
  '/winnings-2.jpeg',
  '/winnings-3.jpeg',
  '/winnings-4.jpeg',
  '/winnings-5.jpeg',
  '/winnings-6.jpeg',
  '/winnings-7.jpeg',
  '/winnings-8.jpeg',
  '/winnings-9.jpeg',
];

export default function WinningsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sort awards by date (descending - most recent first)
  const awards = currentPage === 1
    ? sortAwardsByDate(nationalAwards)
    : sortAwardsByDate(internationalAwards);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Reset visible items when page changes
    setVisibleItems(new Set());
    itemRefs.current = [];
  }, [currentPage]);

  useEffect(() => {
    // Small delay to ensure refs are populated
    const timeoutId = setTimeout(() => {
      // Set up Intersection Observer for scroll-based animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems(prev => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                // Add to visible set when entering viewport
                newSet.add(index);
              } else {
                // Remove from visible set when leaving viewport
                newSet.delete(index);
              }
              return newSet;
            });
          });
        },
        {
          threshold: 0.2, // Trigger when 20% of the item is visible
          rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
        }
      );

      // Observe all items
      itemRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [awards]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Winnings - Kwong Ngai Lion Dance</title>
        <meta name="description" content="Awards and achievements of Kwong Ngai Lion Dance troupe" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        {/* Watermark Logo - Hide on Page 3 */}
        {currentPage !== 3 && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <img
              src="/logo-white.jpg"
              alt="Kwong Ngai Logo Watermark"
              className="h-auto w-[60vw] sm:w-[40vw] opacity-8 object-contain"
            />
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 z-[100] bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all font-semibold"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ← Back
        </button>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2 text-center uppercase relative z-10 mt-16"
          style={{ fontFamily: "'Alfa Slab One', cursive" }}
        >
          Achievements
        </h1>

        {/* Subtitle */}
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-6 text-center uppercase relative z-10"
          style={{ fontFamily: "'Alfa Slab One', cursive" }}
        >
          {currentPage === 1 ? 'National Level' : currentPage === 2 ? 'World & International Level' : 'Gallery'}
        </h2>

        {/* Page Navigation */}
        <div className="flex gap-4 mb-8 relative z-10 flex-wrap justify-center items-center">
          {/* Left Arrow - hidden but maintains layout on page 1 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-4 py-2 rounded-lg font-semibold transition-opacity duration-300 ease-in-out bg-white text-black border-2 border-black hover:bg-gray-200 ${currentPage === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {/* Page Number Buttons */}
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? 'bg-black text-white border-2 border-black'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {page}
            </button>
          ))}

          {/* Right Arrow - hidden but maintains layout on page 3 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-4 py-2 rounded-lg font-semibold transition-opacity duration-300 ease-in-out bg-white text-black border-2 border-black hover:bg-gray-200 ${currentPage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
            disabled={currentPage === 3}
          >
            →
          </button>
        </div>

        {/* Awards List - Only show for Page 1 and 2 */}
        {currentPage !== 3 && (
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 sm:p-8 relative z-10">
            {/* Header Row */}
            <div className="grid gap-4 px-3 pb-4 mb-4 border-b-2 border-gray-300 font-bold text-gray-900 text-sm sm:text-base" style={{ gridTemplateColumns: 'minmax(100px, auto) 1fr auto' }}>
              <div className="text-left">Date</div>
              <div className="text-left">Competition's Title</div>
              <div className="text-right">Result</div>
            </div>

            {/* Award Rows */}
            <div className="space-y-3">
              {awards.map((award, index) => (
                <div
                  key={index}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  data-index={index}
                  className={`grid gap-4 p-3 rounded-lg transition-all duration-500 ${
                    visibleItems.has(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  } hover:bg-gray-50`}
                  style={{ gridTemplateColumns: 'minmax(100px, auto) 1fr auto' }}
                >
                  <div className="text-left text-sm sm:text-base text-gray-700 font-medium whitespace-nowrap">
                    {award.date}
                  </div>
                  <div className="text-left text-sm sm:text-base text-gray-700">
                    {award.title}
                  </div>
                  <div className="text-right text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                    {award.result}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery - Only show for Page 3 */}
        {currentPage === 3 && (
          <div className="w-full max-w-7xl relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  data-index={index}
                  className={`relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-500 ${
                    visibleItems.has(index)
                      ? 'opacity-100 translate-y-0 hover:scale-105'
                      : 'opacity-0 translate-y-8'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-semibold text-lg">Image {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <img
              src={galleryImages[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((selectedImage + 1) % galleryImages.length);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-all shadow-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
