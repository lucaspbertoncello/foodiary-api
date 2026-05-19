export class Goal implements Goal.Attributes {
  public readonly accountId: string;
  public readonly id: string;
  public readonly calories: number;
  public readonly proteins: number;
  public readonly carbohydrates: number;
  public readonly fats: number;
  public readonly createdAt: Date;

  constructor(attr: Goal.Attributes) {
    this.accountId = attr.accountId;
    this.accountId = attr.accountId;
    this.id = attr.id;
    this.calories = attr.calories;
    this.proteins = attr.proteins;
    this.carbohydrates = attr.proteins;
    this.fats = attr.fats;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Goal {
  export type Attributes = {
    accountId: string;
    id: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt?: Date;
  };
}
