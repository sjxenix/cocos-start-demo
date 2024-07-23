import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'
import { resources, SpriteFrame } from 'cc'

export default class ResourceManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }

  //texture/tile/tile
  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, type, function (err, assets) {
        if (err) {
          reject(err)
          return
        }

        resolve(assets)
      })
    })
  }
}
