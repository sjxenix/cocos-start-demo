import { _decorator, Component, AnimationClip, Animation, SpriteFrame } from 'cc'
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import State from 'db://assets/Base/State'

const { ccclass, property } = _decorator

type ParamsValueType = boolean | number

interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: ParamsValueType
}

export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {
  private _currentState: State = null
  params: Map<string, IParamsValue> = new Map()
  stateMachines: Map<string, State> = new Map()
  animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []

  getParams(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  setParams(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run()
    }
  }

  get currentState() {
    return this._currentState
  }

  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  async init() {
    this.animationComponent = this.addComponent(Animation)

    this.initParams()
    this.initStateMachines()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
  }

  initStateMachines() {
    this.stateMachines.set(
      PARAMS_NAME_ENUM.IDLE,
      new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top'))
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        break

      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
