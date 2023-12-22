export const getCoordinates = async (address: string): Promise<number[]> => {
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error(`Aucune coordonnée trouvée pour l'adresse : ${address}`);
  }
  return data.features[0].geometry.coordinates;
};

export const getAddress = async (latitude: number, longitude: number): Promise<string> => {
  const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`);
  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error(`Aucune adresse trouvée pour les coordonnées : ${latitude}, ${longitude}`);
  }
  return data.features[0].properties.label;
};

export const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.trunc(distance);
};

const deg2rad = deg => {
  return deg * (Math.PI / 180);
};
