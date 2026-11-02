/**
 * PLACEHOLDER astrology service.
 * No ephemeris is called. Chart geometry is filled only from the published
 * fictional sample. Every other profile receives an explicit "not computed" model.
 * Replace with an AstrologyService that calls your calculation API.
 */
import { LANGUAGES } from '../content/site';
import {
  EXAMPLE_AYANAMSHA,
  EXAMPLE_DASHA,
  EXAMPLE_DASHA_SUMMARY,
  EXAMPLE_DISCLAIMER,
  EXAMPLE_GRAHAS,
  EXAMPLE_LAGNA,
  EXAMPLE_PROFILE_ID,
  PUBLISHED_QUESTION,
  PUBLISHED_READING,
} from './exampleData';
import type { AstrologyService, BirthProfile, ChartHouse, ChartModel, DashaModel, GrahaMark, Varga } from './types';

const SIGNS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'] as const;

const SOUTH_SIGNS = SIGNS;

function languageName(code: BirthProfile['language']) {
  return LANGUAGES.find((language) => language.code === code)?.label ?? 'English';
}

function d1Houses(): ChartHouse[] {
  const lagnaIndex = SIGNS.indexOf('Makara');
  return SIGNS.map((sign, index) => {
    const house = ((index - lagnaIndex + 12) % 12) + 1;
    const grahas: GrahaMark[] = EXAMPLE_GRAHAS.filter((graha) => graha.sign === sign).map(({ name, short, detail }) => ({ name, short, detail }));
    return { house, sign, grahas, lagna: house === 1 };
  }).sort((a, b) => a.house - b.house);
}

function emptyHouses(): ChartHouse[] {
  return Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    sign: null,
    grahas: [],
    lagna: false,
  }));
}

function signCells(houses: ChartHouse[] | null): ChartModel['signs'] {
  return SOUTH_SIGNS.map((sign) => {
    const match = houses?.find((house) => house.sign === sign);
    return { sign, grahas: match?.grahas ?? [], lagna: match?.lagna ?? false };
  });
}

function chartForExample(varga: Varga): ChartModel {
  if (varga === 'D1') {
    const houses = d1Houses();
    return {
      varga,
      example: true,
      lagnaLabel: EXAMPLE_LAGNA,
      ayanamsha: EXAMPLE_AYANAMSHA,
      houses,
      signs: signCells(houses),
      notice: `${EXAMPLE_DISCLAIMER} Sign order is the zodiac counted from the published Makara lagna. Grahas the sample does not print are left blank.`,
    };
  }
  const label = varga === 'D9' ? 'Navamsha' : 'Dashamsha';
  return {
    varga,
    example: true,
    lagnaLabel: null,
    ayanamsha: EXAMPLE_AYANAMSHA,
    houses: emptyHouses(),
    signs: signCells(null),
    notice: `${label} (${varga}) positions are not included in the published example. The frame is the chart view only. AstrologyService.chart() would fill it from an ephemeris. No divisional longitudes are invented here.`,
  };
}

function chartForProfile(profile: BirthProfile, varga: Varga): ChartModel {
  return {
    varga,
    example: false,
    lagnaLabel: null,
    ayanamsha: null,
    houses: emptyHouses(),
    signs: signCells(null),
    notice: `No chart was computed for ${profile.name}. This preview does not run the Swiss Ephemeris. Connect AstrologyService.chart() to render ${varga} from these birth details.`,
  };
}

const publishedBody = [
  PUBLISHED_QUESTION,
  '',
  `${PUBLISHED_READING.title} · ${PUBLISHED_READING.support}`,
  PUBLISHED_READING.window,
  '',
  `Parashari · BPHS — ${PUBLISHED_READING.parashari}`,
  '',
  `Jaimini · Chara Dasha & AL — ${PUBLISHED_READING.jaimini}`,
  '',
  `KP · Cuspal Sub-Lord Timing — ${PUBLISHED_READING.kp}`,
  '',
  `Shastric guidance — ${PUBLISHED_READING.guidance}`,
  '',
  EXAMPLE_DISCLAIMER,
].join('\n');

export const astrology: AstrologyService = {
  chart(profile, varga) {
    if (profile.id === EXAMPLE_PROFILE_ID || profile.example) return chartForExample(varga);
    return chartForProfile(profile, varga);
  },

  dasha(profile): DashaModel {
    if (profile.example || profile.id === EXAMPLE_PROFILE_ID) {
      return {
        example: true,
        available: true,
        summary: EXAMPLE_DASHA_SUMMARY,
        tree: EXAMPLE_DASHA,
        notice: `${EXAMPLE_DISCLAIMER} Only the Mahadasha, Antardasha, and Pratyantar named in that sample are shown. The rest of the Vimshottari sequence is not invented.`,
      };
    }
    return {
      example: false,
      available: false,
      summary: 'Dasha sequence not computed',
      tree: null,
      notice: `Vimshottari Mahadasha, Antardasha, and Pratyantar for ${profile.name} are not calculated in this preview. AstrologyService.dasha() is the seam for that sequence.`,
    };
  },

  consult({ profile, question, language }) {
    const asked = question.trim();
    const showExample = (profile.example || profile.id === EXAMPLE_PROFILE_ID) && asked.toLowerCase() === PUBLISHED_QUESTION.toLowerCase();
    if (showExample) {
      return { kind: 'published-example', title: 'Published example · not your chart', body: publishedBody };
    }
    const lang = languageName(language);
    return {
      kind: 'notice',
      title: 'No reading computed',
      body: [
        `Question stored in ${lang}. This preview does not spend a credit and does not generate a prediction.`,
        '',
        'A connected AstrologyService.consult() would return a dated synthesis in three parts:',
        'Parashari · Vimshottari window — not computed',
        'Jaimini · Chara Dasha check — not computed',
        'KP · cuspal sub-lord timing — not computed',
        '',
        profile.example
          ? 'The fictional Aarav Verma sample has one published career reading. Use “Show published example” to quote it. Other questions are left unanswered on purpose.'
          : 'Birth details are saved with the profile. They are not sent to an ephemeris.',
      ].join('\n'),
    };
  },

  rectify(input) {
    const recorded = input.milestones
      .filter((milestone) => milestone.event.trim() || milestone.year.trim())
      .map((milestone, index) => `Milestone ${index + 1}: ${milestone.event.trim() || '—'} (${milestone.year.trim() || 'year not given'})`)
      .join(' ');
    return {
      changed: false,
      headline: 'Birth time unchanged',
      detail: `Preview only. No Tattva, Kunda, or Navamsha boundary was calculated, and no candidate minute is shown. Uncertainty noted: ±${input.uncertaintyMinutes} min. ${recorded ? `Recorded with the request — ${recorded}` : 'No milestone text was entered.'} AstrologyService.rectify() would return a calibrated time.`,
    };
  },
};
