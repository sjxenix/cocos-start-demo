/*
  1、需要知道animationClip
  2、需要播放动画的能力animation
 */
import { AnimationClip, Sprite, SpriteFrame, UITransform, animation } from 'cc'
import { PlayerStateMachine } from 'db://assets/Scripts/Player/PlayerStateMachine'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import ResourceManager from 'db://assets/Runtime/ResourceManager'

const ANIMATION_SPEED = 1 / 8

export default class State {
  private animationClip: AnimationClip
  constructor(
    private fsm: PlayerStateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    this.init()
  }

  async init() {
    const promise = ResourceManager.Instance.loadDir(this.path)
    this.fsm.waitingList.push(promise)
    const spriteFrames = await promise
    this.animationClip = new AnimationClip()

    const track = new animation.ObjectTrack() // 创建一个对象轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item])
    track.channel.curve.assignSorted(frames)

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track)
    this.animationClip.duration = frames.length * ANIMATION_SPEED // 整个动画剪辑的周期
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
