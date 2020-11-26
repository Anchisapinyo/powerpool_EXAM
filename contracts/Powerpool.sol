pragma solidity >=0.4.21 <0.6.0;

contract Powerpool {
    uint256 public highPrice = 381;
    uint256 public lowPrice = 168;
    uint256 public _carbonPrefix = 386;
    uint256 public billingEndTime;
    // bool billingEnded;
    uint256 public _buy;
    uint256 public _sell;
    uint256 public _carbon;
    uint256 public allcount = 0;
    uint256 public Qbuy;
    uint256 public Qsell;
    uint256 public allcarbon;
    struct Txn {
        uint256 count;
        uint256 time;
        uint256 buy;
        uint256 sell;
        uint256 carbon;
        bool paid;
    }
    struct AllTxn {
        uint256 count;
        uint256 price;
        uint256 qbuy;
        uint256 qsell;
        uint256 carbon;
    }
    struct Bill {
        string status;
        uint256 amount;
        uint256 carbon;
        bool paid;
    }

    mapping(address => Bill) public bills;
    mapping(uint256 => AllTxn) public all;
    mapping(address => Txn) public txns;
    event Txnrecored(
        uint256 count,
        uint256 buy,
        uint256 sell,
        uint256 carbon,
        bool paid
    );
    event All(
        uint256 count,
        uint256 quant,
        uint256 buy,
        uint256 sell,
        uint256 carbon
    );

    constructor() public {
        uint256 _billingTime = 10000;
        billingEndTime = block.timestamp + _billingTime;
    }

    function setTxn(
        address _user,
        uint256 _acQuant,
        uint256 _clQuant,
        uint256 _clPrice,
        string memory _status,
        uint256 _pvQuant
    ) public {
        // require(now <= billingEndTime);
        require(txns[_user].count < 3, "The txncount should be < 3");
        // require(_user == msg.sender,"_user must be sender");
        require(
            _acQuant >= 0 && _clQuant >= 0 && _clPrice >= 0 && _pvQuant >= 0,
            "_acQuant >= 0 && _clQuant >= 0 && _clPrice >= 0 && _pvQuant >= 0"
        );
        txns[_user].count++;
        if (
            keccak256(abi.encodePacked(_status)) ==
            keccak256(abi.encodePacked("Bid"))
        ) {
            if (_acQuant > _clQuant) {
                _buy =
                    (_clPrice * _clQuant) +
                    (highPrice * (_acQuant - _clQuant));
            } else {
                _buy = _clPrice * _acQuant;
            }
            txns[_user].buy = txns[_user].buy + _buy;
            Qbuy = Qbuy + _acQuant;
        }
        if (
            keccak256(abi.encodePacked(_status)) ==
            keccak256(abi.encodePacked("Offer"))
        ) {
            if (_acQuant > _clQuant) {
                _sell =
                    (_clPrice * _clQuant) +
                    (lowPrice * (_acQuant - _clQuant));
            } else {
                _sell = _clPrice * _acQuant;
            }
            txns[_user].sell = txns[_user].sell + _sell;
            Qsell = Qsell + _acQuant;
        }
        if (
            keccak256(abi.encodePacked(_status)) ==
            keccak256(abi.encodePacked("Offer"))
        ) {
            _carbon = _pvQuant * _carbonPrefix;
        } else {
            _carbon = 0;
        }
        txns[_user].carbon = txns[_user].carbon + _carbon;
        txns[_user].paid = false;
        allcount++;
        all[allcount].count = allcount;
        allcarbon = allcarbon + _carbon;
        all[allcount].price = _clPrice;
        all[allcount].qsell = Qsell;
        all[allcount].qbuy = Qbuy;
        all[allcount].carbon = allcarbon;
        getBill(_user);
        emit Txnrecored(
            txns[_user].count,
            txns[_user].buy,
            txns[_user].sell,
            txns[_user].carbon,
            txns[_user].paid
        );
        emit All(
            all[allcount].count,
            all[allcount].price,
            all[allcount].qbuy,
            all[allcount].qsell,
            all[allcount].carbon
        );
    }

    function getBill(address _user)
        public
        returns (
            string memory,
            uint256,
            uint256,
            bool
        )
    {
        // require(now > billingEndTime);
        require(
            txns[_user].sell >= 0 && txns[_user].buy >= 0,
            "The sell or buy records should be >= 0"
        );
        uint256 _amount;
        string memory _billstatus;
        if (txns[_user].buy > txns[_user].sell) {
            _amount = txns[_user].buy - txns[_user].sell;
            _billstatus = "BUY";
        } else if (txns[_user].sell > txns[_user].buy) {
            _amount = txns[_user].sell - txns[_user].buy;
            _billstatus = "SELL";
        }

        bills[_user].amount = _amount;
        bills[_user].status = _billstatus;
        bills[_user].carbon = txns[_user].carbon;
        bills[_user].paid = false;
        txns[_user].paid = true;
        return (
            bills[_user].status,
            bills[_user].amount,
            bills[_user].carbon,
            bills[_user].paid
        );
    }

    function payBills(address payable _user, address payable market)
        public
        payable
    {
        string memory Status = bills[_user].status;
        uint256 amount = bills[_user].amount;
        require(txns[_user].count >= 1, "The txnrecord should be >= 1");
        require(amount >= 0, "The bill should >0");
        require(
            txns[_user].paid = true,
            "The records should be timeout (true) "
        );

        if (
            keccak256(abi.encodePacked(Status)) ==
            keccak256(abi.encodePacked("BUY"))
        ) {
            require(_user == msg.sender, "user should be sender");
            require(amount <= msg.value, "amount should == msg.value");
            uint256 payment = msg.value;
            market.transfer(payment);
        } else {
            require(market == msg.sender, "market should be sender");
            require(amount <= msg.value, "amount should == msg.value");
            uint256 payment = msg.value;
            _user.transfer(payment);
        }
        bills[_user].paid = true;
        bills[_user].amount = 0;
        bills[_user].status = "";
        bills[_user].carbon = 0;
        txns[_user].count = 0;
        txns[_user].time = 0;
        txns[_user].buy = 0;
        txns[_user].sell = 0;
        txns[_user].carbon = 0;
    }
}
