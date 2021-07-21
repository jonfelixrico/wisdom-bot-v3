import { Repository } from 'typeorm'
import { ReactionTypeormEntity } from '../entities/interaction.typeorm-entity'

export class ReactionTypeormRepository extends Repository<ReactionTypeormEntity> {}
