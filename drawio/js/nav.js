function openTab(event, name) {
    $(".navMenuItem").removeClass("selectedTab");
    event.currentTarget.className += " selectedTab";
    $(".navContent")
        .children()
        .hide();
    $("#" + name).show();
}

function openTool(event, name) {
    if (event) {
        drawio.selectedShape = name;
        $(".toolButton").removeClass("selected");
        event.currentTarget.className += " selected";
        drawio.updateElement = null;
    }
    if (name === "move" || name === "select") {
        return;
    }
    $(".toolSettingsWrapper")
        .children()
        .hide();
    $("#" + name).show();
    if (name == drawio.availableShapes.TEXT) {
        setupText();
    }
}

function openSetting(event, name) {
    $(".toolButton").removeClass("selected");
    event.currentTarget.className += " selected";
    $(".toolSettingsWrapper")
        .children()
        .hide();
    $("#" + name).show();
}

$("#pen").show();

function anime(name) {
    $("#" + name)
        .bind(
            "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
            function () {
                $(this).removeClass("clickAnimationActive");
            }
        )
        .addClass("clickAnimationActive");
}
