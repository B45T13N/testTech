const url = "https://api.npoint.io/d3d609dfd966deae52e2";
var src = '';
var cpt = 0;
var tabCtx = [];
var tabAcceleration = [];
var tabTime = [];
const btnRecherche = document.getElementById('btnRecherche');
const btnDetail = document.getElementById('btnRechercheDetail');
const btnAfficher = document.getElementById('btnAffiche');
const selectDetail = document.querySelector('select#listeSelectDetail');
const selectEnergie = document.querySelector('select#listeSelectEnergie');

if(selectDetail.value === undefined || selectDetail.value === '' &&
    selectEnergie.value === undefined || selectEnergie.value === ''){
    rechercheDonnee();
}

btnRecherche.addEventListener('click',() => onClickAfficheListeFiltre());
btnDetail.addEventListener('click',() => onClickAfficheDetail(selectDetail.value));
btnAfficher.addEventListener('click',() => onClickRetour());



function rechercheDonnee() {
    document.querySelectorAll('div.select').forEach(div => div.style.display = 'block')
    fetch(url)
        .then(response => response.json()
            .then(data => {
                let affichage = '<ul>';
                for (let i = 0; i < data.length; i++) {
                    affichage += '<li id="voiture' + i + '">';
                    affichage += '<h3>' + data[i].Nom + '</h3>';
                    src = data[i].img;
                    affichage += '<div><img alt="'+data[i].Nom+'" src="' + src + '"></div>';
                    affichage += '<div><p class="description" style="display: none;">' + data[i]["Description"] + '</p>'
                    affichage += '<p class="energie" style="display: none;"> Type d\'énergie : ' + data[i]["Energie"] + '</p>'
                    affichage += '<p class="carrosserie" style="display: none;"> Type de carrosserie : ' + data[i]["Carrosserie"] + '</p>'
                    affichage += '<canvas id="myChart' + i + '" class="canvasList" style="display: none;"></canvas></div> </li>';
                    affichage += '<input type="button" class="btnDetail btn btn-primary" style="display: none;" id="'+data[i].Nom+'" value ="Plus de détails">'
                    tabTime[i] = data[i]["Courbe d'accélération"]["time"];
                    tabAcceleration[i] = data[i]["Courbe d'accélération"]["Accélération"];
                    cpt = data.length;
                }
                affichage += '</ul>';
                document.querySelector('#affichageVoiture').innerHTML = affichage;
                var btnsDetail = document.querySelectorAll('input.btnDetail');
                console.log(btnsDetail);
                btnsDetail.forEach(btn => btn.addEventListener('click', function (){onClickAfficheDetail(btn.id)}));
                initTabs();
                affichageDetail();
                optionSelect(data);
            }))
}

function initTabs() {
    let ctx;
    let labels;
    let data;
    let coef;
    let tabMoy;
    for (let i = 0; i < cpt; i++) {
        try {
            ctx = document.getElementById('myChart' + i).getContext('2d');
        }catch (e){
            console.log(e);
            break;
        }
        tabCtx.push(ctx);
        labels = tabTime[i]
        data = tabAcceleration[i];
        coef = MoyTab(tabAcceleration[i])/5;
        tabMoy = [];

        for(let j = 0; j < labels.length; j++){
            labels[j] = Math.round(labels[j]*10)/10;
            tabMoy.push(coef*j/5);
        }

        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Courbe d'accélération",
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                },
                    {
                        label: "Courbe d'accélération moyenne",
                        data: tabMoy,
                        backgroundColor: [
                            'rgba(99,115,255,0.2)',
                        ],
                        borderColor: [
                            'rgb(99,115,255)',
                        ],
                        borderWidth: 1
                    }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: false,
            }
        })
    }

}

function MoyTab(tab){
    var somme = 0;
    for(let i = 0; i < tab.length; i ++){
        somme += tab[i];
    }
    return somme/tab.length;
}

function affichageDetail() {
    var listeVoiture  = document.querySelectorAll('ul > li');

    listeVoiture.forEach(voiture => {
        voiture.addEventListener('click', () =>{
            let id = voiture.id;
            let canva = document.querySelector('li#'+id+' > div > canvas');
            let description = document.querySelector('li#'+id+' > div > p.description');
            let carosserie = document.querySelector('li#'+id+' > div > p.carrosserie');
            let energie = document.querySelector('li#'+id+' > div > p.energie');
            let btn = document.querySelector('input.btnDetail');
            if(canva.style.display === 'none' || description.style.display === 'none' || carosserie.style.display === 'none' || energie.style.display === 'none') {
                canva.style.display = 'block';
                description.style.display = 'block';
                carosserie.style.display = 'block';
                energie.style.display = 'block';
                btn.style.display = 'block';
            } else{
                canva.style.display = 'none';
                description.style.display = 'none';
                carosserie.style.display = 'none';
                energie.style.display = 'none';
                btn.style.display = 'none';
            }
        })
    })
}

function optionSelect(datas){
    if(selectDetail.options.length === 1) {
        for (let i = 0; i < datas.length; i++) {
            let option = new Option(datas[i].Nom, datas[i].Nom);
            selectDetail.options.add(option);
        }
    }
    if(selectEnergie.options.length === 1) {
        let tab = [];
        for (let i = 0; i < datas.length; i++) {
            tab.push(datas[i].Energie);
        }
        tab = filtreTab(tab);
        for(let j = 0; j < tab.length;j ++){
            let option = new Option(tab[j], tab[j]);
            selectEnergie.options.add(option);
        }
    }
}

