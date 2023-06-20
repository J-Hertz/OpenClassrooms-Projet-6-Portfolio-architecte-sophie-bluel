//récupère le fichier works de l'API dans un tableau
async function getWorks() {
    
    const res = await fetch("http://localhost:5678/api/works");

    return await res.json()
}

//affiche les éléments dynamiquement
async function renderWorks(works)  {
    
    //recupère la div "gallery" dans le dom et l'initialise
    const gallery = document.getElementById("gallery");       
    gallery.innerHTML = "";

    for (let i = 0; i < works.length; i++) {

        //crée les éléments 
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let figCaption = document.createElement("figcaption");
        
        //ajoute le contenu aux éléments
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        figCaption.innerHTML = works[i].title;

        //ajoute les éléments au DOM
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figCaption);
    }
}

//donne la valeur au paramètre works de la fonction renderWorks
async function start() {

    let works = await getWorks();
    renderWorks(works)
}

start()
