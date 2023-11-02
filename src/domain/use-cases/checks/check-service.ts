interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>
}

export class CheckService implements CheckServiceUseCase {
  public async execute(url: string): Promise<boolean> {
    try {
      const request = await fetch(url);

      if (!request.ok) throw new Error(`Error on check service ${url}`);

      console.log(`${url} is ok`);
      return true;
    } catch (error) {

      console.log(`${error}`);
      return false;
    }
  }
}
