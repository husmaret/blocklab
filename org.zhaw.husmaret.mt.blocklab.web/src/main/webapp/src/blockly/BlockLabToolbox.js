import {blockColour} from './BlockLabColour'

export const toolbox = {
	'kind': 'categoryToolbox',
	'contents': [
		{
			'kind': 'category',
			'name': 'Contract',
			'colour': blockColour.colourCategoryContracts,
			'contents': [
				{
					'kind': 'block',
					'type': 'contract_with_assets_and_participants'
				},
				{
					'kind': 'block',
					'type': 'contract_with_assets'
				},
				{
					'kind': 'block',
					'type': 'contract'
				},
				{
					'kind': 'block',
					'type': 'contract_close'
				},
			],
		},
		{
			'kind': 'category',
			'name': 'When',
			'colour': blockColour.colourCategoryWhenAndFinished,
			'contents': [
				{
					'kind': 'block',
					'type': 'when',
				},
				{
					'kind': 'block',
					'type': 'when',
					'inputs': {
						'AFTER': {
							'block': {
								'type': 'custom_date',
							}
						},
					}
				},
				{
					'kind': 'block',
					'type': 'when',
					'inputs': {
						'AFTER': {
							'block': {
								'type': 'custom_datetime',
							}
						},
					}
				},
				{
					'kind': 'block',
					'type': 'when',
					'inputs': {
						'AFTER': {
							'block': {
								'type': 'custom_contractstartduration',
								'fields': {
									'AMOUNT': 7,
									'DURATION': 'days',
								}
							}
						},
					}
				},
				{
					'kind': 'block',
					'type': 'when',
					'inputs': {
						'AFTER': {
							'block': {
								'type': 'contractparameter_date',
								'fields': {
									'NAME': 'param',
								}
							}
						},
					}
				},
				{
					'kind': 'block',
					'type': 'contract_close',
				},
			],
		},
		{
			'kind': 'category',
			'name': 'Participants',
			'colour': blockColour.colourCategoryParticipants,
			'contents': [
				{
					'kind': 'block',
					'type': 'participants_participant',
					'fields': {
						'NAME': 'name',
						'ADDRESS': '0x00000000...00000000',
					},
				},
				{
					'kind': 'block',
					'type': 'participants_participantRole',
					'fields': {
						'NAME': 'name',
						'ADDRESS': '0x00000000...00000000',
						'ROLE': 'role',
					},
				},
				{
					'kind': 'block',
					'type': 'participants_contractParam',
					'fields': {
						'NAME': 'name',
					},
					'inputs': {
						'PARAM': {
							'block': {
								'type': 'contractparameter_participant',
								'fields': {
									'NAME': 'param',
								}
							}
						},
					}
				},
				{
					'kind': 'block',
					'type': 'participants_contractParam_role',
					'fields': {
						'NAME': 'name',
						'ROLE': 'role',
					},
					'inputs': {
						'PARAM': {
							'block': {
								'type': 'contractparameter_participant',
								'fields': {
									'NAME': 'param',
								}
							}
						},
					}
				},
				{
					'kind': 'block',
					'type': 'participant_id',
					'fields': {
						'IDENTIFICATION': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'participant_role',
					'fields': {
						'ROLE': 'role',
					}
				},
				{
					'kind': 'block',
					'type': 'participant_creator',
				},
				{
					'kind': 'block',
					'type': 'participant_transactioncaller',
				}
			],
		},
		{
			'kind': 'category',
			'name': 'Assets',
			'colour': blockColour.colourCategoryAsset,
			'contents': [
				{
					'kind': 'block',
					'type': 'asset_accounts',
				},
				{
					'kind': 'block',
					'type': 'asset_property',
					'fields': {
						'NAME': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'asset_gettext',
					'fields': {
						'NAME': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'asset_getnumber',
					'fields': {
						'NAME': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'asset_getdate',
					'fields': {
						'NAME': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'asset_getboolean',
					'fields': {
						'NAME': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'asset_getparticipant',
					'fields': {
						'NAME': 'name',
					},
				},
			],
		},
		{
			'kind': 'category',
			'name': 'Transactions',
			'colour': blockColour.colourCategoryTransactions,
			'contents': [
				{
					'kind': 'block',
					'type': 'when',
				},
				{
					'kind': 'block',
					'type': 'transaction_generic_once',
					'fields': {
						'IDENTIFICATION': 'name',
					},
				},
				{
					'kind': 'block',
					'type': 'transaction_amount',
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_text',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_number',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_date',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_boolean',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_participant',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'contract_close',
				},
			],
		},
		{
			'kind': 'category',
			'name': 'Access',
			'colour': blockColour.colourCategoryAccess,
			'contents': [
				{
					'kind': 'block',
					'type': 'access_anyone'
				},
				{
					'kind': 'block',
					'type': 'access_anyone_role',
					'fields': {
						'ROLE': 'role',
					}
				},
				{
					'kind': 'block',
					'type': 'access_participant_id',
					'fields': {
						'IDENTIFICATION': 'name',
					}
				},
				{
					'kind': 'block',
					'type': 'access_participant_role',
					'fields': {
						'ROLE': 'role',
					}
				},
				{
					'kind': 'block',
					'type': 'access_participant_creator',
				},
			],
		},
		{
			'kind': 'category',
			'name': 'Conditions',
			'colour': blockColour.colourCategoryConditions,
			'contents': [
				{
					'kind': 'block',
					'type': 'condition_always'
				},
				{
					'kind': 'block',
					'type': 'condition_and'
				},
				{
					'kind': 'block',
					'type': 'condition_or'
				},
				{
					'kind': 'block',
					'type': 'condition_not'
				},
				{
					'kind': 'block',
					'type': 'condition_greater'
				},
				{
					'kind': 'block',
					'type': 'condition_greater_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_not_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_less_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_less'
				},
			],
		},
		{
			'kind': 'category',
			'name': 'Statements',
			'colour': blockColour.colourCategoryStatements,
			'contents': [
				{
					'kind': 'block',
					'type': 'statement_setvariable',
					'fields': {
						'PROPERTY': 'property',
					},
				},
				{
					'kind': 'block',
					'type': 'statement_deposit'
				},
				{
					'kind': 'block',
					'type': 'statement_transfer'
				},
				{
					'kind': 'block',
					'type': 'statement_withdraw',
				},
				{
					'kind': 'block',
					'type': 'contract_if'
				},
				{
					'kind': 'block',
					'type': 'contract_if_else'
				},
				{
					'kind': 'block',
					'type': 'contract_close'
				}
			],
		},
		{
			'kind': 'category',
			'name': 'Expressions',
			'colour': blockColour.colourCategoryExpressions,
			'contents': [
				{
					'kind': 'block',
					'type': 'math_plus',
				},
				{
					'kind': 'block',
					'type': 'math_minus',
				},
				{
					'kind': 'block',
					'type': 'math_times',
				},
				{
					'kind': 'block',
					'type': 'math_divide',
				},
				{
					'kind': 'block',
					'type': 'math_modulo',
				},
				{
					'kind': 'block',
					'type': 'condition_and'
				},
				{
					'kind': 'block',
					'type': 'condition_or'
				},
				{
					'kind': 'block',
					'type': 'condition_not'
				},
				{
					'kind': 'block',
					'type': 'condition_greater'
				},
				{
					'kind': 'block',
					'type': 'condition_greater_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_not_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_less_equals'
				},
				{
					'kind': 'block',
					'type': 'condition_less'
				},
			],
		},
		{
			'kind': 'sep',
		},
		{
			'kind': 'category',
			'name': 'Values',
			'colour': blockColour.colourCategoryValues,
			'contents': [
				{
					'kind': 'block',
					'type': 'custom_text',
					'fields': {
						'TEXT': 'text',
					},
				},
				{
					'kind': 'block',
					'type': 'custom_number',
					'fields': {
						'NUM': 0,
					},
				},
				{
					'kind': 'block',
					'type': 'custom_true',
				},
				{
					'kind': 'block',
					'type': 'custom_false',
				},
				{
					'kind': 'block',
					'type': 'custom_now',
				},
				{
					'kind': 'block',
					'type': 'custom_date',
				},
				{
					'kind': 'block',
					'type': 'custom_datetime',
				},
				{
					'kind': 'block',
					'type': 'custom_contractstartduration',
					'fields': {
						'AMOUNT': 7,
						'DURATION': 'days'
					}
				},
			],
		},
		{
			'kind': 'category',
			'name': 'Parameters',
			'colour': blockColour.colourCategoryContractParameters,
			'contents': [
				{
					'kind': 'block',
					'type': 'contractparameter_text',
					'fields': {
						'NAME': 'param',
					},
				},
				{
					'kind': 'block',
					'type': 'contractparameter_number',
					'fields': {
						'NAME': 'param',
					},
				},
				{
					'kind': 'block',
					'type': 'contractparameter_date',
					'fields': {
						'NAME': 'param',
					},
				},
				{
					'kind': 'block',
					'type': 'contractparameter_boolean',
					'fields': {
						'NAME': 'param',
					},
				},
				{
					'kind': 'block',
					'type': 'contractparameter_participant',
					'fields': {
						'NAME': 'param',
					},
				},
				{
					'kind': 'block',
					'type': 'transaction_amount',
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_text',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_number',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_date',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_boolean',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
				{
					'kind': 'block',
					'type': 'transactionparameter_participant',
					'fields': {
						'PARAM': 'param',
						'TRANSACTION': 'name'
					},
				},
			],
		},
	],
};