function onClickAfficheDetail(recherche){
    if(recherche === ''){
        rechercheDonnee();
    }else{
        document.querySelectorAll('div.select').forEach(div => div.style.display = 'none')
        fetch(url)
            .then(response => response.json()
                .then(data => {
                    let affichage = '<article>';
                    let idVoiture;
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].Nom === recherche) {
                            affichage += '<div id="voitureRecherche">';
                            affichage += '<h3>' + data[i].Nom + '</h3>';
                            src = data[i].img;
                            affichage += '<div><img alt="'+data[i].Nom+'" src="' + src + '" id="detail"></div>';
                            affichage += '<div><p>' + data[i]["Description"] + '</p>'
                            affichage += '<p class="energie" > Type d\'énergie : ' + data[i]["Energie"] + '</p>'
                            affichage += '<p class="carrosserie" > Type de carrosserie : ' + data[i]["Carrosserie"] + '</p>'
                            affichage += '<p class="Poids" > Poids : ' + data[i]["Poids"] + '</p>'
                            affichage += '<p class="Classe" > Classe : ' + data[i]["Classe"] + '</p>'
                            affichage += '<p class="Marque" > Marque : ' + data[i]["Marque"] + '</p>'
                            affichage += '<p class="Moteur" > Moteur : ' + data[i]["Moteur"] + '</p>'
                            affichage += '<p class="Production" > Production : ' + data[i]["Production"] + '</p>'
                            affichage += '<p class="Consommation" > Consommation : ' + data[i]["Consommation"] + '</p>'
                            affichage += '<p class="Transmission" > Transmission : ' + data[i]["Transmission"] + '</p>'
                            affichage += '<p class="Accélération" > Accélération : ' + data[i]["Accélération"] + '</p>'
                            affichage += '<p class="Boite de vitesses" > Boite de vitesses : ' + data[i]["Boite de vitesses"] + '</p>'
                            affichage += '<p class="Vitesse maximale" > Vitesse maximale : ' + data[i]["Vitesse maximale"] + '</p>'
                            affichage += '<p class="Couple maximal" > Couple maximal : ' + data[i]["Couple maximal"] + '</p>'
                            affichage += '<p class="Emissions de CO2" > Emissions de CO2 : ' + data[i]["Emissions de CO2"] + '</p>'
                            affichage += '<p class="carrosserie" > Type de carrosserie : ' + data[i]["Carrosserie"] + '</p>'
                            affichage += '<canvas id="myChart' + i+25 + '"></canvas></div>';
                            tabTime[i] = data[i]["Courbe d'accélération"]["time"];
                            tabAcceleration[i] = data[i]["Courbe d'accélération"]["Accélération"];
                            idVoiture = i;
                            break;
                        }
                    }
                    affichage += '</article>';
                    document.querySelector('#affichageVoiture').innerHTML = affichage;
                    initTab(idVoiture);
                    affichageDetail();
                    optionSelect(data);

                }))
    }

}

function onClickAfficheListeFiltre(){
    var energie = selectEnergie.value;
    if(energie === ''){
        rechercheDonnee();
    }else{
        fetch(url)
            .then(response => response.json()
                .then(data => {
                    let affichage = '<ul>';
                    let tmpCpt = 0;
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].Energie === energie) {
                            affichage += '<li id="voiture' + tmpCpt + '">';
                            affichage += '<h3>' + data[i].Nom + '</h3>';
                            src = data[i].img;
                            affichage += '<div><img alt="'+data[i].Nom+'" src="' + src + '"></div>';
                            affichage += '<div><p class="description" style="display: none;">' + data[i]["Description"] + '</p>'
                            affichage += '<p class="energie" style="display: none;"> Type d\'énergie : ' + data[i]["Energie"] + '</p>'
                            affichage += '<p class="carrosserie" style="display: none;"> Type de carrosserie : ' + data[i]["Carrosserie"] + '</p>'
                            affichage += '<canvas id="myChart' + tmpCpt + '" class="canvasList" style="display: none;"></canvas></div> </li>';
                            affichage += '<input type="button" class="btn btn-primary btnDetail" style="display: none;" id="'+data[i].Nom+'" value="Plus de détails">'
                            tabTime[i] = data[i]["Courbe d'accélération"]["time"];
                            tabAcceleration[i] = data[i]["Courbe d'accélération"]["Accélération"];
                            tmpCpt ++;
                        }
                    }
                    affichage += '</ul>';
                    document.querySelector('#affichageVoiture').innerHTML = affichage;
                    initTabs();
                    affichageDetail();
                    optionSelect(data);
                }))
    }
}

function onClickRetour(){
    selectEnergie.value = '';
    selectDetail.value = '';
    rechercheDonnee();
}

function initTab(idVoiture) {
    let ctx;
    let labels;
    let data;
    let coef;
    let tabMoy;
    ctx = document.getElementById('myChart' + idVoiture+25).getContext('2d');
    tabCtx.push(ctx);
    labels = tabTime[idVoiture];
    data = tabAcceleration[idVoiture];
    coef = MoyTab(tabAcceleration[idVoiture])/5;
    tabMoy = [];

    for(let j = 0; j < labels.length; j++){
        labels[j] = Math.round(labels[j]*10)/10;
        tabMoy.push(coef*j/5);
    }

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Courbe d'accélération",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            },
                {
                    label: "Courbe d'accélération moyenne",
                    data: tabMoy,
                    backgroundColor: [
                        'rgba(99,115,255,0.2)',
                    ],
                    borderColor: [
                        'rgb(99,115,255)',
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,
        }
    })
}

function filtreTab(inputArr){
    var found ={};

    return inputArr.filter(function(element){
        return found.hasOwnProperty(element)? false : (found[element]=true);
    });
}