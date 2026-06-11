import KSUID from "ksuid";

export class Meal {
  public readonly id: string;
  public readonly accountId: string;
  public status: Meal.Status;
  public readonly inputType: Meal.InputType;
  public readonly inputFileKey: string;
  public attempts: number;
  public name: string;
  public icons: string;
  public foods: Meal.Food[];
  public readonly createdAt: Date;

  constructor(attr: Meal.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;

    this.accountId = attr.accountId;
    this.status = attr.status;
    this.inputType = attr.inputType;
    this.attempts = attr.attempts ?? 0;
    this.inputFileKey = attr.inputFileKey;
    this.name = attr.name ?? "";
    this.icons = attr.icons ?? "";
    this.foods = attr.foods ?? [];

    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Meal {
  export type Attributes = {
    id?: string;
    accountId: string;
    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
    name?: string;
    attempts?: number;
    icons?: string;
    foods?: Meal.Food[];
    createdAt?: Date;
  };

  export type Food = {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };

  export enum Status {
    PENDING = "PENDING",
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
  }

  export enum InputType {
    AUDIO = "AUDIO",
    PICTURE = "PICTURE",
  }
}
