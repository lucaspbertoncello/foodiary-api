import { Meal } from "@application/entities/meal.entity";

export class MealItem {
  private readonly keys: MealItem.Keys;
  public static readonly type: MealItem.EntityType = "Meal";

  constructor(private readonly attr: MealItem.Attributes) {
    const { id: mealId, createdAt, accountId } = attr;

    this.keys = {
      PK: MealItem.getPk({ mealId }),
      SK: MealItem.getSk({ mealId }),
      GSI1PK: MealItem.getGSI1PK({ accountId, createdAt: new Date(createdAt) }),
      GSI1SK: MealItem.getGSI1SK({ mealId }),
    };
  }

  public static getInstanceFromEntity(meal: Meal) {
    return new MealItem({
      accountId: meal.accountId,
      attempts: meal.attempts,
      foods: meal.foods,
      createdAt: meal.createdAt.toISOString(),
      icons: meal.icons,
      id: meal.id,
      inputFileKey: meal.inputFileKey,
      inputType: meal.inputType,
      name: meal.name,
      status: meal.status,
    });
  }

  public toItem(): MealItem.ItemReturnType {
    return {
      ...this.keys,
      ...this.attr,
      type: MealItem.type,
    };
  }

  public toDomain(attr: MealItem.Attributes): Meal {
    return new Meal({
      ...attr,
      createdAt: new Date(attr.createdAt),
      attempts: 0,
    });
  }

  static getPk({ mealId }: { mealId: string }): MealItem.Keys["PK"] {
    return `MEAL#${mealId}`;
  }

  static getSk({ mealId }: { mealId: string }): MealItem.Keys["SK"] {
    return `MEAL#${mealId}`;
  }

  static getGSI1PK({
    accountId,
    createdAt,
  }: {
    accountId: string;
    createdAt: Date;
  }): MealItem.Keys["GSI1PK"] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(createdAt.getDay()).padStart(2, "0");

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK({ mealId }: { mealId: string }): MealItem.Keys["GSI1SK"] {
    return `MEAL#${mealId}`;
  }
}

export namespace MealItem {
  export type EntityType = "Meal";

  export type Attributes = {
    id: string;
    accountId: string;
    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
    attempts: number;
    name: string;
    icons: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type Keys = {
    PK: `MEAL#${string}`;
    SK: `MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${string}`;
    GSI1SK: `MEAL#${string}`;
  };

  export type ItemReturnType = Attributes & Keys & { type: EntityType };
}
