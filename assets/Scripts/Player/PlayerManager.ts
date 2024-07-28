import { _decorator, Component, Node, Sprite, UITransform, AnimationClip, Animation, animation, SpriteFrame } from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import ResourceManager from 'db://assets/Runtime/ResourceManager'
import { PlayerStateMachine } from 'db://assets/Scripts/Player/PlayerStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x: number = 0
  y: number = 0
  targetX: number = 0
  targetY: number = 0
  private readonly speed = 1 / 10
  fsm: PlayerStateMachine

  async init() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const tranform = this.getComponent(UITransform)
    tranform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CONTROL, this.move, this)
  }

  update() {
    this.updateXY()
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  updateXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }

    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT, true)
    }
  }
}
