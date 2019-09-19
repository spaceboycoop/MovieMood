// --- GENRE OPTIONS ---
// Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History,
// Horror, Music, Mystery, Romance, Science Fiction, TV Movie, Thriller, War, Western

const moviedb_api_key = '9c78553cb3547d0c21d49df380da12a6';
const face_api_key = '1164a87de384422aaa3ca0e1ee7c6f3d';

const moviedb_baseurl = 'https://api.themoviedb.org/3';
const faceapi_baseurl = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0';

var voteAverages = [];

let faceData;
let img_url;

$(document).ready(function () {
    $('#fileButton').on('click', function () {
        img_url = $('#file').click();
    });

    $('#submit').click(function () {

        img_url = $('#imageURL').val();
        $('.imageHolder').html(`<img src="${img_url}" class="img-thumbnail shadow p-3 mb-4 bg-white rounded"
    alt="Responsive image" id="image">`);
        getFaceData(img_url);
    });

    $('#imageInput').on('change', getFaceData);
});

const getMovieCard = function (movie) {
    let $overlay = $(`<div class="view overlay">`);
    let $cardItem = $(`<div class="card m-3" style="width: 15rem;">`);
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
    var $vote = $(`<small class="text-muted bg-transparent">Vote Average ${movie.vote_averages}<small>`)
    $cardFooter.append($vote);
    $cardItem.append($cardFooter);
    return $cardItem;
};

const getMovieData = function (genre1, genre2) {
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
                    $('#movies').empty();
                    response.results.forEach((result, i) => {
                        $('#movies').append(getMovieCard(result));
                    });

                });
        });
};

const getFaceData = function (e) {
    const $loading = $('<img src = "./assets/img/loading.gif"/>');
    $loading.css('width','50%');
    $('#movies').append($loading);
    const endpoint = 'detect';
    var imageFile = e.target.files[0];
    $('.imageHolder').html($(`<img src="${URL.createObjectURL(e.target.files[0])}" alt="uploaded">`));
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
            'Ocp-Apim-Subscription-Key': face_api_key
        },
        method: "POST",
        cache: false,
        processData: false,
        data: imageFile
    })
        .then(function (data) {
            console.log(data);

            let emotion = data[0].faceAttributes.emotion;
            let anger = emotion.anger * 2;
            let contempt = emotion.contempt * 2;
            let disgust = emotion.disgust;
            let fear = emotion.fear * 2;
            let happiness = emotion.happiness;
            let neutral = emotion.neutral / 2;
            let sadness = emotion.sadness * 2;
            let surprise = emotion.surprise * 2;

            $('#char').append(`<h1>Age : ${data[0].faceAttributes.age}</h1>`);
            let emotions = [anger, contempt, disgust, fear, happiness, neutral, sadness, surprise];
            let strongest = Math.max.apply(null, emotions);
            let age = data[0].faceAttributes.age;

            const genre2Select = function () {
                if (data[0].faceAttributes.accessories.length !== 0) {
                    if (data[0].faceAttributes.accessories[0].type === 'headwear') {
                        genre2 = 'Western';
                        return;
                    }
                }
                if (data[0].faceAttributes.facialHair.moustache > 0.8
                    || data[0].faceAttributes.facialHair.beard > 0.8) {
                    genre2 = 'History';
                } else if (happiness === strongest) {
                    genre2 = 'Comedy';
                } else if (sadness === strongest) {
                    genre2 = 'Drama';
                } else if (fear === strongest) {
                    genre2 = 'Horror';
                } else if (surprise === strongest) {
                    genre2 = 'Thriller';
                } else if (contempt === strongest) {
                    genre2 = 'Crime';
                } else if (anger === strongest) {
                    genre2 = 'War';
                } else if (neutral === strongest) {
                    genre2 = 'Mystery';
                } else genre2 = 'Family';
            }
            if (age < 8) {
                genre1 = 'Animation';
                genre2 = 'Family';
            }
            if (age >= 8 && age < 13) {
                genre1 = 'Animation';
                if (data[0].faceAttributes.accessories.length !== 0) {
                    if (data[0].faceAttributes.accessories[0].type === 'headwear') {
                        genre2 = 'Western';
                    } else
                        genre2 = 'Science Fiction'
                } else if (happiness === strongest) {
                    genre2 = 'Comedy';
                } else if (sadness === strongest) {
                    genre2 = 'Drama';
                } else if (fear === strongest) {
                    genre2 = 'Adventure';
                } else if (surprise === strongest) {
                    genre2 = 'Fantasy';
                } else if (contempt === strongest) {
                    genre2 = 'Music';
                } else if (anger === strongest) {
                    genre2 = 'War';
                } else if (neutral === strongest) {
                    genre2 = 'Mystery';
                } else genre2 = 'Family';
            } else if (data[0].faceAttributes.glasses === "ReadingGlasses") {
                genre1 = 'Science Fiction';
                genre2Select();
            } else if (age >= 13 && age < 18) {
                genre1 = 'Action';
                genre2Select();
            } else if (age >= 18 && age < 30) {
                genre1 = 'Adventure'
                genre2Select();
            } else if (age >= 30 && age < 45) {
                genre1 = 'Romance';
                genre2Select();
            } else if (age >= 45 && age < 65) {
                genre1 = 'Adventure';
                genre2Select();
            } else if (age >= 65) {
                genre1 = 'Documentary';
                genre2Select();
            }
            $('#char').append(`<h1>Test:${genre1},${genre2}</h1>`);
            getMovieData(genre1, genre2);
            faceData = data;
        })
        .fail(function (error) {
            console.log(error);
        });
};