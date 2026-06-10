import { Profile } from "@application/entities/profile.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { ProfileRepository } from "@infra/database/dynamo/repositories/profile.repository";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async execute({
    accountId,
    activityLevel,
    birthDate,
    gender,
    goal,
    height,
    name,
    weight,
  }: UpdateProfileUseCase.Input): Promise<UpdateProfileUseCase.Output> {
    const profile = await this.profileRepository.findByAccountId({ accountId });

    if (!profile) {
      throw new ResourceNotFound({ message: "Profile not found" });
    }

    profile.birthDate = birthDate;
    profile.gender = gender;
    profile.goal = goal;
    profile.height = height;
    profile.name = name;
    profile.weight = weight;
    profile.activityLevel = activityLevel;

    await this.profileRepository.update(profile);
  }
}

export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string;
    name: string;
    birthDate: Date;
    activityLevel: Profile.ActivityLevel;
    gender: Profile.Gender;
    goal: Profile.Goal;
    height: number;
    weight: number;
  };
  export type Output = void;
}
