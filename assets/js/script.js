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
const face_api_key = "1164a87de384422aaa3ca0e1ee7c6f3d";

const moviedb_baseurl = 'https://api.themoviedb.org/3';
const faceapi_baseurl = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0';

var titles = [];
var poster = [];
var overviews = [];

const getMovieData = (genre1, genre2) => {
    let endpoint = 'genre/movie/list';
    let params = {
        language: 'en-US',
        api_key: moviedb_api_key
    };
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": `${moviedb_baseurl}/${endpoint}?${$.params(params)}`,
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

        console.log(response);
        
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
            "url": `${baseURL}/${endpoint}?${$.param(params)}`,
            "async": true,
            "crossDomain": true,
            "method": "GET",
            "headers": {},
            "data": "{}"
        })
        .done(response => {
            console.log(response);
            response.results.forEach((result, i) => {
                overviews.push(result.overview);
                titles.push(result.title);
                poster.push(`https://image.tmdb.org/t/p/original${result.poster_path}`);
                $('#movies').append(getCardItem(i));
            });
        });
    });
}

const getCardItem = index => {
    var $overlay = $(`<div class="view overlay">`);
    var $cardItem = $(`<div class="card mr-3" style="width: 15rem;">`);
    var $image = $(`<img class="card-img-top gif mb-3 img-fluid" src=${poster[index]}>`);
    $overlay.append($image);
    var $text = $(`<div class="mask rgba-cyan-strong overflow-auto"></div>`);
    $text.append(`<p class="white-text p-2 align-middle bg-transparent">${overviews[index]}</p>`);
    $text.css('height', '300px');
    $overlay.append($text);
    var $cardBody = $(`<div class="card-body">`);
    $cardBody.append($overlay);
    $cardBody.append(`<h5 class="card-title">${titles[index]}</h5>`);
    $cardItem.append($cardBody);

    return $cardItem;
};

let faceData;

const getFaceData = function(source_url) {
    const endpoint = 'detect';
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };
    $.ajax({
        url: `${faceapi_baseurl}/${endpoint}?${$.param(params)}`,
        contentType: 'application/json',
        headers: { 
            'Ocp-Apim-Subscription-Key' : face_api_key
        },
        method: "POST",
        data: JSON.stringify({ url: source_url })
    })
    .then(function (data) {
        console.log(data);
        faceData = data;
    })
    .fail(function (error) {
        console.log(error);
    });
}
