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
import LinkHeader from 'http-link-header';
import pkg from '../../package.json';
import { Identifiable, Translatable } from './common';

export interface Game extends Identifiable, Translatable {}

interface GitHubRepo {
  readonly name: string;
}

export class GameRepository {
  private readonly myGames: Game[] = [];
  constructor(@ILogger private readonly log: ILogger) {}

  findMyGames(): Game[] {
    return this.myGames;
  }

  async findAll(): Promise<Game[]> {
    const userAgent = `${pkg.name}/${pkg.version}`;
    const repos: GitHubRepo[] = [];
    let uri: string | undefined = 'https://api.github.com/users/BSData/repos';
    do {
      const fetched = await fetch(uri, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
        },
        cache: 'force-cache',
      });
      for (const [k, v] of fetched.headers.entries()) {
        this.log.debug('header', k, v);
      }
      repos.push(...(await fetched.json()));
      const link = fetched.headers.get('Link') ?? undefined;
      if (link) {
        const parsed = LinkHeader.parse(link);
        uri = parsed.rel('next')[0]?.uri;
      } else {
        uri = undefined;
      }
    } while (uri);

    const blacklist: string[] = [
      'bsdata',
      'catalogue-development',
      'check-datafiles',
      'publish-catpkg',
      'schemas',
      'status',
    ];
    return repos
      .map((r) => {
        return {
          id: r.name,
          i18n: `game.${r.name}`,
        };
      })
      .filter((g) => !blacklist.includes(g.id));
  }
}
