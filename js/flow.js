


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

    $.getJSON( "data.json", function( data ) {
        
        var nodes = data.nodes;

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

        alert($('#' + edge.source).html());


        edge.endpoint = "Rectangle";
        edge.endpointStyle= {"fill:": "black"}
        var common = {
            anchors: ['Right', 'Left']
        }

        instance.connect(edge, common);
    }



    // Crea un nuovo nodo
    createNode = function (node) {
        var newNode = $("#node").clone(true, true);
        newNode.find('.title').text(node.title);
        newNode.attr("id", "node-" + node.id);
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

            return newElement;
        }
    }


});