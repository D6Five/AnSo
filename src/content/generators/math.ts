/**
 * Procedural math problem generation.
 *
 * Each skill is a small function that turns a seeded RNG into one correctly
 * scoped problem. This is why the math constellation offers effectively
 * unlimited practice: a star replayed tomorrow gives new numbers at the same
 * difficulty, rather than the same forty problems memorised by Thursday.
 *
 * Word problems use girls' names and settings drawn from the family's world so
 * the maths feels like it belongs to them.
 */

import type { MathChallenge, MathGenerator, MathSkill } from '../../types';
import type { Rng } from '../../core/rng';

const NAMES = [
  'Ana', 'Sofia', 'Mia', 'Zoe', 'Lily', 'Nora', 'Ruby', 'Ivy',
  'Hazel', 'Clara', 'Esther', 'Naomi', 'Priya', 'Amara', 'June',
];

const THINGS = [
  'stickers', 'seashells', 'crayons', 'marbles', 'acorns', 'buttons',
  'grapes', 'pencils', 'ribbons', 'stars', 'pebbles', 'flowers',
];

interface Built {
  expression: string;
  answer: number;
  prompt: string;
  hint: string;
  teach: string;
}

/* ------------------------------------------------------------------ */
/* Individual skills                                                   */
/* ------------------------------------------------------------------ */

function addWithin(rng: Rng, max: number): Built {
  const a = rng.int(1, max - 1);
  const b = rng.int(1, max - a);
  return {
    expression: `${a} + ${b}`,
    answer: a + b,
    prompt: `What is ${a} plus ${b}?`,
    hint: `Start at ${a} and count up ${b} more.`,
    teach: `${a} plus ${b} makes ${a + b}.`,
  };
}

function subWithin(rng: Rng, max: number): Built {
  const a = rng.int(2, max);
  const b = rng.int(1, a);
  return {
    expression: `${a} − ${b}`,
    answer: a - b,
    prompt: `What is ${a} minus ${b}?`,
    hint: `Start at ${a} and count back ${b}.`,
    teach: `${a} take away ${b} leaves ${a - b}.`,
  };
}

function addTwoDigit(rng: Rng): Built {
  const a = rng.int(11, 89);
  const b = rng.int(11, 99 - a > 10 ? 99 - a : 40);
  return {
    expression: `${a} + ${b}`,
    answer: a + b,
    prompt: `What is ${a} plus ${b}?`,
    hint: `Add the tens first, then the ones.`,
    teach: `${a} plus ${b} is ${a + b}.`,
  };
}

function subTwoDigit(rng: Rng): Built {
  const a = rng.int(20, 99);
  const b = rng.int(10, a - 1);
  return {
    expression: `${a} − ${b}`,
    answer: a - b,
    prompt: `What is ${a} minus ${b}?`,
    hint: `You can count up from ${b} to ${a} if that is easier.`,
    teach: `${a} minus ${b} is ${a - b}.`,
  };
}

function addThreeDigit(rng: Rng): Built {
  const a = rng.int(101, 899);
  const b = rng.int(101, 999 - a > 100 ? 999 - a : 400);
  return {
    expression: `${a} + ${b}`,
    answer: a + b,
    prompt: `What is ${a} plus ${b}?`,
    hint: `Stack them in your head: hundreds, then tens, then ones.`,
    teach: `${a} plus ${b} equals ${a + b}.`,
  };
}

function subThreeDigit(rng: Rng): Built {
  const a = rng.int(200, 999);
  const b = rng.int(100, a - 1);
  return {
    expression: `${a} − ${b}`,
    answer: a - b,
    prompt: `What is ${a} minus ${b}?`,
    hint: `Regroup if the top digit is smaller than the bottom one.`,
    teach: `${a} minus ${b} equals ${a - b}.`,
  };
}

function skipCount(rng: Rng): Built {
  const step = rng.pick([2, 5, 10, 3, 4]);
  const start = step * rng.int(1, 6);
  const shown = [start, start + step, start + step * 2, start + step * 3];
  const answer = start + step * 4;
  return {
    expression: `${shown.join(', ')}, ?`,
    answer,
    prompt: `Keep the pattern going. ${shown.join(', ')} — what comes next?`,
    hint: `Each number goes up by ${step}.`,
    teach: `Counting by ${step}s, the next number is ${answer}.`,
  };
}

