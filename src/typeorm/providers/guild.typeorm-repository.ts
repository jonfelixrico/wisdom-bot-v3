import { Repository } from 'typeorm'
import { GuildTypeormEntity } from '../entities/guild.typeorm-entity'

export class GuildTypeormRepository extends Repository<GuildTypeormEntity> {}
