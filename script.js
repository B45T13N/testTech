const url = "https://api.npoint.io/d3d609dfd966deae52e2";
var src = '';
var cpt = 0;
var tabCtx = [];
var tabAcceleration = [];
var tabTime = [];


fetch(url)
    .then(response =>  response.json()
    .then(data => {
        let affichage = '<ul>';
        for(let i = 0; i < data.length ; i++){
            affichage += '<li id="voiture'+cpt+'">';
            affichage += '<h3>'+ data[i].Nom +'</h3>';
            src = data[i].img;
            affichage += '<div><img src="' + src  + '"></div>';
            affichage += '<div><p>'+data[i]["Description"]+'</p>'
            affichage += '<canvas id="myChart'+i+'" style="display: none;"></canvas></div> </li>';
            tabTime[i] = data[i]["Courbe d'accélération"]["time"];
            tabAcceleration[i] = data[i]["Courbe d'accélération"]["Accélération"];
            cpt ++;
        }
        affichage += '</ul>';
        document.querySelector('#affichageVoiture').innerHTML = affichage;
        initTab();

        affichageDetail();
    }))

function initTab() {
    for (let i = 0; i < cpt; i++) {
        let ctx = document.getElementById('myChart' + i).getContext('2d');
        tabCtx.push(ctx);
        let labels = tabTime[i]
        let data = tabAcceleration[i];
        let coef = MoyTab(tabAcceleration[i])/5;
        let tabMoy = [];
        for(let j = 0; j < labels.length; j++){
            labels[j] = Math.round(labels[j]*10)/10;
            tabMoy.push(coef*j/5)
        }



        var myChart = new Chart(tabCtx[i], {
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
            let description = document.querySelector('li#'+id+' > div > p');
            if(canva.style.display === 'none' || description.style.display === 'none') {
                canva.style.display = 'block';
                description.style.display = 'block';
            } else{
                canva.style.display = 'none';
                description.style.display = 'none';
            }
        })
    })
}


