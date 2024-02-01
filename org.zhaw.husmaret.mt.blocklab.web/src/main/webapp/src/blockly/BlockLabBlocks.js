import { blockColour } from "./BlockLabColour"

const contract = {
    'type': 'contract',
    'message0': 'BlockLab Version %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'VERSION',
        'options': [
          ['1.0', '1.0'],
        ]
      },
    ],
    'message1': 'Ecosystem %1',
    'args1': [
      {
        'type': 'field_dropdown',
        'name': 'BLOCKCHAIN',
        'options': [
          ['Ethereum', 'Ethereum'],
          ['Solana', 'Solana'],
          ['Cardano', 'Cardano'],
          ]
      },
    ],
    'message2': 'Workflow (When)',
    'message3': '%1',
    'args3': [
      {
        'type': 'input_statement',
        'name': 'CONTRACT',
        'check': 'When'
      },
    ],
    'colour': blockColour.colourCategoryContracts,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const contractWithAssets = {
    'type': 'contract_with_assets',
    'message0': 'BlockLab Version %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'VERSION',
        'options': [
          ['1.0', '1.0'],
        ]
      },
    ],
    'message1': 'Ecosystem %1',
    'args1': [
      {
        'type': 'field_dropdown',
        'name': 'BLOCKCHAIN',
        'options': [
          ['Ethereum', 'Ethereum'],
          ['Solana', 'Solana'],
          ['Cardano', 'Cardano'],
          ]
      },
    ],
    'message2': 'Assets',
    'message3': '%1',
    'args3': [
      {
        'type': 'input_statement',
        'name': 'ASSET',
        'check': 'Asset'
      },
    ],
    'message4': 'Workflow (When)',
    'message5': '%1',
    'args5': [
      {
        'type': 'input_statement',
        'name': 'CONTRACT',
        'check': 'When'
      },
    ],
    'colour': blockColour.colourCategoryContracts,
    'tooltip': '',
    'helpUrl': '',
  }

  const contractWithAssetsAndParticipants = {
    'type': 'contract_with_assets_and_participants',
    'message0': 'BlockLab Version %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'VERSION',
        'options': [
          ['1.0', '1.0'],
        ]
      },
    ],
    'message1': 'Ecosystem %1',
    'args1': [
      {
        'type': 'field_dropdown',
        'name': 'BLOCKCHAIN',
        'options': [
          ['Ethereum', 'Ethereum'],
          ['Solana', 'Solana'],
          ['Cardano', 'Cardano'],
          ]
      },
    ],
    'message2': 'Participants',
    'message3': '%1',
    'args3': [
      {
        'type': 'input_statement',
        'name': 'DEFINEPARTICIPANTS',
        'check': 'DefineParticipant'
      },
    ],
    'message4': 'Assets',
    'message5': '%1',
    'args5': [
      {
        'type': 'input_statement',
        'name': 'ASSET',
        'check': 'Asset'
      },
    ],
    'message6': 'Workflow (When)',
    'message7': '%1',
    'args7': [
      {
        'type': 'input_statement',
        'name': 'CONTRACT',
        'check': 'When'
      },
    ],
    'colour': blockColour.colourCategoryContracts,
    'tooltip': '',
    'helpUrl': '',
  }

  const participantsParticipant = {
    'type': 'participants_participant',
    'message0': 'Participant %1 with address %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'ADDRESS',
        'check': 'String'
      }
    ],
    'previousStatement': ['DefineParticipant'],
    'nextStatement': ['DefineParticipant'],
    'colour': blockColour.colourCategoryParticipants,
    'inputsInline': true,
  }
  
  const participantsParticipantRole = {
    'type': 'participants_participantRole',
    'message0': 'Participant %1 with address %2 and role %3',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'ADDRESS',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'ROLE',
        'check': 'String'
      }
    ],
    'previousStatement': ['DefineParticipant'],
    'nextStatement': ['DefineParticipant'],
    'colour': blockColour.colourCategoryParticipants,
    'inputsInline': true,
  }
  
    const participantsContractParam = {
      'type': 'participants_contractParam',
      'message0': 'Participant %1 from %2',
      'args0': [
        {
          'type': 'field_input',
          'name': 'NAME',
          'check': 'String'
        },
        {
          'type': 'input_value',
          'name': 'PARAM',
          'check': 'ContractParameterParticipant'
        },
      ],
      'previousStatement': ['DefineParticipant'],
      'nextStatement': ['DefineParticipant'],
      'colour': blockColour.colourCategoryParticipants,
      'inputsInline': true,
    }
  
    const participantsContractParamRole = {
      'type': 'participants_contractParam_role',
      'message0': 'Participant %1 from %2 and role %3',
      'args0': [
        {
          'type': 'field_input',
          'name': 'NAME',
          'check': 'String'
        },
        {
          'type': 'input_value',
          'name': 'PARAM',
          'check': 'ContractParameterParticipant'
        },
        {
          'type': 'field_input',
          'name': 'ROLE',
          'check': 'String'
        }
      ],
      'previousStatement': ['DefineParticipant'],
      'nextStatement': ['DefineParticipant'],
      'colour': blockColour.colourCategoryParticipants,
      'inputsInline': true,
    }

  const assetAccounts = {
    'type': 'asset_accounts',
    'message0': 'Account balances',
    'previousStatement': ['Asset'],
    'nextStatement': ['Asset'],
    'colour': blockColour.colourCategoryAsset,
    'tooltip': '',
    'helpUrl': ''
  }
  
  const assetProperty = {
    'type': 'asset_property',
    'message0': 'Property %1 of type %2 default %3',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
        'check': 'String'
      },
      {
        'type': 'field_dropdown',
        'name': 'TYPE',
        'options': [
          ['Text', 'Text'],
          ['Number', 'Number'],
          ['Participant', 'Participant'],
          ['Date', 'Date'],
          ['True / False', 'Boolean'],
        ]
      },
      {
        'type': 'input_value',
        'name': 'DEFAULTVALUE',
      }
    ],
    'previousStatement': ['Asset'],
    'nextStatement': ['Asset'],
    'colour': blockColour.colourCategoryAsset,
    'inputsInline': true,
  }

  const assetGetText = {
    'type': 'asset_gettext',
    'message0': 'Property %1 (Text)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'String',
    'colour': blockColour.colourCategoryAsset,
  }
  
  const assetGetNumber = {
    'type': 'asset_getnumber',
    'message0': 'Property %1 (Number)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'Number',
    'colour': blockColour.colourCategoryAsset,
  }
  
  const assetGetDate = {
    'type': 'asset_getdate',
    'message0': 'Property %1 (Date)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'Date',
    'colour': blockColour.colourCategoryAsset,
  }
  
  const assetGetParticipant = {
    'type': 'asset_getparticipant',
    'message0': 'Property %1 (Participant)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'Participant',
    'colour': blockColour.colourCategoryAsset,
  }
  
  const assetGetBoolean = {
    'type': 'asset_getboolean',
    'message0': 'Property %1 (True / False)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'Boolean',
    'colour': blockColour.colourCategoryAsset,
  }
  
  const contractWhen = {
    'type': 'when',
    'message0': 'When',
    'message1': 'Transaction %1 after %2',
    'args1': [
      {
        'type': 'input_statement',
        'name': 'TRANSACTION',
        'check': 'Transaction'
      },
      {
        'type': 'input_value',
        'name': 'AFTER',
        'check': 'DateForWhen',
      },
    ],
    'message2': 'continue as',
    'message3': '%1',  
    'args3': [
      {
        'type': 'input_statement',
        'name': 'CONTINUEAS',
        'check': ['When', 'Finish']
      },
    ],
    'previousStatement': ['When'],
    'colour': blockColour.colourCategoryWhenAndFinished,
    'tooltip': '',
    'helpUrl': '',
    inputsInline: false
  }
  
  const contractTransfer = {
    'type': 'statement_transfer',
    'message0': 'Transfer',
    'message1': 'amount of %1 %2 from account of %3 to account of %4',
    'args1': [
       {
        'type': 'field_dropdown',
        'name': 'CURRENCY',
        'options': [
            // ['BTC', 'BTC'],
            ['ETH', 'ETH'],
            ['ADA', 'ADA'],
            // ['USD', 'USD'],
            // ['EUR', 'EUR'],
            // ['CHF', 'CHF'],
            // ['GBP', 'GBP'],
        ]
      },
      {
        'type': 'input_value',
        'name': 'AMOUNT',
        'check': 'Number',
      },
      {
        'type': 'input_value',
        'name': 'FROMACCOUNT',
        'check': ['Participant', 'TransactionCaller'],
      },
      {
        'type': 'input_value',
        'name': 'TOACCOUNT',
        'check': ['Participant', 'TransactionCaller'],
      },
    ],
    'previousStatement': 'Statement',
    'nextStatement': ['Statement', 'When'],
    'colour': blockColour.colourCategoryStatements,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const contractDeposit = {
    'type': 'statement_deposit',
    'message0': 'Deposit',
    'message1': 'amount of %1 %2 into account of %3',
    'args1': [
       {
        'type': 'field_dropdown',
        'name': 'CURRENCY',
        'options': [
          // ['BTC', 'BTC'],
          ['ETH', 'ETH'],
          ['ADA', 'ADA'],
          // ['USD', 'USD'],
          // ['EUR', 'EUR'],
          // ['CHF', 'CHF'],
          // ['GBP', 'GBP'],
        ]
      },
      {
        'type': 'input_value',
        'name': 'AMOUNT',
        'check': 'Number',
      },
      {
        'type': 'input_value',
        'name': 'ACCOUNT',
        'check': ['Participant', 'TransactionCaller'],
      },
    ],
    'previousStatement': 'Statement',
    'nextStatement': ['Statement', 'When'],
    'colour': blockColour.colourCategoryStatements,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const contractWithdraw = {
    'type': 'statement_withdraw',
    'message0': 'Withdraw',
    'message1': 'amount of %1 %2 from account of %3',
    'args1': [
       {
        'type': 'field_dropdown',
        'name': 'CURRENCY',
        'options': [
          ['ETH', 'ETH'],
          ['ADA', 'ADA'],
        ]
      },
      {
        'type': 'input_value',
        'name': 'AMOUNT',
        'check': 'Number',
      },
      {
        'type': 'input_value',
        'name': 'ACCOUNT',
        'check': ['Participant', 'TransactionCaller'],
      },
    ],
    'previousStatement': 'Statement',
    'nextStatement': ['Statement', 'When'],
    'colour': blockColour.colourCategoryStatements,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const contractSetVariable = {
    'type': 'statement_setvariable',
    'message0': 'Set property %1 to %2',
    'args0': [
       {
        'type': 'field_input',
        'name': 'PROPERTY',
        'check': 'String',
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
        'check': ['String', 'Property', 'Condition', 'Number', 'Participant', 'Date', 'Boolean']
      }
    ],
    'previousStatement': 'Statement',
    'nextStatement': ['Statement', 'When'],
    'colour': blockColour.colourCategoryStatements,
    'tooltip': '',
    'helpUrl': '',
    'inputsInline': false
  }
  
  const contractIf = {
    'type': 'contract_if',
    'message0': 'If %1 do %2',
    'args0': [
       {
         'type': 'input_value',
         'name': 'CONDITION',
         'check': ['Condition', 'Boolean'],
      },
      {
        'type': 'input_statement',
        'name': 'DO',
        'check': 'Statement'
      }
    ],
    'previousStatement': 'Statement',
    'nextStatement': ['Statement', 'When'],
    'colour': blockColour.colourCategoryStatements,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const contractIfElse = {
    'type': 'contract_if_else',
    'message0': 'If %1 do %2 else %3',
    'args0': [
       {
        'type': 'input_value',
        'name': 'CONDITION',
        'check': ['Condition', 'Boolean'],
      },
      {
        'type': 'input_statement',
        'name': 'DO',
        'check': 'Statement'
      },
      {
        'type': 'input_statement',
        'name': 'ELSE',
        'check': 'Statement'
      }
    ],
    'previousStatement': 'Statement',
    'nextStatement': ['Statement', 'When'],
    'colour': blockColour.colourCategoryStatements,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const contractClose = {
    'type': 'contract_close',
    'message0': 'Finish contract',
    'previousStatement': ['Finish', 'Statement'],
    'colour': blockColour.colourCategoryWhenAndFinished,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionGeneric = {
    'type': 'transaction_generic',
    'message0': 'Transaction %1',
    'args0': [
      {
        'type': 'field_input',
        'name': 'IDENTIFICATION',
        'check': 'String'
      },
    ],
    'message1': 'Allowed by (Access) %1 Condition %2 do %3',
    'args1': [
      {
        'type': 'input_value',
        'name': 'ALLOWED',
        'check': ['Access']
      },
      {
        'type': 'input_value',
        'name': 'CONDITION',
        'check': ['Condition', 'Boolean', 'Always']
      },
      {
        'type': 'input_statement',
        'name': 'CONTINUEAS',
        'check': ['Statement', 'When']
      },
    ],
    'previousStatement': 'Transaction',
    'nextStatement': 'Transaction',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionGenericOnce = {
    'type': 'transaction_generic_once',
    'message0': 'Transaction %1',
    'args0': [
      {
        'type': 'field_input',
        'name': 'IDENTIFICATION',
        'check': 'String'
      },
    ],
    'message1': 'Only once %1',
    'args1': [
      {
        'type': 'field_checkbox',
        'name': 'ONLYONCE',
        'checked': false
      },
    ],
    'message2': 'Allowed by (Access) %1 Condition %2 do %3',
    'args2': [
      {
        'type': 'input_value',
        'name': 'ALLOWED',
        'check': ['Access']
      },
      {
        'type': 'input_value',
        'name': 'CONDITION',
        'check': ['Condition', 'Boolean', 'Always']
      },
      {
        'type': 'input_statement',
        'name': 'CONTINUEAS',
        'check': ['Statement', 'When']
      },
    ],
    'previousStatement': 'Transaction',
    'nextStatement': 'Transaction',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionAmount = {
    'type': 'transaction_amount',
    'message0': 'Sent amount of transaction',
    'output': 'Number',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionParamNumber = {
    'type': 'transactionparameter_number',
    'message0': 'Parameter %1 (Number) of transaction %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'PARAM',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'TRANSACTION',
        'check': 'String'
      },
    ],
    'output': 'Number',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionParamText = {
    'type': 'transactionparameter_text',
    'message0': 'Parameter %1 (Text) of transaction %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'PARAM',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'TRANSACTION',
        'check': 'String'
      },
    ],
    'output': 'String',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionParamBoolean = {
    'type': 'transactionparameter_boolean',
    'message0': 'Parameter %1 (True / False) of transaction %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'PARAM',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'TRANSACTION',
        'check': 'String'
      },
    ],
    'output': 'Boolean',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionParamDate = {
    'type': 'transactionparameter_date',
    'message0': 'Parameter %1 (Date) of transaction %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'PARAM',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'TRANSACTION',
        'check': 'String'
      },
    ],
    'output': 'Date',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const transactionParamParticipant = {
    'type': 'transactionparameter_participant',
    'message0': 'Parameter %1 (Participant) of transaction %2',
    'args0': [
      {
        'type': 'field_input',
        'name': 'PARAM',
        'check': 'String'
      },
      {
        'type': 'field_input',
        'name': 'TRANSACTION',
        'check': 'String'
      },
    ],
    'output': 'Participant',
    'colour': blockColour.colourCategoryTransactions,
    'tooltip': '',
    'helpUrl': '',
  }
  
  const conditionAlways = {
    'type': 'condition_always',
    'message0': 'Always',
    'output': 'Always',
    'colour': blockColour.colourCategoryConditions,
  }
  
  const conditionAnd = {
    'type': 'condition_and',
    'message0': '%1 and %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'CONDITION1',
        'check': ['Condition', 'Boolean']
      },
      {
        'type': 'input_value',
        'name': 'CONDITION2',
        'check': ['Condition', 'Boolean']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionOr = {
    'type': 'condition_or',
    'message0': '%1 or %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'CONDITION1',
        'check': ['Condition', 'Boolean']
      },
      {
        'type': 'input_value',
        'name': 'CONDITION2',
        'check': ['Condition', 'Boolean']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionNot = {
    'type': 'condition_not',
    'message0': 'not %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'CONDITION',
        'check': ['Condition', 'Boolean']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionGreater = {
    'type': 'condition_greater',
    'message0': '%1 greater than %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'LEFT',
        'check': ['Number', 'Date']
      },
      {
        'type': 'input_value',
        'name': 'RIGHT',
        'check': ['Number', 'Date']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionGreaterEquals = {
    'type': 'condition_greater_equals',
    'message0': '%1 greater or equals %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'LEFT',
        'check': ['Number', 'Date']
      },
      {
        'type': 'input_value',
        'name': 'RIGHT',
        'check': ['Number', 'Date']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionEquals = {
    'type': 'condition_equals',
    'message0': '%1 equals %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'LEFT',
        'check': ['Number', 'Date', 'String', 'Boolean', 'Participant']
      },
      {
        'type': 'input_value',
        'name': 'RIGHT',
        'check': ['Number', 'Date', 'String', 'Boolean', 'Participant']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionNotEquals = {
    'type': 'condition_not_equals',
    'message0': '%1 not equals %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'LEFT',
        'check': ['Number', 'Date', 'String', 'Boolean', 'Participant']
      },
      {
        'type': 'input_value',
        'name': 'RIGHT',
        'check': ['Number', 'Date', 'String', 'Boolean', 'Participant']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionLessEquals = {
    'type': 'condition_less_equals',
    'message0': '%1 less or equals %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'LEFT',
        'check': ['Number', 'Date']
      },
      {
        'type': 'input_value',
        'name': 'RIGHT',
        'check': ['Number', 'Date']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const conditionLess = {
    'type': 'condition_less',
    'message0': '%1 less than %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'LEFT',
        'check': ['Number', 'Date']
      },
      {
        'type': 'input_value',
        'name': 'RIGHT',
        'check': ['Number', 'Date']
      }
    ],
    'output': 'Condition',
    'colour': blockColour.colourCategoryConditions,
    'inputsInline': true
  }
  
  const participantRole = {
    'type': 'participant_role',
    'message0': 'Role %1',
    'args0': [
      {
        'type': 'field_input',
        'name': 'ROLE',
        'check': 'String'
      }
    ],
    'output': 'Participant',
    'colour': blockColour.colourCategoryParticipants
  }
  
    const accessAnyone = {
      'type': 'access_anyone',
      'message0': 'Anyone',
      'output': 'Access',
      'colour': blockColour.colourCategoryAccess,
    }
  
    const accessAnyoneRole = {
      'type': 'access_anyone_role',
      'message0': 'Anyone, assign role %1',
      'args0': [
        {
          'type': 'field_input',
          'name': 'ROLE',
          'check': 'String'
        },
      ],
      'output': 'Access',
      'colour': blockColour.colourCategoryAccess,
    }
  
    const participantCreator = {
      'type': 'participant_creator',
      'message0': 'Smart Contract creator',
      'output': 'Participant',
      'colour': blockColour.colourCategoryParticipants,
    }
    
    const participantTransactionCaller = {
      'type': 'participant_transactioncaller',
      'message0': 'Transaction caller',
      'output': 'Participant',
      'colour': blockColour.colourCategoryParticipants,
    }
  
    const participantId = {
      'type': 'participant_id',
      'message0': 'Participant %1',
      'args0': [
          {
              'type': 'field_input',
              'name': 'IDENTIFICATION',
          },
      ],
      'output': 'Participant',
      'colour': blockColour.colourCategoryParticipants,
    }


    const accessParticipantId = {
      'type': 'access_participant_id',
      'message0': 'Only Participant %1',
      'args0': [
          {
              'type': 'field_input',
              'name': 'IDENTIFICATION',
          },
      ],
      'output': 'Access',
      'colour': blockColour.colourCategoryAccess,
    }

    const accessParticipantCreator = {
      'type': 'access_participant_creator',
      'message0': 'Only Smart Contract creator',
      'output': 'Access',
      'colour': blockColour.colourCategoryAccess,
    }
    
    const accessParticipantRole = {
      'type': 'access_participant_role',
      'message0': 'Only Role %1',
      'args0': [
        {
          'type': 'field_input',
          'name': 'ROLE',
          'check': 'String'
        }
      ],
      'output': 'Access',
      'colour': blockColour.colourCategoryAccess
    }

  const mathPlus = {
      'type': 'math_plus',
      'message0': '%1 + %2',
      'args0': [
        {
          'type': 'input_value',
          'name': 'A',
          'check': 'Number',
        },
        {
          'type': 'input_value',
          'name': 'B',
          'check': 'Number',
        },
      ],
      'inputsInline': true,
      'output': 'Number',
      'colour': blockColour.colourCategoryExpressions,
  }
  
  const mathMinus = {
      'type': 'math_minus',
      'message0': '%1 - %2',
      'args0': [
        {
          'type': 'input_value',
          'name': 'A',
          'check': 'Number',
        },
        {
          'type': 'input_value',
          'name': 'B',
          'check': 'Number',
        },
      ],
      'inputsInline': true,
      'output': 'Number',
      'colour': blockColour.colourCategoryExpressions,
  }
  
  
  const mathTimes = {
      'type': 'math_times',
      'message0': '%1 * (multiply) %2',
      'args0': [
        {
          'type': 'input_value',
          'name': 'A',
          'check': 'Number',
        },
        {
          'type': 'input_value',
          'name': 'B',
          'check': 'Number',
        },
      ],
      'inputsInline': true,
      'output': 'Number',
      'colour': blockColour.colourCategoryExpressions,
  }
  
  const mathDivide = {
      'type': 'math_divide',
      'message0': '%1 / (divide) %2',
      'args0': [
        {
          'type': 'input_value',
          'name': 'A',
          'check': 'Number',
        },
        {
          'type': 'input_value',
          'name': 'B',
          'check': 'Number',
        },
      ],
      'inputsInline': true,
      'output': 'Number',
      'colour': blockColour.colourCategoryExpressions,
  }

  const mathModulo = {
    'type': 'math_modulo',
    'message0': '%1 % (modulo) %2',
    'args0': [
      {
        'type': 'input_value',
        'name': 'A',
        'check': 'Number',
      },
      {
        'type': 'input_value',
        'name': 'B',
        'check': 'Number',
      },
    ],
    'inputsInline': true,
    'output': 'Number',
    'colour': blockColour.colourCategoryExpressions,
}
  
  const customNumber = {
      'type': 'custom_number',
      'message0': 'Number %1',
      'args0': [
        {
          'type': 'field_input',
          'name': 'NUM',
          'value': 0,
        },
      ],
      'output': 'Number',
      'colour': blockColour.colourCategoryValues,
      //'helpUrl': '%{BKY_MATH_NUMBER_HELPURL}',
      'tooltip': '%{BKY_MATH_NUMBER_TOOLTIP}',
      'extensions': ['parent_tooltip_when_inline'],
  }
  
  const customText = {
      'type': 'custom_text',
      'message0': '%1',
      'args0': [
        {
          'type': 'field_input',
          'name': 'TEXT',
          'text': '',
        }
      ],
      'output': 'String',
      'colour': blockColour.colourCategoryValues,
      //'helpUrl': '%{BKY_TEXT_TEXT_HELPURL}',
      'tooltip': '%{BKY_TEXT_TEXT_TOOLTIP}',
      'extensions': [
        'text_quotes',
        'parent_tooltip_when_inline',
      ],
   }
  
   const customNow = {
    'type': 'custom_now',
    'message0': 'now',
    'output': 'Date',
    'colour': blockColour.colourCategoryValues
  }
  
  const customContractStart = {
    'type': 'custom_contractstart',
    'message0': 'contract start',
    'output': 'Date',
    'colour': blockColour.colourCategoryValues
  }
  
  const customContractStartDuration = {
    'type': 'custom_contractstartduration',
    'message0': '%1 %2 after contract start',
    'args0': [
      {
        'type': 'field_input',
        'name': 'AMOUNT',
        'check': 'Number',
      },
      {
        'type': 'field_dropdown',
        'name': 'DURATION',
        'options': [
        ['minutes', 'minutes'],
        ['hours', 'hours'],
        ['days', 'days'],
        ['weeks', 'weeks'],
        ['months', 'months'],
        ['years', 'years'],
      ]
      },
    ],
    'output': ['Date', 'DateForWhen'],
    'colour': blockColour.colourCategoryValues
  }
  
  const customDate = {
      'type': 'custom_date',
      'message0': '%1',
      'args0': [
        {
          'type': 'field_date',
          'name': 'DATE',
          'text': '',
        }
      ],
      'output': ['Date', 'DateForWhen'],
      'colour': blockColour.colourCategoryValues,
      'tooltip': 'A date in format yyyy-MM-dd',
      'extensions': ['parent_tooltip_when_inline'],
   }
  
  const customDateTime = {
      'type': 'custom_datetime',
      'message0': '%1 %2:%3',
      'args0': [
        {
          'type': 'field_date',
          'name': 'DATE',
          'text': '',
        },
        {
          'type': 'field_input',
          'name': 'HOUR',
          'text': '00',
          'check': 'Number'
        },
        {
          'type': 'field_input',
          'name': 'MINUTE',
          'text': '00',
          'check': 'Number'
        }
      ],
      'output': ['Date', 'DateForWhen'],
      'colour': blockColour.colourCategoryValues,
      'tooltip': 'A datetime in format yyyy-MM-dd hh:mm',
      'extensions': ['parent_tooltip_when_inline'],
    }
  
   const customTrue = {
     'type': 'custom_true',
     'message0': 'True',
     'colour': blockColour.colourCategoryValues,
     'output': 'Boolean',
   }
  
   const customFalse = {
    'type': 'custom_false',
    'message0': 'False',
    'colour': blockColour.colourCategoryValues,
    'output': 'Boolean',
  }
  
  const contractParameterText = {
    'type': 'contractparameter_text',
    'message0': 'Contract parameter %1 (Text)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'String',
    'colour': blockColour.colourCategoryContractParameters,
  }
  
  const contractParameterNumber = {
    'type': 'contractparameter_number',
    'message0': 'Contract parameter %1 (Number)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'Number',
    'colour': blockColour.colourCategoryContractParameters,
  }
  
  const contractParameterDate = {
    'type': 'contractparameter_date',
    'message0': 'Contract parameter %1 (Date)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': ['Date', 'DateForWhen'],
    'colour': blockColour.colourCategoryContractParameters,
  }
  
  const contractParameterParticipant = {
    'type': 'contractparameter_participant',
    'message0': 'Contract parameter %1 (Participant)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': ['Participant', 'ContractParameterParticipant'],
    'colour': blockColour.colourCategoryContractParameters,
  }
  
  const contractParameterBoolean = {
    'type': 'contractparameter_boolean',
    'message0': 'Contract parameter %1 (True / False)',
    'args0': [
      {
        'type': 'field_input',
        'name': 'NAME',
      }
    ],
    'output': 'Boolean',
    'colour': blockColour.colourCategoryContractParameters,
  }
   
  
  // Create the block definitions for the JSON-only blocks.
  // This does not register their definitions with Blockly.
  // This file has no side effects!
  export const blocks = [
    // contracts
    contract, 
    contractWithAssets, 
    contractWithAssetsAndParticipants,
    // asset
    assetAccounts,
    assetProperty,
    assetGetText,
    assetGetNumber,
    assetGetBoolean,
    assetGetParticipant,
    assetGetDate,
    // contract and statements
    contractWhen, 
    contractDeposit,
    contractTransfer,
    contractWithdraw,
    contractIf,
    contractIfElse,
    contractSetVariable,
    contractClose, 
    // transactions
    transactionGeneric,
    transactionGenericOnce,
    transactionAmount,
    // transactionSentAmount,
    transactionParamNumber,
    transactionParamText,
    transactionParamBoolean,
    transactionParamDate,
    transactionParamParticipant,
    // conditions
    conditionAlways,
    conditionAnd,
    conditionOr,
    conditionNot,
    conditionGreater,
    conditionGreaterEquals,
    conditionEquals,
    conditionNotEquals,
    conditionLessEquals,
    conditionLess,
    // participant
    participantsParticipant,
    participantsParticipantRole,
    participantsContractParam,
    participantsContractParamRole,
    participantRole,
    participantId, 
    participantCreator,
    participantTransactionCaller,
    // access
    accessAnyone,
    accessAnyoneRole,
    accessParticipantId,
    accessParticipantCreator,
    accessParticipantRole,
    // values
    mathPlus,
    mathMinus,
    mathTimes,
    mathDivide,
    mathModulo,
    customNumber,
    customText,
    customNow,
    customContractStart,
    customContractStartDuration,
    customDate,
    customDateTime,
    customTrue,
    customFalse,
    contractParameterText,
    contractParameterNumber,
    contractParameterDate,
    contractParameterParticipant,
    contractParameterBoolean
  ];
  