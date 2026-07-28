import type { Star } from '../../types';
import { buildVocabStar, type VocabStarSpec } from '../vocabBuilder';

/**
 * Grade 3 vocabulary — 10 stars, 6 words each. Tier-two words: the ones that
 * show up across every subject rather than belonging to just one, which is
 * where vocabulary instruction gives the most return at this age.
 */

const specs: VocabStarSpec[] = [
  {
    id: 'g3_vocab_01',
    grade: 3,
    title: 'Words for Thinking',
    blurb: 'Words that describe what your mind is doing.',
    minutes: 12,
    words: [
      {
        word: 'analyze',
        meaning: 'to look at something closely, piece by piece, to understand it',
        cloze: 'Let us ____ this problem before we try to solve it.',
        decoys: ['to ignore something completely', 'to build something quickly', 'to memorize word for word'],
      },
      {
        word: 'assume',
        meaning: 'to believe something is true without checking it',
        cloze: 'Do not ____ she is upset — go and ask her.',
        decoys: ['to prove with evidence', 'to write down carefully', 'to ask a direct question'],
        note: 'Assuming is not the same as knowing. That gap causes most arguments.',
      },
      {
        word: 'evidence',
        meaning: 'facts that show whether something is true',
        cloze: 'What ____ do you have for that claim?',
        decoys: ['a strong feeling', 'a popular opinion', 'a good guess'],
      },
      {
        word: 'conclude',
        meaning: 'to decide something after thinking it through',
        cloze: 'From the tracks in the snow, we can ____ a deer walked past.',
        decoys: ['to begin an experiment', 'to forget on purpose', 'to ask for help'],
      },
      {
        word: 'perspective',
        meaning: 'the particular way one person sees a thing',
        cloze: 'From her ____, the number looked like a nine.',
        decoys: ['a type of measuring tool', 'a written rule', 'the middle of a story'],
      },
      {
        word: 'reasonable',
        meaning: 'sensible and fair, based on good thinking',
        cloze: 'That is a ____ explanation for the noise.',
        decoys: ['wildly unlikely', 'extremely expensive', 'completely silent'],
      },
    ],
  },
  {
    id: 'g3_vocab_02',
    grade: 3,
    title: 'Words for Describing People',
    blurb: 'Precise words beat vague ones. "Nice" tells me almost nothing.',
    minutes: 12,
    words: [
      {
        word: 'considerate',
        meaning: 'careful about how your actions affect other people',
        cloze: 'It was ____ of her to keep her voice down while he slept.',
        decoys: ['loud and careless', 'good at sports', 'quick to anger'],
      },
      {
        word: 'stubborn',
        meaning: 'refusing to change your mind, even with good reason',
        cloze: 'He was too ____ to admit he had taken a wrong turn.',
        decoys: ['easily convinced', 'always cheerful', 'very forgetful'],
      },
      {
        word: 'determined',
        meaning: 'refusing to give up on something you have decided to do',
        cloze: 'She was ____ to finish the whole book that week.',
        decoys: ['quick to quit', 'unsure of everything', 'happy to be lazy'],
        note: 'Determined and stubborn look similar from outside. The difference is whether you are right.',
      },
      {
        word: 'sincere',
        meaning: 'honest and real in what you say and feel',
        cloze: 'Her apology was ____, and he could tell.',
        decoys: ['fake and pretend', 'shouted loudly', 'written down'],
      },
      {
        word: 'humble',
        meaning: 'not thinking you are better than other people',
        cloze: 'She won every race and stayed ____ about it.',
        decoys: ['bragging constantly', 'very wealthy', 'physically small'],
      },
      {
        word: 'reliable',
        meaning: 'able to be counted on to do what you said',
        cloze: 'He is ____ — if he says he will be there, he will.',
        decoys: ['always changing plans', 'often late', 'good at telling jokes'],
      },
    ],
  },
  {
    id: 'g3_vocab_03',
    grade: 3,
    title: 'Science Words',
    blurb: 'Words that show up in every science book you will ever read.',
    minutes: 12,
    words: [
      {
        word: 'observe',
        meaning: 'to watch carefully and notice details',
        cloze: 'Scientists ____ what happens before they explain why.',
        decoys: ['to guess without looking', 'to build a machine', 'to write a story'],
      },
      {
        word: 'experiment',
        meaning: 'a careful test to find out whether an idea is true',
        cloze: 'They ran an ____ with seeds in space.',
        decoys: ['a firm conclusion', 'a type of report', 'a set of instructions'],
      },
      {
        word: 'predict',
        meaning: 'to say what you think will happen before it does',
        cloze: 'Can you ____ what will happen when we add the water?',
        decoys: ['to describe the past', 'to measure exactly', 'to repeat an action'],
      },
      {
        word: 'absorb',
        meaning: 'to soak something up and take it in',
        cloze: 'The roots ____ water from the soil.',
        decoys: ['to push something away', 'to reflect back', 'to break into pieces'],
      },
      {
        word: 'gradual',
        meaning: 'happening slowly, a little at a time',
        cloze: 'The change in the seasons is ____.',
        decoys: ['instant and sudden', 'never happening', 'happening backwards'],
      },
      {
        word: 'reaction',
        meaning: 'what happens in response to something else',
        cloze: 'Mixing those two caused a bubbling ____.',
        decoys: ['a careful plan', 'a type of container', 'a written record'],
      },
    ],
  },
  {
    id: 'g3_vocab_04',
    grade: 3,
    title: 'Words About Words',
    blurb: 'The words you need to talk about reading and writing.',
    minutes: 12,
    words: [
      {
        word: 'theme',
        meaning: 'the big idea or lesson underneath a story',
        cloze: 'The ____ of that story is that kindness costs something.',
        decoys: ['the name of the main character', 'the number of pages', 'where the story happens'],
      },
      {
        word: 'summarize',
        meaning: 'to tell the main points briefly in your own words',
        cloze: 'Can you ____ the chapter in three sentences?',
        decoys: ['to retell every detail', 'to read it aloud', 'to copy it exactly'],
      },
      {
        word: 'persuade',
        meaning: 'to convince someone to agree with you',
        cloze: 'She wrote a letter to ____ the class to recycle.',
        decoys: ['to describe neutrally', 'to argue with yourself', 'to ask a question'],
      },
      {
        word: 'describe',
        meaning: 'to tell what something is like using details',
        cloze: 'Can you ____ the room you walked into?',
        decoys: ['to argue against it', 'to count it up', 'to hide it'],
      },
      {
        word: 'opinion',
        meaning: 'what someone thinks or believes, which others might disagree with',
        cloze: 'That the book is boring is an ____, not a fact.',
        decoys: ['something proven true', 'a measurement', 'a scientific law'],
        note: 'Facts can be checked. Opinions can be argued. Knowing which is which is a superpower.',
      },
      {
        word: 'quotation',
        meaning: 'the exact words someone said, copied word for word',
        cloze: 'She used a ____ from the passage to prove her point.',
        decoys: ['a summary in your own words', 'a made-up example', 'a page number'],
      },
    ],
  },
  {
    id: 'g3_vocab_05',
    grade: 3,
    title: 'Words for Difficulty',
    blurb: 'Precise words for when things are hard.',
    minutes: 12,
    words: [
      {
        word: 'obstacle',
        meaning: 'something in the way that makes progress harder',
        cloze: 'The fallen tree was the only ____ on the trail.',
        decoys: ['a clear open road', 'a helpful friend', 'a finished project'],
      },
      {
        word: 'persist',
        meaning: 'to keep going even when it is hard',
        cloze: 'She chose to ____ until the bridge finally held.',
        decoys: ['to give up quickly', 'to start over from scratch', 'to ask someone else'],
      },
      {
        word: 'frustrated',
        meaning: 'upset because something is not working',
        cloze: 'He was ____ after the third try failed.',
        decoys: ['calm and satisfied', 'sleepy and slow', 'proud of a success'],
      },
      {
        word: 'complicated',
        meaning: 'having many parts that are hard to keep track of',
        cloze: 'The instructions were too ____ to follow at first.',
        decoys: ['extremely simple', 'very short', 'brightly colored'],
      },
      {
        word: 'overcome',
        meaning: 'to succeed against something that was blocking you',
        cloze: 'She worked all winter to ____ her fear of the water.',
        decoys: ['to be defeated by', 'to avoid entirely', 'to forget about'],
      },
      {
        word: 'patience',
        meaning: 'the ability to wait or keep trying without getting upset',
        cloze: 'Growing anything from seed takes ____.',
        decoys: ['a need for speed', 'a bad temper', 'a lot of money'],
      },
    ],
  },
  {
    id: 'g3_vocab_06',
    grade: 3,
    title: 'Space and Distance',
    blurb: 'Words for the very large and the very far.',
    minutes: 12,
    words: [
      {
        word: 'galaxy',
        meaning: 'a huge group of billions of stars held together by gravity',
        cloze: 'Our sun is one star in a ____ called the Milky Way.',
        decoys: ['a single bright star', 'a small moon', 'the space between planets'],
      },
      {
        word: 'gravity',
        meaning: 'the force that pulls objects toward each other',
        cloze: '____ keeps the moon circling the Earth.',
        decoys: ['the heat from the sun', 'the speed of light', 'the color of a star'],
      },
      {
        word: 'atmosphere',
        meaning: 'the layer of gases surrounding a planet',
        cloze: 'Earth\'s ____ protects us from most falling rocks.',
        decoys: ['the rocky core inside', 'the water on the surface', 'a planet\'s moon'],
      },
      {
        word: 'astronomer',
        meaning: 'a scientist who studies stars, planets, and space',
        cloze: 'An ____ discovered the comet last year.',
        decoys: ['a person who flies to space', 'someone who predicts the future', 'a maker of telescopes'],
        note: 'An astronomer studies space from here. An astronaut goes there.',
      },
      {
        word: 'immense',
        meaning: 'enormously large',
        cloze: 'The distance between stars is ____.',
        decoys: ['barely noticeable', 'exactly average', 'shrinking quickly'],
      },
      {
        word: 'rotate',
        meaning: 'to spin around a center point',
        cloze: 'Earth takes twenty-four hours to ____ once.',
        decoys: ['to travel in a straight line', 'to stop completely', 'to grow larger'],
      },
    ],
  },
  {
    id: 'g3_vocab_07',
    grade: 3,
    title: 'Words for Groups and Amounts',
    blurb: 'How much, how many, and how they fit together.',
    minutes: 12,
    words: [
      {
        word: 'majority',
        meaning: 'more than half of a group',
        cloze: 'The ____ of the class voted for the museum trip.',
        decoys: ['exactly one person', 'less than half', 'nobody at all'],
      },
      {
        word: 'estimate',
        meaning: 'a careful guess about an amount',
        cloze: 'Can you ____ how many beans are in the jar?',
        decoys: ['an exact count', 'a perfect measurement', 'a written receipt'],
      },
      {
        word: 'sufficient',
        meaning: 'enough for what is needed',
        cloze: 'We have ____ paint to finish the wall.',
        decoys: ['far too little', 'wildly too much', 'completely used up'],
      },
      {
        word: 'various',
        meaning: 'several different kinds',
        cloze: 'The shelf held ____ books about space.',
        decoys: ['all exactly the same', 'only one', 'none at all'],
      },
      {
        word: 'entire',
        meaning: 'the whole thing, with nothing left out',
        cloze: 'She read the ____ book in one weekend.',
        decoys: ['a small piece of', 'about half of', 'the outside of'],
      },
      {
        word: 'gather',
        meaning: 'to collect things into one place',
        cloze: 'Let us ____ the evidence before deciding.',
        decoys: ['to scatter widely', 'to throw away', 'to break apart'],
      },
    ],
  },
  {
    id: 'g3_vocab_08',
    grade: 3,
    title: 'Words That Connect Ideas',
    blurb: 'Small words that do enormous work in a sentence.',
    minutes: 12,
    words: [
      {
        word: 'however',
        meaning: 'used to show the next idea goes against the one before',
        cloze: 'She practiced daily. ____, the race did not go as planned.',
        decoys: ['used to add a similar idea', 'used to give an example', 'used to show time passing'],
      },
      {
        word: 'therefore',
        meaning: 'used to show something is the result of what came before',
        cloze: 'The tracks led to the river. ____, the deer went that way.',
        decoys: ['used to show a contrast', 'used to change the subject', 'used to ask a question'],
      },
      {
        word: 'although',
        meaning: 'used to admit something before saying the opposite',
        cloze: '____ she was frightened, she looked out the window anyway.',
        decoys: ['used to state a result', 'used to list items', 'used to show agreement'],
      },
      {
        word: 'instead',
        meaning: 'in place of something else',
        cloze: 'She did not shout. ____, she waited quietly.',
        decoys: ['in addition to that', 'because of that', 'at the same time'],
      },
      {
        word: 'meanwhile',
        meaning: 'at the same time as something else',
        cloze: 'Amara counted seconds. ____, her grandmother searched for candles.',
        decoys: ['much later on', 'long before', 'as a result'],
      },
      {
        word: 'finally',
        meaning: 'after a long time or as the last step',
        cloze: 'She thought hard, and ____ found a simpler way to say it.',
        decoys: ['at the very start', 'immediately', 'by accident'],
      },
    ],
  },
  {
    id: 'g3_vocab_09',
    grade: 3,
    title: 'Words for Change',
    blurb: 'Precise words for things becoming different.',
    minutes: 12,
    words: [
      {
        word: 'transform',
        meaning: 'to change completely into something different',
        cloze: 'A caterpillar will ____ into a butterfly.',
        decoys: ['to stay exactly the same', 'to move to a new place', 'to grow slightly larger'],
      },
      {
        word: 'increase',
        meaning: 'to become greater in amount',
        cloze: 'The salt in the ocean continues to ____.',
        decoys: ['to become smaller', 'to disappear entirely', 'to stay level'],
      },
      {
        word: 'reduce',
        meaning: 'to make smaller in amount',
        cloze: 'We can ____ waste by using both sides of the paper.',
        decoys: ['to make much larger', 'to keep unchanged', 'to buy more of'],
      },
      {
        word: 'develop',
        meaning: 'to grow or improve over time',
        cloze: 'Her handwriting will ____ with practice.',
        decoys: ['to shrink away', 'to happen instantly', 'to break down'],
      },
      {
        word: 'replace',
        meaning: 'to put something new where the old one was',
        cloze: 'We had to ____ the broken window.',
        decoys: ['to keep the old one', 'to add a second one', 'to remove entirely'],
      },
      {
        word: 'permanent',
        meaning: 'lasting forever, not meant to change',
        cloze: 'Use pencil first — pen is ____.',
        decoys: ['lasting a short time', 'easily undone', 'changing constantly'],
      },
    ],
  },
  {
    id: 'g3_vocab_10',
    grade: 3,
    title: 'Words Worth Knowing',
    blurb: 'The last word star. These six are the ones I would most want you to keep.',
    minutes: 12,
    words: [
      {
        word: 'curiosity',
        meaning: 'the strong desire to find out and understand',
        cloze: 'Her ____ led her to ask the question nobody else asked.',
        decoys: ['a lack of interest', 'a fear of new things', 'a need for quiet'],
      },
      {
        word: 'integrity',
        meaning: 'doing the right thing even when nobody is watching',
        cloze: 'Telling the truth when no one saw takes ____.',
        decoys: ['being good at sports', 'having many friends', 'winning an argument'],
      },
      {
        word: 'empathy',
        meaning: 'understanding how someone else feels',
        cloze: 'Walking around the fence gave her ____ for the other view.',
        decoys: ['feeling sorry for yourself', 'ignoring other people', 'being very clever'],
      },
      {
        word: 'resilient',
        meaning: 'able to recover and keep going after something hard',
        cloze: 'The bridge fell, but the engineers were ____ and rebuilt better.',
        decoys: ['easily broken forever', 'unwilling to try', 'afraid of everything'],
      },
      {
        word: 'wisdom',
        meaning: 'knowing not just facts, but what to do with them',
        cloze: 'Knowing many words is knowledge. Knowing which to use is ____.',
        decoys: ['remembering many facts', 'reading very quickly', 'being the oldest'],
        note: 'Knowledge is having the pieces. Wisdom is knowing how they fit.',
      },
      {
        word: 'humility',
        meaning: 'being willing to admit you might be wrong',
        cloze: 'It takes ____ to say "I do not know, let us find out."',
        decoys: ['being certain always', 'refusing to listen', 'talking the loudest'],
      },
    ],
  },
];

export const grade3Vocabulary: Star[] = specs.map(buildVocabStar);
