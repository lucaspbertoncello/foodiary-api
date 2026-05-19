import { Profile } from "@application/entities/profile.entity";

export class ProfileItem {
  private readonly keys: ProfileItem.Keys;
  private readonly type: ProfileItem.EntityType = "Profile";

  constructor(private readonly attr: ProfileItem.Attributes) {
    const { accountId } = attr;

    this.keys = {
      PK: ProfileItem.getPk({ accountId }),
      SK: ProfileItem.getSk({ accountId }),
    };
  }

  public static fromEntity(profile: Profile) {
    return new ProfileItem({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      birthDate: profile.birthDate.toISOString(),
    });
  }

  public toItem(): ProfileItem.ItemType {
    return {
      ...this.keys,
      ...this.attr,
      type: this.type,
    };
  }

  public toEntity(attr: ProfileItem.Attributes): Profile {
    return new Profile({
      ...attr,
      birthDate: new Date(attr.birthDate),
      createdAt: new Date(attr.createdAt),
    });
  }

  static getPk({ accountId }: { accountId: string }): ProfileItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSk({ accountId }: { accountId: string }): ProfileItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#PROFILE`;
  }
}

export namespace ProfileItem {
  export type EntityType = "Profile";

  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    createdAt: string;
  };

  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}#PROFILE`;
  };

  export type ItemType = Attributes & Keys & { type: EntityType };
}
