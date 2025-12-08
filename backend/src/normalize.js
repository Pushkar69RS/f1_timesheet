// backend/src/normalize.js
const { parseOpenF1Date } = require('./utils');

function parseXY(value) {
  if (!value) return null;
  if (typeof value === 'object' && value !== null) {
    if ('x' in value && 'y' in value) return { x: Number(value.x), y: Number(value.y) };
    if ('lon' in value && 'lat' in value) return { x: Number(value.lon), y: Number(value.lat) };
  }
  const s = String(value).trim();
  const parts = s.split(/[,\s|]+/).map(p => Number(p)).filter(n => !Number.isNaN(n));
  if (parts.length >= 2) return { x: parts[0], y: parts[1] };
  return null;
}

/**
 * Normalizes raw OpenF1 API data into a consistent event model.
 * This function processes various OpenF1 endpoints (laps, sectors, stints, drivers, positions)
 * and combines them into a single, time-ordered stream of events.
 *
 * @param {object} openf1Json - An object containing raw data from OpenF1 API endpoints.
 *   Expected properties: `laps`, `sectors`, `stints`, `drivers`, `positions`.
 * @returns {Array<object>} An array of normalized event objects, sorted by timestamp.
 */
function normalizeOpenF1(openf1Json) {
  if (!openf1Json || typeof openf1Json !== 'object') {
    console.warn('normalizeOpenF1: Invalid input data');
    return [];
  }

  const { laps = [], sectors = [], stints = [], drivers = [], positions = [], location = [], pit = [] } = openf1Json;

  if (!Array.isArray(drivers)) {
    console.warn('normalizeOpenF1: drivers is not an array', typeof drivers);
    return [];
  }

  const driverMap = new Map();
  drivers.forEach(d => {
    driverMap.set(d.driver_number, {
      driverId: d.driver_number,
      driverName: d.full_name,
      team: d.team_name,
      number: d.driver_number,
      code: d.name_acronym || d.driver_number,
    });
  });

  const events = [];

  // Process Laps
  if (!Array.isArray(laps)) {
    console.warn('normalizeOpenF1: laps is not an array', typeof laps);
  } else {
    laps.forEach(lap => {
    const driverInfo = driverMap.get(lap.driver_number);
    if (!driverInfo) return;

    const timestamp = parseOpenF1Date(lap.date_start);
    if (!timestamp) return;

    const sectorTimes = [
      lap.duration_sector_1 !== undefined && lap.duration_sector_1 !== null ? lap.duration_sector_1 : null,
      lap.duration_sector_2 !== undefined && lap.duration_sector_2 !== null ? lap.duration_sector_2 : null,
      lap.duration_sector_3 !== undefined && lap.duration_sector_3 !== null ? lap.duration_sector_3 : null,
    ];

    events.push({
      kind: 'lap',
      driverId: lap.driver_number,
      driverName: driverInfo.driverName,
      number: driverInfo.number,
      team: driverInfo.team,
      lapNumber: lap.lap_number,
      lapTimeSeconds: lap.lap_duration,
      timestamp: timestamp,
      isPitLap: lap.is_pit_out_lap || false,
      sectorTimes: sectorTimes,
      tyres: null,
      position: null,
      i1_speed: lap.i1_speed,
      i2_speed: lap.i2_speed,
      st_speed: lap.st_speed,
    });
    });
  }

  // Process Sectors and merge with Laps
  if (!Array.isArray(sectors)) {
    console.warn('normalizeOpenF1: sectors is not an array', typeof sectors);
  } else {
    sectors.forEach(sector => {
    const driverInfo = driverMap.get(sector.driver_number);
    if (!driverInfo) return;

    const timestamp = parseOpenF1Date(sector.date);
    if (!timestamp) return; // Skip if timestamp is invalid

    const lapEvent = events.find(
      e => e.kind === 'lap' && e.driverId === sector.driver_number && e.lapNumber === sector.lap_number
    );

    if (lapEvent) {
      // Merge sector times into existing lap event
      if (sector.sector_number === 1) lapEvent.sectorTimes[0] = sector.sector_duration;
      if (sector.sector_number === 2) lapEvent.sectorTimes[1] = sector.sector_duration;
      if (sector.sector_number === 3) lapEvent.sectorTimes[2] = sector.sector_duration;
    } else {
      // If no corresponding lap event, create a standalone sector event
      const sectorTimes = [null, null, null];
      if (sector.sector_number === 1) sectorTimes[0] = sector.sector_duration;
      if (sector.sector_number === 2) sectorTimes[1] = sector.sector_duration;
      if (sector.sector_number === 3) sectorTimes[2] = sector.sector_duration;

      events.push({
        kind: 'sector',
        driverId: sector.driver_number,
        driverName: driverInfo.driverName,
        number: driverInfo.number,
        team: driverInfo.team,
        lapNumber: sector.lap_number,
        lapTimeSeconds: null, // Sector event doesn't have full lap time
        sectorTimes: sectorTimes,
        timestamp: timestamp,
        tyres: null,
        position: null,
      });
    }
    });
  }

  // Process Stints and merge with Laps/Pit events
  if (!Array.isArray(stints)) {
    console.warn('normalizeOpenF1: stints is not an array', typeof stints);
  } else {
    stints.forEach(stint => {
    const driverInfo = driverMap.get(stint.driver_number);
    if (!driverInfo) return;

    // Apply tyre compound to all laps within the stint
    events.filter(e =>
      e.kind === 'lap' &&
      e.driverId === stint.driver_number &&
      e.lapNumber >= stint.lap_start &&
      e.lapNumber <= stint.lap_end
    ).forEach(lapEvent => {
      lapEvent.tyres = stint.compound;
      if (stint.is_pit_out_lap) {
        lapEvent.isPitLap = true;
      }
    });

    // Add explicit pit stop events for pit out laps
    if (stint.is_pit_out_lap) {
      // Find the lap event that corresponds to the pit out lap to get its timestamp
      const pitOutLapEvent = events.find(
        e => e.kind === 'lap' && e.driverId === stint.driver_number && e.lapNumber === stint.lap_start
      );
      if (pitOutLapEvent && pitOutLapEvent.timestamp) {
        events.push({
          kind: 'pit',
          driverId: stint.driver_number,
          driverName: driverInfo.driverName,
          number: driverInfo.number,
          team: driverInfo.team,
          lapNumber: stint.lap_start,
          timestamp: new Date(pitOutLapEvent.timestamp.getTime() - 1000), // Pit event just before the lap starts
          tyres: stint.compound,
          pitDuration: stint.stint_duration, // This is actually stint duration, not pit stop duration
          position: null,
        });
      }
    }
    });
  }

  // Process dedicated Pit endpoint data
  if (!Array.isArray(pit)) {
    console.warn('normalizeOpenF1: pit is not an array', typeof pit);
  } else {
    pit.forEach(pitStop => {
      const driverInfo = driverMap.get(pitStop.driver_number);
      if (!driverInfo) return;

      const timestamp = parseOpenF1Date(pitStop.date);
      if (!timestamp) return;

      events.push({
        kind: 'pit',
        driverId: pitStop.driver_number,
        driverName: driverInfo.driverName,
        number: driverInfo.number,
        team: driverInfo.team,
        lapNumber: pitStop.lap_number,
        timestamp: timestamp,
        pitDuration: pitStop.pit_duration,
        position: null,
      });
    });
  }

  // Process Positions
  if (!Array.isArray(positions)) {
    console.warn('normalizeOpenF1: positions is not an array', typeof positions);
  } else {
    positions.forEach(pos => {
    const driverInfo = driverMap.get(pos.driver_number);
    if (!driverInfo) return;

    const timestamp = parseOpenF1Date(pos.date);
    if (!timestamp) return; // Skip if timestamp is invalid

    events.push({
      kind: 'position',
      driverId: pos.driver_number,
      driverName: driverInfo.driverName,
      number: driverInfo.number,
      team: driverInfo.team,
      position: pos.position,
      lapNumber: pos.lap_number,
      timestamp: timestamp,
    });
    });
  }

  // Process Location data (X, Y coordinates for track map)
  if (!Array.isArray(location)) {
    console.warn('normalizeOpenF1: location is not an array', typeof location);
  } else {
    location.forEach(loc => {
      const driverInfo = driverMap.get(loc.driver_number);
      if (!driverInfo) return;

      const timestamp = parseOpenF1Date(loc.date);
      if (!timestamp) return;

      const coords = parseXY(loc);
      if (!coords || isNaN(coords.x) || isNaN(coords.y)) {
        return;
      }

      events.push({
        kind: 'location',
        driverId: loc.driver_number,
        driverName: driverInfo.driverName,
        number: driverInfo.number,
        team: driverInfo.team,
        x: coords.x,
        y: coords.y,
        z: loc.z || null,
        timestamp: timestamp,
      });
    });
  }

  // Sort all events by timestamp
  events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return events;
}

module.exports = {
  normalizeOpenF1,
  parseXY,
};