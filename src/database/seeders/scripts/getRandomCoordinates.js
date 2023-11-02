function getRandomCoordinate(min, max) {
  return Math.random() * (max - min) + min;
}

exports.getRandomParisCoordinates = () => {
  const latMin = 48.815573;
  const latMax = 48.902144;
  const lonMin = 2.224199;
  const lonMax = 2.46992;

  const randomLat = getRandomCoordinate(latMin, latMax);
  const randomLon = getRandomCoordinate(lonMin, lonMax);
  return { latitude: randomLat, longitude: randomLon };
};
