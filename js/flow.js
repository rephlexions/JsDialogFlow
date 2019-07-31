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
        Endpoint: ["Dot", {
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
    $.getJSON("data.json", function (data) {

        nodes = data.nodes;

        nodes.forEach(drawNode);

        edgeList.forEach(drawEdge);

        //alert(data);
    });

    edgeList = [];

    drawNode = function (node) {
        //alert(node.title);
        createNode(node);
    }

    drawEdge = function (edge) {
        //alert(edge.source);
        //edge.anchors = ['Right', 'Left'];

        //alert($('#' + edge.source).html());

        edge.endpoint = "Rectangle";
        edge.endpointStyle = {
            "fill:": "yellow"
        }
        var common = {
            anchors: ['Right', 'Left']
        }

        instance.connect(edge, common);
    }



    createNode = function (node) {
        var newNode = $("#node").clone(true, true);
        newNode.find('.title').text(node.title);
        newNode.attr("id", "node-" + node.id);
        // TODO: fix position
        newNode.css('left', node.positionX + 'px');
        newNode.css('top', node.positionY + 'px');
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
            console.log(edgeList);

            return newElement;
        }
    };


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
        console.log(nodeNumber);
        

        var title = $('#title').val();
        var elementData = $('#elementData').val();

        //var str = "{\"id\": " + id + ",\"title\":" + title + ",\"type\": " + type + ",\"elementData\": " + elementData + ",\"localizedTitle\": {\"en\":" + title + "},\"localizedElementData\": {\"en\":" + elementData + "}}";

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
                console.log(nodes);
                var element = createElement(element);
                if (element) {
                    elementList.append(element);
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