export class Profile {
  public readonly accountId: string;
  public name: string;
  public birthDate: Date;
  public gender: Profile.Gender;
  public height: number;
  public weight: number;
  public goal: Profile.Goal;
  public activityLevel: Profile.ActivityLevel;
  public readonly createdAt: Date;

  constructor(attr: Profile.Attributes) {
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.gender = attr.gender;
    this.height = attr.height;
    this.weight = attr.weight;
    this.activityLevel = attr.activityLevel;
    this.goal = attr.goal;
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
    goal: Profile.Goal;
    createdAt?: Date;
  };

  export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
  }

  export enum Goal {
    GAIN = "GAIN",
    LOSE = "LOSE",
    MAINTAIN = "MAINTAIN",
  }

  export enum ActivityLevel {
    SEDENTARY = "SEDENTARY",
    LIGHT = "LIGHT",
    MODERATE = "MODERATE",
    HEAVY = "HEAVY",
    ATHLETE = "ATHLETE",
  }
}
