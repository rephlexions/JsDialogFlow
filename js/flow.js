


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

        //alert(data);
    });




    drawNode = function (node) {
        alert(node.title);





    }






});