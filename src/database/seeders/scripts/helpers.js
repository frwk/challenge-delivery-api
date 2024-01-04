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

exports.getRandomParisAddress = () => {
  const addresses = [
    '10 Rue de la Paix, 75002 Paris',
    '22 Rue du Faubourg Saint-Antoine, 75012 Paris',
    '33 Avenue des Champs-Élysées, 75008 Paris',
    '4 Rue de la Chine, 75020 Paris',
    '1 Place du Louvre, 75001 Paris',
    'Place de la Concorde, 75008 Paris',
  ];
  return addresses[Math.floor(Math.random() * addresses.length)];
};

exports.getRandomRoute = () => {
  const itineraires = [
    {
      pickupAddress: 'Cathédrale Notre-Dame de Paris, 6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
      pickupCoordinates: { latitude: 48.852969, longitude: 2.349903 },
      dropoffAddress: 'Shakespeare and Company, 37 Rue de la Bûcherie, 75005 Paris',
      dropoffCoordinates: { latitude: 48.852539, longitude: 2.347263 },
    },
    {
      pickupAddress: 'Panthéon, Place du Panthéon, 75005 Paris',
      pickupCoordinates: { latitude: 48.846222, longitude: 2.346089 },
      dropoffAddress: 'Jardin du Luxembourg, 75006 Paris',
      dropoffCoordinates: { latitude: 48.846221, longitude: 2.33716 },
    },
    {
      pickupAddress: 'Place des Vosges, 75004 Paris',
      pickupCoordinates: { latitude: 48.855564, longitude: 2.366494 },
      dropoffAddress: 'Musée Carnavalet, 23 Rue de Sévigné, 75003 Paris',
      dropoffCoordinates: { latitude: 48.857365, longitude: 2.362792 },
    },
    {
      pickupAddress: 'Place de la Concorde, 75008 Paris',
      pickupCoordinates: { latitude: 48.865633, longitude: 2.321236 },
      dropoffAddress: 'Jardin des Tuileries, 75001 Paris',
      dropoffCoordinates: { latitude: 48.863492, longitude: 2.327494 },
    },
    {
      pickupAddress: 'Sainte-Chapelle, 8 Boulevard du Palais, 75001 Paris',
      pickupCoordinates: { latitude: 48.85542, longitude: 2.344919 },
      dropoffAddress: 'Marché aux Fleurs, Place Louis Lépine, 75004 Paris',
      dropoffCoordinates: { latitude: 48.855301, longitude: 2.346897 },
    },
    {
      pickupAddress: "Opéra Garnier, Place de l'Opéra, 75009 Paris",
      pickupCoordinates: { latitude: 48.871945, longitude: 2.33156 },
      dropoffAddress: 'Place Vendôme, 75001 Paris',
      dropoffCoordinates: { latitude: 48.867485, longitude: 2.329428 },
    },
    {
      pickupAddress: 'Place de la Bastille, 75011 Paris',
      pickupCoordinates: { latitude: 48.853218, longitude: 2.369811 },
      dropoffAddress: 'Coulée verte René-Dumont, 1 Coulée verte René-Dumont, 75012 Paris',
      dropoffCoordinates: { latitude: 48.850482, longitude: 2.373879 },
    },
    {
      pickupAddress: 'Place de la République, 75010 Paris',
      pickupCoordinates: { latitude: 48.867487, longitude: 2.363069 },
      dropoffAddress: 'Canal Saint-Martin, Quai de Valmy, 75010 Paris',
      dropoffCoordinates: { latitude: 48.871779, longitude: 2.365848 },
    },
    {
      pickupAddress: 'Sorbonne, 75005 Paris',
      pickupCoordinates: { latitude: 48.84913, longitude: 2.34367 },
      dropoffAddress: 'Place Saint-Michel, 75006 Paris',
      dropoffCoordinates: { latitude: 48.853462, longitude: 2.343119 },
    },
    {
      pickupAddress: 'Hôtel de Ville, 75004 Paris',
      pickupCoordinates: { latitude: 48.856366, longitude: 2.35221 },
      dropoffAddress: 'Centre Pompidou, Place Georges-Pompidou, 75004 Paris',
      dropoffCoordinates: { latitude: 48.860642, longitude: 2.352245 },
    },
  ];

  return itineraires[Math.floor(Math.random() * itineraires.length)];
};
