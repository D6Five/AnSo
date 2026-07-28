import type { BsfWeek } from './bsf';

/**
 * ============================================================================
 * DROP YOUR BSF WEEKLY CURRICULUM IN HERE
 * ============================================================================
 *
 * This is the only file you need to edit to add Bible Study Fellowship weeks.
 * Nothing else in the app has to change — add a week to this array, save, and
 * a new star appears in The Lamp constellation for both girls.
 *
 * Each week needs:
 *   week        the week number (controls order and the star's id)
 *   title       short name for the lesson
 *   reference   the scripture reference, e.g. "Genesis 1:1-31"
 *   summary     one or two sentences AnSo reads to introduce it
 *   passage     the text, one string per paragraph or verse
 *   questions   see below
 *
 * Optional:
 *   memoryVerse  becomes a typing challenge at the end of the star
 *   minutes      estimated length, defaults to 15
 *
 * A question is either MULTIPLE CHOICE:
 *   { ask: '...', options: ['a','b','c'], correct: 1, teach: '...' }
 *
 * ...or OPEN RESPONSE, answered by voice or typing:
 *   { ask: '...', accept: ['noah','a boat'], sample: 'Noah built a boat.' }
 *
 * Open questions without an `accept` list are treated as reflection questions
 * and accept any genuine attempt — use those for "what do you think" prompts.
 *
 * Add `grades: [1]` or `grades: [3]` to a question to show it to only one
 * child. Leave it off and both girls get it.
 *
 * The two weeks below are working examples. Replace or keep them as you like.
 * ============================================================================
 */

export const BSF_WEEKS: BsfWeek[] = [
  {
    week: 1,
    title: 'In the Beginning',
    reference: 'Genesis 1',
    summary:
      'Our first week in The Lamp. This is the very first page of the Bible, about how everything began.',
    minutes: 15,
    passage: [
      'In the beginning God created the heavens and the earth.',
      'And God said, "Let there be light," and there was light. God saw that the light was good, and he separated the light from the darkness.',
      'God called the light "day," and the darkness he called "night." And there was evening, and there was morning — the first day.',
      'God made the sun, the moon, and the stars. He filled the sea with fish and the sky with birds, and the land with every kind of living creature.',
      'Then God made people, and he blessed them.',
      'God saw all that he had made, and it was very good.',
    ],
    memoryVerse: {
      text: 'In the beginning God created the heavens and the earth.',
      reference: 'Genesis 1:1',
    },
    questions: [
      {
        ask: 'What is the very first thing God made in this chapter?',
        options: ['Light', 'Fish', 'People', 'Trees'],
        correct: 0,
        teach: 'Light came first. Everything else was made in the light.',
      },
      {
        ask: 'What did God call the light, and what did he call the darkness?',
        accept: ['day and night', 'day night', 'day', 'night', 'he called it day and night'],
        sample: 'He called the light day and the darkness night.',
        teach: 'Day and night. Naming something is a way of saying it belongs to you.',
      },
      {
        ask: 'After God finished making everything, what did he say about it?',
        options: ['It was very good', 'It was finished', 'It was difficult', 'It was small'],
        correct: 0,
        teach: 'It was very good. That is how the chapter ends.',
      },
      {
        ask: 'The chapter says God made the stars. When we travel through our star map, what could that remind you of?',
        sample: 'That someone made all the real stars too.',
        teach: 'Every star on our map stands for something real that was made on purpose.',
        grades: [1],
      },
      {
        ask: 'Why do you think this chapter repeats the phrase "and there was evening, and there was morning" over and over?',
        sample: 'To show the days going by in order, one after another.',
        teach: 'Repeating a phrase gives writing a rhythm — and it shows careful order, not rush.',
        grades: [3],
      },
      {
        ask: 'What is one thing in creation you are thankful for?',
        sample: 'I am thankful for the ocean.',
        teach: 'Thank you for telling me. Noticing what is good is its own kind of practice.',
      },
    ],
  },
  {
    week: 2,
    title: 'The Boy Who Listened',
    reference: '1 Samuel 3',
    summary:
      'This week is about a boy about your age who heard his name in the night, and what he said back.',
    minutes: 15,
    passage: [
      'The boy Samuel served in the temple. In those days, messages from the Lord were rare.',
      'One night Samuel was lying down when he heard a voice call his name. "Samuel!"',
      'He ran to Eli, the old priest, and said, "Here I am; you called me."',
      'But Eli said, "I did not call. Go back and lie down."',
      'It happened again. And a third time.',
      'Then Eli understood. He told Samuel, "Go and lie down, and if he calls you, say: Speak, Lord, for your servant is listening."',
      'So Samuel went and lay down. The Lord came and called as before, "Samuel! Samuel!"',
      'And Samuel said, "Speak, for your servant is listening."',
    ],
    memoryVerse: {
      text: 'Speak, for your servant is listening.',
      reference: '1 Samuel 3:10',
    },
    questions: [
      {
        ask: 'How many times was Samuel called before he understood who it was?',
        options: ['Once', 'Twice', 'Three times', 'Five times'],
        correct: 2,
        teach: 'Three times. He was not slow — he simply had not heard that voice before.',
      },
      {
        ask: 'Who helped Samuel understand what was happening?',
        accept: ['eli', 'the priest', 'eli the priest', 'the old priest'],
        sample: 'Eli, the old priest.',
        teach: 'Eli. Sometimes we need someone older to help us understand what we are hearing.',
      },
      {
        ask: 'What did Samuel finally say?',
        options: [
          'Speak, for your servant is listening',
          'Who is there?',
          'I am too young',
          'Please come back tomorrow',
        ],
        correct: 0,
        teach: 'That is the line the whole story builds toward — and this week\'s verse.',
      },
      {
        ask: 'Samuel kept running to Eli each time. What does that tell you about him?',
        sample: 'He was quick to answer and did not ignore it.',
        teach: 'He answered every single time. Being quick to respond is its own kind of faithfulness.',
        grades: [3],
      },
      {
        ask: 'What is something that makes it hard to listen carefully?',
        sample: 'When it is noisy, or when I am thinking about something else.',
        teach: 'Noise and a busy mind. Both are worth noticing, because you can do something about both.',
      },
    ],
  },
];
