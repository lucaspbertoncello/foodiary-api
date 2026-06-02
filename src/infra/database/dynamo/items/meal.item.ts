import { Meal } from "@application/entities/meal.entity";

export class MealItem {
  private readonly keys: MealItem.Keys;
  public static readonly type: MealItem.EntityType = "Meal";

  constructor(private readonly attr: MealItem.Attributes) {
    const { id: mealId, createdAt, accountId } = attr;

    this.keys = {
      PK: MealItem.getPk({ mealId, accountId }),
      SK: MealItem.getSk({ mealId, accountId }),
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

  public static toDomain(attr: MealItem.Attributes): Meal {
    return new Meal({
      ...attr,
      createdAt: new Date(attr.createdAt),
      attempts: 0,
    });
  }

  static getPk({ mealId, accountId }: MealItem.PKParams): MealItem.Keys["PK"] {
    return `ACCOUNT#${accountId}MEAL#${mealId}`;
  }

  static getSk({ mealId, accountId }: MealItem.SKParams): MealItem.Keys["SK"] {
    return `ACCOUNT#${accountId}MEAL#${mealId}`;
  }

  static getGSI1PK({ accountId, createdAt }: MealItem.GSI1PKParams): MealItem.Keys["GSI1PK"] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(createdAt.getDate()).padStart(2, "0");

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK({ mealId }: MealItem.GSI1SKParams): MealItem.Keys["GSI1SK"] {
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
    PK: `ACCOUNT#${string}MEAL#${string}`;
    SK: `ACCOUNT#${string}MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${string}`;
    GSI1SK: `MEAL#${string}`;
  };

  export type ItemReturnType = Attributes & Keys & { type: EntityType };

  export type PKParams = { mealId: string; accountId: string };
  export type SKParams = { mealId: string; accountId: string };

  export type GSI1PKParams = { accountId: string; createdAt: Date };
  export type GSI1SKParams = { mealId: string };
}
