import { Repository } from 'typeorm'
import { InteractionTypeormEntity } from '../entities/interaction.typeorm-entity'

export class InteractionTypeormRepository extends Repository<InteractionTypeormEntity> {}
