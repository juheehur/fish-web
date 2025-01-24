const FISHWATCH_API_BASE_URL = 'https://www.fishwatch.gov/api/species';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Fallback fish data in case API fails
const FALLBACK_FISH = [
  {
    name: "Pacific Blue Tang",
    scientificName: "Paracanthurus hepatus",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Paracanthurus_hepatus_01.jpg",
    habitat: "Coral reefs in the Indo-Pacific",
    biology: "Known for their bright blue coloration and yellow tail",
    funFacts: "This is the species of fish that Dory from Finding Nemo belongs to. They can live up to 20 years in the wild."
  },
  {
    name: "Clownfish",
    scientificName: "Amphiprioninae",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Amphiprion_ocellaris_%28Clown_anemonefish%29.jpg",
    habitat: "Tropical waters in the Indo-Pacific",
    biology: "Lives in symbiosis with sea anemones",
    funFacts: "Clownfish are immune to sea anemone stings and can change their gender."
  },
  {
    name: "Yellow Tang",
    scientificName: "Zebrasoma flavescens",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Yellow_Tang_1.jpg",
    habitat: "Coral reefs in the Pacific Ocean",
    biology: "Bright yellow coloration helps with species recognition",
    funFacts: "Yellow tangs can live up to 30 years and are important reef cleaners."
  },
  {
    name: "Moorish Idol",
    scientificName: "Zanclus cornutus",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Zanclus_cornutus_Réunion.jpg",
    habitat: "Tropical and subtropical waters",
    biology: "Known for their distinctive elongated dorsal fin",
    funFacts: "Their name comes from the Moors of Africa, who believed the fish brought happiness."
  }
];

export const getFishList = async () => {
  try {
    // First try with direct API call
    const response = await fetch(FISHWATCH_API_BASE_URL);
    
    if (!response.ok) {
      throw new Error('Direct API call failed');
    }

    const data = await response.json();
    return data.map(fish => ({
      name: fish['Species Name'],
      scientificName: fish['Scientific Name'],
      image: fish['Species Illustration Photo']?.src || null,
      habitat: fish['Habitat'],
      biology: fish['Biology'],
      population: fish['Population'],
      funFacts: fish['Fun Facts'],
    }));
  } catch (error) {
    try {
      // Try with CORS proxy if direct call fails
      const proxyResponse = await fetch(CORS_PROXY + FISHWATCH_API_BASE_URL);
      
      if (!proxyResponse.ok) {
        throw new Error('Proxy API call failed');
      }

      const data = await proxyResponse.json();
      return data.map(fish => ({
        name: fish['Species Name'],
        scientificName: fish['Scientific Name'],
        image: fish['Species Illustration Photo']?.src || null,
        habitat: fish['Habitat'],
        biology: fish['Biology'],
        population: fish['Population'],
        funFacts: fish['Fun Facts'],
      }));
    } catch (proxyError) {
      // If both API calls fail, return fallback data
      console.log('Using fallback fish data due to API errors');
      return FALLBACK_FISH;
    }
  }
};

export const searchFishByName = async (name) => {
  try {
    const fishList = await getFishList();
    return fishList.filter(fish => 
      fish.name.toLowerCase().includes(name.toLowerCase()) ||
      fish.scientificName.toLowerCase().includes(name.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching fish:', error);
    return [];
  }
}; 