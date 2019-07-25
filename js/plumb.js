jsPlumb.ready(function () {
    var instance = jsPlumb.getInstance({
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        Connector: ["Bezier", {
            curviness: 150
        }],
        PaintStyle: {
            strokeWidth: 3,
            stroke: "#0101f9",

        },
        Endpoint: ["Dot", {
            radius: 5
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

    window.jsp = instance;

    instance.draggable(jsPlumb.getSelector(".node"));

    // TODO: refactor function
    function initAnchors() {

        var lists = jsPlumb.getSelector("ul");
        for (let i = 0; i < lists.length; i++) {
            var items = lists[i].querySelectorAll('li')
            for (let j = 0; j < items.length; j++) {
                var columnText = $('span').text();
                instance.makeSource(items[j], {
                    isSource: true,
                    allowLoopback: false,
                    anchor: ["Right"],
                    maxConnections: 1,
                    connectorOverlays: [
                        ['Arrow', {
                            location: 1,
                            id: "arrow"
                        }],
                        ['Label', {
                            label: columnText,
                            id: "label"
                        }]
                    ]

                });

                instance.makeTarget(items[j], {
                    isTarget: true,
                    createEndpoint: true,
                    allowLoopback: false,
                    anchor: ["Left"],
                });
            }
        }
    }

    initAnchors();

    // bind a click listener to "new-node"; add new node when this occurs.
    $(document.body).on('click', '.new-node', function (e) {
        var title = prompt("Please enter a title:", "");
        if (title == null || title == "") {
            alert("Title cannot be empty");
        } else {
            newNode(title,e.offsetX, e.offsetY);
        }
    });

    // TODO: change counter after dev demo is done
    var i = 2;
    var newNode = function (title, x, y) {
        var newNode = $("#node").clone(true, true);
        newNode.find('span').text(title);
        console.log(newNode.find('span').text(title));
        
        newNode.attr("id", "node" + (i++));
        newNode.css('left', 250 + 'px');
        newNode.css('top', 150 + 'px');
        newNode.css('visibility', 'visible');
        newNode.appendTo(instance.getContainer());
        instance.draggable(newNode);
        return (newNode);
    };


    //remove column
    $(document.body).on('click', '.node-column-delete', function (e) {
        $(this).closest('li').remove();
    });


    //add column
    $(document.body).on('click', '.new-column', function (e) {
        var message = prompt("Please enter a message:", "");
        if (message == null || message == "") {
            alert("Message cannot be empty");
        } else {
            var list = $(this).parentsUntil($('.node')).siblings('ul');
            var newColumn = $('<li>').addClass('node-column');
            var nodeEdit = $('<div>').addClass('node-column-edit');
            var editIcon = $('<i>').addClass('fa fa-pencil node-column-edit-icon');
            var nodeDelete = $('<div>').addClass('node-column-delete');
            var deleteIcon = $('<i>').addClass('fa fa-times node-column-delete-icon');
            var msgDiv = $('<div>'),
                msgSpan = $('<span>');
            msgSpan.text(message);

            nodeEdit.append(editIcon);
            nodeDelete.append(deleteIcon);
            msgDiv.append(msgSpan);
            newColumn.append(nodeEdit);
            newColumn.append(nodeDelete);
            newColumn.append(msgDiv);
            list.append(newColumn);

            // TODO: refactor
            instance.makeSource(newColumn, {
                isSource: true,
                allowLoopback: false,
                anchor: ["Right"],
                maxConnections: 1,
                connectorOverlays: [
                    ['Arrow', {
                        location: 1,
                        id: "arrow"
                    }],
                    ['Label', {
                        label: 'test',
                        id: "label"
                    }]
                ]

            });

            // TODO: refactor
            instance.makeTarget(newColumn, {
                isTarget: true,
                createEndpoint: true,
                allowLoopback: false,
                anchor: ["Left"],
            });

        }
    });

    // edit title
    $(document.body).on('click', '.edit-name', function (e) {
        var currTitle = $(this).parent($('.buttons')).siblings('span');
        var newTitle = prompt("Edit title:", "");
        if (newTitle == null || newTitle == "") {
            alert("Title cannot be empty")
        } else {
            currTitle.text(newTitle);
        }

    })

    instance.bind("click", function (c) {
        instance.deleteConnection(c);
    });
})