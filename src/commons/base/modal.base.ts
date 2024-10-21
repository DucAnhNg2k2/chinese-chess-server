export class BaseModal<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }
}