function missingAddend(rng: Rng, max: number): Built {
  const total = rng.int(5, max);
  const known = rng.int(1, total - 1);
  return {
    expression: `${known} + ? = ${total}`,
    answer: total - known,
    prompt: `${known} plus what makes ${total}?`,
    hint: `Count up from ${known} until you reach ${total}.`,
    teach: `${known} plus ${total - known} makes ${total}.`,
  };
}

function compare(rng: Rng, max: number): Built {
  const a = rng.int(1, max);
  let b = rng.int(1, max);
  if (b === a) b = a === max ? a - 1 : a + 1;
  const bigger = Math.max(a, b);
  return {
    expression: `${a}  ?  ${b}`,
    answer: bigger,
    prompt: `Which number is bigger, ${a} or ${b}?`,
    hint: `The bigger number is the one further along when you count.`,
    teach: `${bigger} is the bigger number.`,
  };
}

function placeValue(rng: Rng, threeDigit: boolean): Built {
  const n = threeDigit ? rng.int(100, 999) : rng.int(10, 99);
  const digits = String(n).split('').map(Number);
  const places = threeDigit ? ['hundreds', 'tens', 'ones'] : ['tens', 'ones'];
  const idx = rng.int(0, places.length - 1);
  return {
    expression: `${n}`,
    answer: digits[idx],
    prompt: `In the number ${n}, which digit is in the ${places[idx]} place?`,
    hint: `Read the number from the right: ones, then tens, then hundreds.`,
    teach: `In ${n}, the ${places[idx]} digit is ${digits[idx]}.`,
  };
}

function multFacts(rng: Rng): Built {
  const a = rng.int(2, 10);
  const b = rng.int(2, 10);
  return {
    expression: `${a} × ${b}`,
    answer: a * b,
    prompt: `What is ${a} times ${b}?`,
    hint: `Think of ${a} groups with ${b} in each group.`,
    teach: `${a} times ${b} is ${a * b}.`,
  };
}

function divFacts(rng: Rng): Built {
  const b = rng.int(2, 10);
  const answer = rng.int(2, 10);
  const a = b * answer;
  return {
    expression: `${a} ÷ ${b}`,
    answer,
    prompt: `What is ${a} divided by ${b}?`,
    hint: `How many groups of ${b} fit inside ${a}?`,
    teach: `${a} divided by ${b} is ${answer}, because ${b} times ${answer} is ${a}.`,
  };
}

function multTwoDigit(rng: Rng): Built {
  const a = rng.int(11, 25);
  const b = rng.int(2, 9);
  return {
    expression: `${a} × ${b}`,
    answer: a * b,
    prompt: `What is ${a} times ${b}?`,
    hint: `Break ${a} apart: multiply the tens, then the ones, then add.`,
    teach: `${a} times ${b} is ${a * b}.`,
  };
}

function rounding(rng: Rng): Built {
  const n = rng.int(11, 989);
  const toHundred = rng.chance(0.4);
  const unit = toHundred ? 100 : 10;
  const answer = Math.round(n / unit) * unit;
  return {
    expression: `${n} → nearest ${unit}`,
    answer,
    prompt: `Round ${n} to the nearest ${unit}.`,
    hint: `Look at the digit just to the right. Five or more rounds up.`,
    teach: `${n} rounded to the nearest ${unit} is ${answer}.`,
  };
}

function fractionsCompare(rng: Rng): Built {
  const den = rng.pick([2, 3, 4, 5, 6, 8]);
  const a = rng.int(1, den - 1);
  let b = rng.int(1, den - 1);
  if (b === a) b = a === 1 ? a + 1 : a - 1;
  const bigger = Math.max(a, b);
  return {
    expression: `${a}/${den}  ?  ${b}/${den}`,
    answer: bigger,
    prompt: `Which is bigger: ${a} ${den}ths or ${b} ${den}ths? Say the top number of the bigger one.`,
    hint: `The pieces are the same size, so more pieces means more.`,
    teach: `${bigger}/${den} is bigger, because it has more of the same-sized pieces.`,
  };
}

