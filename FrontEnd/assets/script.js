//Récupère le fichier works de l'API dans un tableau
async function getWorks() {
    
    const worksResponse = await fetch("http://localhost:5678/api/works");

    return await worksResponse.json()
}

//Affiche les éléments dynamiquement
async function renderWorks(works) {

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
  
    
    for (const work of works) {

        //Crée les éléments 
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figCaption = document.createElement("figcaption");

        //Ajoute le contenu aux éléments
        img.src = work.imageUrl;
        img.alt = work.title;
        figCaption.innerHTML = work.title;
        figure.setAttribute("data-category", work.category.name);

        //Ajoute les éléments au DOM
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figCaption);
    }
  }

//Donne la valeur au paramètre works de la fonction renderWorks
async function start() {

    let works = await getWorks();
    renderWorks(works);
    filterWorks();
}

start()

//Filtre les works grâce aux boutons de filtre
async function filterWorks() {

  let works = await getWorks(); 

  filters = document.getElementById("filters");

  //Crée le bouton "Tous"
  const filterButton = document.createElement("button");
  filterButton.classList.add("filterButton");
  filterButton.setAttribute("data-category", "Tous");
  filterButton.innerHTML = "Tous";
  filters.appendChild(filterButton);

  const categoriesSet = new Set(); // Crée un ensemble pour stocker les catégories uniques

  // Parcourir les objets dans le tableau works et ajouter les catégories à l'ensemble
  for (const work of works) {
    categoriesSet.add(work.category.name);
  }

  //Crée les autres boutons
  for (const category of categoriesSet) {

    const filterButton = document.createElement("button");

    filterButton.classList.add("filterButton");

    filterButton.setAttribute("data-category", category);

    filterButton.innerHTML = category;

    filters.appendChild(filterButton);
  }

  const filterButtons = document.getElementsByClassName("filterButton");

  for (let i = 0; i < filterButtons.length; i++) {

    //Ajout d'écouteur d'événements sur chaque bouton de filtre
    filterButtons[i].addEventListener("click", async (e) => {
      let works = await getWorks()

      const category = e.target.dataset.category;
      
      // Applique le filtre sur le tableau "filteredWorks"
      if (category !== "Tous") {
        works = works.filter(
          (work) => work.category.name === category
        );
        
      }

      renderWorks(works);
    });
  }
}




