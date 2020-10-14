var dataframe = undefined;
var data_f = undefined;
$(document).ready(function () {

    $("#reviewButton").click(function () {
        minimum = document.getElementById("minimum").value
        maximum = document.getElementById("maximum").value
        rows = document.getElementById("rows").value

        $.ajax({
            url: '/packets',
            method: 'get',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: {
                minimum: minimum,
                maximum: maximum,
                rows: rows,
            },
            beforeSend: function () {
                //
            },
            success: function (data) {
                dataframe = data;

                $("#packets tbody").remove();
                $("#packets thead").remove();

                $("#packets").show();
                var trHTML = '';

                $.each(data, function (i, item) {
                    trHTML += '><tr><td>' + item[0] + '</td><td>' + item[1] + '</td><td>' + item[2] + '</td><td>' + item[3] + '</td><td>' + item[4] + '</td></tr>';
                });
                thHTML = `<thead>
                    <tr>
                      <th scope="col">ID </th>
                      <th scope="col">Height <small>(cms.)</small></th>
                      <th scope="col">Width <small>(cms.)</small></th>
                      <th scope="col">Length <small>(cms.)</small></th>
                      <th scope="col">Weight <small>(kgs.)</small></th>
                    </tr>
                  </thead>`
                $('#packets').append(thHTML + '<tbody>' + trHTML + '</tbody>');
            },

            error: function (result) {
                console.log("Failed");
            }
        });
    });

    $("#clearButton").click(function () {
        $("#packets tr").remove();
        $("#packets").hide();
    });

    $("#loadFigureButton").click(function () {
        $.ajax({
            url: '/figure',
            method: 'post',
            data: JSON.stringify(dataframe),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $("#loading").show();
                $("#chart").hide();
                $(".remaining_packets").hide();
            },
            complete: function () {
                // ... your finalization code here (hide loader) ...
                $("#loading").hide();
            },
            success: function (data) {
                data_f = data;
                console.log(data_f.count)
                Plotly.newPlot('chart', JSON.parse(data_f.graph), {});
                $(".chart").show();
                $(".remaining_packets").show();
                var trHTML = '';

                $.each(JSON.parse(data_f.items), function (i, item) {
                    trHTML += '><tr><td>' + item[0] + '</td><td>' + item[1] + '</td><td>' + item[2] + '</td><td>' + item[3] + '</td><td>' + item[4] + '</td></tr>';
                });
                thHTML = `<thead>
                    <tr>
                      <th scope="col">ID </th>
                      <th scope="col">Height <small>(cms.)</small></th>
                      <th scope="col">Width <small>(cms.)</small></th>
                      <th scope="col">Length <small>(cms.)</small></th>
                      <th scope="col">Weight <small>(kgs.)</small></th>
                    </tr>
                  </thead>`

                  $("#remaining_packets tbody").remove();
                  $("#remaining_packets thead").remove();
                $('#remaining_packets').append(thHTML + '<tbody>' + trHTML + '</tbody>');

            },

            error: function (result) {
                console.log("Failed");
            }
        });

    });

});