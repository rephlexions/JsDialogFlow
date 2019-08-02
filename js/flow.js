jsPlumb.ready(function () {
    var instance = jsPlumb.getInstance({
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        Connector: ["Bezier", {
            curviness: 100
        }],
        PaintStyle: {
            strokeWidth: 3,
            stroke: "#0101f9",

        },
        Endpoint: ["Rectangle", {
            radius: 10
        }],
        EndpointStyle: {
            fill: "#ffa500"
        },

        /*
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                visible: true,
                id: "ARROW"
            }],
            [ "Label", { label:"foo", location:0.5, id:"myLabel" } ]

        ],*/
        Container: "canvas"
    });

    instance.draggable(jsPlumb.getSelector(".node"));

    var nodes;
    var edgeList = [];
    $.getJSON("data.json", function (data) {

        nodes = data.nodes;

        //  suspend drawing before data lading for better performance
        jsPlumb.setSuspendDrawing(true);
        nodes.forEach(drawNode);
        edgeList.forEach(drawEdge);
        jsPlumb.setSuspendDrawing(false, true);

    });

    // TODO: Javascript doesnt support writing to file for security reasons.
    //       The data should be POSTed to a server that executes the writing. 
    $('#saveFLow').button().on('click', function () {
        getPosition(nodes);
    });

    getPosition = function (nodes) {
        for (let i = 0; i < nodes.length; i++) {
            var node = $('#node-' + nodes[i].id);
            if (node) {
                var pos = node.position()
                nodes[i].graphInfo.top = pos.top.toString();
                nodes[i].graphInfo.left = pos.left.toString();
            } else {
                // TODO: the searched node doesnt exist in the DOM. Maybe draw it? 
            }
            console.log(nodes[i].graphInfo.top);
            console.log(nodes[i].graphInfo.left);
        }
    }


    drawNode = function (node) {
        //alert(node.title);
        createNode(node);
    }

    drawEdge = function (edge) {
        //alert(edge.source);
        //edge.anchors = ['Right', 'Left'];

        //alert($('#' + edge.source).html());

        edge.endpoint = "Dot";
        var common = {
            anchors: ['Right', 'Left'],
            detachable: false,
            paintStyle: {
                stroke: "lightblue",
                strokeWidth: 5
            },
            endpointStyles: [{
                    fill: "red",
                    outlineStroke: "black",
                    outlineWidth: 1,
                    radius: 7
                },
                {
                    fill: "green",
                    radius: 7
                }
            ],
            hoverPaintStyle: {
                stroke: "blue"
            },
        }

        instance.connect(edge, common);
    }


    createNode = function (node) {
        console.log(node);

        var newNode = $("#node").clone(true, true);
        newNode.find('.title').text(node.title);
        newNode.attr("id", "node-" + node.id);
        newNode.css('top', node.graphInfo.top + 'px');
        newNode.css('left', node.graphInfo.left + 'px');
        newNode.css('visibility', 'visible');


        var elementList = newNode.find('.node-element-list');

        if (node.elements) {
            for (var e = 0; e < node.elements.length; e++) {

                var element = createElement(node.elements[e])
                if (element) {
                    elementList.append(element);
                }
            }
        }

        newNode.appendTo(instance.getContainer());
        instance.draggable(newNode);
        return (newNode);
    };


    createElement = function (element) {
        if (element.type == 'text') {
            var newElement = $("#node-element-text").clone(true, true);
            newElement.attr("id", "element-" + element.id);
            newElement.html(element.title);
            return newElement;
        }
        if (element.type == 'edge') {
            var newElement = $("#node-element-edge").clone(true, true);
            newElement.attr("id", "element-" + element.id);
            newElement.html(element.title);

            var edge = {};
            edge.source = "element-" + element.id;
            edge.target = "node-" + element.elementData;
            edgeList.push(edge)

            return newElement;
        }
    };

    // TODO: Javascript doesnt support writing to file for security reasons.
    //       The data should be POSTed to a server that executes the writing. 
    addElement = function (nodeID) {
        var type, radios = document.getElementsByName('type');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                type = radios[i].value;
                break;
            }
        }
        // get node number
        var patt = new RegExp("\\d+");
        var nodeNumber = patt.exec(nodeID);

        var title = $('#title').val();
        var elementData = $('#elementData').val();

        var node = document.getElementById(nodeID);
        var elementList = $(node).find('.node-element-list');
        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].id == nodeNumber[0]) {

                var currLength = nodes[index].elements.length;

                var element = {};
                element['id'] = nodeNumber[0] + '-' + (++currLength);
                element['title'] = title;
                element['type'] = type;
                element['elementData'] = elementData;
                element['localizedTitle'] = {
                    'en': title
                };
                element['localizedElementData'] = {
                    'en': elementData
                };
                nodes[index].elements.push(element);
                var newElement = createElement(element);
                if (newElement) {
                    if (type == 'edge' && !(isNaN(elementData))) {
                        if (!searchNode(elementData, nodes)) {
                            var newNode = {};
                            var newNodePos = {};
                            newNodePos['top'] = '100';
                            newNodePos['left'] = '400';
                            newNode['id'] = elementData;
                            newNode['title'] = title;
                            newNode['parameter'] = title.replace(' ', '').toLowerCase();
                            newNode['graphInfo'] = newNodePos;
                            newNode['directAccess'] = false;
                            newNode['elements'] = [{}];
                            nodes.push(newNode)
                            console.log(nodes);
                            createNode(newNode);
                            elementList.append(newElement);
                            var last_element = edgeList[edgeList.length - 1];
                            drawEdge(last_element);
                        } else {
                            elementList.append(newElement);
                            var last_element = edgeList[edgeList.length - 1];
                            drawEdge(last_element);
                        }
                    }

                    // TODO: check if url is valid using RegExp
                    // var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

                }
            }
        }
    };

    dialog = $('#dialog-form').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            'Add': function () {
                var param = $('#dialog-form').data('param');
                addElement(param);
                dialog.dialog('close');
            },
            Cancel: function () {
                dialog.dialog('close');
            }
        },
        close: function () {}
    })

    $(document.body).on('click', '.new-column', function (e) {
        var parent = $(this).parentsUntil($('.node'));
        var currNode = parent.parent($('.node'))
        var nodeID = currNode.attr('id');

        dialog.data('param', nodeID).dialog("open");

    });


});

// search for a specific node. Return true in node exists
function searchNode(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].id === nameKey) {
            return true;
        }
    }
}