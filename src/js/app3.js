var script_url = "https://script.google.com/macros/s/AKfycbyWBJJWJ4e1Z2kFKPq678tbU72Ukx4xUFd5eb3yAsT5mxWid18S/exec";
var s = 0,
    m = 0,
    hr = 0;
var timer;
var stopWatch = document.querySelector(".stopwatch");

function marketOpen() {
    if (!timer) {
        var url = script_url + "?action=marketOpen";
        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "POST",
            dataType: "jsonp"
        });
        timer = setInterval(run, 1000);
    }
}

function run() {
    stopWatch.textContent = getTimer();
    s++;
    if (s === 60) {
        s = 0;
        m++;
    }
    if (m === 60) {
        m = 0;
        hr++;
    }
}

function marketClose() {
    stopTimer();
    s = 0;
    m = 0;
    hr = 0;
    var url = script_url + "?action=marketClose";
    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "POST",
        dataType: "jsonp"
    });

    stopWatch.textContent = getTimer();
}

function stopTimer() {
    clearInterval(timer);
    timer = false;
}

function getTimer() {
    return (hr < 10 ? "0" + hr : hr) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

function readClear() {
    var url = script_url + "?action=readClear";
    $.getJSON(url, function(json) {

        $("#RclPrice").html((json.records[0].RClearing_Price.toFixed(2)));
        $("#RclQuant").html((json.records[0].RClearing_Quantity.toFixed(2)));
        $("#PclPrice").html((json.records[0].PClearing_Price.toFixed(2)));
        $("#PclQuant").html((json.records[0].PClearing_Quantity.toFixed(2)));


    });
}

function showClear() {

    var url = script_url + "?action=showClear";
    $.getJSON(url, function(json) {

        var table = document.createElement("table");
        var header = table.createTHead();
        var row = header.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);


        cell1.innerHTML = "<b>Order Id</b>";
        cell2.innerHTML = "<b>Account</b>";
        cell3.innerHTML = "<b>Price <br>(Baht/kWh)</b>";
        cell4.innerHTML = "<b>Quantity <br>(kWh)</b>";
        cell5.innerHTML = "<b>Status</b>";


        for (var i = 0; i < json.records.length-1; i++) {

            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Id;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Address;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = (json.records[i].Clearing_Price*1).toFixed(2);
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = (json.records[i].Clearing_Quantity*1).toFixed(2);
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Status;
        }
        var divContainer = document.getElementById("showData2");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

    });

    var modal = document.getElementById("myModal5");
    var btn = document.getElementById("btn-ckClear");
    var span = document.getElementsByClassName("close")[0];


    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function addOrder() {

    var _address = $("#addressOr").val();
    var _type = $("#typeOr").val();
    var _price = $("#priceOr").val();
    var _quant = $("#quantOr").val();
    var _pass = $("#passOr").val();



    var url = script_url + "?callback=ctrlq&_address=" + _address + "&_type=" + _type + "&_price=" + _price +
        "&_quant=" + _quant + "&_pass=" + _pass + "&action=addOrder";

    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "POST",
        dataType: "jsonp"
    });


   
}


function showOrder() {

    var url = script_url + "?action=showOrder";

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

        cell1.innerHTML = "<b>Order Id</b>";
        cell2.innerHTML = "<b>Account</b>";
        cell3.innerHTML = "<b>Order Type</b>";
        cell4.innerHTML = "<b>Price (Baht/kWh)</b>";
        cell5.innerHTML = "<b>Quantity (kWh)</b>";
        cell6.innerHTML = "<b>Status</b>";


        for (var i = 0; i < json.records.length; i++) {

            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Order_Id;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Address;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Type;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Price.toFixed(2);
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Quantity.toFixed(2);
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Status;
        }

        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

    });
}

function showMatch() {

    var url = script_url + "?action=showMatch";

    $.getJSON(url, function(json) {

        var table = document.createElement("table");

        var header = table.createTHead();
        var row = header.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = "<b>Bid Price <br>(Baht/kWh)</b>";
        cell2.innerHTML = "<b>Bid Quantity <br>(kWh)</b>";
        cell3.innerHTML = "<b>Offer Price <br>(Baht/kWh)</b>";
        cell4.innerHTML = "<b>Offer Quantity <br> (kWh)</b>";


        for (var i = 0; i < json.records.length; i++) {

            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Bid_Price;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Bid_Quantity;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Offer_Price;
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json.records[i].Offer_Quantity;
        }

        var divContainer = document.getElementById("showData4");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

    });
}