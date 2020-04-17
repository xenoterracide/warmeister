
interface Identifiable {
    readonly id: string;
}

export interface Game extends Identifiable {
    readonly i18n: string;
}

export class GameRepository {

    private readonly allGames: Array<Game> = [
        {id: '40k', i18n: '40k'},
        {id: 'aos', i18n: 'aos'},
    ];

    private readonly myGames: Array<Game> = [];

    findMyGames(): Array<Game> {
        return this.myGames;
    }

    findAllGames(): Array<Game> {
        return this.allGames;
    }
}
