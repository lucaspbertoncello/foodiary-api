import { Profile } from "@application/entities/profile.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { ProfileRepository } from "@infra/database/dynamo/repositories/profile.repository";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async execute({
    accountId,
    birthDate,
    gender,
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
    profile.height = height;
    profile.name = name;
    profile.weight = weight;

    await this.profileRepository.update(profile);
  }
}

export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
  };
  export type Output = void;
}
