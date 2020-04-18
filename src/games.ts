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
import { IRouteableComponent } from '@aurelia/router';
import { Enableable } from './model/common';
import { Game, GameRepository } from './model/game';

interface GameButton extends Game, Enableable {
}

function gameComparator(): (a: Game, b: Game) => number {
  return (a, b) => a.display.localeCompare(b.display);
}
export class Games implements IRouteableComponent {
  addIsActive: boolean = false;
  games: GameButton[] = [];
  myGames: Game[] = [];
  constructor(private readonly repo: GameRepository, @ILogger private readonly log: ILogger) {
  }

  add(game: GameButton) {
    this.log.debug('add', game.id);
    game.enabled = false;
    this.myGames.push(game);
    this.myGames.sort(gameComparator());
  }

  remove(game: GameButton) {
    this.log.debug('remove', game.id);
    game.enabled = true;
    this.myGames.splice(this.myGames.findIndex((g) => _.isEqual(g, game)), 1);
  }

  async enter(): Promise<void> {
    this.myGames = this.repo.findMyGames();
    this.games = (await this.repo.findAll()).map((game) => {
      return {
        ...game,
        enabled: !this.myGames.some((g) => _.isEqual(g, game)),
      };
    }).sort(gameComparator());
  }

}
