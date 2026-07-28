import type { Star } from '../../types';
import { buildVocabStar, type VocabStarSpec } from '../vocabBuilder';

/**
 * Grade 1 vocabulary — 10 stars, 6 words each, grouped by theme so related
 * words reinforce one another. Definitions are written the way you would say
 * them out loud to a six-year-old, because AnSo reads them aloud.
 */

const specs: VocabStarSpec[] = [
  {
    id: 'g1_vocab_01',
    grade: 1,
    title: 'Feeling Words',
    blurb: 'Words for what happens inside you.',
    minutes: 11,
    words: [
      {
        word: 'joyful',
        meaning: 'very happy, all the way through',
        cloze: 'She was ____ when she saw the puppy.',
        decoys: ['very tired and sleepy', 'a little bit cold', 'quiet and still'],
      },
      {
        word: 'nervous',
        meaning: 'worried about something that is coming',
        cloze: 'I felt ____ before my first day of school.',
        decoys: ['very fast', 'full of food', 'sure about everything'],
      },
      {
        word: 'proud',
        meaning: 'glad about something good you did',
        cloze: 'She was ____ that she tied her own shoes.',
        decoys: ['sorry about a mistake', 'hungry for lunch', 'lost in a big store'],
      },
      {
        word: 'gentle',
        meaning: 'soft and careful, not rough',
        cloze: 'Be ____ when you hold the baby bird.',
        decoys: ['loud and fast', 'angry at someone', 'far away'],
      },
      {
        word: 'curious',
        meaning: 'wanting very much to know',
        cloze: 'She was ____ about what was in the box.',
        decoys: ['bored by everything', 'ready to sleep', 'sure she was right'],
      },
      {
        word: 'grateful',
        meaning: 'thankful for something you were given',
        cloze: 'I am ____ for my warm bed.',
        decoys: ['upset about a gift', 'unsure what to do', 'faster than before'],
      },
    ],
  },
  {
    id: 'g1_vocab_02',
    grade: 1,
    title: 'Sky Words',
    blurb: 'Words for the things above your head.',
    minutes: 11,
    words: [
      {
        word: 'orbit',
        meaning: 'the path something takes as it goes around something else',
        cloze: 'The moon travels in an ____ around Earth.',
        decoys: ['a hole in the ground', 'a kind of loud noise', 'the top of a hill'],
        note: 'Orbit is a path, not a place. The moon is always on the move.',
      },
      {
        word: 'glow',
        meaning: 'to give off a soft light',
        cloze: 'The stars ____ in the dark sky.',
        decoys: ['to fall down fast', 'to be very cold', 'to make a loud sound'],
      },
      {
        word: 'vast',
        meaning: 'very, very big',
        cloze: 'Space is ____ and full of stars.',
        decoys: ['very small', 'nearly empty of air', 'made of stone'],
      },
      {
        word: 'distant',
        meaning: 'very far away',
        cloze: 'That ____ star took years to send its light to us.',
        decoys: ['close enough to touch', 'brand new', 'broken in half'],
      },
      {
        word: 'shimmer',
        meaning: 'to shine with a light that wobbles',
        cloze: 'The water began to ____ in the sunlight.',
        decoys: ['to sink slowly', 'to grow taller', 'to become silent'],
      },
      {
        word: 'journey',
        meaning: 'a long trip from one place to another',
        cloze: 'We are on a ____ through the stars.',
        decoys: ['a short nap', 'a kind of meal', 'a small room'],
      },
    ],
  },
  {
    id: 'g1_vocab_03',
    grade: 1,
    title: 'Doing Words',
    blurb: 'Strong words for things you can do.',
    minutes: 11,
    words: [
      {
        word: 'discover',
        meaning: 'to find something out for the first time',
        cloze: 'Let us ____ what is inside this shell.',
        decoys: ['to lose something', 'to close a door', 'to sit down slowly'],
      },
      {
        word: 'wander',
        meaning: 'to walk slowly with no set plan',
        cloze: 'We like to ____ through the garden.',
        decoys: ['to run in a straight line', 'to shout loudly', 'to fall asleep'],
      },
      {
        word: 'gather',
        meaning: 'to bring things together into one place',
        cloze: 'Let us ____ all the leaves in a pile.',
        decoys: ['to throw things apart', 'to hide alone', 'to break something'],
      },
      {
        word: 'whisper',
        meaning: 'to talk in a very soft voice',
        cloze: 'You have to ____ in the library.',
        decoys: ['to yell as loud as you can', 'to sing a fast song', 'to stay silent'],
      },
      {
        word: 'balance',
        meaning: 'to hold steady without falling',
        cloze: 'She can ____ on one foot for ten seconds.',
        decoys: ['to fall down on purpose', 'to run very fast', 'to lie flat'],
      },
      {
        word: 'protect',
        meaning: 'to keep something safe from harm',
        cloze: 'A helmet will ____ your head.',
        decoys: ['to break something on purpose', 'to give away', 'to forget about'],
      },
    ],
  },
  {
    id: 'g1_vocab_04',
    grade: 1,
    title: 'Size and Shape',
    blurb: 'Words that tell us how big, how small, how wide.',
    minutes: 11,
    words: [
      {
        word: 'tiny',
        meaning: 'extremely small',
        cloze: 'An ant is a ____ creature.',
        decoys: ['taller than a house', 'very heavy', 'made of glass'],
      },
      {
        word: 'enormous',
        meaning: 'extremely large',
        cloze: 'A whale is an ____ animal.',
        decoys: ['smaller than a bug', 'very quiet', 'nearly invisible'],
      },
      {
        word: 'narrow',
        meaning: 'not wide, close together on the sides',
        cloze: 'We walked down a ____ path between the trees.',
        decoys: ['very wide open', 'high in the air', 'colored bright red'],
      },
      {
        word: 'curved',
        meaning: 'bending, not straight',
        cloze: 'The road was ____ like the letter C.',
        decoys: ['perfectly straight', 'broken in two', 'standing still'],
      },
      {
        word: 'hollow',
        meaning: 'empty on the inside',
        cloze: 'The owl lived in a ____ tree.',
        decoys: ['packed full of rocks', 'painted green', 'very sharp'],
      },
      {
        word: 'steep',
        meaning: 'going up or down very sharply',
        cloze: 'The hill was too ____ to ride down.',
        decoys: ['flat and level', 'warm to touch', 'made of water'],
      },
    ],
  },
  {
    id: 'g1_vocab_05',
    grade: 1,
    title: 'Kindness Words',
    blurb: 'Words for how we treat each other.',
    minutes: 11,
    words: [
      {
        word: 'patient',
        meaning: 'able to wait without getting upset',
        cloze: 'She was ____ while her sister finished her turn.',
        decoys: ['always in a rush', 'unkind to others', 'very loud'],
      },
      {
        word: 'honest',
        meaning: 'telling the truth even when it is hard',
        cloze: 'He was ____ and said he broke the cup.',
        decoys: ['saying things that are not true', 'very fast at running', 'good at drawing'],
      },
      {
        word: 'forgive',
        meaning: 'to stop being angry at someone who was sorry',
        cloze: 'She chose to ____ her friend.',
        decoys: ['to stay angry forever', 'to run away', 'to give a present'],
      },
      {
        word: 'include',
        meaning: 'to let someone join in with you',
        cloze: 'Let us ____ her in our game.',
        decoys: ['to leave someone out', 'to hide from someone', 'to laugh at someone'],
      },
      {
        word: 'comfort',
        meaning: 'to help someone feel better when they are sad',
        cloze: 'She sat close to ____ her friend.',
        decoys: ['to make someone cry', 'to walk away', 'to shout at someone'],
      },
      {
        word: 'generous',
        meaning: 'happy to give and share',
        cloze: 'It was ____ of him to share his snack.',
        decoys: ['keeping everything', 'always hungry', 'good at math'],
      },
    ],
  },
  {
    id: 'g1_vocab_06',
    grade: 1,
    title: 'Weather Words',
    blurb: 'Words for what the sky is doing today.',
    minutes: 11,
    words: [
      {
        word: 'breeze',
        meaning: 'a light, gentle wind',
        cloze: 'A cool ____ moved through the trees.',
        decoys: ['a heavy rock', 'a warm blanket', 'a loud bang'],
      },
      {
        word: 'drizzle',
        meaning: 'very light rain',
        cloze: 'It was only a ____, so we still went outside.',
        decoys: ['bright sunshine', 'thick snow', 'strong wind'],
      },
      {
        word: 'thunder',
        meaning: 'the loud sound that comes after lightning',
        cloze: 'The ____ made the windows shake.',
        decoys: ['a soft light', 'a kind of cloud', 'a small puddle'],
      },
      {
        word: 'frost',
        meaning: 'thin white ice on cold mornings',
        cloze: 'There was ____ on the grass when we woke up.',
        decoys: ['warm steam', 'green moss', 'falling leaves'],
      },
      {
        word: 'humid',
        meaning: 'sticky because the air is full of water',
        cloze: 'The day was hot and ____.',
        decoys: ['dry and dusty', 'freezing cold', 'very windy'],
      },
      {
        word: 'clear',
        meaning: 'with nothing in the way to block your view',
        cloze: 'The night was ____, so we saw every star.',
        decoys: ['covered in thick clouds', 'full of noise', 'very crowded'],
      },
    ],
  },
  {
    id: 'g1_vocab_07',
    grade: 1,
    title: 'Story Words',
    blurb: 'Words that help you talk about books.',
    minutes: 11,
    words: [
      {
        word: 'character',
        meaning: 'a person or animal in a story',
        cloze: 'My favorite ____ in that book is the little owl.',
        decoys: ['the place a story happens', 'the last page', 'the color of a book'],
      },
      {
        word: 'setting',
        meaning: 'where and when a story happens',
        cloze: 'The ____ of the story is a farm long ago.',
        decoys: ['the person telling the story', 'the problem in a story', 'the name of a book'],
      },
      {
        word: 'problem',
        meaning: 'the trouble the characters have to solve',
        cloze: 'The ____ was that the bridge kept falling down.',
        decoys: ['the happy ending', 'the cover of a book', 'a kind of animal'],
      },
      {
        word: 'solution',
        meaning: 'the way a problem gets fixed',
        cloze: 'Her ____ was to make the stacks wider.',
        decoys: ['the start of a story', 'a kind of weather', 'a sad feeling'],
      },
      {
        word: 'author',
        meaning: 'the person who wrote the book',
        cloze: 'The ____ of this book also drew the pictures.',
        decoys: ['a person who reads a book', 'a person in the story', 'a kind of library'],
      },
      {
        word: 'predict',
        meaning: 'to guess what will happen next',
        cloze: 'Can you ____ how the story will end?',
        decoys: ['to remember the beginning', 'to close the book', 'to read out loud'],
      },
    ],
  },
  {
    id: 'g1_vocab_08',
    grade: 1,
    title: 'Nature Words',
    blurb: 'Words from outside your window.',
    minutes: 11,
    words: [
      {
        word: 'meadow',
        meaning: 'a wide field full of grass and flowers',
        cloze: 'We ran across the ____ looking for butterflies.',
        decoys: ['a tall building', 'a deep cave', 'a busy road'],
      },
      {
        word: 'burrow',
        meaning: 'a hole an animal digs to live in',
        cloze: 'The rabbit went down into its ____.',
        decoys: ['a nest high in a tree', 'a kind of bird', 'a small stream'],
      },
      {
        word: 'blossom',
        meaning: 'a flower on a tree or plant',
        cloze: 'Every ____ on the tree opened in spring.',
        decoys: ['a fallen branch', 'a piece of bark', 'a small stone'],
      },
      {
        word: 'stream',
        meaning: 'a small, narrow river',
        cloze: 'We stepped over the ____ on flat rocks.',
        decoys: ['a wide ocean', 'a dry desert', 'a tall mountain'],
      },
      {
        word: 'shade',
        meaning: 'a cool dark place out of the sun',
        cloze: 'We sat in the ____ under the big tree.',
        decoys: ['the hottest spot', 'the top of a hill', 'a bright light'],
      },
      {
        word: 'creature',
        meaning: 'any living animal',
        cloze: 'Every ____ in the pond went quiet at once.',
        decoys: ['a kind of rock', 'a type of cloud', 'a machine'],
      },
    ],
  },
  {
    id: 'g1_vocab_09',
    grade: 1,
    title: 'Thinking Words',
    blurb: 'Words for what your mind does.',
    minutes: 11,
    words: [
      {
        word: 'imagine',
        meaning: 'to make a picture in your mind',
        cloze: 'Close your eyes and ____ a purple elephant.',
        decoys: ['to forget on purpose', 'to say out loud', 'to write down'],
      },
      {
        word: 'notice',
        meaning: 'to see something you might have missed',
        cloze: 'Did you ____ the bird on the fence?',
        decoys: ['to look away quickly', 'to break something', 'to fall asleep'],
      },
      {
        word: 'compare',
        meaning: 'to look at how things are the same or different',
        cloze: 'Let us ____ these two leaves.',
        decoys: ['to throw two things away', 'to count to ten', 'to draw a circle'],
      },
      {
        word: 'explain',
        meaning: 'to tell someone how or why something works',
        cloze: 'Can you ____ how you got that answer?',
        decoys: ['to keep it secret', 'to guess wildly', 'to ask a question'],
      },
      {
        word: 'wonder',
        meaning: 'to think about something you do not know yet',
        cloze: 'I ____ how far away that star is.',
        decoys: ['to be certain already', 'to stop thinking', 'to run in circles'],
      },
      {
        word: 'decide',
        meaning: 'to choose what you are going to do',
        cloze: 'You get to ____ which book we read.',
        decoys: ['to leave it to chance', 'to change nothing', 'to lose something'],
      },
    ],
  },
  {
    id: 'g1_vocab_10',
    grade: 1,
    title: 'Time Words',
    blurb: 'Words for when things happen.',
    minutes: 11,
    words: [
      {
        word: 'suddenly',
        meaning: 'happening fast and without warning',
        cloze: '____, the lights went out.',
        decoys: ['very slowly over years', 'every single day', 'never at all'],
      },
      {
        word: 'often',
        meaning: 'many times, again and again',
        cloze: 'We ____ walk to the park after dinner.',
        decoys: ['only one time ever', 'never', 'a long time ago'],
      },
      {
        word: 'finally',
        meaning: 'at last, after waiting',
        cloze: 'On day six the seed ____ sprouted.',
        decoys: ['right at the beginning', 'before anything else', 'by accident'],
      },
      {
        word: 'meanwhile',
        meaning: 'at the same time as something else',
        cloze: 'She read a book. ____, her sister drew a picture.',
        decoys: ['much later that year', 'before she was born', 'instead of that'],
      },
      {
        word: 'ancient',
        meaning: 'from a very, very long time ago',
        cloze: 'The light from that star is ____.',
        decoys: ['brand new today', 'happening right now', 'still to come'],
      },
      {
        word: 'moment',
        meaning: 'a very short piece of time',
        cloze: 'Wait here for a ____, please.',
        decoys: ['a whole year', 'a hundred days', 'the rest of your life'],
      },
    ],
  },
];

export const grade1Vocabulary: Star[] = specs.map(buildVocabStar);
