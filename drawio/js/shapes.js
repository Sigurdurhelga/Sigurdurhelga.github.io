/*
 * Define the shapes
 */

function Shape(position, shape) {
    this.position = position;
    this.oldPosition = position;
    this.shape = shape;
    this.color = drawio.selectedColor.value || "black";
};

Shape.prototype.render = function () {};

Shape.prototype.move = function (position) {
    this.position = position;
};

Shape.prototype.resize = function () {};

Shape.prototype.collision = function (mouse_position) {};

function Rectangle(position, width, height, lineWidth) {
    Shape.call(this, position, drawio.availableShapes.RECTANGLE);
    this.filled = drawio.filledRectangle;
    this.width = width;
    this.height = height;
    this.lineWidth = lineWidth;
};

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
    if (this.filled) {
        drawio.ctx.fillStyle = this.color;
        drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    } else {
        drawio.ctx.strokeStyle = this.color;
        drawio.ctx.lineWidth = this.lineWidth;
        drawio.ctx.beginPath();
        drawio.ctx.rect(this.position.x, this.position.y, this.width, this.height);
        drawio.ctx.stroke();
        drawio.ctx.closePath();
    }
};

Rectangle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};

Rectangle.prototype.collision = function (mouse_position) {
    if (mouse_position.x > this.position.x && mouse_position.x < this.position.x + this.width &&
        mouse_position.y > this.position.y && mouse_position.y < this.position.y + this.height)
        return true;
    return false;
};

function Circle(position, radius, lineWidth) {
    Shape.call(this, position, drawio.availableShapes.CIRCLE);
    this.lineWidth = lineWidth;
    this.filled = drawio.filledCircle;
    this.radius = radius;
};

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.strokeStyle = this.color;
    if (this.filled) {
        drawio.ctx.lineWidth = this.lineWidth;
    }
    drawio.ctx.beginPath();
    drawio.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    if (!this.filled) {
        drawio.ctx.fill();
        drawio.ctx.closePath();
    } else {
        drawio.ctx.closePath();
        drawio.ctx.stroke();
    }

};

Circle.prototype.resize = function (x, y) {
    this.radius = Math.sqrt(Math.pow((this.position.x - x), 2) + Math.pow((this.position.y - y), 2));
};

Circle.prototype.collision = function (mouse_position) {

    /* Check if the length between the mouse and the center of the circle
       is less than the radius of the circle then it is colliding */
    if (Math.sqrt(Math.pow(this.position.x - mouse_position.x, 2) + Math.pow(this.position.y - mouse_position.y, 2)) < this.radius)
        return true
    return false;

};

function Line(position, lineWidth) {
    Shape.call(this, position, drawio.availableShapes.LINE);
    this.lineWidth = lineWidth;
    this.end = position;
};

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWidth;
    drawio.ctx.lineJoin = 'round';
    drawio.ctx.lineCap = 'round';
    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.end.x, this.end.y);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
};

Line.prototype.resize = function (position) {
    this.end = position;
};

Line.prototype.move = function (position) {

    let center = {
        x: (this.position.x + this.end.x) / 2,
        y: (this.position.y + this.end.y) / 2
    };

    let moved_by = {
        x: position.x - center.x,
        y: position.y - center.y
    };

    this.position.x += moved_by.x;
    this.position.y += moved_by.y;
    this.end.x += moved_by.x;
    this.end.y += moved_by.y;

}

Line.prototype.collision = function (postition) {
    let leftPoint = this.position.x < this.end.x ? this.position : this.end;
    let rightPoint = this.position == leftPoint ? this.end : this.position;
    let topPoint = this.position.y < this.end.y ? this.position : this.end;
    let bottomPoint = this.position == topPoint ? this.end : this.position;

    if (postition.x > leftPoint.x && postition.x < rightPoint.x && postition.y > topPoint.y && postition.y < bottomPoint.y)
        return true;
    return false;
}

function calculate_mid(point1, point2) {
    return {
        x: point1.x + ((point2.x - point1.x) / 2),
        y: point1.y + ((point2.y - point1.y) / 2)
    };
};

function Pen(position, lineWidth, rightmost_point, leftmost_point, topmost_point, bottommost_point) {
    Shape.call(this, position, drawio.availableShapes.PEN);
    this.point_array = [position];
    this.lineWidth = lineWidth;
    this.leftmost_point = leftmost_point;
    this.rightmost_point = rightmost_point;
    this.topmost_point = topmost_point;
    this.bottommost_point = bottommost_point;
};

Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor = Pen;

Pen.prototype.render = function () {

    drawio.ctx.lineJoin = 'round';
    drawio.ctx.lineCap = 'round';
    drawio.ctx.lineWidth = this.lineWidth;
    drawio.ctx.strokeStyle = this.color;

    drawio.ctx.beginPath();

    let current_point = this.point_array[0];
    let next_point = this.point_array[1];
    let middle = {};

    drawio.ctx.moveTo(current_point.x, current_point.y);

    for (let index = 1; index < this.point_array.length; index++) {
        middle = calculate_mid(current_point, next_point);
        drawio.ctx.quadraticCurveTo(current_point.x, current_point.y, middle.x, middle.y);
        current_point = this.point_array[index];
        next_point = this.point_array[index + 1];
    }

    drawio.ctx.lineTo(current_point.x, current_point.y);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
};

Pen.prototype.move = function (position) {
    let center = {
        x: this.leftmost_point + ((this.rightmost_point - this.leftmost_point) / 2),
        y: this.topmost_point + ((this.bottommost_point - this.topmost_point) / 2)
    };
    let moved_by = {
        x: position.x - center.x,
        y: position.y - center.y
    };
    this.leftmost_point += moved_by.x;
    this.rightmost_point += moved_by.x;
    this.topmost_point += moved_by.y;
    this.bottommost_point += moved_by.y;

    this.point_array.map((elem) => {
        elem.x += moved_by.x;
        elem.y += moved_by.y;
    });

}

Pen.prototype.collision = function (mouse_position) {
    if (mouse_position.x > this.leftmost_point && mouse_position.x < this.rightmost_point &&
        mouse_position.y > this.topmost_point && mouse_position.y < this.bottommost_point)
        return true;
    return false;
}

Pen.prototype.add_point = function (point) {
    /*
    check if this new point is a point in the bounding box of
    the freehand drawing
     */
    this.leftmost_point = point.x < this.leftmost_point ? point.x : this.leftmost_point;
    this.rightmost_point = point.x > this.rightmost_point ? point.x : this.rightmost_point;
    this.topmost_point = point.y < this.topmost_point ? point.y : this.topmost_point;
    this.bottommost_point = point.y > this.bottommost_point ? point.y : this.bottommost_point;
    this.point_array.push(point);
};

function Text(position, width, height, font, fontSize, stringText) {
    Shape.call(this, position, drawio.availableShapes.TEXT);
    this.width = width;
    this.height = height;
    this.font = font;
    this.fontSize = fontSize;
    this.stringText = stringText;
}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Pen;

Text.prototype.render = function () {
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.font = this.font;
    drawio.ctx.fillText(this.stringText, this.position.x, this.position.y);
}

Text.prototype.collision = function (mousePosition) {
    if (mousePosition.x > this.position.x && mousePosition.x < (this.position.x + this.width) &&
        mousePosition.y < this.position.y && mousePosition.y > (this.position.y - this.height))
        return true;
    return false;
}