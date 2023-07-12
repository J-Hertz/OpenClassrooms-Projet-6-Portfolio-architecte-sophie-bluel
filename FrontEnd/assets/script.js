// Récupère le fichier works de l'API dans un tableau
async function getWorks() {
  const worksResponse = await fetch("http://localhost:5678/api/works");

  return await worksResponse.json();
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
  indexEditMode();
  addClickRenderModalGallery();
}

start();

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

    // Ajout d'écouteur d'événements sur chaque bouton de filtre
    filterButton.addEventListener("click", clickFilter);

    filterButton.innerHTML = category;

    filters.appendChild(filterButton);
  }
}

async function clickFilter(e) {
  let works = await getWorks();

  const category = e.target.dataset.category;

  // Applique le filtre sur le tableau "filteredWorks"
  if (category !== "Tous") {
    works = works.filter((work) => work.category.name === category);
  }

  renderWorks(works);
}

function isLoggedIn() {
  // Récupérer le token JWT du LocalStorage
  const token = localStorage.getItem("token");

  if (token) {
    // Diviser le token en ses parties : header, payload et signature
    const [header, payload, signature] = token.split(".");

    // Décoder la partie payload du token
    const decodedPayload = JSON.parse(atob(payload));

    // Récupérer la date d'expiration du token
    const expirationDate = new Date(decodedPayload.exp * 1000);

    // Vérifier si le token est expiré ou non
    const currentDate = new Date();
    if (currentDate < expirationDate) {
      // Le token est valide
      return true;
    }
  }

  // Le token est inexistant ou expiré
  return false;
}

// Fonction pour effectuer les modifications en mode édition de l'index
function indexEditMode() {
  if (isLoggedIn() === true) {
    // Modifications du header
    const editModeHeader = document.getElementById("editModeHeader");
    editModeHeader.classList.add("editModeHeader");

    headerEditIcon = document.createElement("i");
    headerEditIcon.classList.add(
      "fa-regular",
      "fa-pen-to-square",
      "headerEditIcon"
    );

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

    const modifyButtonContainers = document.querySelectorAll(
      ".modifyButtonContainer"
    );

    modifyButtonContainers.forEach((container, index) => {
      const modifyIcon = document.createElement("i");
      modifyIcon.classList.add("fa-regular", "fa-pen-to-square", "modifyIcon");
      modifyIcon.innerHTML = "";

      const modifyButton = document.createElement("div");
      modifyButton.classList.add("modifyButton");
      modifyButton.innerHTML = "modifier";

      container.appendChild(modifyIcon);
      container.appendChild(modifyButton);

      if (index === 2) {
        container.setAttribute("id", "openModalButton");
      }
    });

    const filters = document.getElementById("filters");
    filters.classList.add("hidden");
  }
}

async function renderModalGallery() {
  if (isLoggedIn() === true) {
    const previousModal = document.querySelector(".modal");
    if (previousModal) {
      previousModal.remove();
    }
    let works = await getWorks();

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

      iconContainer.classList.add("iconContainer");
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

      deleteIcon.addEventListener("click", async () => {
        const workId = work.id;
        if (
          window.confirm("Etes-vous sûr(e) de vouloir supprimer " + work.title)
        ) {
          await deleteWorks(workId);
        }
      });
    }

    // Ferme la modale au clic de la croix ou en dehors de modalContent
    closeModalIcon.addEventListener("click", async (e) => {
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
      renderModalAddImgMenu();
    });
  }
}

async function addClickRenderModalGallery() {
  const openModalButton = document.getElementById("openModalButton");

  openModalButton.addEventListener("click", async (e) => {
    renderModalGallery();
  });
}

