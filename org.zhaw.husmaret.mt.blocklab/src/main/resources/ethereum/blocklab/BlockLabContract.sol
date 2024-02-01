// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "./../openzeppelin/PullPayment.sol";
import "./../openzeppelin/Escrow.sol";
import "./../openzeppelin/SafeMath.sol";
import "./../openzeppelin/Secondary.sol";

contract BlockLabContract is PullPayment {

	// data object to store a participant
	struct Participant {
		string name;
		address id;
		string role;
		bool isParticipant;
	}

	// mapping of an address to a participant
	mapping(address => Participant) internal participants;

	// mapping of an address to its balance
    mapping(address => uint) internal accountBalances;

    // data object to track execution of transactions
	struct CallContext {
   		 address caller;
  	 	 uint time;
   		 bool success;
	}

	mapping(bytes4 => CallContext) private _callMonitor;
	bool internal contractFinished = false;

	modifier postCall() {
		_;
		setCallContext();
	}

	modifier notFinishedYet() {
		require(!contractFinished, "Contract already finished.");
		_;
	}
	
	function setCallContext() private {
		_callMonitor[msg.sig].success = true;
		_callMonitor[msg.sig].time = block.timestamp;
		_callMonitor[msg.sig].caller = msg.sender;
	}

	function onlyBy(address _account) view internal returns(bool) {
		if (msg.sender == _account)
		    return true;
		return false;
	}

	function onlyAfter(uint _time, uint _duration, bool _within) view internal returns(bool) {
		if (_time == 0) {
			return false;
		}
		if (!_within) {
			if (block.timestamp > _time + _duration) // else function called too early
			    return true;
		} else {
			if (_time + _duration > block.timestamp && block.timestamp > _time) // else function not called within expected timeframe
			    return true;
		}
		return false;
	}

	function onlyBefore(uint _time, uint _duration, bool _within) view internal returns(bool) {
		if (_time == 0) {
			return true;
		}
		if (!_within) {
			if (block.timestamp < _time - _duration) // else function called too late
			    return true;
		} else {
			if (_time - _duration < block.timestamp && block.timestamp < _time) // else function not called within expected timeframe
			    return true;
		}
		return false;
	}

	function callSuccess(bytes4 _selector) internal view returns (bool) {
        return _callMonitor[_selector].success;
    }
    
    function callTime(bytes4 _selector) internal view returns (uint) {
        return _callMonitor[_selector].time;
    }
    
    function callCaller(bytes4 _selector) internal view returns (address) {
        return _callMonitor[_selector].caller;
    }

	function claimRemainingBalanceFinishedInternal() internal returns (bool) {
        require(contractFinished, "Contract is not yet finished.");
        require(hasBalance(msg.sender), "No balance, nothing to withdraw");
        _asyncTransfer(msg.sender, getBalance(msg.sender) * 1 ether);
		return true;
    }
	
    function hasBalance(address _addr) public view returns(bool) {
        return accountBalances[_addr] > 0;
    }

    function getBalance(address _addr) public view returns (uint) {
        if (!hasBalance(_addr)) {
            return 0;
        }
        return accountBalances[_addr];
    }

    function addBalance(address _addr, uint _amount) public returns(bool success) {
		accountBalances[_addr] = SafeMath.add(getBalance(_addr), _amount);
        return true;
    }

    function removeBalance(address _addr, uint _amount) public returns(bool success) {
        uint currentBalance = getBalance(_addr);
        require(currentBalance >= _amount, "Not enough balance");
        accountBalances[_addr] = SafeMath.sub(currentBalance, _amount);
        return true;
    }

}
