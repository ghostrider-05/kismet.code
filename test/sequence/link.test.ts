/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Constants } from '../../src/index.js'
import {
    BaseKismetConnection,
    ItemConnection,
    VariableConnection,
    KismetFile,
} from '../../src/structures/index.js'
import { builders } from '../../src/structures/builders/index.js'

const {
    baseConnectionBuilder,
    itemConnectionBuilder,
    variableConnectionBuilder,
} = builders

const {
    Actions: { AddGameBall },
} = KismetFile.Items

const linkInput =
    '(LinkDesc="Add",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)'
const variableInput =
    '(ExpectedType=Class\'Engine.SeqVar_Object\',LinkedVariables=none,LinkDesc="Instigator",LinkVar=None,PropertyName=Instigator,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)'

const base = baseConnectionBuilder({
    input: 'input',
    type: Constants.ConnectionType.INPUT,
})

const inputLink = itemConnectionBuilder(
    linkInput,
    Constants.ConnectionType.INPUT
)
const outputLink = itemConnectionBuilder(
    linkInput,
    Constants.ConnectionType.OUTPUT
)
const variableLink = variableConnectionBuilder(
    variableInput,
    Constants.ConnectionType.VARIABLE
)

describe('base node connections', () => {
    describe('static methods', () => {
        test('convert input', () => {
            expect(
                BaseKismetConnection.convertInput('(test=1,foo=ba)')
            ).toEqual({ test: '1', foo: 'ba' })
        })

        test('create link', () => {
            expect(
                BaseKismetConnection.convertLink(
                    Constants.ConnectionType.INPUT,
                    linkInput
                )
            ).toBeInstanceOf(ItemConnection)
            expect(
                BaseKismetConnection.convertLink(
                    Constants.ConnectionType.VARIABLE,
                    variableInput
                )
            ).toBeInstanceOf(VariableConnection)

            //@ts-expect-error
            expect(BaseKismetConnection.convertLink('test', '')).toBeUndefined()
        })
    })

    test('type guards', () => {
        expect(base.isBaseConnection()).toBe(true)
        expect(base.isItemConnection()).toBe(false)
        expect(base.isVariableConnection()).toBe(false)

        expect(inputLink.isBaseConnection()).toBe(false)
        expect(inputLink.isItemConnection()).toBe(true)
        expect(inputLink.isVariableConnection()).toBe(false)

        expect(variableLink.isBaseConnection()).toBe(false)
        expect(variableLink.isItemConnection()).toBe(false)
        expect(variableLink.isVariableConnection()).toBe(true)
    })

    test('hidden link', () => {
        expect(base.bHidden).toBe(false)
        expect(base.setHidden(true).bHidden).toBe(true)
    })

    test('add link', () => {
        expect(base.addLink(new AddGameBall().linkId).links?.length).toBe(1)
    })

    test('format link', () => {
        expect(base.prefix()).toBe('InputLinks(0)')
        expect(base.prefix(1)).toBe('InputLinks(1)')

        expect(typeof base.value === 'string').toBe(true)
    })

    test('export string', () => {
        expect(base.toKismet()).toEqual(base.toString())
        expect(base.toString()).toBeTruthy()
    })
})

describe('item link', () => {
    test('type guards', () => {
        expect(outputLink.isOutputLink()).toBe(true)
        expect(outputLink.isInputLink()).toBe(false)
    })

    test('add delay', () => {
        expect(outputLink.setActivateDelay(2).ActivateDelay).toBe(2)
    })

    test('export string', () => {
        expect(inputLink.toKismet()).toEqual(inputLink.toString())
        expect(inputLink.toString()).toBeTruthy()
    })
})

describe('variable link', () => {
    test('export string', () => {
        expect(variableLink.toKismet()).toEqual(variableLink.toString())
        expect(variableLink.toString()).toBeTruthy()
    })
})
