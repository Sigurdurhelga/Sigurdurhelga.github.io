window.drawio = {
    shapes: [],
    state: [],
    currentState: 0,
    selectedShape: 'pen',
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    selectedColor: document.getElementById('color'),
    selectedElement: null,
    updateElement: null,
    redraw: null,
    background: "white",
    availableShapes: {
        CIRCLE: 'circle',
        RECTANGLE: 'rectangle',
        LINE: 'line',
        MOVE: 'move',
        TEXT: 'text',
        PEN: 'pen',
        SELECT: 'select'
    },
    availableStates: {
        SHAPECREATED: 'shapecreated',
        SHAPEMOVED: 'shapemoved',
        SHAPECOLORED: 'shapecolored',
        FONTCHANGED: 'fontchanged',
        SHAPEFILLED: 'shapefilled'
    },
    currentTextItem: {},
    filledCircle: true,
    filledRectangle: false
};

$(function () {

    function drawCanvas() {
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        if (drawio.background instanceof HTMLImageElement) {
            drawio.ctx.drawImage(drawio.background, 0, 0);
        } else {
            drawio.ctx.fillStyle = drawio.background;
            drawio.ctx.fillRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        }
        for (let i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
    }

    drawio.redraw = drawCanvas;

    $("#canvas").on('mousedown', function (mouseEvent) {
        if (drawio.currentState != 0) {
            for (let i = 0; i < drawio.currentState; i++) {
                drawio.state.shift();
            }
        }

        drawio.currentState = 0;
        switch (drawio.selectedShape) {
            case drawio.availableShapes.CIRCLE:
                var lineWidth = parseInt($("#circleSlider").val());
                drawio.selectedElement = new Circle({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, 0, lineWidth);
                break;
            case drawio.availableShapes.RECTANGLE:
                var lineWidth = parseInt($("#rectangleSlider").val());
                drawio.selectedElement = new Rectangle({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, 0, 0, lineWidth);
                break;
            case drawio.availableShapes.MOVE:
                for (let index = 0; index < drawio.shapes.length; index++) {
                    if (drawio.shapes[index].collision({
                            x: mouseEvent.offsetX,
                            y: mouseEvent.offsetY
                        }))
                        drawio.selectedElement = drawio.shapes[index];
                }
                break;
            case drawio.availableShapes.LINE:
                var lineWidth = parseInt($("#lineSlider").val());
                drawio.selectedElement = new Line({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, lineWidth);
                break;
            case drawio.availableShapes.PEN:
                var lineWidth = parseInt($("#penSlider").val());
                drawio.selectedElement = new Pen({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, lineWidth, mouseEvent.offsetX, mouseEvent.offsetX, mouseEvent.offsetY, mouseEvent.offsetY);
                break;
            case drawio.availableShapes.TEXT:
                let width = drawio.ctx.measureText(drawio.currentTextItem.stringText, drawio.currentState.font).width;
                let height = parseInt(drawio.currentTextItem.font);
                let fontSize = $("#fontSlider").val();
                let newTextItem = new Text({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, width, height, drawio.currentTextItem.font, fontSize, drawio.currentTextItem.stringText);
                drawio.shapes.push(newTextItem);
                drawio.state.unshift(new ShapeCreated(drawio.availableShapes.TEXT, newTextItem));
                updateHistory();
                break;
            case drawio.availableShapes.SELECT:
                for (let index = 0; index < drawio.shapes.length; index++) {
                    if (drawio.shapes[index].collision({
                            x: mouseEvent.offsetX,
                            y: mouseEvent.offsetY
                        })) {
                        drawio.updateElement = drawio.shapes[index];
                        restoreSettings(drawio.shapes[index])
                    }
                }
                break;

        }
        updateHistory();
        drawCanvas();
    });

    $("#canvas").on('mousemove', function (mouseEvent) {
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            switch (drawio.selectedShape) {
                case drawio.availableShapes.RECTANGLE:
                    drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
                    break;
                case drawio.availableShapes.CIRCLE:
                    drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
                    break;
                case drawio.availableShapes.PEN:
                    drawio.selectedElement.add_point({
                        x: mouseEvent.offsetX,
                        y: mouseEvent.offsetY
                    });
                    break;
                case drawio.availableShapes.LINE:
                    drawio.selectedElement.resize({
                        x: mouseEvent.offsetX,
                        y: mouseEvent.offsetY
                    });
                    break;
                case drawio.availableShapes.MOVE:
                    drawio.selectedElement.move({
                        x: mouseEvent.offsetX,
                        y: mouseEvent.offsetY
                    });
                    break;
            }
            drawCanvas();
        } else if (drawio.selectedShape == drawio.availableShapes.TEXT) {
            drawCanvas();
            drawio.ctx.fillStyle = drawio.selectedColor.value;
            drawio.ctx.font = drawio.currentTextItem.font;
            drawio.ctx.fillText(drawio.currentTextItem.stringText, mouseEvent.offsetX, mouseEvent.offsetY);
        }
    });

    $("#canvas").on('mouseup', function (mouseEvent) {
        if (drawio.selectedElement) {
            switch (drawio.selectedShape) {
                case drawio.availableShapes.RECTANGLE:
                    drawio.shapes.push(drawio.selectedElement);
                    drawio.state.unshift(new ShapeCreated(drawio.availableShapes.RECTANGLE, drawio.selectedElement));
                    drawio.selectedElement = null;
                    break;
                case drawio.availableShapes.CIRCLE:
                    drawio.shapes.push(drawio.selectedElement);
                    drawio.state.unshift(new ShapeCreated(drawio.availableShapes.CIRCLE, drawio.selectedElement));
                    drawio.selectedElement = null;
                    break;
                case drawio.availableShapes.PEN:
                    drawio.shapes.push(drawio.selectedElement);
                    drawio.state.unshift(new ShapeCreated(drawio.availableShapes.PEN, drawio.selectedElement));
                    drawio.selectedElement = null;
                    break;
                case drawio.availableShapes.LINE:
                    drawio.shapes.push(drawio.selectedElement);
                    drawio.state.unshift(new ShapeCreated(drawio.availableShapes.LINE, drawio.selectedElement));
                    drawio.selectedElement = null;
                    break;
                case drawio.availableShapes.MOVE:
                    let newLocation = {
                        x: mouseEvent.offsetX,
                        y: mouseEvent.offsetY
                    };
                    drawio.state.unshift(new ShapeMoved(drawio.availableShapes.MOVE, drawio.selectedElement, drawio.selectedElement.oldPosition, newLocation));

                    drawio.selectedElement.move(newLocation);
                    drawio.selectedElement.oldPosition = newLocation;
                    drawio.selectedElement = null;
                    break;
            }
            updateHistory();
        }
    });

    $("#canvas").on('mouseenter', function () {
        drawCanvas();
    });

    $("#canvas").on('mouseleave', function () {
        drawCanvas();
    });

    $("#undo").click(function () {
        if (drawio.state.length > 0 &&
            drawio.currentState < drawio.state.length) {
            drawio.state[drawio.currentState++].undo();
            drawCanvas();
            updateHistory();
        }
    });

    $("#redo").click(function () {
        if (drawio.currentState > 0) {
            drawio.state[--drawio.currentState].redo();
            drawCanvas();
            updateHistory();
        }
    });

    $("#fullResetButton").click(function () {
        drawio.shapes = [];
        drawio.state = [];
        drawio.background = "white";
        drawio.currentTextItem = {};
        drawio.currentState = 0;
        drawio.selectedElement = null;
        drawio.updateElement = null;
        drawCanvas();
        updateHistory();
    });

    $("#save").click(function () {
        try {
            let shapeIdx = []
            drawio.state.forEach(element => {
                shapeIdx.unshift(drawio.shapes.indexOf(element.target));
            })
            window.localStorage.setItem("shapeIdx", JSON.stringify(shapeIdx));
            window.localStorage.setItem("state", JSON.stringify(drawio.state));
            window.localStorage.setItem("currentstate", drawio.currentState);
        } catch (err) {
            console.log("Local Storage acess error.");
            console.log(err)
        }
    })

    $("#load").click(function () {
        try {
            let tempState = JSON.parse(window.localStorage.getItem("state"));
            let shapeIdx = JSON.parse(window.localStorage.getItem("shapeIdx"));
            drawio.currentState = parseInt(window.localStorage.getItem("currentstate"));
            drawio.shapes = [];
            drawio.state = [];
            tempState.forEach(element => {
                if (element.typeOfState === drawio.availableStates.SHAPECREATED) {
                    switch (element.target.shape) {
                        case drawio.availableShapes.CIRCLE:
                            drawio.shapes.unshift(Object.assign(new Circle(), element.target));
                            break;
                        case drawio.availableShapes.RECTANGLE:
                            drawio.shapes.unshift(Object.assign(new Rectangle(), element.target));
                            break;
                        case drawio.availableShapes.LINE:
                            drawio.shapes.unshift(Object.assign(new Line(), element.target));
                            break;
                        case drawio.availableShapes.PEN:
                            drawio.shapes.unshift(Object.assign(new Pen(), element.target));
                            break;
                        case drawio.availableShapes.TEXT:
                            drawio.shapes.unshift(Object.assign(new Text(), element.target));
                            break;
                    }

                }
            });

            for (let i = 0; i < tempState.length; i++) {
                let element = tempState[i];
                element.target = drawio.shapes[shapeIdx[i]];
                switch (element.typeOfState) {
                    case drawio.availableStates.SHAPECREATED:
                        drawio.state.push(Object.assign(new ShapeCreated(), element));
                        break;
                    case drawio.availableStates.SHAPEMOVED:
                        drawio.state.push(Object.assign(new ShapeMoved(), element));
                        break;
                    case drawio.availableStates.SHAPECOLORED:
                        drawio.state.push(Object.assign(new ShapeColored(), element));
                        break;
                    case drawio.availableStates.FONTCHANGED:
                        drawio.state.push(Object.assign(new FontChanged(), element));
                        break;
                }
            }

            for (let i = 0; drawio.currentState > i; i++) {
                drawio.state[i].undo();
            }
            updateHistory();
            drawCanvas();
        } catch (err) {
            console.log("Local Storage acess error.");
            console.log(err);
        }
    });
});

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

function changeCanvasBackground(back) {
    if (back === "reset") {
        drawio.background = "white";
        drawio.redraw();
    } else if (back === 'color') {
        drawio.background = drawio.selectedColor.value;
        drawio.redraw();
    } else {
        var src = createObjectURL(back);
        var background = new Image();
        background.src = src;

        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function () {
            drawio.background = background;
            drawio.redraw();
        };
    }
};

function setupText() {
    drawio.currentTextItem = {
        stringText: $("#textToolText")[0].value == "" ? "Change text in the sidebar" : $("#textToolText")[0].value,
        font: $("#fontSlider").val() + "pt " + $("#textToolFont")[0].value,
    };
};

$("#textToolText").on('input', (change) => {
    drawio.currentTextItem.stringText = change.target.value;
});
$("#textToolFont").on('change', (change) => {
    drawio.currentTextItem.font = $("#fontSlider").val() + "pt " + change.target.value;
});
