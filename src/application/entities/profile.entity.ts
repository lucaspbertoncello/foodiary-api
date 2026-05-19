export class Profile {
  public readonly accountId: string;
  public readonly name: string;
  public readonly birthDate: Date;
  public readonly gender: Profile.Gender;
  public readonly height: number;
  public readonly weight: number;
  public readonly activityLevel: Profile.ActivityLevel;
  public readonly createdAt: Date;

  constructor(attr: Profile.Attributes) {
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.gender = attr.gender;
    this.height = attr.height;
    this.weight = attr.weight;
    this.activityLevel = attr.activityLevel;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: Date;
    activityLevel: ActivityLevel;
    gender: Gender;
    height: number;
    weight: number;
    createdAt?: Date;
  };

  export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
  }

  export enum ActivityLevel {
    SEDENTARY = "SEDENTARY",
    LIGHT = "LIGHT",
    MODERATE = "MODERATE",
    HEAVY = "HEAVY",
    ATHLETE = "ATHLETE",
  }
}
