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
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8547');
            web3 = new Web3(App.web3Provider);
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

        $("#account").html("  " + ">" + App.account + "<");


        App.setLoading(false)
    },

    submitOrder: async() => {

        App.setLoading(true)
        const _id = $('#id2').val();
        const _user = $('#Address2').val();
        const _acQuant = $('#Actual_Quantity2').val();
        const _PVQuant = $('#PV_Quantity2').val();
        const _clQuant = $('#Clearing_Quantity2').val();
        const _clPrice = $('#Clearing_Price2').val();
        const _status = $('#Status2').val();
       
        console.log(_id)

        // add data to blockchain

        await App.power.setTxn(_user, _acQuant * 100, _clQuant * 100, _clPrice * 100, _status, _PVQuant * 100)

        // add data to sheet


        const script_url = "https://script.google.com/macros/s/AKfycbyWBJJWJ4e1Z2kFKPq678tbU72Ukx4xUFd5eb3yAsT5mxWid18S/exec";

        const url = script_url + "?callback=ctrlq&user=" + _user + "&acQuant=" + _acQuant + "&clQuant=" + _clQuant +
            "&clPrice=" + _clPrice + "&status=" + _status + "&id=" + _id + "&pvQuant=" + _PVQuant +"&action=insert";

           

        const request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp"
        });

       

        window.location.reload()

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