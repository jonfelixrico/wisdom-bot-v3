import { Repository } from 'typeorm'
import { ReactionTypeormEntity } from '../entities/interaction.typeorm-entity'

export class InteractionTypeormRepository extends Repository<ReactionTypeormEntity> {}
