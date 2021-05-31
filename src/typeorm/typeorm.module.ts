import { Module } from '@nestjs/common'
import { typeormProviders } from './typeorm.provider'

@Module({
  providers: typeormProviders,
  exports: typeormProviders,
})
export class TypeormModule {}
