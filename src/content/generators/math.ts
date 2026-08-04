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
  const a = rng.int(1, 12);
  const b = rng.int(1, 12);
  return {
    expression: `${a} × ${b}`,
    answer: a * b,
    prompt: `What is ${a} times ${b}?`,
    hint: `Think of ${a} groups with ${b} in each group.`,
    teach: `${a} times ${b} is ${a * b}.`,
  };
}

/**
 * One specific times table, e.g. "know your 7s". The fixed number lands on
 * either side at random, since 7 × 4 and 4 × 7 both belong to the 7 times
 * table and a child needs to recognise it either way round.
 */
function multTable(rng: Rng, table: number): Built {
  const other = rng.int(1, 12);
  const [a, b] = rng.chance(0.5) ? [table, other] : [other, table];
  return {
    expression: `${a} × ${b}`,
    answer: a * b,
    prompt: `What is ${a} times ${b}?`,
    hint: `This is the ${table} times table: count by ${table}s, ${other} times.`,
    teach: `${a} times ${b} is ${a * b}.`,
  };
}

/** A number times itself. Worth its own drill — squares turn up constantly. */
function multSquares(rng: Rng): Built {
  const a = rng.int(1, 12);
  return {
    expression: `${a} × ${a}`,
    answer: a * a,
    prompt: `What is ${a} times ${a}?`,
    hint: `${a} squared. Count ${a} groups of ${a}.`,
    teach: `${a} times ${a} is ${a * a}.`,
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

const PLACES = ['the park', 'the garden', 'the beach', 'her classroom', 'the library', 'her room'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Word problems for grade 1.
 *
 * Ten shapes rather than two, because the skill being practised is reading a
 * situation and deciding what to do with it — and a child who has seen the same
 * two sentences forty times is pattern-matching rather than reading. Numbers
 * stay inside 20 so the arithmetic never becomes the obstacle to the reading.
 */
function wordProblemEasy(rng: Rng): Built {
  const name = rng.pick(NAMES);
  const friend = rng.pick(NAMES.filter((n) => n !== rng.pick(NAMES)));
  const thing = rng.pick(THINGS);
  const place = rng.pick(PLACES);
  const day = rng.pick(DAYS);

  switch (rng.int(0, 9)) {
    case 0: {
      const start = rng.int(4, 14);
      const more = rng.int(2, 6);
      return {
        expression: `${start} + ${more}`,
        answer: start + more,
        prompt: `${name} had ${start} ${thing}. At ${place} she found ${more} more. How many does she have now?`,
        hint: 'Finding more means we add.',
        teach: `${start} and ${more} more makes ${start + more}.`,
      };
    }
    case 1: {
      const start = rng.int(6, 16);
      const gone = rng.int(2, 5);
      return {
        expression: `${start} − ${gone}`,
        answer: start - gone,
        prompt: `${name} had ${start} ${thing}. She gave ${gone} to ${friend}. How many are left?`,
        hint: 'Giving away means we take away.',
        teach: `${start} take away ${gone} leaves ${start - gone}.`,
      };
    }
    case 2: {
      const each = rng.int(2, 5);
      const groups = rng.int(2, 4);
      return {
        expression: `${groups} groups of ${each}`,
        answer: each * groups,
        prompt: `${name} has ${groups} baskets. Each basket holds ${each} ${thing}. How many ${thing} altogether?`,
        hint: `Count by ${each}s, ${groups} times.`,
        teach: `${groups} groups of ${each} is ${each * groups}.`,
      };
    }
    case 3: {
      const total = rng.int(8, 18);
      const some = rng.int(3, total - 2);
      return {
        expression: `${some} + ? = ${total}`,
        answer: total - some,
        prompt: `${name} needs ${total} ${thing} for a project. She already has ${some}. How many more does she need?`,
        hint: `Count up from ${some} to ${total}.`,
        teach: `She needs ${total - some} more.`,
      };
    }
    case 4: {
      const mine = rng.int(3, 10);
      const extra = rng.int(2, 6);
      return {
        expression: `${mine} + ${extra}`,
        answer: mine + extra,
        prompt: `${name} has ${mine} ${thing}. ${friend} has ${extra} more than ${name}. How many does ${friend} have?`,
        hint: '"More than" means we add.',
        teach: `${friend} has ${mine + extra}.`,
      };
    }
    case 5: {
      const big = rng.int(9, 18);
      const small = rng.int(2, 7);
      return {
        expression: `${big} − ${small}`,
        answer: big - small,
        prompt: `${name} has ${big} ${thing} and ${friend} has ${small}. How many more does ${name} have?`,
        hint: '"How many more" means we find the difference.',
        teach: `${big} minus ${small} is ${big - small} more.`,
      };
    }
    case 6: {
      const a = rng.int(2, 7);
      const b = rng.int(2, 7);
      const c = rng.int(2, 6);
      return {
        expression: `${a} + ${b} + ${c}`,
        answer: a + b + c,
        prompt: `${name} picked ${a} ${thing} on ${day}, ${b} the next day, and ${c} the day after. How many in all?`,
        hint: 'Add the first two, then add the last one.',
        teach: `${a} plus ${b} is ${a + b}, plus ${c} makes ${a + b + c}.`,
      };
    }
    case 7: {
      const total = rng.int(10, 20);
      const eaten = rng.int(3, 8);
      return {
        expression: `${total} − ${eaten}`,
        answer: total - eaten,
        prompt: `There were ${total} ${thing} in a bowl. ${name} and ${friend} took ${eaten} altogether. How many are still in the bowl?`,
        hint: 'Taken away means subtract.',
        teach: `${total} minus ${eaten} leaves ${total - eaten}.`,
      };
    }
    case 8: {
      const pairs = rng.int(2, 6);
      return {
        expression: `${pairs} × 2`,
        answer: pairs * 2,
        prompt: `${name} lined up ${pairs} pairs of shoes. How many shoes is that?`,
        hint: 'A pair means two.',
        teach: `${pairs} pairs is ${pairs * 2} shoes.`,
      };
    }
    default: {
      const start = rng.int(8, 16);
      const lost = rng.int(2, 5);
      const found = rng.int(1, 4);
      return {
        expression: `${start} − ${lost} + ${found}`,
        answer: start - lost + found,
        prompt: `${name} had ${start} ${thing}. She lost ${lost} at ${place}, then found ${found} in her bag. How many now?`,
        hint: 'Two steps: take away first, then add.',
        teach: `${start} minus ${lost} is ${start - lost}, plus ${found} makes ${start - lost + found}.`,
      };
    }
  }
}

/** Word problems for grade 3. Multi-step, and the numbers can be awkward. */
function wordProblemHard(rng: Rng): Built {
  const name = rng.pick(NAMES);
  const friend = rng.pick(NAMES);
  const thing = rng.pick(THINGS);
  const day = rng.pick(DAYS);
  const groups = rng.int(3, 9);
  const each = rng.int(3, 9);

  switch (rng.int(0, 7)) {
    case 0:
      return {
        expression: `${groups} × ${each}`,
        answer: groups * each,
        prompt: `${name} packed ${groups} boxes with ${each} ${thing} in each box. How many ${thing} altogether?`,
        hint: 'Equal groups means multiply.',
        teach: `${groups} boxes of ${each} is ${groups * each}.`,
      };
    case 1:
      return {
        expression: `${groups * each} ÷ ${groups}`,
        answer: each,
        prompt: `${name} shared ${groups * each} ${thing} equally among ${groups} friends. How many did each friend get?`,
        hint: 'Sharing equally means divide.',
        teach: `Each friend got ${each}.`,
      };
    case 2: {
      const a = rng.int(20, 80);
      const b = rng.int(10, 40);
      const c = rng.int(5, 20);
      return {
        expression: `${a} + ${b} − ${c}`,
        answer: a + b - c,
        prompt: `${name} collected ${a} ${thing} on ${day} and ${b} more the next day. She gave away ${c}. How many are left?`,
        hint: 'Add the two days first, then subtract.',
        teach: `${a} plus ${b} is ${a + b}, minus ${c} leaves ${a + b - c}.`,
      };
    }
    case 3: {
      const price = rng.int(4, 12);
      const count = rng.int(3, 8);
      return {
        expression: `${count} × ${price}`,
        answer: count * price,
        prompt: `Each ${thing.replace(/s$/, '')} costs ${price} dollars. ${name} buys ${count} of them. What does she spend?`,
        hint: 'Same price each time means multiply.',
        teach: `${count} times ${price} is ${count * price} dollars.`,
      };
    }
    case 4: {
      const total = rng.int(40, 90);
      const per = rng.pick([4, 5, 6]);
      const full = Math.floor(total / per);
      return {
        expression: `${total} ÷ ${per}`,
        answer: full,
        prompt: `${name} has ${total} ${thing} and puts ${per} in each bag. How many bags does she fill completely?`,
        hint: 'Divide, and ignore anything left over.',
        teach: `She fills ${full} bags, with ${total - full * per} left over.`,
      };
    }
    case 5: {
      const start = rng.int(30, 70);
      const each2 = rng.int(3, 7);
      const days = rng.int(3, 6);
      return {
        expression: `${start} − ${each2} × ${days}`,
        answer: start - each2 * days,
        prompt: `${name} had ${start} ${thing}. She used ${each2} every day for ${days} days. How many are left?`,
        hint: 'Work out how many she used altogether first.',
        teach: `${each2} times ${days} is ${each2 * days}, and ${start} minus that is ${start - each2 * days}.`,
      };
    }
    case 6: {
      const mine = rng.int(12, 40);
      const times = rng.int(2, 4);
      return {
        expression: `${mine} × ${times}`,
        answer: mine * times,
        prompt: `${name} has ${mine} ${thing}. ${friend} has ${times} times as many. How many does ${friend} have?`,
        hint: '"Times as many" means multiply.',
        teach: `${mine} times ${times} is ${mine * times}.`,
      };
    }
    default: {
      const total = rng.int(50, 95);
      const part = rng.int(15, 40);
      return {
        expression: `${total} − ${part}`,
        answer: total - part,
        prompt: `${total} children came to the fair. ${part} of them were in the first group. How many were in the rest?`,
        hint: 'The rest means everyone who was not in that group.',
        teach: `${total} minus ${part} is ${total - part}.`,
      };
    }
  }
}

function wordProblem(rng: Rng, grade3: boolean): Built {
  return grade3 ? wordProblemHard(rng) : wordProblemEasy(rng);
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
    case 'mult-table-2': return multTable(rng, 2);
    case 'mult-table-3': return multTable(rng, 3);
    case 'mult-table-4': return multTable(rng, 4);
    case 'mult-table-5': return multTable(rng, 5);
    case 'mult-table-6': return multTable(rng, 6);
    case 'mult-table-7': return multTable(rng, 7);
    case 'mult-table-8': return multTable(rng, 8);
    case 'mult-table-9': return multTable(rng, 9);
    case 'mult-table-10': return multTable(rng, 10);
    case 'mult-table-11': return multTable(rng, 11);
    case 'mult-table-12': return multTable(rng, 12);
    case 'mult-squares': return multSquares(rng);
    case 'div-facts': return divFacts(rng);
    case 'mult-two-digit': return multTwoDigit(rng);
    case 'fractions-compare': return fractionsCompare(rng);
    case 'fractions-equivalent': return fractionsEquivalent(rng);
    case 'rounding': return rounding(rng);
    case 'area-perimeter': return areaPerimeter(rng);
    case 'elapsed-time': return elapsedTime(rng);
    case 'money': return money(rng, rng.chance(0.5));
    // Two explicit skills rather than one that picks at random. A grade 1 star
    // asking for word problems must never roll a multi-step grade 3 one.
    case 'word-problem': return wordProblem(rng, false);
    case 'word-problem-hard': return wordProblem(rng, true);
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
