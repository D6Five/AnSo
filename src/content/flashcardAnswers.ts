/**
 * Acceptable ways to define each vocabulary word in a child's own words.
 *
 * Matching (`core/match.ts`) is lenient — it accepts a short phrase found
 * inside a longer answer, or a longer answer that contains a short one — so
 * each entry is a handful of different simple phrasings rather than the exact
 * dictionary definition. A child who gets the idea right in her own words
 * should never be marked wrong for not using the textbook wording.
 */

export const FLASHCARD_ACCEPT: Record<string, string[]> = {
  // Words for Thinking
  analyze: ['look closely', 'study it piece by piece', 'examine carefully', 'break it down to understand'],
  assume: ['believe without checking', 'think its true without proof', 'guess without checking', 'take it as true without asking'],
  evidence: ['facts that prove something', 'proof', 'facts that show its true', 'something that proves it'],
  conclude: ['decide after thinking', 'figure out the answer', 'come to a decision', 'decide based on clues'],
  perspective: ['how someone sees things', 'ones point of view', 'the way you look at something', 'point of view'],
  reasonable: ['makes sense', 'sensible and fair', 'fair and sensible', 'a fair idea'],

  // Words for Describing People
  considerate: ['thinks about others feelings', 'careful of other people', 'thoughtful of others', 'kind and thoughtful'],
  stubborn: ['wont change their mind', 'refuses to give in', 'set in their ways', 'hard headed'],
  determined: ['wont give up', 'keeps trying no matter what', 'stays focused on a goal', 'never quits'],
  sincere: ['honest and real', 'means what they say', 'truly honest', 'not fake'],
  humble: ['doesnt brag', 'not stuck up', 'modest', 'doesnt think theyre better'],
  reliable: ['you can count on them', 'always keeps their word', 'dependable', 'does what they say'],

  // Science Words
  observe: ['watch closely', 'look carefully and notice', 'pay close attention', 'watch and notice details'],
  experiment: ['a test to check an idea', 'a scientific test', 'testing something to see', 'a careful test'],
  predict: ['guess what will happen', 'say what happens next before it does', 'make a guess about the future', 'forecast what happens'],
  absorb: ['soak it up', 'take it in', 'suck it up like a sponge', 'take in liquid'],
  gradual: ['happens slowly', 'little by little', 'slow change over time', 'bit by bit'],
  reaction: ['what happens because of something', 'a response to something', 'something that happens back', 'happens in response'],

  // Words About Words
  theme: ['the main lesson of a story', 'the big idea of a story', 'what the story is really about', 'the message of the story'],
  summarize: ['tell the main points shortly', 'give a short version', 'sum it up', 'retell it briefly'],
  persuade: ['convince someone', 'get someone to agree with you', 'talk someone into something', 'change someones mind to agree'],
  describe: ['tell what something is like', 'explain with details', 'give details about something', 'paint a picture with words'],
  opinion: ['what someone thinks', 'a belief that could be argued', 'your own view on something', 'not a fact, just a view'],
  quotation: ['the exact words someone said', 'copying words exactly', 'word for word from the text', 'exact words from the book'],

  // Words for Difficulty
  obstacle: ['something blocking your way', 'a thing that gets in the way', 'a problem stopping you', 'something in your path'],
  persist: ['keep going even when hard', 'dont give up', 'keep trying', 'push through difficulty'],
  frustrated: ['upset because it isnt working', 'annoyed when something fails', 'mad because it wont work', 'upset when stuck'],
  complicated: ['hard to understand with many parts', 'confusing with lots of pieces', 'has many hard parts', 'not simple, has many parts'],
  overcome: ['beat something hard', 'get past a problem', 'succeed over a challenge', 'win against a difficulty'],
  patience: ['being able to wait calmly', 'not getting upset while waiting', 'staying calm while you wait', 'waiting without complaining'],

  // Space and Distance
  galaxy: ['a huge group of stars', 'billions of stars together', 'a big cluster of stars', 'many stars held by gravity'],
  gravity: ['the force that pulls things together', 'what pulls you down', 'the pull between objects', 'the force that pulls down'],
  atmosphere: ['the air around a planet', 'the layer of gas around earth', 'gases surrounding a planet', 'the sky layer around a planet'],
  astronomer: ['a scientist who studies space', 'someone who studies stars and planets', 'a space scientist', 'studies stars for a living'],
  immense: ['extremely huge', 'really really big', 'gigantic', 'super large'],
  rotate: ['spin around', 'turn in a circle', 'spin around a center', 'go around and around'],

  // Words for Groups and Amounts
  majority: ['more than half', 'most of the group', 'the bigger part of a group', 'over half of everyone'],
  estimate: ['a careful guess', 'guessing about how much', 'a smart guess at a number', 'roughly guessing an amount'],
  sufficient: ['enough', 'just the right amount needed', 'as much as you need', 'plenty for what you need'],
  various: ['different kinds', 'many different types', 'a few different sorts', 'several different ones'],
  entire: ['the whole thing', 'all of it', 'everything, nothing left out', 'the complete thing'],
  gather: ['collect things together', 'bring things into one place', 'round things up', 'put things together in one spot'],

  // Words That Connect Ideas
  however: ['shows a contrast', 'means but', 'shows the opposite happened', 'introduces something different than before'],
  therefore: ['shows a result', 'means so or because of that', 'introduces the outcome', 'shows what happened because of something'],
  although: ['means even though', 'admits something then says the opposite', 'shows a contrast at the start', 'means despite that'],
  instead: ['in place of something', 'rather than that', 'as a replacement', 'swapped for something else'],
  meanwhile: ['at the same time', 'while something else happens', 'happening at once with something else', 'during the same time'],
  finally: ['at last', 'after a long time', 'the last step', 'in the end'],

  // Words for Change
  transform: ['change completely', 'turn into something totally different', 'become something new', 'completely change form'],
  increase: ['get bigger in amount', 'go up in number', 'become more', 'grow larger in amount'],
  reduce: ['make smaller', 'lower the amount', 'cut down in size', 'decrease the amount'],
  develop: ['grow or get better over time', 'improve slowly', 'get better with practice', 'grow over time'],
  replace: ['swap the old for a new one', 'put a new one in place of the old', 'switch out the old one', 'take out and put in new'],
  permanent: ['lasts forever', 'never changes', 'stays that way for good', 'not temporary'],

  // Words Worth Knowing
  curiosity: ['wanting to find out and learn', 'strong wish to know things', 'being curious about things', 'wanting to explore and understand'],
  integrity: ['doing whats right even alone', 'being honest when no one is watching', 'doing the right thing always', 'honest even when unseen'],
  empathy: ['understanding someone elses feelings', 'feeling what someone else feels', 'putting yourself in their shoes', 'knowing how another person feels'],
  resilient: ['bounces back after hard times', 'recovers and keeps going', 'doesnt stay down after failing', 'able to recover from difficulty'],
  wisdom: ['knowing what to do with what you know', 'good judgment from experience', 'knowing how to use knowledge well', 'smart choices from experience'],
  humility: ['willing to admit youre wrong', 'not too proud to say sorry', 'admitting mistakes', 'staying modest about yourself'],
};
