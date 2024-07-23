import Singleton from 'db://assets/Base/Singleton'

interface IItem {
  func: Function
  ctx: unknown //上下文
}

export default class EventManager extends Singleton {
  static get Instance() {
    return super.GetInstance<EventManager>()
  }

  private eventDic: Map<string, Array<IItem>> = new Map()

  //绑定
  on(eventName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).push({ func, ctx })
    } else {
      this.eventDic.set(eventName, [{ func, ctx }])
    }
  }

  //解绑
  off(eventName: string, func: Function) {
    if (this.eventDic.has(eventName)) {
      const index = this.eventDic.get(eventName).findIndex(i => i.func === func)
      index > -1 && this.eventDic.get(eventName).splice(index, 1)
    }
  }

  emit(eventName: string, ...params: unknown[]) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, params) : func(...params)
      })
    }
  }

  clear() {
    this.eventDic.clear()
  }
}
