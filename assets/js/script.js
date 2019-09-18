let faceData;
let img_url;

$('#submit').click(function () {

    img_url = $('#imageURL').val();
    $('.imageHolder').html(`<img src="${img_url}" class="img-thumbnail shadow p-3 mb-4 bg-white rounded"
    alt="Responsive image" id="image"></img>`);
    processImage(img_url);

});

$('#fileButton').on('click', openDialog);

function openDialog() {
    img_url = $('#file').click();
}

function processImage(source_url) {
    const face_api_key = "1164a87de384422aaa3ca0e1ee7c6f3d";

    const uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    $.ajax({
        url: `${uriBase}?${$.param(params)}`,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", face_api_key);
        },
        method: "POST",
        data: '{"url": ' + '"' + source_url + '"}',
    })
        .then(function (data) {
            $('#char').append(`<h1>Age : ${data[0].faceAttributes.age}</h1>`);
            console.log(data);
            faceData = data;
        })
        .fail(function (error) {
            console.log(error);
        });
};
