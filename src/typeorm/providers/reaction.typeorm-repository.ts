import { Repository } from 'typeorm'
import { ReactionTypeormEntity } from '../entities/reaction.typeorm-entity'

export class ReactionTypeormRepository extends Repository<ReactionTypeormEntity> {}