async function renderModalAddImgMenu() {
  // Remplacement du bouton
  modalButton = document.querySelector(".modalButton");
  modalButton.classList.remove("modalButton");
  modalButton.classList.add("displayNone");
  const addImgModalButton = document.createElement("button");
  addImgModalButton.innerHTML = "Valider";
  addImgModalButton.classList.add("addImgModalButton");
  addImgModalButton.classList.add("modalButton");
  const modalContent = document.querySelector(".modalContent");

  modalContent.appendChild(addImgModalButton);

  modalTitle = document.querySelector(".modalTitle");
  modalTitle.innerHTML = "Ajout photo";

  const arrowLeft = document.createElement("i");
  const iconContainer = document.querySelectorAll(".iconContainer");
  const modalDeleteGallery = document.querySelector(".modalDeleteGallery");

  modalGallery = document.querySelector(".modalGallery");
  modalGallery.innerHTML = "";

  modalDeleteGallery.classList.add("displayNone");

  const addImgMenu = document.createElement("div");
  addImgMenu.classList.add("addImgMenu");
  modalGallery.appendChild(addImgMenu);

  const addImgMenuIcon = document.createElement("i");
  addImgMenuIcon.classList.add("fa-regular", "fa-image");
  addImgMenu.appendChild(addImgMenuIcon);

  const addImgMenuButton = document.createElement("input");
  addImgMenuButton.setAttribute("type", "file");
  addImgMenuButton.setAttribute("id", "imageFile");
  addImgMenuButton.classList.add("displayNone");
  addImgMenu.appendChild(addImgMenuButton);

  const addImgMenuButtonLabel = document.createElement("label");
  addImgMenuButtonLabel.classList.add("addImgMenuButtonLabel");
  addImgMenuButtonLabel.setAttribute("for", "imageFile");
  addImgMenuButtonLabel.innerHTML = "+ Ajouter photo";
  addImgMenu.appendChild(addImgMenuButtonLabel);

  const addImgMenuText = document.createElement("p");
  addImgMenuText.classList.add("addImgMenuText");
  addImgMenuText.innerHTML = "jpg, png : 4mo max";
  addImgMenu.appendChild(addImgMenuText);

  addImgMenuButton.addEventListener("change", (e) => {
    const file = e.target.files[0]; // Récupérer le fichier sélectionné par l'utilisateur

    // Vérifier si un fichier a été sélectionné
    if (file) {
      const reader = new FileReader();

      // Lorsque la lecture du fichier est terminée
      reader.onload = (e) => {
        const addedImg = document.createElement("img");
        addedImg.src = e.target.result; // Obtenir l'URL de l'image lue
        addedImg.classList.add("addedImg");
        addedImg.setAttribute("id", "addedImg");

        // Remplacer le contenu de la div addImgMenu par l'image
        addImgMenuButtonLabel.classList.remove("addImgMenuButtonLabel");
        addImgMenuButtonLabel.classList.add("displayNone");
        addImgMenuButton.classList.add("displayNone");
        addImgMenuText.classList.add("displayNone");
        addImgMenuIcon.classList.add("displayNone");

        addImgMenu.appendChild(addedImg);
      };
      reader.readAsDataURL(file);
    }
  });

  const addImgForms = document.createElement("div");
  addImgForms.classList.add("addImgForms");

  const inputTitleLabel = document.createElement("label");
  inputTitleLabel.innerHTML = "Titre";
  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.setAttribute("id", "inputTitle");

  const selectCategoryLabel = document.createElement("label");
  selectCategoryLabel.innerHTML = "Catégorie";
  const selectCategory = document.createElement("select");
  selectCategory.setAttribute("id", "selectCategory");

  const emptyOption = document.createElement("option");
  selectCategory.appendChild(emptyOption);

  const categoriesSet = new Set();

  let works = await getWorks();

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

  addImgForms.appendChild(selectCategoryLabel);
  addImgForms.appendChild(selectCategory);

  modalGallery.appendChild(addImgForms);

  const modalIconContainer = document.querySelector(".modalIconContainer");

  arrowLeft.classList.add("fa-solid", "fa-arrow-left");

  modalIconContainer.appendChild(arrowLeft);

  arrowLeft.addEventListener("click", async (e) => {
    //  e.stopPropagation();
    console.log("toto");
    renderModalGallery();
  });

  addImgModalButton.addEventListener("click", async (e) => {
    submitWorks();
  });
}

async function submitWorks() {
  const token = localStorage.getItem("token");
  const imageFile = document.getElementById("imageFile");
  const inputTitle = document.getElementById("inputTitle");
  const addImgForms = document.querySelector(".addImgForms");

  const selectCategory = document.getElementById("selectCategory");
  const categoryMap = {
    Objets: 1,
    Appartements: 2,
    "Hotels & restaurants": 3,
  };

  const selectedCategory = categoryMap[selectCategory.value];

  // Vérifier si tous les champs sont remplis
  if (imageFile && inputTitle && selectCategory) {
    // Créer un objet FormData pour envoyer les données multipart/form-data
    const formData = new FormData();
    formData.append("image", imageFile.files[0]);
    formData.append("title", inputTitle.value);
    formData.append("category", selectedCategory);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Work ajouté avec succès
        const newWork = await response.json();

        // Récupérer à nouveau les works après l'ajout
        let works = await getWorks();

        // Re-render la galerie avec les works mis à jour
        renderWorks(works);
        renderModalGallery();
      } else {
        // La requête a échoué
        console.error("Erreur lors de l'ajout du work :", response.status);

        const addImgError = document.createElement("span");
        addImgError.innerHTML = "Veuillez remplir tous les champs.";
        addImgError.classList.add("error");
        addImgForms.appendChild(addImgError);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du work :", error);
    }
  } else {
    // Afficher un message d'erreur si tous les champs ne sont pas remplis
    console.error("Veuillez remplir tous les champs.");

    const addImgError = document.createElement("span");
    addImgError.innerHTML = "Veuillez remplir tous les champs.";
    addImgError.classList.add("error");
    addImgForms.appendChild(addImgError);
  }
}

// Supprime un élément du tableau works
async function deleteWorks(workId) {
  const token = localStorage.getItem("token");

  try {
    await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Récupère à nouveau les works après la suppression
    let works = await getWorks();

    // Re-render la galerie avec les works mis à jour
    renderWorks(works);
    renderModalGallery();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément :", error);
  }
}
