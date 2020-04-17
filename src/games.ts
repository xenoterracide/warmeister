/**
 * Copyright (C) 2020 Caleb Cushing <xenoterracide@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ILogger } from 'aurelia';
import _ from 'lodash';
import { I18N } from '@aurelia/i18n';
import { Game, GameRepository } from './model/games';

interface GameButton {
    readonly i18n: string;
    inMyGames: boolean;
    readonly id: string;
}

function sortGames(i18n: I18N): (a: GameButton, b: GameButton) => number {
    return function (a: GameButton, b: GameButton): number {
        return (a.inMyGames == b.inMyGames ? 0 : -1) || i18n.tr(a.i18n).localeCompare(i18n.tr(b.i18n));
    };
}

export class Games {
    private games: GameButton[];
    private myGames: Game[];
    constructor(private readonly repo: GameRepository, @I18N private readonly i18n: I18N, @ILogger private readonly log: ILogger) {
        this.myGames = repo.findMyGames();
        this.games = repo.findAllGames().map((game) => {
            return {
                id: game.id,
                i18n: 'game.' + game.i18n,
                inMyGames: this.myGames.some((g) => _.isEqual(g, game)),
            };
        }).sort(sortGames(this.i18n));
    }

    toggleMyGames(game: GameButton) {
        this.log.debug('toggling game', game.i18n);
        game.inMyGames = !game.inMyGames;
        this.games = this.games.sort(sortGames(this.i18n));
    }

}
