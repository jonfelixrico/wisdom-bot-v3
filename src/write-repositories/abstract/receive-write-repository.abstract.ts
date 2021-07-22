import { Receive } from 'src/domain/entities/receive.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class ReceiveWriteRepository extends EsdbRepository<Receive> {}
