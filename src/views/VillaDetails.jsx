import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getVillaImage, getGalleryImages } from '../utils/villaHelpers';
import { Star, MapPin, Check, ChevronLeft, ArrowRight, AlertCircle } from 'lucide-react';

const FALLBACK_HUES = { sunrise: 140, sunset: 200 };

export default function VillaDetails() {
  const { 
    selectedVillaId, 
    setCurrentView, 
    reviews, 
    addReview,
    currentUser,
    villaConfigs
  } = useContext(AppContext);

  // Form State for Review
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const config = villaConfigs[selectedVillaId] || villaConfigs.sunrise;
  const fallbackHue = FALLBACK_HUES[selectedVillaId] || 140;
  const villaName = config.name;
  const gallery = getGalleryImages(config, fallbackHue);
  const amenities = config.amenities || [];
  const villaReviews = reviews.filter(r => r.villaId === selectedVillaId);
  const avgRating = villaReviews.length
    ? (villaReviews.reduce((s, r) => s + r.rating, 0) / villaReviews.length).toFixed(1)
    : '5.0';

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewName || !comment) return;

    addReview(selectedVillaId, reviewName, rating, comment);
    setReviewSuccess(true);
    setComment('');
    if (!currentUser) setReviewName('');

    setTimeout(() => {
      setReviewSuccess(false);
    }, 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 100px' }}>
      
      {/* Back navigation */}
      <button 
        onClick={() => setCurrentView('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--primary)',
          fontWeight: '600',
          marginBottom: '30px',
          fontSize: '15px'
        }}
      >
        <ChevronLeft size={20} /> Back to Villas
      </button>

      {/* Hero Layout */}
      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '60px', alignItems: 'start' }}>
        
        {/* Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '480px', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img src={gallery[0]} alt={villaName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {gallery.slice(1, 4).map((img, i) => (
              <div key={i} style={{
                height: '100px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden',
                border: i === 0 ? '2px solid var(--secondary)' : 'none',
                opacity: i === 2 && gallery.length > 4 ? 0.7 : 1,
                position: 'relative'
              }}>
                <img src={img} alt={`Gallery ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 2 && gallery.length > 4 && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(19, 46, 39, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '14px'
                  }}>
                    +{gallery.length - 4} Photos
                  </div>
                )}
              </div>
            ))}
            {gallery.length < 4 && gallery.slice(1).length < 3 && (
              Array.from({ length: Math.max(0, 3 - (gallery.length - 1)) }).map((_, i) => (
                <div key={`pad-${i}`} style={{ height: '100px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', opacity: 0.5 }}>
                  <img src={gallery[0]} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingLeft: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>{config.tagline}</span>
              <div className="flex align-center gap-1">
                <Star size={14} fill="var(--secondary)" style={{ color: 'var(--secondary)' }} />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  {avgRating} ({villaReviews.length} Reviews)
                </span>
              </div>
            </div>
            <h2 style={{ fontSize: '42px', marginBottom: '16px' }}>{villaName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-800)', fontSize: '15px' }}>
              <MapPin size={16} style={{ color: 'var(--secondary)' }} />
              <span>{config.location}</span>
            </div>
          </div>

          <p style={{ color: 'var(--gray-800)', fontSize: '16px', lineHeight: '1.8' }}>
            {config.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', backgroundColor: 'var(--gray-100)', padding: '20px', borderRadius: 'var(--border-radius-md)' }}>
            <div>
              <span style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Capacity</span>
              <strong style={{ fontSize: '16px', color: 'var(--primary)' }}>{config.capacity} Guests</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Beds</span>
              <strong style={{ fontSize: '16px', color: 'var(--primary)' }}>{config.bedrooms} King Beds</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Bathrooms</span>
              <strong style={{ fontSize: '16px', color: 'var(--primary)' }}>{config.baths} Baths</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', borderTop: '1px solid var(--gray-200)', paddingTop: '24px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '14px', color: 'var(--gray-500)' }}>Rate per Night</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>${config.price}</span>
              <span style={{ fontSize: '16px', color: 'var(--gray-500)' }}> / night</span>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentView(`booking-${selectedVillaId}`)}
              style={{ padding: '16px 40px', fontSize: '16px', display: 'flex', gap: '8px' }}
            >
              Configure Reservation <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* Tabs / Amenities & Map */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '80px' }}>
        
        {/* Amenities Column */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>What this Place Offers</h3>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--gray-800)' }}>
                <div style={{ color: 'var(--primary)', backgroundColor: 'var(--gray-100)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                  <Check size={14} />
                </div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Map Mock */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>Location Map</h3>
          <div style={{
            flex: 1,
            backgroundColor: 'var(--gray-200)',
            borderRadius: 'var(--border-radius-md)',
            position: 'relative',
            minHeight: '200px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Elegant map layout using absolute divs */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#e2ebda' }}>
              {/* Map roads mock */}
              <div style={{ position: 'absolute', top: '30%', left: 0, width: '100%', height: '8px', backgroundColor: '#fff', transform: 'rotate(-10deg)' }} />
              <div style={{ position: 'absolute', top: 0, left: '60%', width: '8px', height: '100%', backgroundColor: '#fff', transform: 'rotate(15deg)' }} />
              {/* Coast mock */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%', backgroundColor: '#aed1d6', borderRadius: '100% 100% 0 0' }} />
              
              {/* Villa Pin */}
              <div style={{
                position: 'absolute',
                top: '55%',
                left: '52%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--secondary)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: '4px'
                }}>
                  {villaName}
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--accent)',
                  border: '2.5px solid #fff',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-sm)'
                }} />
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>
              Latitude -8.8290, Longitude 115.0874
            </div>
          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <div style={{ borderTop: '1px solid var(--gray-300)', paddingTop: '60px' }}>
        <h3 style={{ fontSize: '26px', marginBottom: '30px' }}>Guest Reviews</h3>
        
        <div className="grid grid-cols-3 gap-4" style={{ alignItems: 'start' }}>
          
          {/* Reviews List */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {villaReviews.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>No reviews yet for this villa. Be the first to share your experience!</p>
            ) : (
              villaReviews.map(review => (
                <div key={review.id} className="card" style={{ padding: '24px' }}>
                  <div className="flex align-center justify-between" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--gray-200)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                        fontSize: '15px'
                      }}>
                        {review.guestName.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', color: 'var(--primary)' }}>{review.guestName}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{review.date}</span>
                      </div>
                    </div>
                    <div className="flex align-center gap-1" style={{ color: 'var(--secondary)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < Math.floor(review.rating) ? 'var(--secondary)' : 'none'} 
                          style={{ color: 'var(--secondary)' }} 
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '14.5px', color: 'var(--gray-800)', lineHeight: '1.6' }}>
                    "{review.comment}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Panel */}
          <div className="card">
            <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Leave a Review</h4>
            
            {reviewSuccess && (
              <div style={{
                backgroundColor: 'rgba(19, 46, 39, 0.1)',
                borderLeft: '4px solid var(--primary)',
                color: 'var(--primary)',
                padding: '10px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} /> Review submitted successfully!
              </div>
            )}

            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="John Doe" 
                  required
                  disabled={!!currentUser}
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <select 
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                >
                  <option value={5}>5 Stars - Perfect</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comment</label>
                <textarea 
                  className="form-control" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your stay..." 
                  rows={4} 
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                Submit Review
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
