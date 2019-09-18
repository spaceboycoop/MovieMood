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
        for (let i = 0; i < response.genres.length; i++) {
            if (genre1 == response.genres[i].name) {
                genre1 = response.genres[i].id;
            } else if (genre2 == response.genres[i].name) {
                genre2 = response.genres[i].id;
            }
        }
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
            "url": `${baseURL}/${endpoint}?${$.param($params)}`,
            "async": true,
            "crossDomain": true,
            "method": "GET",
            "headers": {},
            "data": "{}"
        })
        .done(response => {
            console.log(response);
            for (let i = 0; i < response.results.length; i++) {
                overviews.push(response.results[i].overview);
                titles.push(response.results[i].title);
                poster.push(`https://image.tmdb.org/t/p/original${response.results[i].poster_path}`);
                $('#movies').append(getCardItem(i));
            }
        });
    }
}

const getCardItem = function(index) {
    var $overlay = $(`<div class = "view overlay"</div>`);
    var $cardItem = $(`<div class="card mr-3" style="width: 15rem;"></div>`);
    var $image = $(`<img class="card-img-top gif mb-3 img-fluid" src=${poster[index]}>`);
    $overlay.append($image);
    var $text = $(`<div class="mask flex-center rgba-blue-strong w-auto h-auto overflow-auto"></div>`);
    $text.append(`<p class="white-text bg-transparent">${overviews[index]}</p>`);
    $overlay.append($text);
    var $cardBody = $(`<div class="card-body"></div>`);
    $cardBody.append($overlay);
    $cardBody.append(`<h5 class="card-title">${titles[index]}</h5>`);
    $cardItem.append($cardBody);

    return $cardItem;
};

let faceData;

function getFaceData(source_url) {
    const endpoint = 'detect';
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };
    $.ajax({
        url: `${uriBase}/${endpoint}?${$.param(params)}`,
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
};
