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

import { I18N } from '@aurelia/i18n';

export interface Identifiable {
  readonly id: string;
}

export interface Enableable {
  enabled: boolean;
}

export interface Translatable {
  readonly i18n: string;
}

function translatableComparator(
  i18n: I18N
): (a: Translatable, b: Translatable) => number {
  return function (a: Translatable, b: Translatable): number {
    return i18n.tr(a.i18n).localeCompare(i18n.tr(b.i18n));
  };
}

export const Comparator = {
  translatable(i18n: I18N) {
    return translatableComparator(i18n);
  },
};
