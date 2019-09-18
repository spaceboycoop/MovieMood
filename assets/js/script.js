// --- GENRE OPTIONS ---
// Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History,
// Horror, Music, Mystery, Romance, Science, Fiction, TV Movie, Thriller, War, Western

// IDEAS:

// Happinness = Comedy
// Angry = War,Crime
// Contempt = War
// accessories? = Music
// Sadness = Romantic
// Surpise = Thriller
// Age > 50 = History
// Fear = Horror
// Glasses, Facial Hair = Science
// Age < 16 = Animation
// Neutral = documentary
// Bald = War

const moviedb_api_key = '9c78553cb3547d0c21d49df380da12a6';
const face_api_key = '1164a87de384422aaa3ca0e1ee7c6f3d';

const moviedb_baseurl = 'https://api.themoviedb.org/3';
const faceapi_baseurl = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0';

var voteAverages = [];

let faceData;
let img_url;

$(document).ready(function() {
    $('#fileButton').on('click', function() {
        img_url = $('#file').click();
    });

    $('#submit').click(function () {
        img_url = $('#imageURL').val();
        $('.imageHolder').html(`<img src="${img_url}" class="img-thumbnail shadow p-3 mb-4 bg-white rounded"
    alt="Responsive image" id="image">`);
        getFaceData(img_url);
    });

    $('#imageInput').on('change', getFaceData);

    //getMovieData('Horror','Romance');
});

const getMovieCard = function(movie) {
    console.log('getCardItem');
    let $overlay = $(`<div class="view overlay">`);
    let $cardItem = $(`<div class="card mr-3" style="width: 15rem;">`);
    let $image = $(`<img class="card-img-top gif mb-3 img-fluid" src="https://image.tmdb.org/t/p/original${movie.poster_path}">`);
    $image.css('height', '300px');
    $overlay.append($image);
    let $text = $(`<div class="mask rgba-cyan-strong overflow-auto">`);
    $text.append(`<p class="white-text p-2 align-middle bg-transparent">${movie.overview}</p>`);
    $text.css('height', '300px');
    $overlay.append($text);
    let $cardBody = $(`<div class="card-body">`);
    $cardBody.append($overlay);
    $cardBody.append(`<h5 class="card-title">${movie.title}</h5>`);
    $cardItem.append($cardBody);
    var $cardFooter = $('<div class="card-footer">');
    var $vote = $(`<small class-"text-muted bg-transparent">Vote Average ${movie.vote_averages}<small>`)
    $cardFooter.append($vote);
    $cardItem.append($cardFooter);
    return $cardItem;
};

const getMovieData = function(genre1, genre2) {
    let endpoint = 'genre/movie/list';
    let params = {
        language: 'en-US',
        api_key: moviedb_api_key
    };
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": `${moviedb_baseurl}/${endpoint}?${$.param(params)}`,
        "method": "GET",
        "headers": {},
        "data": "{}"
    })
    .done(response => {
        response.genres.forEach((genre) => {
            if (genre1 == genre.name) {
                genre1 = genre.id;
            } else if (genre2 == genre.name) {
                genre2 = genre.id;
            }
        });

        let endpoint = 'discover/movie';
        let params = {
            with_genres: `${genre1},${genre2}`,
            page: 1,
            include_video: false,
            include_adult: false,
            sort_by: 'popularity.desc',
            language: 'en-US',
            api_key: moviedb_api_key
        };
        $.ajax({
            "url": `${moviedb_baseurl}/${endpoint}?${$.param(params)}`,
            "async": true,
            "crossDomain": true,
            "method": "GET",
            "headers": {},
            "data": "{}"
        })
        .done(response => {
            response.results.forEach((result, i) => {
                $('#movies').append(getMovieCard(result));
            });
        });
    });
};

const getFaceData = function(e) {
    const endpoint = 'detect';
    var imageFile = e.target.files[0];
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };
    $.ajax({
        url: `${faceapi_baseurl}/${endpoint}?${$.param(params)}`,
        contentType: 'application/octet-stream',
        dataType: 'json',
        headers: {
            'Ocp-Apim-Subscription-Key' : face_api_key
        },
        method: "POST",
        cache:false,
        processData: false,
        data: imageFile
    })
    .then(function (data) {
        console.log(data);
        $('#char').append(`<h1>Age : ${data[0].faceAttributes.age}</h1>`);
        faceData = data;
    })
    .fail(function (error) {
        console.log(error);
    });
};