function fractionsEquivalent(rng: Rng): Built {
  const den = rng.pick([2, 3, 4, 5]);
  const num = rng.int(1, den - 1);
  const factor = rng.int(2, 4);
  return {
    expression: `${num}/${den} = ?/${den * factor}`,
    answer: num * factor,
    prompt: `${num} over ${den} equals how many over ${den * factor}?`,
    hint: `The bottom was multiplied by ${factor}, so the top must be too.`,
    teach: `${num}/${den} is the same as ${num * factor}/${den * factor}.`,
  };
}

function areaPerimeter(rng: Rng): Built {
  const w = rng.int(2, 12);
  const h = rng.int(2, 12);
  const wantArea = rng.chance(0.5);
  return wantArea
    ? {
        expression: `${w} × ${h} rectangle`,
        answer: w * h,
        prompt: `A rectangle is ${w} units wide and ${h} units tall. What is its area?`,
        hint: `Area means the space inside: multiply width by height.`,
        teach: `The area is ${w} times ${h}, which is ${w * h} square units.`,
      }
    : {
        expression: `${w} × ${h} rectangle`,
        answer: 2 * (w + h),
        prompt: `A rectangle is ${w} units wide and ${h} units tall. What is its perimeter?`,
        hint: `Perimeter is the walk all the way around the outside.`,
        teach: `The perimeter is ${w} plus ${h} plus ${w} plus ${h}, which is ${2 * (w + h)} units.`,
      };
}

function elapsedTime(rng: Rng): Built {
  const startHour = rng.int(1, 11);
  const startMin = rng.pick([0, 15, 30, 45]);
  const addMin = rng.pick([15, 30, 45, 60, 90]);
  const total = startMin + addMin;
  const endHour = ((startHour + Math.floor(total / 60) - 1) % 12) + 1;
  const endMin = total % 60;
  const fmt = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;
  return {
    expression: `${fmt(startHour, startMin)} + ${addMin} min`,
    answer: endMin,
    prompt: `It is ${fmt(startHour, startMin)}. In ${addMin} minutes it will be ${endHour} o'clock something — how many minutes past?`,
    hint: `Count forward in chunks: first to the next hour, then the rest.`,
    teach: `${addMin} minutes after ${fmt(startHour, startMin)} is ${fmt(endHour, endMin)}.`,
  };
}

function money(rng: Rng, simple: boolean): Built {
  if (simple) {
    const coins = rng.int(2, 5);
    const value = rng.pick([5, 10, 25]);
    return {
      expression: `${coins} × ${value}¢`,
      answer: coins * value,
      prompt: `You have ${coins} coins worth ${value} cents each. How many cents is that?`,
      hint: `Count by ${value}s, ${coins} times.`,
      teach: `${coins} coins of ${value} cents is ${coins * value} cents.`,
    };
  }
  const price = rng.int(15, 85);
  const paid = rng.pick([100, 200]);
  return {
    expression: `${paid}¢ − ${price}¢`,
    answer: paid - price,
    prompt: `Something costs ${price} cents and you pay with ${paid} cents. How much change?`,
    hint: `Count up from ${price} to ${paid}.`,
    teach: `The change is ${paid - price} cents.`,
  };
}

