function State(type, target, typeOfState) {
    this.type = type;
    this.target = target;
    this.typeOfState = typeOfState;
};

State.prototype.undo = function () {};
State.prototype.redo = function () {};
State.prototype.description = function () {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1)
};
State.prototype.icon = function () {};

function ShapeCreated(type, target) {
    State.call(this, type, target, drawio.availableStates.SHAPECREATED);
};

ShapeCreated.prototype = Object.create(State.prototype);
ShapeCreated.prototype.constructor = State;
ShapeCreated.prototype.undo = function () {
    drawio.shapes.pop();
};

ShapeCreated.prototype.redo = function () {
    drawio.shapes.push(this.target);
};

ShapeCreated.prototype.icon = function () {
    switch (this.type) {
        case drawio.availableShapes.RECTANGLE:
            return "square";
            break;
        case drawio.availableShapes.CIRCLE:
            return "circle";
            break;
        case drawio.availableShapes.PEN:
            return "pencil-alt";
            break;
        case drawio.availableShapes.LINE:
            return "bars";
            break;
        case drawio.availableShapes.TEXT:
            return "font";
            break;
    }
};

function ShapeMoved(type, target, oldPosition, newPosition) {
    State.call(this, type, target, drawio.availableStates.SHAPEMOVED);
    this.oldPosition = oldPosition;
    this.newPosition = newPosition;
};

ShapeMoved.prototype = Object.create(State.prototype);
ShapeMoved.prototype.constructor = State;
ShapeMoved.prototype.undo = function () {
    this.target.move(this.oldPosition);
};

ShapeMoved.prototype.redo = function () {
    this.target.move(this.newPosition);
};

ShapeMoved.prototype.icon = function () {
    return "arrows-alt";
};

function ShapeColored(type, target, oldColor, newColor) {
    State.call(this, type, target, drawio.availableStates.SHAPECOLORED);
    this.oldColor = oldColor;
    this.newColor = newColor;
};

ShapeColored.prototype = Object.create(State.prototype);
ShapeColored.prototype.constructor = State;
ShapeColored.prototype.undo = function () {
    this.target.color = this.oldColor;
};

ShapeColored.prototype.redo = function () {
    this.target.position = this.newColor;
};

ShapeColored.prototype.icon = function () {
    return "paint-brush";
};

function FontChanged(type, target, oldFont, newFont) {
    State.call(this, type, target, drawio.availableStates.FONTCHANGED);
    this.oldFont = oldFont;
    this.newFont = newFont;
};

FontChanged.prototype = Object.create(State.prototype);
FontChanged.prototype.constructor = State;
FontChanged.prototype.undo = function () {
    this.target.font = this.oldFont;
};

FontChanged.prototype.redo = function () {
    this.target.font = this.newFont;
};

FontChanged.prototype.icon = function () {
    return "font";
};

function ShapeFilled(type, target, filled) {
    State.call(this, type, target, drawio.availableStates.SHAPEFILLED);
    this.filled = filled;
};

ShapeFilled.prototype = Object.create(State.prototype);
ShapeFilled.prototype.constructor = State;
ShapeFilled.prototype.undo = function () {
    this.target.filled = !this.filled;
};

ShapeFilled.prototype.redo = function () {
    this.target.filled = this.filled;
};

ShapeFilled.prototype.icon = function () {
    if (this.target.shape === drawio.availableShapes.CIRCLE) {
        return "circle";
    }
    else {
        return "square";
    }
};

function updateHistory() {
    $(".historyWrapper").html("");
    for (let i = 0; i < drawio.state.length; i++) {
        let className = "historyItem";
        if (i == drawio.currentState) {
            className = "historyItem active";
        }
        let description = drawio.state[i].description();
        let icon = drawio.state[i].icon();
        let index = drawio.state.length - i;

        $(".historyWrapper").append("<div class='" + className + "'> \
                <i class='fas fa-" + icon + "'></i> \
                <div class='historyItemName'>" + description + "</div> \
                <div class='historyItemId'>" + index + "</div> \
            </div>");
    }
}

$(document).on("click", ".historyItem", function (event) {
    let newState = $(".historyItem").index(this);
    if (newState > drawio.currentState) {
        // undo
        for (let i = drawio.currentState; i < newState; i++) {
            drawio.state[i].undo();
        }
    } else if (newState < drawio.currentState) {
        // redo
        for (let i = drawio.currentState - 1; i >= newState; i--) {
            drawio.state[i].redo();
        }
    }
    drawio.currentState = newState;
    drawio.redraw();
    updateHistory();
});
