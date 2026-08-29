// frontend/src/utils/teamColors.js

const TEAM_COLORS = {
  'Red Bull Racing': '#3671C6',
  'Red Bull': '#3671C6',
  'Mercedes': '#27F4D2',
  'Ferrari': '#E80020',
  'McLaren': '#FF8000',
  'Aston Martin': '#229971',
  'Audi': '#E60000',
  'Audi F1 Team': '#E60000',
  'Williams': '#64C4FF',
  'Alpine': '#0093CC',
  'RB': '#6692FF',
  'Racing Bulls': '#6692FF',
  'Haas': '#B6BABD',
  'Haas F1 Team': '#B6BABD',
  'Sauber': '#52E252',
  'Kick Sauber': '#52E252',
};

const TYRE_STYLES = {
  SOFT: { bg: '#E10600', text: '#FFFFFF', border: '#E10600', label: 'S' },
  MEDIUM: { bg: '#FFD700', text: '#000000', border: '#FFD700', label: 'M' },
  HARD: { bg: '#FFFFFF', text: '#000000', border: '#B0B0B0', label: 'H' },
  INTERMEDIATE: { bg: '#39B54A', text: '#FFFFFF', border: '#39B54A', label: 'I' },
  WET: { bg: '#00A3E0', text: '#FFFFFF', border: '#00A3E0', label: 'W' },
};

export function getTeamColor(teamName) {
  if (!teamName) return '#808080';
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (teamName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(teamName.toLowerCase())) {
      return color;
    }
  }
  return '#808080';
}

export function getTyreStyle(compound) {
  if (!compound) return null;
  const key = String(compound).trim().toUpperCase();
  return TYRE_STYLES[key] || { bg: '#4A5568', text: '#FFFFFF', border: '#718096', label: key.charAt(0) };
}