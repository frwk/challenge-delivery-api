export const getCoordinates = async (address: string): Promise<number[]> => {
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error(`Aucune coordonnée trouvée pour l'adresse : ${address}`);
  }
  return data.features[0].geometry.coordinates;
};
