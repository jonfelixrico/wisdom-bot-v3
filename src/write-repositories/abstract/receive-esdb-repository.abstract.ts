import { Receive } from 'src/domain/receive/receive.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class ReceiveEsdbRepository extends EsdbRepository<Receive> {}
