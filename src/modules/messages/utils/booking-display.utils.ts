/**
 * Utility functions for displaying booking information in a user-friendly way
 */

// Simple hash function to generate consistent names from IDs
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate hotel name from ID
export function getHotelDisplayName(hotelId: string): string {
  const hotelNames = [
    'Grand Plaza Hotel',
    'Ocean View Resort',
    'Mountain Lodge',
    'City Center Inn',
    'Sunset Beach Hotel',
    'Royal Palace Hotel',
    'Garden Court Hotel',
    'Riverside Lodge',
    'Skyline Hotel',
    'Heritage Manor',
  ];

  const index = simpleHash(hotelId) % hotelNames.length;
  return hotelNames[index];
}

// Generate room number from ID
export function getRoomDisplayNumber(roomId: string): string {
  const hash = simpleHash(roomId);
  const floor = Math.floor((hash % 10) + 1); // Floors 1-10
  const roomNum = (hash % 50) + 1; // Room numbers 1-50
  return `${floor}${roomNum.toString().padStart(2, '0')}`;
}

// Generate room type from ID
export function getRoomDisplayType(roomId: string): string {
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Premium', 'Family'];

  const index = simpleHash(roomId + 'type') % roomTypes.length;
  return roomTypes[index];
}

// Format booking display text
export function formatBookingDisplay(
  hotel: { id: string; name: string; address?: string } | string | null,
  room: { id: string; roomNumber: string; roomType: string } | string | null,
): { hotelName: string; roomInfo: string } {
  let hotelName: string;
  let roomInfo: string;

  if (typeof hotel === 'object' && hotel?.name) {
    // Hotel is populated object
    hotelName = hotel.name;
  } else if (typeof hotel === 'string') {
    // Hotel is ObjectId string - generate friendly name
    hotelName = getHotelDisplayName(hotel);
  } else {
    hotelName = 'Unknown Hotel';
  }

  if (typeof room === 'object' && room?.roomNumber) {
    // Room is populated object
    roomInfo = `Room ${room.roomNumber}`;
  } else if (typeof room === 'string') {
    // Room is ObjectId string - generate friendly name
    const roomNumber = getRoomDisplayNumber(room);
    const roomType = getRoomDisplayType(room);
    roomInfo = `Room ${roomNumber} (${roomType})`;
  } else {
    roomInfo = 'Room N/A';
  }

  return { hotelName, roomInfo };
}
