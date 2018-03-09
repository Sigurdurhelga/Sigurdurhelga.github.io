$(function () {

    $('#colorpicker').farbtastic('#color');

    /*
        get all available fonts from google webfonts and include them into the project
    */
    $.ajax({
        type: "GET",
        headers: {
            Accept: "application/json",
        },
        url: "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCXm6o1hpeorzN_rutxXdbt03jMreNMgG0&sort=popularity",
        success: (response) => {
            let select = $("#textToolFont")[0];
            for (let index = 0; index < 50; index++) {
                if (response.items[index].variants.includes("regular") && response.items[index].family.match(/\d+/g) == null) {
                    var newFontFace = new FontFace(response.items[index].family, 'url(' + response.items[index].files.regular + ')');
                    document.fonts.add(newFontFace);
                    let option = document.createElement('option');
                    option.text = response.items[index].family;
                    option.value = response.items[index].family;
                    option.style.fontFamily = response.items[index].family;
                    select.add(option);
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });


    function resizeCanvas() {
        drawio.canvas.width = $(window).width();
        drawio.canvas.height = $(window).height();
        drawio.redraw();
    }
    resizeCanvas();


    $(window).bind("resize", resizeCanvas);
});
