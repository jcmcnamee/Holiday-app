'use strict';
import lookup from "country-code-lookup";

export function isoToCountry (locations) {
    for (let location of locations) {
        location.country = lookup.byIso(location.country).country;
    };
    return locations
};

