
interface Identifiable {
  readonly id: string;
}

export interface Game extends Identifiable {
  readonly i18n: string;
}

export class GameRepository {

  private readonly allGames: Game[] = [
    {id: '40k', i18n: 'game.40k'},
    {id: 'aos', i18n: 'game.aos'},
  ];

  private readonly myGames: Game[] = [];

  findMyGames(): Game[] {
    return this.myGames;
  }

  findAllGames(): Game[] {
    return this.allGames;
  }
}
