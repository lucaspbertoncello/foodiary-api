import { Account } from "@application/entities/account";

export class AccountItem {
  private readonly keys: AccountItem.Keys;
  private readonly type: AccountItem.EntityType = "Account";

  constructor(private readonly attr: AccountItem.Attributes) {
    this.keys = {
      PK: AccountItem.getPk({ accountId: this.attr.id }),
      SK: AccountItem.getSk({ accountId: this.attr.id }),
      GSI1PK: AccountItem.getGSI1PK({ accountEmail: this.attr.email }),
      GSI1SK: AccountItem.getGSI1SK({ accountEmail: this.attr.email }),
    };
  }

  public static fromEntity(account: Account) {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  // metodo que retorna a receita correta para insercao no dynamo
  public toItem(): AccountItem.ItemType {
    return {
      ...this.keys,
      ...this.attr,
      type: this.type,
    };
  }

  // metodo que recebe a account no formato de ItemType, e transforma numa account de dominio
  public static toEntity(accountItem: AccountItem.ItemType): Account {
    return new Account({
      id: accountItem.id,
      createdAt: new Date(accountItem.createdAt),
      email: accountItem.email,
      externalId: accountItem.externalId,
    });
  }

  public static getPk({ accountId }: { accountId: string }): AccountItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  public static getSk({ accountId }: { accountId: string }): AccountItem.Keys["SK"] {
    return `ACCOUNT#${accountId}`;
  }

  public static getGSI1PK({ accountEmail }: { accountEmail: string }): AccountItem.Keys["GSI1PK"] {
    return `ACCOUNT#${accountEmail}`;
  }

  public static getGSI1SK({ accountEmail }: { accountEmail: string }): AccountItem.Keys["GSI1SK"] {
    return `ACCOUNT#${accountEmail}`;
  }
}

// temos 3 tipos de dados de attributes no nosso banco
// 1. tipo da entidade
// 2. atributos customizados da entidade especifica
// 3. chaves
export namespace AccountItem {
  export type EntityType = "Account";

  export type Attributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;
  };

  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  };

  export type ItemType = Keys & Attributes & { type: EntityType };
}