function wordProblem(rng: Rng, grade3: boolean): Built {
  const name = rng.pick(NAMES);
  const thing = rng.pick(THINGS);

  if (!grade3) {
    const start = rng.int(3, 12);
    const change = rng.int(1, 8);
    const gives = rng.chance(0.5) && change < start;
    const answer = gives ? start - change : start + change;
    return {
      expression: gives ? `${start} − ${change}` : `${start} + ${change}`,
      answer,
      prompt: gives
        ? `${name} had ${start} ${thing}. She gave ${change} to a friend. How many does she have now?`
        : `${name} had ${start} ${thing}. She found ${change} more. How many does she have now?`,
      hint: gives ? `Giving away means we take away.` : `Finding more means we add.`,
      teach: `${name} has ${answer} ${thing}.`,
    };
  }

  const groups = rng.int(3, 9);
  const each = rng.int(3, 9);
  const style = rng.int(0, 2);
  if (style === 0) {
    return {
      expression: `${groups} × ${each}`,
      answer: groups * each,
      prompt: `${name} packed ${groups} boxes with ${each} ${thing} in each box. How many ${thing} altogether?`,
      hint: `Equal groups means multiply.`,
      teach: `${groups} boxes of ${each} is ${groups * each} ${thing}.`,
    };
  }
  if (style === 1) {
    const total = groups * each;
    return {
      expression: `${total} ÷ ${groups}`,
      answer: each,
      prompt: `${name} shared ${total} ${thing} equally among ${groups} friends. How many did each friend get?`,
      hint: `Sharing equally means divide.`,
      teach: `Each friend got ${each} ${thing}.`,
    };
  }
  const a = rng.int(20, 80);
  const b = rng.int(10, 40);
  const c = rng.int(5, 20);
  return {
    expression: `${a} + ${b} − ${c}`,
    answer: a + b - c,
    prompt: `${name} collected ${a} ${thing} on Monday and ${b} more on Tuesday. She gave away ${c}. How many are left?`,
    hint: `Do it in order: add the two days first, then subtract.`,
    teach: `${a} plus ${b} is ${a + b}, minus ${c} leaves ${a + b - c}.`,
  };
}

/* ------------------------------------------------------------------ */
/* Dispatch                                                            */
/* ------------------------------------------------------------------ */

function build(skill: MathSkill, rng: Rng): Built {
  switch (skill) {
    case 'add-within-10': return addWithin(rng, 10);
    case 'add-within-20': return addWithin(rng, 20);
    case 'sub-within-10': return subWithin(rng, 10);
    case 'sub-within-20': return subWithin(rng, 20);
    case 'add-two-digit': return addTwoDigit(rng);
    case 'sub-two-digit': return subTwoDigit(rng);
    case 'add-three-digit': return addThreeDigit(rng);
    case 'sub-three-digit': return subThreeDigit(rng);
    case 'skip-count': return skipCount(rng);
    case 'missing-addend': return missingAddend(rng, 20);
    case 'compare': return compare(rng, 100);
    case 'place-value': return placeValue(rng, rng.chance(0.5));
    case 'mult-facts': return multFacts(rng);
    case 'div-facts': return divFacts(rng);
    case 'mult-two-digit': return multTwoDigit(rng);
    case 'fractions-compare': return fractionsCompare(rng);
    case 'fractions-equivalent': return fractionsEquivalent(rng);
    case 'rounding': return rounding(rng);
    case 'area-perimeter': return areaPerimeter(rng);
    case 'elapsed-time': return elapsedTime(rng);
    case 'money': return money(rng, rng.chance(0.5));
    case 'word-problem': return wordProblem(rng, rng.chance(0.5));
  }
}

/** Plausible wrong answers — near misses, not random noise. */
function distractors(answer: number, rng: Rng): number[] {
  const candidates = new Set<number>();
  const offsets = [1, -1, 2, -2, 10, -10];
  while (candidates.size < 3) {
    const offset = rng.pick(offsets);
    const value = answer + offset;
    if (value >= 0 && value !== answer) candidates.add(value);
    // Guard against tiny answers where offsets keep colliding.
    if (candidates.size < 3 && rng.chance(0.2)) candidates.add(answer + rng.int(3, 12));
  }
  return [...candidates].slice(0, 3);
}

export function generateMath(
  spec: MathGenerator,
  count: number,
  rng: Rng,
  idPrefix: string,
): MathChallenge[] {
  const out: MathChallenge[] = [];
  for (let i = 0; i < count; i++) {
    // Cycle through the skills so a star covers all of them evenly.
    const skill = spec.skills[i % spec.skills.length];
    const built = build(skill, rng);

    const challenge: MathChallenge = {
      kind: 'math',
      id: `${idPrefix}_m${i}`,
      expression: built.expression,
      answer: built.answer,
      prompt: built.prompt,
      hint: built.hint,
      teach: built.teach,
    };

    if (spec.multipleChoice) {
      challenge.options = rng.shuffle([built.answer, ...distractors(built.answer, rng)]);
    }
    out.push(challenge);
  }
  return out;
}
