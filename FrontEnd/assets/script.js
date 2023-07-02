// Récupère le fichier works de l'API dans un tableau
async function getWorks() {
    
    const worksResponse = await fetch("http://localhost:5678/api/works");

    return await worksResponse.json()
}

// Affiche les éléments dynamiquement
async function renderWorks(works) {

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
  
    
    for (const work of works) {

        // Crée les éléments 
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figCaption = document.createElement("figcaption");

        // Ajoute le contenu aux éléments
        img.src = work.imageUrl;
        img.alt = work.title;
        figCaption.innerHTML = work.title;
        figure.setAttribute("data-category", work.category.name);

        // Ajoute les éléments au DOM
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figCaption);
    }
  }


// Fonction principale pour démarrer l'application
// Donne la valeur au paramètre works de la fonction renderWorks
async function start() {

  let works = await getWorks();
  renderWorks(works);
  filterWorks();

  // Vérifier si la connexion a réussi
  const loginSuccess = window.localStorage.getItem("loginSuccess");
  if (loginSuccess === "true") {
      indexEditMode();
      renderModal();
  }
}

start()

// Filtre les works grâce aux boutons de filtre
async function filterWorks() {

  let works = await getWorks(); 

  filters = document.getElementById("filters");

  // Crée le bouton "Tous"
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

  // Crée les autres boutons
  for (const category of categoriesSet) {

    const filterButton = document.createElement("button");

    filterButton.classList.add("filterButton");

    filterButton.setAttribute("data-category", category);

    filterButton.innerHTML = category;

    filters.appendChild(filterButton);
  }

  const filterButtons = document.getElementsByClassName("filterButton");

  for (let i = 0; i < filterButtons.length; i++) {

    // Ajout d'écouteur d'événements sur chaque bouton de filtre
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


// Fonction pour effectuer les modifications en mode édition de l'index
function indexEditMode() {

  // Modifications du header
  const editModeHeader = document.getElementById("editModeHeader")
  editModeHeader.classList.add("editModeHeader");

  headerEditIcon = document.createElement("i");
  headerEditIcon.classList.add("fa-regular", "fa-pen-to-square", "headerEditIcon");

  const headerEditButton = document.createElement("div");
  headerEditButton.classList.add("headerEditButton");
  headerEditButton.innerHTML = "Mode édition";

  const headerPublishButton = document.createElement("div");
  headerPublishButton.classList.add("headerPublishButton");
  headerPublishButton.innerHTML = "publier les changements";
  
  editModeHeader.appendChild(headerEditIcon);
  editModeHeader.appendChild(headerEditButton);
  editModeHeader.appendChild(headerPublishButton);

  // Ajout des boutons "Modifier"

  const modifyButtonContainers = document.querySelectorAll(".modifyButtonContainer");

  modifyButtonContainers.forEach((container) => {
    const modifyIcon = document.createElement("i");
    modifyIcon.classList.add("fa-regular", "fa-pen-to-square", "modifyIcon");
    modifyIcon.innerHTML = "";

    const modifyButton = document.createElement("div");
    modifyButton.classList.add("modifyButton");
    modifyButton.innerHTML = "modifier";

    container.appendChild(modifyIcon);
    container.appendChild(modifyButton);
  });

  const filters = document.getElementById("filters");
  filters.classList.add("hidden");

  // Réinitialiser la valeur de loginSuccess
  window.localStorage.setItem("loginSuccess", "false");
}


async function renderModal () {

  let works = await getWorks(); 

  const modalButton = document.querySelector(".headerEditButton")
  modalButton.addEventListener("click", async (e) => {
    
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modalContent");


    const closeModalIcon = document.createElement("i");
    closeModalIcon.classList.add("fa-solid", "fa-xmark");

    const modalIconContainer = document.createElement("div");
    modalIconContainer.classList.add("modalIconContainer");


    const modalTitle = document.createElement("h3");
    modalTitle.classList.add("modalTitle");
    modalTitle.innerHTML = "Galerie photo";

    const modalGallery = document.createElement("div");
    modalGallery.classList.add("modalGallery");

    const modalButton = document.createElement("button");
    modalButton.classList.add("modalButton");
    modalButton.innerHTML = "Ajouter une photo";

    const modalDeleteGallery = document.createElement("p");
    modalDeleteGallery.classList.add("modalDeleteGallery");
    modalDeleteGallery.innerHTML = "Supprimer la gallerie";

    const main = document.getElementById("main");

    main.appendChild(modal);
    modal.appendChild(modalContent);
    modalContent.appendChild(modalIconContainer);
    modalIconContainer.appendChild(closeModalIcon);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalGallery);
    modalContent.appendChild(modalButton);
    modalContent.appendChild(modalDeleteGallery);
    
    for (let i = 0; i < works.length; i++) {
      const work = works[i];
    
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const deleteIcon = document.createElement("i");
      const iconContainer = document.createElement("div");

      iconContainer.classList.add("iconContainer")
      deleteIcon.classList.add("fa-solid", "fa-trash-can");
    
      const editWork = document.createElement("p");
    
      img.src = work.imageUrl;
      img.alt = work.title;
    
      figure.classList.add("modalFigure");
      img.classList.add("modalImg");
      editWork.classList.add("editWork");
    
      editWork.innerHTML = "éditer";
      
      figure.appendChild(img);
      figure.appendChild(editWork);
      figure.appendChild(iconContainer);
      
      

      if (i === 0) {
        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right");
        iconContainer.appendChild(arrowIcon);
      }
      iconContainer.appendChild(deleteIcon);
      modalGallery.appendChild(figure);

      
    }

    // Ferme la modale au clic de la croix ou en dehors de modalContent
    closeModalIcon.addEventListener ("click", async (e) => {

      modal.classList.add("displayNone");
      
    });
    
    document.addEventListener("click", async (e) => { 
      if (modal.contains(e.target)) {
        modal.classList.add("displayNone");
      }
    });

    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });


    // Menu ajout photo
    modalButton.addEventListener("click", async (e) => {
      e.stopPropagation();

      modalTitle.innerHTML ="Ajout photo";


      const arrowLeft = document.createElement("i")
      const iconContainer = document.querySelectorAll(".iconContainer");
      const modalDeleteGallery = document.querySelector(".modalDeleteGallery")

      modalGallery.innerHTML =""

      modalDeleteGallery.classList.add("displayNone");

      modalButton.classList.add("addImgModalButton")
      modalButton.innerHTML ="Valider";


      const addImgMenu = document.createElement("div");
      addImgMenu.classList.add("addImgMenu");
      modalGallery.appendChild(addImgMenu);

      const addImgMenuIcon = document.createElement("i");
      addImgMenuIcon.classList.add("fa-regular", "fa-image");
      addImgMenu.appendChild(addImgMenuIcon);

      const addImgMenuButton = document.createElement("div");
      addImgMenuButton.classList.add("addImgMenuButton");
      addImgMenuButton.innerHTML="+ Ajouter photo";
      addImgMenu.appendChild(addImgMenuButton);

      const addImgMenuText = document.createElement("p");
      addImgMenuText.classList.add("addImgMenuText");
      addImgMenuText.innerHTML="jpg, png : 4mo max";
      addImgMenu.appendChild(addImgMenuText);


      const addImgForms = document.createElement("div");
      addImgForms.classList.add("addImgForms");

      const inputTitleLabel = document.createElement("label");
      inputTitleLabel.innerHTML = "Titre";
      const inputTitle = document.createElement("input");
      inputTitle.type = "text";

      const selectCategoryLabel = document.createElement("label");
      selectCategoryLabel.innerHTML = "Catégorie";
      const selectCategory = document.createElement("select");

      const emptyOption = document.createElement("option");
      selectCategory.appendChild(emptyOption);

      const categoriesSet = new Set(); 

    for (const work of works) {
      categoriesSet.add(work.category.name);
    }

  
    for (const category of categoriesSet) {
      const option = document.createElement("option");
      option.value = category;
      option.text = category;
      selectCategory.appendChild(option);
    }

    addImgForms.appendChild(inputTitleLabel);
    addImgForms.appendChild(inputTitle);

    addImgForms.appendChild(selectCategoryLabel)
    addImgForms.appendChild(selectCategory);
    
    modalGallery.appendChild(addImgForms);



    const modalIconContainer = document.querySelector(".modalIconContainer")

    arrowLeft.classList.add("fa-solid", "fa-arrow-left");

    modalIconContainer.appendChild(arrowLeft);

    arrowLeft.addEventListener("click", async (e) => {

      

    });


    });

  });
}
