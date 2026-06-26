export const mergeVillaConfigs = (stored, defaults) => {
  const merged = { ...defaults };
  if (!stored) return merged;

  for (const villaId of Object.keys(defaults)) {
    merged[villaId] = {
      ...defaults[villaId],
      ...(stored[villaId] || {}),
      amenities: stored[villaId]?.amenities ?? defaults[villaId].amenities,
      gallery: stored[villaId]?.gallery ?? defaults[villaId].gallery ?? [],
    };
  }
  return merged;
};

export const getVillaImage = (villaConfig, fallbackHue = 140) => {
  if (villaConfig?.image) return villaConfig.image;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${fallbackHue},35%,25%)"/>
        <stop offset="100%" style="stop-color:hsl(${fallbackHue + 40},45%,45%)"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="400" y="300" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Georgia,serif" font-size="28">${villaConfig?.name || 'Villa'}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const getGalleryImages = (villaConfig, fallbackHue = 140) => {
  const main = getVillaImage(villaConfig, fallbackHue);
  const gallery = villaConfig?.gallery?.length ? villaConfig.gallery : [main];
  return gallery;
};
