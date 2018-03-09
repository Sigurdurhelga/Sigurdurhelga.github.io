function changeColor(color) {
    $("#color").val(color);
    $(".colorPreview").css("background", color);
    $(".colorLabel").text(color)
}

function changeFill(filled, shape) {
    if (filled) {
        $("nonFilled" + shape).hide();
        $("filled" + shape).show();
    } else {
        $("nonFilled" + shape).show();
        $("filled" + shape).hide();
    }
}

function changeLineWidth(lineWidth, shape) {
    $("#" + shape + "Slider").val(lineWidth);
    $("#" + shape + "Linewidth").text(lineWidth + "px");
}

function restoreSettings(target) {
    openTool(null, target.shape);
    changeColor(target.color);

    switch (target.shape) {
        case drawio.availableShapes.CIRCLE:
            changeFill(target.filled, "Circle");
            changeLineWidth(target.lineWidth, target.shape);
            break;
        case drawio.availableShapes.RECTANGLE:
            changeFill(target.filled, "Rectangle");
            changeLineWidth(target.lineWidth, target.shape);
            break;
        case drawio.availableShapes.LINE:
            changeLineWidth(target.lineWidth, target.shape);
            break;
        case drawio.availableShapes.PEN:
            changeLineWidth(target.lineWidth, target.shape);
            break;
        case drawio.availableShapes.TEXT:
            $("#textToolText").val(target.stringText);
            let font = target.font.split(" ").slice(1).join(" ");
            $("#textToolFont").val(font);
            $("#fontSlider").val(target.fontSize);
            $("#fontSize").text(target.fontSize + "pt");
            break;
    }
}

function updateLineWidth(target, lineWidth) {
    if (target) {
        target.lineWidth = lineWidth;
        drawio.redraw();
    }
}

$("#lineSlider").on("input", function () {
    let lineWidth = $("#lineSlider").val();
    $("#lineLinewidth").text(lineWidth + "px");
    updateLineWidth(drawio.updateElement, lineWidth);
});

$("#penSlider").on("input", function () {
    $("#penLinewidth").text($("#penSlider").val() + "px");
    updateLineWidth(drawio.updateElement, $("#penSlider").val());
});

$("#circleSlider").on("input", function () {
    $("#circleLinewidth").text($("#circleSlider").val() + "px");
    updateLineWidth(drawio.updateElement, $("#circleSlider").val());
});

$("#rectangleSlider").on("input", function () {
    $("#rectangleLinewidth").text($("#rectangleSlider").val() + "px");
    updateLineWidth(drawio.updateElement, $("#rectangleSlider").val());
});

$("#fontSlider").on("input", function () {
    $("#fontSize").text($("#fontSlider").val() + "pt");
    drawio.currentTextItem.font = $("#fontSlider").val() + "pt " + $("#textToolFont")[0].value;

    if (drawio.updateElement) {
        drawio.updateElement.fontSize = $("#fontSlider").val();
        drawio.updateElement.font = $("#fontSlider").val() + "pt " + $("#textToolFont")[0].value;
        drawio.updateElement.width = drawio.ctx.measureText(drawio.updateElement.stringText, drawio.updateElement.font).width;
        drawio.updateElement.height = parseInt(drawio.currentTextItem.font);
        drawio.redraw();
    }
});

$("#textToolText").on("keyup", function () {
    if (drawio.updateElement) {
        drawio.updateElement.stringText = $("#textToolText").val();
        drawio.updateElement.width = drawio.ctx.measureText(drawio.updateElement.stringText, drawio.updateElement.font).width;
        drawio.updateElement.height = parseInt(drawio.currentTextItem.font);
        drawio.redraw();
    }
});

$("#textToolFont").on("change", function () {
    if (drawio.updateElement) {
        let oldFont = drawio.updateElement.font;
        drawio.updateElement.font = $("#fontSlider").val() + "pt " + $("#textToolFont")[0].value;
        drawio.updateElement.width = drawio.ctx.measureText(drawio.updateElement.stringText, drawio.updateElement.font).width;
        drawio.updateElement.height = parseInt(drawio.currentTextItem.font);
        drawio.state.unshift(new FontChanged("Font Change", drawio.updateElement, oldFont, drawio.updateElement.font));
        updateHistory();
        drawio.redraw();
    }
});

$("#nonFilledCircle").click(function () {
    $("#nonFilledCircle").hide();
    $("#filledCircle").show();
    $("#circle .slidecontainer").hide();
    drawio.filledCircle = !drawio.filledCircle;

    if (drawio.updateElement) {
        drawio.updateElement.filled = drawio.filledCircle;
        drawio.state.unshift(new ShapeFilled("Shape Filled", drawio.updateElement, drawio.updateElement.filled));
        updateHistory();
        drawio.redraw();
    }
});

$("#filledCircle").click(function () {
    $("#filledCircle").hide();
    $("#nonFilledCircle").show();
    $("#circle .slidecontainer").show();
    drawio.filledCircle = !drawio.filledCircle;

    if (drawio.updateElement) {
        drawio.updateElement.filled = drawio.filledCircle;
        drawio.state.unshift(new ShapeFilled("Shape Filled", drawio.updateElement, drawio.updateElement.filled));
        updateHistory();
        drawio.redraw();
    }
});

$("#nonFilledRectangle").click(function () {
    $("#nonFilledRectangle").hide();
    $("#filledRectangle").show();
    $("#rectangle .slidecontainer").hide();
    drawio.filledRectangle = !drawio.filledRectangle;

    if (drawio.updateElement) {
        drawio.updateElement.filled = drawio.filledRectangle;
        drawio.state.unshift(new ShapeFilled("Shape Filled", drawio.updateElement, drawio.updateElement.filled));
        updateHistory();
        drawio.redraw();
    }
})

$("#filledRectangle").click(function () {
    $("#filledRectangle").hide();
    $("#nonFilledRectangle").show();
    $("#rectangle .slidecontainer").show();
    drawio.filledRectangle = !drawio.filledRectangle;

    if (drawio.updateElement) {
        drawio.updateElement.filled = drawio.filledRectangle;
        drawio.state.unshift(new ShapeFilled("Shape Filled", drawio.updateElement, drawio.updateElement.filled));
        updateHistory();
        drawio.redraw();
    }
})