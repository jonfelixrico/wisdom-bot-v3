import { Receive } from 'src/domain/entities/receive.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class PendingQuoteWriteRepository extends EsdbRepository<Receive> {}
