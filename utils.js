'use strict';

import lookup from 'country-code-lookup';

export function isoToCountry(locations) {
  for (let location of locations) {
    location.countryFullName = lookup.byIso(location.country).country;
  }
  return locations;
}
