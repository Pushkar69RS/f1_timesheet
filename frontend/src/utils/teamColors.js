// frontend/src/utils/teamColors.js

const TEAM_COLORS = {
  'Red Bull Racing': '#0600EF',
  'Mercedes': '#00D2BE',
  'Ferrari': '#DC0000',
  'McLaren': '#FF8700',
  'Aston Martin': '#006F62',
  'Alpine': '#0090FF',
  'Williams': '#005AFF',
  'RB': '#6692FF', // Formerly AlphaTauri
  'Sauber': '#52E252', // Formerly Alfa Romeo / Stake F1 Team
  'Haas F1 Team': '#FFFFFF', // White, might need a border for visibility
  // Add more teams as needed
};

export function getTeamColor(teamName) {
  return TEAM_COLORS[teamName] || '#808080'; // Default to grey if team not found
}