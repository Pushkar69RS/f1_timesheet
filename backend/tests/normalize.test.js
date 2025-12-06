// backend/tests/normalize.test.js
const { normalizeOpenF1 } = require('../src/normalize');
const { parseOpenF1Date } = require('../src/utils');

describe('normalizeOpenF1', () => {
  const mockDrivers = [
    { driver_number: 1, full_name: 'Max Verstappen', team_name: 'Red Bull Racing' },
    { driver_number: 16, full_name: 'Charles Leclerc', team_name: 'Ferrari' },
  ];

  it('should correctly normalize lap data with driver info', () => {
    const mockLaps = [
      { driver_number: 1, lap_number: 1, lap_duration: 90.123, date: '2024-03-02T15:00:00.000Z' },
      { driver_number: 16, lap_number: 1, lap_duration: 90.500, date: '2024-03-02T15:00:01.000Z' },
    ];
    const openf1Json = {
      laps: mockLaps,
      sectors: [],
      stints: [],
      drivers: mockDrivers,
      positions: [],
    };

    const normalizedEvents = normalizeOpenF1(openf1Json);

    expect(normalizedEvents.length).toBe(2);
    expect(normalizedEvents[0]).toMatchObject({
      kind: 'lap',
      driverId: 1,
      driverName: 'Max Verstappen',
      number: 1,
      team: 'Red Bull Racing',
      lapNumber: 1,
      lapTimeSeconds: 90.123,
      timestamp: parseOpenF1Date('2024-03-02T15:00:00.000Z'),
      isPitLap: false,
      sectorTimes: [null, null, null],
      tyres: null,
      position: null,
    });
    expect(normalizedEvents[1]).toMatchObject({
      kind: 'lap',
      driverId: 16,
      driverName: 'Charles Leclerc',
      number: 16,
      team: 'Ferrari',
      lapNumber: 1,
      lapTimeSeconds: 90.500,
      timestamp: parseOpenF1Date('2024-03-02T15:00:01.000Z'),
    });
  });

  it('should merge sector times into existing lap events', () => {
    const mockLaps = [
      { driver_number: 1, lap_number: 1, lap_duration: 90.000, date: '2024-03-02T15:00:00.000Z' },
    ];
    const mockSectors = [
      { driver_number: 1, lap_number: 1, sector_number: 1, sector_duration: 30.000, date: '2024-03-02T15:00:10.000Z' },
      { driver_number: 1, lap_number: 1, sector_number: 2, sector_duration: 30.000, date: '2024-03-02T15:00:40.000Z' },
      { driver_number: 1, lap_number: 1, sector_number: 3, sector_duration: 30.000, date: '2024-03-02T15:01:10.000Z' },
    ];
    const openf1Json = {
      laps: mockLaps,
      sectors: mockSectors,
      stints: [],
      drivers: mockDrivers,
      positions: [],
    };

    const normalizedEvents = normalizeOpenF1(openf1Json);
    expect(normalizedEvents.length).toBe(4); // 1 lap + 3 sector events (if not merged, but they should be)
    const lapEvent = normalizedEvents.find(e => e.kind === 'lap');
    expect(lapEvent.sectorTimes).toEqual([30.000, 30.000, 30.000]);
  });

  it('should apply tyre information from stints to relevant laps and create pit events', () => {
    const mockLaps = [
      { driver_number: 1, lap_number: 1, lap_duration: 90.000, date: '2024-03-02T15:00:00.000Z' },
      { driver_number: 1, lap_number: 2, lap_duration: 91.000, date: '2024-03-02T15:01:30.000Z' },
      { driver_number: 1, lap_number: 3, lap_duration: 92.000, date: '2024-03-02T15:03:01.000Z' },
    ];
    const mockStints = [
      { driver_number: 1, lap_start: 1, lap_end: 2, compound: 'SOFT', is_pit_out_lap: false, stint_duration: 181.000 },
      { driver_number: 1, lap_start: 3, lap_end: 3, compound: 'MEDIUM', is_pit_out_lap: true, stint_duration: 92.000 },
    ];
    const openf1Json = {
      laps: mockLaps,
      sectors: [],
      stints: mockStints,
      drivers: mockDrivers,
      positions: [],
    };

    const normalizedEvents = normalizeOpenF1(openf1Json);

    const lap1 = normalizedEvents.find(e => e.kind === 'lap' && e.lapNumber === 1);
    const lap2 = normalizedEvents.find(e => e.kind === 'lap' && e.lapNumber === 2);
    const lap3 = normalizedEvents.find(e => e.kind === 'lap' && e.lapNumber === 3);
    const pitEvent = normalizedEvents.find(e => e.kind === 'pit' && e.lapNumber === 3);

    expect(lap1.tyres).toBe('SOFT');
    expect(lap2.tyres).toBe('SOFT');
    expect(lap3.tyres).toBe('MEDIUM');
    expect(lap3.isPitLap).toBe(true);
    expect(pitEvent).toBeDefined();
    expect(pitEvent.tyres).toBe('MEDIUM');
    expect(pitEvent.timestamp.getTime()).toBeLessThan(lap3.timestamp.getTime()); // Pit event before lap starts
  });

  it('should include position events', () => {
    const mockPositions = [
      { driver_number: 1, position: 1, lap_number: 1, date: '2024-03-02T15:00:05.000Z' },
      { driver_number: 16, position: 2, lap_number: 1, date: '2024-03-02T15:00:06.000Z' },
    ];
    const openf1Json = {
      laps: [],
      sectors: [],
      stints: [],
      drivers: mockDrivers,
      positions: mockPositions,
    };

    const normalizedEvents = normalizeOpenF1(openf1Json);
    expect(normalizedEvents.length).toBe(2);
    expect(normalizedEvents[0]).toMatchObject({
      kind: 'position',
      driverId: 1,
      position: 1,
      lapNumber: 1,
      timestamp: parseOpenF1Date('2024-03-02T15:00:05.000Z'),
    });
  });

  it('should sort all events by timestamp', () => {
    const mockLaps = [
      { driver_number: 1, lap_number: 1, lap_duration: 90.000, date: '2024-03-02T15:00:00.000Z' },
    ];
    const mockPositions = [
      { driver_number: 1, position: 1, lap_number: 1, date: '2024-03-02T15:00:05.000Z' },
    ];
    const openf1Json = {
      laps: mockLaps,
      sectors: [],
      stints: [],
      drivers: mockDrivers,
      positions: mockPositions,
    };

    const normalizedEvents = normalizeOpenF1(openf1Json);
    expect(normalizedEvents.length).toBe(2);
    expect(normalizedEvents[0].kind).toBe('lap'); // Lap event is earlier
    expect(normalizedEvents[1].kind).toBe('position'); // Position event is later
  });

  it('should handle empty input arrays gracefully', () => {
    const openf1Json = {
      laps: [],
      sectors: [],
      stints: [],
      drivers: mockDrivers,
      positions: [],
    };
    const normalizedEvents = normalizeOpenF1(openf1Json);
    expect(normalizedEvents.length).toBe(0);
  });

  it('should handle missing driver info for events', () => {
    const mockLaps = [
      { driver_number: 99, lap_number: 1, lap_duration: 90.000, date: '2024-03-02T15:00:00.000Z' }, // Driver 99 not in mockDrivers
    ];
    const openf1Json = {
      laps: mockLaps,
      sectors: [],
      stints: [],
      drivers: mockDrivers,
      positions: [],
    };
    const normalizedEvents = normalizeOpenF1(openf1Json);
    expect(normalizedEvents.length).toBe(0); // Event for unknown driver should be skipped
  });
});