var data;

$(function () {
    $('#button-search').click(() => {
        if (!$('#ingredient').val()) {
            let msg = "Hey, com'on... Type something first, ok?";
            messageToUser(msg);
        } else {
            //add a loading
            loading(true);

            //fetch meals
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            let url = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
            url += $('#ingredient').val();

            fetch(url, requestOptions)
                .then(response => response.text())
                .then(result => {
                    data = JSON.parse(result);
                    //console.log(data);
                    if(data.meals != null) {
                        
                        let list = $('<div class="list-group"></div>');
                        $('#meals').append(list);

                        data.meals.forEach((meal, i) => {
                            //Add list
                            let item = `<a href="#receipe" id="meal${meal.idMeal}" class="receipeitem list-group-item list-group-item-action" onclick='selectMeal(${i}, this.id)'>`;
                            item += '<div class="d-flex w-100 justify-content-between align-items-center">';
                            item += `<img class='imgThumb' src='${meal.strMealThumb}/preview' alt='thumb_${meal.idMeal}' onerror="this.onerror=null; this.src='./images/logo-small.png'" />`;
                            item += `<span class='flex-fill ml-2'>${meal.strMeal}</span>`;
                            item += '</div></a>';
                            list.append(item);
                        });
                        loading(false);
                    } else {
                        let msg = `Hey, I don't know what <mark>${$('#ingredient').val()}</mark> is. Can you try another thing?`;
                        loading(false);
                        messageToUser(msg);
                    }
                })
                .catch(error => {
                    loading(false);
                    messageToUser("Ohho.. Something not good happened. Keep calm!");
                    console.error('error', error);
                });
        }
    });

    // mapping ENTER press on the ingredient field
    $('#ingredient').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $('#button-search').click();
        }
    });
});

function messageToUser(msg) {
    $('#meals').html('');
    let par = $(`<p>${msg}</p>`);
    $('#meals').append(par);

    setTimeout(() => {
        //clear
        $('#meals').html('');
    }, 5000);
}

function loading(onOff) {
    if (onOff)
        $('#meals').html('<img id="loadingPan" class="imgLoading" src="./images/frypan-white.gif" alt="loading">');
    else
        setTimeout(()=> {$('#loadingPan').fadeOut();}, 1000);
}

function selectMeal(index, element) {
    // highlight selected meal
    $('.receipeitem').removeClass("active");
    $(`#${element}`).addClass("active");

    //clean previous meal details
    $('#receipe').html('');

    let meal = data.meals[index];

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+meal.idMeal, requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(result);
            let mealDet = JSON.parse(result);
            mealDet = mealDet.meals[0];

            
            let prev = '<div class="card bg-light">'; 
            prev += `<h5 class="card-header">${meal.strMeal}</h5>`;
            prev += `<img class="card-img-top" src='${meal.strMealThumb}' alt='pic_${meal.idMeal}' />`;
            prev += '<div class="card-body">';
            prev += `<h5 class="card-title">${meal.strMeal}</h5>`;
            prev += `<p class="text-right">Origin: ${mealDet.strArea}</p>`;
            if (mealDet.strCategory) {
                prev += `<p class="text-right">Category: ${mealDet.strCategory}</p>`;
            }

            //ingedients
            prev += '<h6 class="card-title">Ingredients</h6>';
            prev += '<ul class="list-group list-group-flush">';
            for (let i=1; i<=20; i++) {
                if (mealDet["strIngredient"+i]) {
                    prev += `<li class="list-group-item">${mealDet["strIngredient"+i]} - ${mealDet["strMeasure"+i]}</li>`;
                }
            }

            prev += '</ul>';
            prev += '<br/>'
            
            prev += '<h6 class="card-title">Instructions</h6>';

            //brake in lines to easy reading
            prev += `<p>${(mealDet.strInstructions).replace(/\./g,".<br/><br/>")}</p>`;
            

            prev += '</div><br/></div><br/>';

            $('#receipe').append(prev);


        })
        .catch(error => console.log('error', error));



    
}
