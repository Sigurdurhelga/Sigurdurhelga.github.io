$(".colorPreview").click(function (event) {
    $("#colorModal").show(500);
});

function updateColor() {
    let color = drawio.selectedColor.value;
    $(".colorPreview").css("background", color);
    $(".colorLabel").text(color);
    if (drawio.updateElement) {
        drawio.updateElement.color = color;
        drawio.redraw();
    }
};

$("#colorModal").on('mousemove', function (event) {
    updateColor();
});

$("#colorModal").on('mouseup', function (event) {
    updateColor();
});
updateColor();

$(document).mouseup(function (e) {
    var container = $("#colorModal");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});