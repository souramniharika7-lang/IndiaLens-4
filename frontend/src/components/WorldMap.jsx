import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * Normalize a score to 0–1 range.
 * @param {number} score
 * @param {number} min
 * @param {number} max
 * @param {boolean} higherIsBetter
 * @returns {number}
 */
export const normalizeScore = (score, min, max, higherIsBetter = true) => {
  if (min === max) return 0.5;
  const ratio = (score - min) / (max - min);
  return higherIsBetter ? ratio : 1 - ratio;
};

/** Linearly interpolate two hex colours */
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const interpolate = (a, b, t) => {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl2 = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl2})`;
};

/**
 * Map a normalized 0–1 value to a colour.
 * @param {number|null} normalized
 * @returns {string} CSS colour
 */
export const scoreToColor = (normalized) => {
  if (normalized === null || normalized === undefined || isNaN(normalized)) return '#cccccc';
  if (normalized >= 0.67) return interpolate('#f39c12', '#2ecc71', (normalized - 0.67) / 0.33);
  return interpolate('#e74c3c', '#f39c12', normalized / 0.67);
};

const WorldMap = memo(({ countryColorMap = {}, onCountryClick }) => (
  <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: '100%', height: 'auto' }}>
    <ZoomableGroup center={[0, 20]} zoom={1}>
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map(geo => {
            const code = geo.properties.name;
            const color = countryColorMap[code] || countryColorMap[geo.id] || '#cccccc';
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={color}
                stroke="#fff"
                strokeWidth={0.4}
                onClick={() => onCountryClick && onCountryClick(geo)}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#FF6B35', outline: 'none', cursor: 'pointer' },
                  pressed: { outline: 'none' }
                }}
              />
            );
          })
        }
      </Geographies>
    </ZoomableGroup>
  </ComposableMap>
));

export default WorldMap;
