export class Missing {
  public static parameters = ["id"];
  public missingComponent?: string;

  public enter(parameters: any) {
    this.missingComponent = parameters.id;
  }
}
