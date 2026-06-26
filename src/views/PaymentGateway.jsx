import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, ChevronLeft, CreditCard, Award, ArrowRight, CheckCircle2, Ticket } from 'lucide-react';

export default function PaymentGateway() {
  const { 
    currentReservation, 
    createBooking, 
    setCurrentView, 
    setCurrentReservation 
  } = useContext(AppContext);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Interface states
  const [focusedField, setFocusedField] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
  const [processingMsg, setProcessingMsg] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  if (!currentReservation) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p>No active booking session found.</p>
        <button className="btn btn-primary" onClick={() => setCurrentView('home')}>Go Home</button>
      </div>
    );
  }

  // Format Card Number (space every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  // CVV Input (digits only, max 3)
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    if (field === 'cvv') {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const handleBlur = () => {
    setFocusedField('');
    setIsFlipped(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanCard = cardNumber.replace(/\s/g, '');
    
    if (cleanCard.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required.';
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = 'Expiry must be in MM/YY format.';
    } else {
      const [month, year] = cardExpiry.split('/');
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.cardExpiry = 'Invalid month.';
      }
    }
    if (cardCvv.length !== 3) {
      newErrors.cardCvv = 'CVC must be 3 digits.';
    }
    if (!zipCode.trim() || zipCode.length < 5) {
      newErrors.zipCode = 'Valid Zip code required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPaymentStatus('processing');
    
    // Simulate Stripe payment gateway step-by-step
    const steps = [
      'Establishing secure connection with Stripe...',
      'Verifying credit card details with card network...',
      'Authorizing charge of $' + currentReservation.grandTotal + '...',
      'Locking reservation dates for ' + currentReservation.villaName + '...',
      'Finalizing reservation and emailing receipt...'
    ];

    let currentStep = 0;
    setProcessingMsg(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingMsg(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        // Save the booking in context
        const savedBooking = createBooking({
          villaId: currentReservation.villaId,
          villaName: currentReservation.villaName,
          checkIn: currentReservation.checkIn,
          checkOut: currentReservation.checkOut,
          guests: currentReservation.guests,
          totalPrice: currentReservation.grandTotal,
          userEmail: currentReservation.userEmail
        });

        setConfirmedBookingId(savedBooking.id);
        setPaymentStatus('success');
      }
    }, 1200);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="container animate-fade-in" style={{ padding: '60px 24px 100px', maxWidth: '650px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
          
          <div style={{ color: 'var(--primary)', backgroundColor: 'rgba(19, 46, 39, 0.1)', padding: '20px', borderRadius: '50%', display: 'flex' }}>
            <CheckCircle2 size={50} style={{ color: 'var(--primary)' }} />
          </div>

          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>
              Your tropical stay at {currentReservation.villaName} has been secured.
            </p>
          </div>

          {/* Receipt Box */}
          <div className="glass" style={{
            width: '100%',
            backgroundColor: 'var(--gray-100)',
            borderRadius: 'var(--border-radius-md)',
            padding: '24px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid var(--gray-300)',
            fontSize: '14px',
            color: 'var(--gray-800)'
          }}>
            <div className="flex justify-between" style={{ borderBottom: '1px dashed var(--gray-300)', paddingBottom: '10px', color: 'var(--primary)', fontWeight: 'bold' }}>
              <span className="flex align-center gap-1"><Ticket size={16} /> Booking Reference</span>
              <span>{confirmedBookingId}</span>
            </div>

            <div className="flex justify-between">
              <span>Villa</span>
              <strong style={{ color: 'var(--primary)' }}>{currentReservation.villaName}</strong>
            </div>
            
            <div className="flex justify-between">
              <span>Check-In</span>
              <strong style={{ color: 'var(--primary)' }}>{currentReservation.checkIn}</strong>
            </div>

            <div className="flex justify-between">
              <span>Check-Out</span>
              <strong style={{ color: 'var(--primary)' }}>{currentReservation.checkOut}</strong>
            </div>

            <div className="flex justify-between">
              <span>Guests</span>
              <strong style={{ color: 'var(--primary)' }}>{currentReservation.guests} Guests</strong>
            </div>

            <div className="flex justify-between" style={{ borderTop: '1px solid var(--gray-300)', paddingTop: '10px', fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>
              <span>Total Paid (Stripe)</span>
              <span>${currentReservation.grandTotal}</span>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: '1.6' }}>
            A confirmation receipt, check-in instructions, and packing guidelines have been sent to <strong>{currentReservation.userEmail}</strong>.
          </div>

          <div className="flex gap-2" style={{ width: '100%' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setCurrentReservation(null);
                setCurrentView('home');
              }}
              style={{ flex: 1 }}
            >
              Back to Home
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setCurrentReservation(null);
                setCurrentView('guest-dashboard');
              }}
              style={{ flex: 1 }}
            >
              My Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 100px' }}>
      
      {/* Back Nav */}
      <button 
        onClick={() => setCurrentView(`booking-${currentReservation.villaId}`)}
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
        <ChevronLeft size={20} /> Back to Booking Calendar
      </button>

      {paymentStatus === 'processing' ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          gap: '24px'
        }}>
          <div className="loader" style={{ width: '50px', height: '50px', borderWidth: '5px' }}></div>
          <div>
            <h3 style={{ fontSize: '22px', color: 'var(--primary)', marginBottom: '8px' }}>Processing Payment...</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>{processingMsg}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4" style={{ alignItems: 'start' }}>
          
          {/* Left: Card Animation & Stripe Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            
            {/* 3D Flipping Card Container */}
            <div className="card-container" style={{
              perspective: '1000px',
              width: '100%',
              maxWidth: '380px',
              height: '220px'
            }}>
              <div className="card-wrapper" style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isFlipped ? 'rotateY(180deg)' : 'none'
              }}>
                {/* Front Side */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #132E27 0%, #224C41 100%)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '24px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1.5px solid var(--secondary)'
                }}>
                  {/* Card top */}
                  <div className="flex justify-between align-center">
                    <div style={{ fontWeight: '800', letterSpacing: '2px', fontSize: '16px', color: 'var(--secondary)' }}>SENTILOW</div>
                    <div style={{ width: '40px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>VISA</div>
                  </div>
                  
                  {/* Card Chip */}
                  <div style={{
                    width: '38px',
                    height: '28px',
                    backgroundColor: 'rgba(212, 163, 115, 0.6)',
                    borderRadius: '4px',
                    marginRight: 'auto'
                  }} />

                  {/* Card Number */}
                  <div style={{
                    fontSize: '20px',
                    letterSpacing: '3px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    padding: '8px 0',
                    border: focusedField === 'number' ? '1px dashed var(--secondary)' : '1px solid transparent',
                    borderRadius: '4px',
                    transition: 'border var(--transition-fast)'
                  }}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Card Bottom */}
                  <div className="flex justify-between align-center">
                    <div style={{
                      border: focusedField === 'holder' ? '1px dashed var(--secondary)' : '1px solid transparent',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      maxWidth: '75%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <div style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.7 }}>Card Holder</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{cardHolder.toUpperCase() || 'YOUR NAME'}</div>
                    </div>
                    
                    <div style={{
                      border: focusedField === 'expiry' ? '1px dashed var(--secondary)' : '1px solid transparent',
                      borderRadius: '4px',
                      padding: '2px 4px'
                    }}>
                      <div style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.7 }}>Expires</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #132E27 0%, #224C41 100%)',
                  boxShadow: 'var(--shadow-lg)',
                  color: '#fff',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px 0',
                  border: '1.5px solid var(--secondary)'
                }}>
                  {/* Magnetic Strip */}
                  <div style={{ height: '40px', backgroundColor: '#0e1d19', width: '100%' }} />
                  
                  {/* CVV Container */}
                  <div style={{ padding: '0 24px' }}>
                    <div style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.7, textAlign: 'right', marginBottom: '4px' }}>CVC / CVV</div>
                    <div className="flex align-center" style={{ backgroundColor: '#fff', height: '36px', borderRadius: '4px', padding: '0 10px', justifyContent: 'flex-end' }}>
                      <span style={{ fontFamily: 'monospace', color: '#000', letterSpacing: '2px', fontWeight: 'bold' }}>
                        {cardCvv || '•••'}
                      </span>
                    </div>
                  </div>

                  {/* Legal Text */}
                  <p style={{ fontSize: '8px', opacity: 0.6, padding: '0 24px', textAlign: 'center' }}>
                    This is a simulated transaction security interface representing Stripe checkout environment. No real funds are transferred.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePay} style={{ width: '100%', maxWidth: '400px' }}>
              
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => handleFocus('number')}
                  onBlur={handleBlur}
                  placeholder="4242 4242 4242 4242"
                  style={{ borderColor: errors.cardNumber ? 'var(--accent)' : 'var(--gray-300)' }}
                  required
                />
                {errors.cardNumber && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>{errors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label>Card Holder Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  onFocus={() => handleFocus('holder')}
                  onBlur={handleBlur}
                  placeholder="JOHN DOE"
                  style={{ borderColor: errors.cardHolder ? 'var(--accent)' : 'var(--gray-300)' }}
                  required
                />
                {errors.cardHolder && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>{errors.cardHolder}</span>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="form-group">
                  <label>Expiration (MM/YY)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    onFocus={() => handleFocus('expiry')}
                    onBlur={handleBlur}
                    placeholder="12/28"
                    style={{ borderColor: errors.cardExpiry ? 'var(--accent)' : 'var(--gray-300)' }}
                    required
                  />
                  {errors.cardExpiry && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>{errors.cardExpiry}</span>}
                </div>

                <div className="form-group">
                  <label>CVC (CVV)</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={cardCvv}
                    onChange={handleCvvChange}
                    onFocus={() => handleFocus('cvv')}
                    onBlur={handleBlur}
                    placeholder="•••"
                    style={{ borderColor: errors.cardCvv ? 'var(--accent)' : 'var(--gray-300)' }}
                    required
                  />
                  {errors.cardCvv && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>{errors.cardCvv}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Billing Zip/Postal Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  onFocus={() => handleFocus('zip')}
                  onBlur={handleBlur}
                  placeholder="80361"
                  style={{ borderColor: errors.zipCode ? 'var(--accent)' : 'var(--gray-300)' }}
                  required
                />
                {errors.zipCode && <span style={{ color: 'var(--accent)', fontSize: '11px' }}>{errors.zipCode}</span>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px 0', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> Pay ${currentReservation.grandTotal} USD
              </button>
            </form>
          </div>

          {/* Right: Booking Summary Invoice */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              <CreditCard size={20} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '20px' }}>Stripe Checkout</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px', color: 'var(--gray-800)' }}>
              
              <div className="flex justify-between">
                <span>Villa Selection</span>
                <strong style={{ color: 'var(--primary)' }}>{currentReservation.villaName}</strong>
              </div>

              <div className="flex justify-between">
                <span>Dates</span>
                <strong style={{ color: 'var(--primary)' }}>{currentReservation.checkIn} to {currentReservation.checkOut}</strong>
              </div>

              <div className="flex justify-between">
                <span>Total Nights</span>
                <strong style={{ color: 'var(--primary)' }}>{currentReservation.nights} Nights</strong>
              </div>

              <div className="flex justify-between">
                <span>Guests count</span>
                <strong style={{ color: 'var(--primary)' }}>{currentReservation.guests} Guests</strong>
              </div>

              <div style={{ borderTop: '1px solid var(--gray-200)', margin: '10px 0' }} />

              <div className="flex justify-between">
                <span>Accommodation Rate</span>
                <span>${currentReservation.accommodationTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Cleaning Service Fee</span>
                <span>${currentReservation.cleaningFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Stripe & Local Tax (12%)</span>
                <span>${currentReservation.serviceTax}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--gray-200)', margin: '10px 0' }} />

              <div className="flex justify-between" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                <span>Amount Due</span>
                <span>${currentReservation.grandTotal}</span>
              </div>

            </div>

            <div className="glass" style={{
              marginTop: '30px',
              padding: '16px',
              borderRadius: 'var(--border-radius-md)',
              border: '1px dashed var(--gray-300)',
              fontSize: '12px',
              color: 'var(--gray-500)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Award size={14} style={{ color: 'var(--secondary)' }} /> Secure Stripe Transaction
              </div>
              <p>Your payment information is encrypted and transmitted directly to the card network. Under demo mode, enter any details and click Pay.</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
