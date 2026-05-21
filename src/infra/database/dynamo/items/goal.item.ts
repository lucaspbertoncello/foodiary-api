import { Goal } from "@application/entities/goal.entity";

export class GoalItem {
  private readonly keys: GoalItem.Keys;
  public static readonly type: GoalItem.EntityType = "Goal";

  constructor(private readonly attr: GoalItem.Attributes) {
    const { accountId } = attr;

    this.keys = {
      PK: GoalItem.getPk({ accountId }),
      SK: GoalItem.getSk({ accountId }),
    };
  }

  public static getInstanceFromEntity(goal: Goal) {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  public toItem(): GoalItem.ItemReturnType {
    return {
      ...this.keys,
      ...this.attr,
      type: GoalItem.type,
    };
  }

  public toDomain(attr: GoalItem.Attributes): Goal {
    return new Goal({
      ...attr,
      createdAt: new Date(attr.createdAt),
    });
  }

  static getPk({ accountId }: { accountId: string }): GoalItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSk({ accountId }: { accountId: string }): GoalItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {
  export type EntityType = "Goal";

  export type Attributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt: string;
  };

  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}#GOAL`;
  };

  export type ItemReturnType = Attributes & Keys & { type: EntityType };
}
