$(function () {
    $('#button-search').click(() => {
        if (!$('#ingredient').val()) {
            let msg = "Hey, com'on... Type something first, ok?";
            messageToUser(msg);
        } else {

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
                    result = JSON.parse(result);
                    console.log(result);
                    if(result.meals != null) {
                        //add a loading
                        loading();
                        let list = $('<ul class="list-group"></ul>');
                        $('#meals').append(list);

                        result.meals.forEach(meal => {
                            //Add list
                            let item = $('<li class="list-group-item"></li>');
                            item.html(meal.strMeal);
                            list.append(item);
                        });
                        
                    } else {
                        let msg = `Hey, I don't know what <mark>${$('#ingredient').val()}</mark> is. Can you try another thing?`;
                        messageToUser(msg);
                    }
                })
                .catch(error => {
                    messageToUser("Ohho.. Something not good happened. Keep calm!");
                    console.error('error', error);
                });
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

function loading() {
    $('#meals').html('');
}