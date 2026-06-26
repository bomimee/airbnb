import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { getVillaImage } from '../utils/villaHelpers';
import {
  Save, Upload, Trash2, Image, DollarSign, FileText, Tag,
  MapPin, Users, Bed, Bath, CheckCircle, Plus, X, Mail
} from 'lucide-react';

const VILLA_IDS = ['sunrise', 'sunset'];
const VILLA_LABELS = { sunrise: 'Sunrise Villa', sunset: 'Sunset Villa' };

export default function AdminContent() {
  const { villaConfigs, updateVillaConfig, contactEmail, saveContactEmail } = useContext(AppContext);
  const [activeVilla, setActiveVilla] = useState('sunrise');
  const [saved, setSaved] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [contactDraft, setContactDraft] = useState(contactEmail);
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const config = villaConfigs[activeVilla];
  const fallbackHue = activeVilla === 'sunrise' ? 140 : 200;

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFieldChange = (field, value) => {
    updateVillaConfig(activeVilla, { [field]: value });
  };

  const handleSaveAll = () => {
    saveContactEmail(contactDraft);
    showSaved();
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('이미지는 2MB 이하로 업로드해 주세요.');
      return;
    }
    const base64 = await readFileAsBase64(file);
    updateVillaConfig(activeVilla, { image: base64 });
    e.target.value = '';
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages = [];
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) continue;
      newImages.push(await readFileAsBase64(file));
    }
    const gallery = [...(config.gallery || []), ...newImages];
    updateVillaConfig(activeVilla, { gallery });
    e.target.value = '';
  };

  const removeGalleryImage = (index) => {
    const gallery = (config.gallery || []).filter((_, i) => i !== index);
    updateVillaConfig(activeVilla, { gallery });
  };

  const removeCoverImage = () => {
    updateVillaConfig(activeVilla, { image: null });
  };

  const addAmenity = () => {
    const trimmed = newAmenity.trim();
    if (!trimmed) return;
    const amenities = [...(config.amenities || []), trimmed];
    updateVillaConfig(activeVilla, { amenities });
    setNewAmenity('');
  };

  const removeAmenity = (index) => {
    const amenities = (config.amenities || []).filter((_, i) => i !== index);
    updateVillaConfig(activeVilla, { amenities });
  };

  const coverSrc = getVillaImage(config, fallbackHue);

  return (
    <div className="animate-fade-in">
      {/* Success Banner */}
      {saved && (
        <div style={{
          backgroundColor: 'rgba(19, 46, 39, 0.1)',
          borderLeft: '4px solid var(--primary)',
          color: 'var(--primary)',
          padding: '12px 16px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '14px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          <CheckCircle size={18} /> 변경사항이 저장되었습니다. 사용자 화면에 즉시 반영됩니다.
        </div>
      )}

      {/* Villa Selector */}
      <div className="flex gap-2" style={{ marginBottom: '28px' }}>
        {VILLA_IDS.map((id) => (
          <button
            key={id}
            className="btn btn-secondary"
            onClick={() => setActiveVilla(id)}
            style={{
              flex: 1,
              maxWidth: '220px',
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: activeVilla === id ? 'var(--primary)' : 'transparent',
              color: activeVilla === id ? '#fff' : 'var(--primary)',
              borderColor: 'var(--primary)'
            }}
          >
            {VILLA_LABELS[id]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4" style={{ alignItems: 'start' }}>

        {/* Left: Basic Info & Pricing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Basic Info Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              <FileText size={18} style={{ color: 'var(--secondary)' }} /> 기본 정보
            </h3>

            <div className="form-group">
              <label>숙소 이름</label>
              <input
                type="text"
                className="form-control"
                value={config.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} /> 태그라인 (카드 배지)
              </label>
              <input
                type="text"
                className="form-control"
                value={config.tagline}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                placeholder="예: Traditional Teak & Lush Garden"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} /> 1박 요금 (USD)
              </label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={config.price}
                onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> 위치
              </label>
              <input
                type="text"
                className="form-control"
                value={config.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> 최대 인원</label>
                <input type="number" className="form-control" min="1" max="20"
                  value={config.capacity}
                  onChange={(e) => handleFieldChange('capacity', parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bed size={13} /> 침실</label>
                <input type="number" className="form-control" min="1"
                  value={config.bedrooms}
                  onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bath size={13} /> 욕실</label>
                <input type="text" className="form-control"
                  value={config.baths}
                  onChange={(e) => handleFieldChange('baths', e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
              <label>수영장 유형</label>
              <input type="text" className="form-control"
                value={config.poolType}
                onChange={(e) => handleFieldChange('poolType', e.target.value)}
                placeholder="예: Private Pool" />
            </div>
          </div>

          {/* Descriptions Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              숙소 설명
            </h3>

            <div className="form-group">
              <label>짧은 설명 (목록 카드용)</label>
              <textarea
                className="form-control"
                rows={3}
                value={config.shortDescription}
                onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>상세 설명 (상세 페이지용)</label>
              <textarea
                className="form-control"
                rows={6}
                value={config.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* Amenities Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              편의시설
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {(config.amenities || []).map((amenity, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', backgroundColor: 'var(--gray-100)',
                  borderRadius: '20px', fontSize: '13px', color: 'var(--primary)'
                }}>
                  {amenity}
                  <button onClick={() => removeAmenity(i)} style={{ color: 'var(--accent)', display: 'flex' }}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="form-control"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="편의시설 추가..."
                style={{ flex: 1 }}
              />
              <button className="btn btn-secondary" onClick={addAmenity} style={{ padding: '0 16px' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Photos & Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Cover Photo */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              <Image size={18} style={{ color: 'var(--secondary)' }} /> 대표 사진
            </h3>

            <div style={{
              height: '220px', borderRadius: 'var(--border-radius-md)',
              overflow: 'hidden', marginBottom: '16px', position: 'relative',
              border: '2px dashed var(--gray-300)'
            }}>
              <img src={coverSrc} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />

            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={() => coverInputRef.current?.click()} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Upload size={16} /> 사진 업로드
              </button>
              {config.image && (
                <button className="btn btn-danger" onClick={removeCoverImage} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={16} /> 삭제
                </button>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '10px' }}>JPG, PNG · 최대 2MB</p>
          </div>

          {/* Gallery */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              갤러리 사진 ({(config.gallery || []).length}장)
            </h3>

            {(config.gallery || []).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {(config.gallery || []).map((img, i) => (
                  <div key={i} style={{ position: 'relative', height: '90px', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
                    <img src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      style={{
                        position: 'absolute', top: '4px', right: '4px',
                        backgroundColor: 'rgba(231, 111, 81, 0.9)', color: '#fff',
                        borderRadius: '50%', width: '24px', height: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '16px', textAlign: 'center', padding: '20px', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--border-radius-sm)' }}>
                갤러리 사진이 없습니다. 대표 사진이 갤러리에 표시됩니다.
              </p>
            )}

            <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
            <button className="btn btn-secondary" onClick={() => galleryInputRef.current?.click()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Upload size={16} /> 갤러리 사진 추가
            </button>
          </div>

          {/* Contact Settings */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              <Mail size={18} style={{ color: 'var(--secondary)' }} /> 연락처 설정
            </h3>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>문의 이메일 (푸터에 표시)</label>
              <input
                type="email"
                className="form-control"
                value={contactDraft}
                onChange={(e) => setContactDraft(e.target.value)}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            className="btn btn-primary"
            onClick={handleSaveAll}
            style={{ width: '100%', padding: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Save size={18} /> 변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}
