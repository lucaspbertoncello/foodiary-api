import { Constructor } from "@shared/@types/constructor.type";

export class Registry {
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private constructor() {}

  // { "HelloController": { impl: HelloController } }
  private readonly providers = new Map<string, Registry.Provider>();
  private static instance: Registry | undefined;

  // registra a funcao construtora no provider
  public register(impl: Constructor): void {
    const token = impl.name;

    if (this.providers.has(token)) {
      throw new Error(`${token} is already registered.`);
    }

    // quando usamos o decorator em uma classe, o typescript automaticamente injeta esse metadata nela
    // nele temos os parametros que sao enviados no Constructor, ou seja, as dependencias da classe
    // [HelloUseCase]
    // inclusive o esbuild do serverless nao faz verificacao de tipos, nem injecao de metadados. entao sem uma config personalizada, isso aqui nao funciona
    const deps: Constructor[] = Reflect.getMetadata("design:paramtypes", impl) ?? [];

    // EXTRA: por esse motivo que o @Injectable() não funciona com inversão de dependências. Buscamos ali a classe concreta nas dependências, não uma abstração

    // registramos a classe e suas dependencias
    this.providers.set(token, { impl, deps });
  }

  // o metodo resolve serve para instanciar a classe base e injetar suas dependencias:
  // new Controller(new UseCase(new NotificationProvider()))
  public resolve<TImpl extends Constructor>(impl: TImpl): InstanceType<TImpl> {
    const token = impl.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`${token} is not registered`);
    }

    // aqui implementamos uma recursao para resolver as dependencias da impl do provider
    // this.resolve() retorna uma instancia, entao pegamos a instancia de CADA dependencia da classe pra depois injetarmos nela
    const deps = provider.deps.map((constructor) => this.resolve(constructor)); // [new Dep(), new Dep(), new Dep()]
    const instance = new provider.impl(...deps);

    return instance; // new HelloController()
  }
}

// FLUXO
// 1. .resolve(HelloController)
// 2. busca seu registro no provider (classe e dependencias)
// 3. itera sobre cada dependencia no construtor e chama o this.resolve
// 4. this.resolve basicamente verifica se uma classe esta registrada, e retorna sua instancia com as dependencias
// 5. deps retorna um array de classes
// 6. retornamos a instancia com tudo injetado

export namespace Registry {
  // { impl: HelloController, deps: [HelloUseCase, HelloUseCase2] }
  export type Provider = { impl: Constructor; deps: Constructor[] };
}
