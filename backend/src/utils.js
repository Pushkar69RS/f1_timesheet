// backend/src/utils.js

/**
 * Formats a time in seconds to mm:ss.mmm
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTime(totalSeconds) {
  if (totalSeconds === null || isNaN(totalSeconds)) {
    return '-';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

/**
 * Converts OpenF1 API date string to a Date object.
 * Returns null if dateString is invalid or null/undefined.
 * @param {string} dateString - Date string from OpenF1 API (e.g., "2024-03-02T15:00:00.000Z")
 * @returns {Date | null}
 */
function parseOpenF1Date(dateString) {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
}

module.exports = {
  formatTime,
  parseOpenF1Date,
};