import KSUID from "ksuid";

export class Account {
  public readonly id: string;
  public readonly email: string;
  public externalId: string;
  public readonly createdAt: Date;

  constructor(attr: Account.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.externalId = attr.externalId;
    this.email = attr.email;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Account {
  export type Attributes = {
    id?: string;
    email: string;
    externalId: string;
    createdAt?: Date;
  };
}
