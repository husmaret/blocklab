export var mockDSLState = {
  ecosystem: "Ethereum",
  simulationStart: "2023-02-01T12:00:00",
  useAccountBalances: true,
  useCreatorRole: true,
  properties: [
    {
      type: "Text",
      name: "Participant name",
      value: "$C{Participant}",
    },
    {
      type: "Date",
      name: "Timeout",
      value: "$C{Timeout}",
    },
    {
      type: "Number",
      name: "count",
      value: "$C{incrementStart}",
    },
  ],
  contractParams: [
    {
      type: "Text",
      paramName: "Participant",
      value: "Test",
    },
    {
      type: "Boolean",
      paramName: "Is Working",
    },
    {
      type: "Date",
      paramName: "Timeout",
      // value: "2023-02-01T13:00:00",
    },
    {
      type: "Number",
      paramName: "incrementStart",
      value: "1",
    }
  ],
  timeouts: [
    {
      name: "Timeout Deposit AGIX",
      value: "2023-05-01T13:00:00",
      offsetInSeconds: 0,
      timeoutStatements: [{
        type: "Finish"
      }]
    },
    {
      name: "Timeout from Param",
      contractParam: "Timeout",
      value: null,
      offsetInSeconds: 0,
    },
  ],
  transactions: [
    {
      name: "Increment 2 and and a long transaction namw",
      params: [],
      allowedByAnyone: true,
      allowed: "Anyone",
      useTransactionValue: false,
      condition: "$A{count} >= 0",
      previousTransactions: [],
      beforeTimeouts: [],
      afterTimeouts: [],
      statements: [{
        type: "SetProperty",
        instructions: {
          propertyName: "count",
          expression: "$A{count} + 1"
        }
      },{
        type: "SetProperty",
        instructions: {
          propertyName: "count",
          expression: "$A{count} + 1"
        }
      }],
    },
    {
      name: "Decrement",
      params: [],
      allowedByAnyone: true,
      allowed: "Anyone",
      useTransactionValue: false,
      condition: "$A{count} > ${TransactionValue}",
      previousTransactions: ["Increment", "Transfer"],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-05-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "SetProperty",
        instructions: {
          propertyName: "count",
          expression: "$A{count} - 1"
        }
      }]
    },
    {
      name: "Finish",
      params: [],
      useTransactionValue: false,
      allowedByAnyone: true,
      allowed: "Anyone",
      condition: "",
      previousTransactions: [],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-05-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "Finish",
      }]
    },
    {
      name: "Only Creator: Decrement",
      params: [],
      allowedByAnyone: false,
      allowed: "${Creator}",
      useTransactionValue: true,
      condition: "",
      previousTransactions: [],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-02-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "SetProperty",
        instructions: {
          propertyName: "count",
          expression: "$A{count} - 1"
        }
      }]
    },
    {
      name: "Deposit",
      params: [],
      onlyOnce: true,
      useTransactionValue: true,
      allowedByAnyone: false,
      allowed: "Anyone(Depositor)",
      condition: "${TransactionValue} > 0",
      previousTransactions: [],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-02-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "Deposit",
        instructions: {
          amount: "${TransactionValue}",
          token: "ETH",
          account: "Depositor"
        }
      }]
    },
    {
      name: "Transfer 10 to Reto",
      params: [],
      allowedByAnyone: false,
      allowed: "Reto",
      condition: "",
      useTransactionValue: true,
      previousTransactions: ["Deposit"],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-02-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "Transfer",
        instructions: {
          amount: "10",
          token: "ETH",
          fromAccount: "Depositor",
          toAccount: "Reto",
        }
      },
      {
        type: "SetProperty",
        instructions: {
          propertyName: "count",
          expression: "$A{count} + 1"
        }
      }]
    },
    {
      name: "If",
      params: [
        {
          "type": "Text",
          "paramName": "newName",
        }
      ],
      allowedByAnyone: true,
      allowed: "Anyone",
      condition: "",
      previousTransactions: [],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-05-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "If",
        instructions: {
          condition: "$A{count} > 5",
          statements: [
            {
              type: "SetProperty",
              instructions: {
                propertyName: "count",
                expression: "$A{count} + 5"
              }
            },
          ]
        }
      },
      ]
    },
    {
      name: "IfElse",
      params: [
        {
          "type": "Text",
          "paramName": "newName",
        }
      ],
      allowedByAnyone: true,
      allowed: "Anyone",
      useTransactionValue: false,
      condition: "",
      previousTransactions: [],
      beforeTimeouts: [{
        name: "Timeout Deposit AGIX",
        value: "2023-05-01T13:00:00"
      }],
      afterTimeouts: [],
      statements: [{
        type: "IfElse",
        instructions: {
          condition: "$A{count} > 5",
          statements: [
            {
              type: "SetProperty",
              instructions: {
                propertyName: "count",
                expression: "$A{count} + 5"
              }
            },
          ],
          elseStatements: [
            {
              type: "SetProperty",
              instructions: {
                propertyName: "count",
                expression: "$A{count} - 5"
              }
            },
          ]
        }
      },
      ]
    },
  ],
  roles: ["Depositor", "Receiver"],
  participants: [
    {
      name: "Reto",
      address: "0x0000000000000000000000000000000000000000",
      role: "Depositor"
    }
  ],
  generatedFiles: [
    {
      folder: "",
      fileName: "Contract.sol",
      content: "Hallo"
    },
    {
      folder: "lib",
      fileName: "Model2.sol",
      content: "Model2"
    },
    {
      folder: "lib",
      fileName: "Model.sol",
      content: "Model"
    }
  ]


};
