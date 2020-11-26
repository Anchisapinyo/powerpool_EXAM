App = {
    loading: false,
    contracts: {},
    load: async() => {
        await App.loadWeb3() // console.log("loading")
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async() => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                    // Acccounts now exposed
                web3.eth.sendTransaction({ /* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
                // Acccounts always exposed
            web3.eth.sendTransaction({ /* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async() => {
        App.account = web3.eth.accounts[0]
        console.log(App.account)
    },

    loadContract: async() => {
        const power = await $.getJSON('Powerpool.json')
        App.contracts.Powerpool = TruffleContract(power)
        App.contracts.Powerpool.setProvider(App.web3Provider)
        console.log(power)

        App.power = await App.contracts.Powerpool.deployed()
    },

    render: async() => {
        if (App.loading) {
            return
        }
        App.setLoading(true)

        $("#account").html("Thank you for your donations  " + ">" + App.account + "<");

        await App.renderTxn()
        await App.viewRecord()

        App.setLoading(false)
    },

    renderTxn: async() => {
        const counts = await App.power.allcount()
        const alltxns = await App.power.all(counts)
        const clPrice = alltxns[1].c;
        const qBuy = alltxns[2].c;
        const qSell = alltxns[3].c;
        const carbon = alltxns[4].c;

        $("#clPrice").html((clPrice / 100).toFixed(2));
        $("#qBuy").html((qBuy / 100).toFixed(2));
        $("#qSell").html((qSell / 100).toFixed(2));
        $("#carbon").html((carbon / 100000).toFixed(2));

        console.log(clPrice, carbon, qBuy, qSell);

    },

    viewRecord: async() => {
        App.setLoading(true)
        var modal = document.getElementById("myModal3");
        var btn = document.getElementById("btn-record");
        var span = document.getElementsByClassName("close")[0];


        const _user = $('#address').val();
        const _txns = await App.power.txns(_user)
        const count = _txns[0].c;
        const buy = _txns[2].c;
        const sell = _txns[3].c;
        const Carbon = _txns[4].c;

        console.log(buy, sell, Carbon);

        $("#User").val(_user);
        $("#count").val(count);
        $("#buy").val((buy / 10000).toFixed(2));
        $("#sell").val((sell / 10000).toFixed(2));
        $("#Carbon").val((Carbon / 100000).toFixed(2));

        modal.style.display = "block";

        span.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        var modalbill = document.getElementById("myModal4");
        var btnbill = document.getElementById("btn-bill");
        var spanbill = document.getElementsByClassName("closebill")[0];

        const _bills = await App.power.bills(_user)
        const _status = _bills[0];
        const _amount = _bills[1].c;
        const _carbon = _bills[2].c;
        const _paid = _bills[3];

        console.log(_status, _amount, _carbon, _paid);
        var _sender;
        const _market = "0xbd9d6789B00eD4141626b350169A8368cf34B0a5";
        var _reciever;
        if (_status == "BUY") {
            _sender = _user;
            _reciever = _market;
        } else if (_status == "SELL") {
            _sender = _market;
            _reciever = _user;
        }

        const _ether = (_amount / (10000 * 6928.59)); //1 Ether == 6,928.59 Thai Baht Aug 7, 01:05 UTC//

        $("#statusbill").val(_status);
        $("#sender").val(_sender);
        $("#reciever").val(_reciever);
        $("#amountbillBaht").html((_amount / 10000).toFixed(2));
        $("#amountbillWei").val((_ether * 1000000000000000000).toFixed(0));
        $("#amountbillEther").html(_ether.toFixed(6));
        $("#carbonbill").val((_carbon / 100000).toFixed(2));


        btnbill.onclick = function() {
            modal.style.display = "none";
            modalbill.style.display = "block";
        }

        spanbill.onclick = function() {
            modalbill.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modalbill) {
                modalbill.style.display = "none";
            }
        }
        App.setLoading(false)

    },

    payBill: async() => {
        App.setLoading(true)

        const _Sender = $('#sender').val();
        const _Reciever = $('#reciever').val();
        const _Status = $('#statusbill').val();
        const _Amount = $('#amountbillWei').val();

        var _USER;
        var _MARKET;
        if (_Status == "BUY") {
            _USER = _Sender;
            _MARKET = _Reciever;
            
        } else if (_Status == "SELL") {
            _MARKET = _Sender;
            _USER = _Reciever;
           
        }

        console.log(_USER, _MARKET, _Amount, _Status);

        await App.power.payBills(_USER, _MARKET, {value: _Amount })



        window.location.reload()
        alert("Your Green Power Payment is Success !!!");

    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})