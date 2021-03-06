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
import { IRouteableComponent } from '@aurelia/router';
import { Comparator, Enableable } from './model/common';
import { Game, GameRepository } from './model/game';

interface GameButton extends Game, Enableable {}

export class Games implements IRouteableComponent {
  title = 'Games';
  addIsActive = false;
  games: GameButton[] = [];
  myGames: Game[] = [];
  constructor(
    private readonly repo: GameRepository,
    @ILogger private readonly log: ILogger,
    @I18N private readonly i18n: I18N
  ) {}

  close(): void {
    this.log.debug('closing');
    this.addIsActive = false;
    this.myGames.sort(Comparator.translatable(this.i18n));
  }

  add(game: GameButton): void {
    this.log.debug('add', game.id);
    game.enabled = false;
    this.myGames.push(game);
    this.log.debug('mygames', this.myGames);
  }

  remove(game: GameButton): void {
    this.log.debug('remove', game.id);
    game.enabled = true;
    this.myGames.splice(
      this.myGames.findIndex((g) => _.isEqual(g, game)),
      1
    );
  }
  async enter(): Promise<void> {
    this.myGames = this.repo.findMyGames();
    const games = await this.repo.findAll();
    this.games = games
      .map((game) => {
        return {
          ...game,
          enabled: !this.myGames.some((g) => _.isEqual(g, game)),
        };
      })
      .sort(Comparator.translatable(this.i18n));
  }
}
