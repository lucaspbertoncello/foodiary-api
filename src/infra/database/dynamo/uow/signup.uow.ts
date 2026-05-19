import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AccountRepository } from "../repositories/account.repository";
import { GoalRepository } from "../repositories/goal.repository";
import { ProfileRepository } from "../repositories/profile.repository";
import { UnitOfWork } from "./uow.contract";

@Injectable()
export class SignupUnitOfWork extends UnitOfWork<SignupUnitOfWork.RunParams> {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly accountRepository: AccountRepository,
    private readonly goalRepository: GoalRepository,
  ) {
    super();
  }

  public override async run({ account, goal, profile }: SignupUnitOfWork.RunParams) {
    this.addOperations(this.accountRepository.getPutCommandInput(account));
    this.addOperations(this.profileRepository.getPutCommandInput(profile));
    this.addOperations(this.goalRepository.getPutCommandInput(goal));

    await this.commit();
  }
}

export namespace SignupUnitOfWork {
  export type RunParams = { account: Account; goal: Goal; profile: Profile };
}
