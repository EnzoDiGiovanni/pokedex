// const pokemons = document.querySelector(".pokemons");

const baseApiUrl = "https://pokeapi.co/api/v2";

// Fonction principale pour récupérer la liste des Pokémon
async function getAllPokemon() {
  const url = baseApiUrl + "/pokemon?limit=50";
  const res = await fetch(url);
  const data = await res.json();

  for (const el of data["results"]) {
    await getPokemonDetails(el["url"]);
  }
}

getAllPokemon();

// Fonction pour récupérer les détails d'un Pokémon
async function getPokemonDetails(url) {
  const res = await fetch(url);
  const data = await res.json();

  // Générer la carte avec les détails et les types en français
  await generatePokemonCard(data);
}

// Fonction pour récupérer la description d'un Pokémon en français
async function getPokemonDescriptionInFrench(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  const res = await fetch(url);
  const data = await res.json();

  // Filtrer les descriptions pour trouver celle en français
  const frenchEntry = data.flavor_text_entries.find(
    (entry) => entry.language.name === "fr"
  );

  return frenchEntry
    ? frenchEntry.flavor_text
    : "Description non disponible en français.";
}

// Fonction pour récupérer les types d'un Pokémon en français
async function getPokemonTypesInFrench(typesArray) {
  const typeNamesInFrench = [];

  // Parcourt chaque type et récupère les informations de type en français
  for (const typeInfo of typesArray) {
    const typeUrl = typeInfo.type.url;
    const res = await fetch(typeUrl);
    const data = await res.json();

    // Filtrer le nom du type en français
    const frenchNameEntry = data.names.find(
      (nameEntry) => nameEntry.language.name === "fr"
    );
    if (frenchNameEntry) {
      typeNamesInFrench.push(frenchNameEntry.name);
    }
  }

  return typeNamesInFrench;
}

// Fonction pour générer une carte Pokémon avec tous les détails et types en français
async function generatePokemonCard(detail) {
  const newPokemonCard = document.createElement("div");
  newPokemonCard.className = "card";

  // Image du Pokémon
  const newPokemonCardImg = document.createElement("img");
  newPokemonCardImg.src =
    detail["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
      "front_default"
    ];

  // Nom du Pokémon
  const newPokemonCardTitle = document.createElement("p");
  newPokemonCardTitle.innerText = detail["name"];

  // ID du Pokémon
  const newPokemonCardId = document.createElement("p");
  newPokemonCardId.innerText = `ID: ${detail["id"]}`;

  // Description en français
  const newPokemonDescription = document.createElement("p");
  const description = await getPokemonDescriptionInFrench(detail["id"]);
  newPokemonDescription.innerText = `Description : ${description}`;
  newPokemonDescription.className = "description";

  // Conteneur pour les types en français
  const newPokemonCardTypes = document.createElement("p");

  // Récupération des types en français
  const typesInFrench = await getPokemonTypesInFrench(detail["types"]);
  newPokemonCardTypes.innerText = `Types : ${typesInFrench.join(", ")}`;
  newPokemonCardTypes.className = "types";

  // Ajout des éléments au conteneur de la carte
  newPokemonCard.appendChild(newPokemonCardId);
  newPokemonCard.appendChild(newPokemonCardImg);
  newPokemonCard.appendChild(newPokemonCardTitle);
  newPokemonCard.appendChild(newPokemonCardTypes);
  newPokemonCard.appendChild(newPokemonDescription);

  // Ajout de la carte au conteneur global
  pokemons?.appendChild(newPokemonCard);
}
