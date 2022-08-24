import { SequenceAction, BaseKismetActionRequiredOptions } from '../src/index.js'

class MyAction extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: 'SeqAct_MyAction\'Package.Default__SeqAct_MyAction\'',
            inputs: {
                input: [
                    "(LinkDesc=\"Random\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
}

const myAction = new MyAction()
    .setComment({ comment: 'Hello custom action!' })

console.log(myAction.toString())