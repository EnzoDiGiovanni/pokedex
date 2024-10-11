const pokemons = document.querySelector(".pokemons");
const baseUrlApi = "https://tyradex.tech/api/v1/pokemon";

// Fonction principale pour récupérer la liste des Pokémon
async function getAllPokemon() {
  const res = await fetch(baseUrlApi);
  const data = await res.json();

  const limitedData = data.slice(0, 50);

  for await (const el of limitedData) {
    await getPokemonDetails(el);
  }
}

// Fonction pour récupérer les détails d'un Pokémon
async function getPokemonDetails(pokemon) {
  if (!pokemon.pokedex_id) {
    console.error("Aucun ID trouvé pour ce Pokémon:", pokemon);
    return;
  }

  const url = `${baseUrlApi}/${pokemon.pokedex_id}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status === 404) {
    console.warn(
      `Détails non trouvés pour le Pokémon avec l'ID ${pokemon.pokedex_id}: ${data.message}`
    );
    return; // Si les détails ne sont pas trouvés, on arrête ici pour ce Pokémon
  }

  // Générer la carte avec les détails et les types en français
  await generatePokemonCard(data);
}

// Fonction pour générer une carte Pokémon avec tous les détails et types en français
async function generatePokemonCard(detail) {
  const newPokemonCard = document.createElement("div");
  newPokemonCard.className = "card";

  // Vérifie si les propriétés existent avant de les utiliser
  const spriteUrl =
    detail.sprites?.regular || "https://via.placeholder.com/150";
  const nameFr = detail.name?.fr || "Nom indisponible";
  const pokedexId = detail.pokedex_id || "ID inconnu";

  // Image du Pokémon
  const newPokemonCardImg = document.createElement("img");
  newPokemonCardImg.src = spriteUrl;
  newPokemonCardImg.alt = nameFr;

  // Nom du Pokémon
  const newPokemonCardTitle = document.createElement("p");
  newPokemonCardTitle.innerText = nameFr;

  // ID du Pokémon
  const newPokemonCardId = document.createElement("p");
  newPokemonCardId.innerText = `ID: ${pokedexId}`;

  // Conteneur pour les types en français
  const newPokemonCardTypes = document.createElement("div");
  newPokemonCardTypes.className = "typesContainer";

  // Ajout des images pour chaque type
  if (detail.types && Array.isArray(detail.types)) {
    detail.types.forEach((type) => {
      const typeImg = document.createElement("img");
      const typeName = document.createElement("p");
      typeImg.className = "imgType";
      typeImg.src = type.image; // Utilise l'URL de l'image du type
      typeImg.alt = type.name;

      typeName.innerText = type.name;

      newPokemonCardTypes.appendChild(typeImg);
      newPokemonCardTypes.appendChild(typeName);
    });
  } else {
    newPokemonCardTypes.innerText = "Types inconnus";
  }

  // Ajout des éléments au conteneur de la carte
  newPokemonCard.appendChild(newPokemonCardImg);
  newPokemonCard.appendChild(newPokemonCardId);
  newPokemonCard.appendChild(newPokemonCardTitle);
  newPokemonCard.appendChild(newPokemonCardTypes);

  // Ajout d'un événement pour afficher la pop-up au clic sur la carte
  newPokemonCard.addEventListener("click", () => {
    showPokemonDetails(detail);
  });

  // Ajout de la carte au conteneur global
  pokemons?.appendChild(newPokemonCard);
}

// Fonction pour afficher la pop-up avec les détails du Pokémon
function showPokemonDetails(pokemon) {
  // Création de la pop-up en plein écran
  const popup = document.createElement("div");
  popup.className = "popup";

  // Image du Pokémon dans la pop-up
  const pokemonImg = document.createElement("img");
  pokemonImg.src = pokemon.sprites?.regular;
  pokemonImg.alt = pokemon.name?.fr || "Nom indisponible";

  // Nom du Pokémon
  const pokemonName = document.createElement("h2");
  pokemonName.innerText = pokemon.name?.fr || "Nom indisponible";

  // ID du Pokémon
  const pokemonId = document.createElement("p");
  pokemonId.innerText = `ID: ${pokemon.pokedex_id}`;

  // Catégorie du Pokémon
  const pokemonCategory = document.createElement("p");
  pokemonCategory.innerText = `Catégorie: ${pokemon.category}`;

  // Conteneur pour les stats
  const pokemonStats = document.createElement("div");
  pokemonStats.className = "pokemon-stats";

  // Ajout des statistiques
  const statsTitle = document.createElement("h3");
  statsTitle.innerText = "Statistiques";

  const statsList = document.createElement("ul");
  if (pokemon.stats) {
    for (const [statName, statValue] of Object.entries(pokemon.stats)) {
      const statItem = document.createElement("li");
      statItem.innerText = `${statName}: ${statValue}`;
      statsList.appendChild(statItem);
    }
  }

  // Bouton de fermeture de la pop-up
  const closeButton = document.createElement("button");
  closeButton.innerText = "Fermer";
  closeButton.className = "close-button";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  // Ajout des éléments dans la pop-up
  pokemonStats.appendChild(statsTitle);
  pokemonStats.appendChild(statsList);
  popup.appendChild(pokemonImg);
  popup.appendChild(pokemonName);
  popup.appendChild(pokemonId);
  popup.appendChild(pokemonCategory);
  popup.appendChild(pokemonStats);
  popup.appendChild(closeButton);

  // Ajout de la pop-up au body pour être affichée par-dessus tout
  document.body.appendChild(popup);
  console.log("Pop-up affichée :", popup);
}

// Exécute la récupération des Pokémon
getAllPokemon();
