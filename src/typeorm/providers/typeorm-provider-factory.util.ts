import { Provider } from '@nestjs/common'
import { Connection, ObjectType, Repository } from 'typeorm'

export const generateTypeormRepositoryProvider = <
  EntityType,
  RepositoryType extends Repository<EntityType>,
>(
  entity: ObjectType<EntityType>,
  repository: ObjectType<RepositoryType>,
): Provider => {
  return {
    inject: [Connection],
    useFactory: (conn: Connection) => conn.getRepository(entity),
    provide: repository,
  }
}
