import level1 from 'db://assets/Levels/level1'
import level2 from 'db://assets/Levels/level2'
import { TILE_TYPE_ENUM } from 'db://assets/Enums'

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
}

export default levels
