var script_url = "https://script.google.com/macros/s/AKfycbyWBJJWJ4e1Z2kFKPq678tbU72Ukx4xUFd5eb3yAsT5mxWid18S/exec";



function read_value() {

    var url = script_url + "?action=read";

    $.getJSON(url, function(json) {

        var table = document.createElement("table");
        var header = table.createTHead();
        var row = header.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);


        cell1.innerHTML = "<b>Order Id</b>";
        cell2.innerHTML = "<b>Address</b>";
        cell3.innerHTML = "<b>Clearing Price <br>(Baht/kWh)</b>";
        cell4.innerHTML = "<b>Clearing Quantity <br>(kWh)</b>";
        cell5.innerHTML = "<b>Order Status</b>";
        cell6.innerHTML = "<b>Check Data </b>";
        cell7.innerHTML = "<b>Check Quantity</b>";
        cell8.innerHTML = "<b>Confirm Data</b>";

        for (var i = 0; i < json.records.length; i++) {

            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Id;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Address;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Clearing_Price.toFixed(2);
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Clearing_Quantity.toFixed(2);
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].STATUS;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = '<button id="btn-edit" >View Data</button>';
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = '<progress class="progress-bar" id="progressBar1" value="0" max="100" style="width:300px;"></progress><br><span id="span1"value =""></span><br>' +
                ' <progress class="progress-bar" id="progressBar2" value="0" max="100" style="width:300px; "></progress><br><span id="span2" value=""></span>';
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = '<button id="btn-submit">Confirm Data</button>';
        }
        var divContainer = document.getElementById("showData5");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

    });


    var _tr = null;
    $(document).on('click', '#btn-edit', function() {

        var modal = document.getElementById("myModal");
        var btn = document.getElementById("btn-edit");
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";

        _tr = $(this).closest('tr');
        var _id = $(_tr).find('td:eq(0)').text();
        var _address = $(_tr).find('td:eq(1)').text();
        var _price = $(_tr).find('td:eq(2)').text();
        var _quant = $(_tr).find('td:eq(3)').text();
        var _status = $(_tr).find('td:eq(4)').text();

        $('#id').val(_id);
        $('#Address').val(_address);
        $('#Clearing_Price').val(_price);
        $('#Clearing_Quantity').val(_quant);
        $('#Status').val(_status);

        // console.log(_id);
        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    });

    $('#btn-update').click(function() {
        if (_tr) {
            var _id = $('#id').val();
            var _address = $('#Address').val();
            var _price = $('#Clearing_Price').val();
            var _quant = $('#Clearing_Quantity').val();
            var _status = $('#Status').val();
            var _Acquant = $('#Actual_Quantity').val();
            var _PVquant = $('#PV_Quantity').val();
            var i = 0;
            var interval = setInterval(increase, 60);
            var _perQuantC = _quant * 100;
            var _perQuantAc = _Acquant * 100;

            $(_tr).find('td:eq(0)').text(_id);
            $(_tr).find('td:eq(1)').text(_address);
            $(_tr).find('td:eq(2)').text(_price);
            $(_tr).find('td:eq(3)').text(_quant);
            $(_tr).find('td:eq(4)').text(_status);
            $(_tr).find('td:eq(5)').text(_PVquant);
            $(_tr).find('#progressBar1').val(_perQuantC);
            $(_tr).find('#span1').text("Clearing Quantity : " + _quant);


            function increase() {
                _Acquant = $('#Actual_Quantity').val();
                _perQuantAc = _Acquant * 100;
                if (i >= _perQuantAc) {
                    clearInterval(interval);
                } else {
                    i++;
                    $(_tr).find('#progressBar2').val(i);
                    $(_tr).find("#span2").text("Actual Quantity : " + (i / 100).toFixed(2));
                    
                }
            }

        }

    });
    var _trs = null;
    $(document).on('click', '#btn-submit', function() {

        var modal = document.getElementById("myModal2");
        var btn = document.getElementById("btn-submit");
        var span = document.getElementsByClassName("close2")[0];
        modal.style.display = "block";

        _trs = $(this).closest('tr');
        var _id = $(_trs).find('td:eq(0)').text();
        var _address = $(_trs).find('td:eq(1)').text();
        var _price = $(_trs).find('td:eq(2)').text();
        var _quant = $(_trs).find('td:eq(3)').text();
        var _status = $(_trs).find('td:eq(4)').text();
        var _Acquant = $('#Actual_Quantity').val();
        var _PVquant = $(_trs).find('td:eq(5)').text();

        // console.log(_Acquant)

        $('#id2').val(_id);
        $('#Address2').val(_address);
        $('#Clearing_Price2').val(_price);
        $('#Clearing_Quantity2').val(_quant);
        $('#Status2').val(_status);
        $('#Actual_Quantity2').val(_Acquant);
        $('#PV_Quantity2').val(_PVquant);

        // console.log(_id);
        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    });
}