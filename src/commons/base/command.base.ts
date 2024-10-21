export interface CommandBase<T> {
  execute(dto: T): Promise<any>;
}
