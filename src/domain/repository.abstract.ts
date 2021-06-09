export abstract class Repository<Entity> {
  abstract findById(id: string): Promise<Entity>
}
