import { Guild } from 'src/domain/entities/guild.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class GuildWriteRepository extends EsdbRepository<Guild> {}
