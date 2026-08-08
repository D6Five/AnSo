import type { BsfWeek } from './bsf';

/**
 * ============================================================================
 * BSF ROMANS — LESSONS 1 THROUGH 14
 * ============================================================================
 *
 * The children's study of Paul's letter to the Romans, one star per lesson.
 * Lesson summaries (main truth, God's attribute, doctrine, gospel connection)
 * and the NIV memory verses follow the BSF Romans children's material.
 *
 * Passage text is the World English Bible (WEB), a modern public-domain
 * translation, so the full scripture reading can ship inside the app. The
 * memory verses the girls learn by heart are NIV, exactly as on the lesson
 * cards. To swap the passage text for another translation, replace the
 * `passage` arrays — every other feature works unchanged.
 *
 * Lesson 2 reads Romans 1:18-25 rather than the full 18-32: the closing
 * verses of that chapter name adult matters the BSF children's material
 * also leaves for later years. The lesson's truth is taught in full.
 * ============================================================================
 */

export const BSF_WEEKS: BsfWeek[] = [
  {
    week: 1,
    title: 'Our Need for the Gospel',
    reference: 'Romans 1:1-17',
    summary:
      'Welcome to the letter to the Romans! A man named Paul wrote this letter long ago to believers in the great city of Rome. He starts with the most important news in the world.',
    art: 'scroll',
    minutes: 18,
    passage: [
      "Paul, a servant of Jesus Christ, called to be an apostle, set apart for the Good News of God, which he promised before through his prophets in the holy Scriptures, concerning his Son, who was born of the offspring of David according to the flesh,",
      "who was declared to be the Son of God with power, according to the Spirit of holiness, by the resurrection from the dead, Jesus Christ our Lord, through whom we received grace and apostleship, for obedience of faith among all the nations, for his name’s sake; among whom you are also called to belong to Jesus Christ;",
      "to all who are in Rome, beloved of God, called to be saints: Grace to you and peace from God our Father and the Lord Jesus Christ. First, I thank my God through Jesus Christ for all of you, that your faith is proclaimed throughout the whole world. For God is my witness, whom I serve in my spirit in the Good News of his Son, how unceasingly I make mention of you always in my prayers,",
      "requesting, if by any means now at last I may be prospered by the will of God to come to you. For I long to see you, that I may impart to you some spiritual gift, to the end that you may be established; that is, that I with you may be encouraged in you, each of us by the other’s faith, both yours and mine.",
      "Now I don’t desire to have you unaware, brothers, that I often planned to come to you, and was hindered so far, that I might have some fruit among you also, even as among the rest of the Gentiles. I am debtor both to Greeks and to foreigners, both to the wise and to the foolish. So, as much as is in me, I am eager to preach the Good News to you also who are in Rome.",
      "For I am not ashamed of the Good News of Christ, because it is the power of God for salvation for everyone who believes; for the Jew first, and also for the Greek. For in it is revealed God’s righteousness from faith to faith. As it is written, “But the righteous shall live by faith.”",
    ],
    memoryVerse: {
      text: 'For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last.',
      reference: 'Romans 1:17a',
    },
    truth: 'The gospel is the power of God that saves sinners.',
    attribute: { name: 'Righteous', meaning: 'God is right in all He does.' },
    doctrine: { term: 'Righteousness', meaning: 'being completely right and good, the way God is' },
    gospel: 'When we believe in Jesus, God gives us Jesus’s perfect righteousness.',
    questions: [
      {
        ask: 'Who wrote this letter to the Romans?',
        options: ['Paul', 'Peter', 'David', 'Moses'],
        correct: 0,
        teach: 'Paul — he calls himself a servant of Jesus Christ in the very first line.',
      },
      {
        ask: 'Paul says he is NOT ashamed of the Good News. Why not?',
        options: [
          'Because it is the power of God for salvation',
          'Because it made him famous',
          'Because it was easy to say',
          'Because everyone already believed it',
        ],
        correct: 0,
        teach: 'It is the power of God for salvation for everyone who believes. That is nothing to be shy about.',
      },
      {
        ask: 'The gospel is for everyone who believes. Who does that include?',
        accept: ['everyone', 'me', 'us', 'all people', 'anyone', 'the whole world', 'jews and greeks'],
        sample: 'Everyone — including me.',
        teach: 'Everyone. The Jew first, and also the Greek — Paul means the whole world gets invited.',
      },
      {
        ask: 'What does "gospel" mean?',
        options: ['Good news', 'A long letter', 'A kind of song', 'A city in Rome'],
        correct: 0,
        teach: 'Good News. The best news there is: God saves sinners through Jesus.',
        grades: [1],
      },
      {
        ask: 'Paul wanted to visit Rome so he and the believers could encourage each other by their faith. What does it mean to encourage someone?',
        accept: ['help', 'cheer', 'make them strong', 'build them up', 'make them brave', 'lift them up'],
        sample: 'To help them feel strong and brave.',
        teach: 'To put courage into someone. Faith grows stronger when friends share it.',
        grades: [3],
      },
    ],
  },
  {
    week: 2,
    title: 'God’s Wrath Against Sinful Humanity',
    reference: 'Romans 1:18-32',
    summary:
      'This lesson is serious, but important. Paul explains that everyone can see God’s power in the world He made — and what happens when people refuse to thank Him.',
    art: 'storm',
    minutes: 17,
    passage: [
      "For the wrath of God is revealed from heaven against all ungodliness and unrighteousness of men, who suppress the truth in unrighteousness, because that which is known of God is revealed in them, for God revealed it to them. For the invisible things of him since the creation of the world are clearly seen, being perceived through the things that are made, even his everlasting power and divinity; that they may be without excuse.",
      "Because, knowing God, they didn’t glorify him as God, neither gave thanks, but became vain in their reasoning, and their senseless heart was darkened. Professing themselves to be wise, they became fools, and traded the glory of the incorruptible God for the likeness of an image of corruptible man, and of birds, and four-footed animals, and creeping things.",
      "Therefore God also gave them up in the lusts of their hearts to uncleanness, that their bodies should be dishonored among themselves; who exchanged the truth of God for a lie, and worshiped and served the creature rather than the Creator, who is blessed forever. Amen.",
    ],
    memoryVerse: {
      text: 'For since the creation of the world God’s invisible qualities—his eternal power and divine nature—have been clearly seen, being understood from what has been made, so that people are without excuse.',
      reference: 'Romans 1:20',
    },
    truth: 'People who refuse to turn away from their sin will face God’s wrath.',
    attribute: { name: 'Creator', meaning: 'God made everything.' },
    doctrine: { term: 'Wrath of God', meaning: 'God’s holy anger against sin' },
    gospel: 'No one can be saved from God’s wrath except through faith in Jesus.',
    questions: [
      {
        ask: 'How can everyone see that God is real and powerful?',
        options: [
          'Through the things He has made — creation',
          'Only by reading books',
          'Only in dreams',
          'No one can see it',
        ],
        correct: 0,
        teach: 'Creation shows Him. Stars, oceans, animals, you — the Maker’s power is on display everywhere.',
      },
      {
        ask: 'What did people trade the glory of God for?',
        options: [
          'Images of people, birds, and animals',
          'Gold and silver',
          'Nothing at all',
          'Books of wisdom',
        ],
        correct: 0,
        teach: 'They swapped the real, living God for statues of made things. A terrible trade.',
      },
      {
        ask: 'The passage says people knew God but did not give thanks. Why do you think thanking God matters?',
        accept: ['he made everything', 'he deserves it', 'it shows love', 'he gives us everything', 'because he is good'],
        sample: 'Because He made everything and deserves our thanks.',
        teach: 'Thanking God is how we honor Him as the Giver. Forgetting to thank Him is where the trouble began.',
      },
      {
        ask: 'Name one thing in creation that shows you how powerful God is.',
        accept: ['stars', 'ocean', 'mountains', 'sun', 'animals', 'sky', 'trees', 'the sea', 'people'],
        sample: 'The ocean — it is so huge and strong.',
        teach: 'Yes. Every one of those is a signpost pointing to its Maker.',
        grades: [1],
      },
      {
        ask: 'The passage says people are "without excuse." What does that mean here?',
        options: [
          'No one can say "I never knew about God" — creation already showed Him',
          'People are not allowed to talk',
          'Everyone gets excused',
          'Excuses are always fine',
        ],
        correct: 0,
        teach: 'Creation is evidence everyone has seen. No one can claim they had no clue.',
        grades: [3],
      },
    ],
  },
  {
    week: 3,
    title: 'No Excuse for Anyone',
    reference: 'Romans 2',
    summary:
      'Have you ever pointed out someone else’s mistake while making the same one yourself? Paul says God sees it all — and judges everyone completely fairly.',
    art: 'scales',
    minutes: 19,
    passage: [
      "Therefore you are without excuse, O man, whoever you are who judge. For in that which you judge another, you condemn yourself. For you who judge practice the same things. We know that the judgment of God is according to truth against those who practice such things. Do you think this, O man who judges those who practice such things, and do the same, that you will escape the judgment of God?",
      "Or do you despise the riches of his goodness, forbearance, and patience, not knowing that the goodness of God leads you to repentance? But according to your hardness and unrepentant heart you are treasuring up for yourself wrath in the day of wrath, revelation, and of the righteous judgment of God; who “will pay back to everyone according to their works:”",
      "to those who by perseverance in well-doing seek for glory, honor, and incorruptibility, eternal life; but to those who are self-seeking, and don’t obey the truth, but obey unrighteousness, will be wrath and indignation, oppression and anguish, on every soul of man who does evil, to the Jew first, and also to the Greek.",
      "But glory, honor, and peace go to every man who does good, to the Jew first, and also to the Greek. For there is no partiality with God. For as many as have sinned without the law will also perish without the law. As many as have sinned under the law will be judged by the law.",
      "For it isn’t the hearers of the law who are righteous before God, but the doers of the law will be justified (for when Gentiles who don’t have the law do by nature the things of the law, these, not having the law, are a law to themselves, in that they show the work of the law written in their hearts, their conscience testifying with them, and their thoughts among themselves accusing or else excusing them)",
      "in the day when God will judge the secrets of men, according to my Good News, by Jesus Christ. Indeed you bear the name of a Jew, and rest on the law, and glory in God, and know his will, and approve the things that are excellent, being instructed out of the law,",
      "and are confident that you yourself are a guide of the blind, a light to those who are in darkness, a corrector of the foolish, a teacher of babies, having in the law the form of knowledge and of the truth. You therefore who teach another, don’t you teach yourself? You who preach that a man shouldn’t steal, do you steal?",
      "For he is not a Jew who is one outwardly, neither is that circumcision which is outward in the flesh; but he is a Jew who is one inwardly, and circumcision is that of the heart, in the spirit not in the letter; whose praise is not from men, but from God.",
    ],
    memoryVerse: {
      text: 'For God does not show favoritism.',
      reference: 'Romans 2:11',
    },
    truth: 'God will judge every person.',
    attribute: { name: 'Just', meaning: 'All God’s judgments are perfect.' },
    doctrine: { term: 'Judgment', meaning: 'God looking at every life completely fairly' },
    gospel: 'God’s kindness leads people to repent, believe in Jesus, and be saved.',
    questions: [
      {
        ask: 'When we judge someone else for doing wrong things we also do, what does Paul say about us?',
        options: [
          'We condemn ourselves',
          'We are being helpful',
          'We are always right',
          'Nothing happens',
        ],
        correct: 0,
        teach: 'We condemn ourselves — pointing a finger while doing the same thing.',
      },
      {
        ask: 'What does God’s goodness and patience lead us toward?',
        options: ['Repentance — turning away from sin', 'More toys', 'Being famous', 'Nothing'],
        correct: 0,
        teach: 'Repentance. God is patient because He is giving people time to turn around.',
      },
      {
        ask: 'What does "God does not show favoritism" mean?',
        accept: ['he is fair', 'no favorites', 'he treats everyone the same', 'everyone equal', 'fair to all'],
        sample: 'God treats everyone fairly — no favorites.',
        teach: 'Perfectly fair, to every person, always. Our memory verse in five words.',
      },
      {
        ask: 'Does God only care about what people do on the outside, or what is in their heart?',
        options: ['What is in their heart too', 'Only the outside', 'Only on Sundays', 'Neither'],
        correct: 0,
        teach: 'The heart. Paul says real belonging to God is "of the heart" — inside, where only God sees.',
        grades: [1],
      },
      {
        ask: 'Paul asks teachers: "You who teach others, do you not teach yourself?" What is he warning about?',
        accept: ['hypocrisy', 'saying one thing doing another', 'not following your own words', 'being fake', 'do what you say'],
        sample: 'Saying the right thing but not doing it yourself.',
        teach: 'That is called hypocrisy — and God sees through it every time.',
        grades: [3],
      },
    ],
  },
  {
    week: 4,
    title: 'No One Righteous',
    reference: 'Romans 3:1-20',
    summary:
      'If God is perfectly fair, here is the hard question: is anyone good enough on their own? Paul answers with words that include every single person.',
    art: 'mirror',
    minutes: 18,
    passage: [
      "Then what advantage does the Jew have? Or what is the profit of circumcision? Much in every way! Because first of all, they were entrusted with the revelations of God. For what if some were without faith? Will their lack of faith nullify the faithfulness of God?",
      "May it never be! Yes, let God be found true, but every man a liar. As it is written, “That you might be justified in your words, and might prevail when you come into judgment.” But if our unrighteousness commends the righteousness of God, what will we say? Is God unrighteous who inflicts wrath? I speak like men do. May it never be! For then how will God judge the world?",
      "What then? Are we better than they? No, in no way. For we previously warned both Jews and Greeks, that they are all under sin.",
      "As it is written, “There is no one righteous; no, not one. There is no one who understands. There is no one who seeks after God. They have all turned away. They have together become unprofitable. There is no one who does good, no, not so much as one.”",
      "Now we know that whatever things the law says, it speaks to those who are under the law, that every mouth may be closed, and all the world may be brought under the judgment of God. Because by the works of the law, no flesh will be justified in his sight. For through the law comes the knowledge of sin.",
    ],
    memoryVerse: {
      text: 'As it is written: ‘There is no one righteous, not even one.’',
      reference: 'Romans 3:10',
    },
    truth: 'Without Jesus, everyone is guilty before God.',
    attribute: { name: 'Holy', meaning: 'God’s perfect goodness sets Him apart from His creation.' },
    doctrine: { term: 'Sin', meaning: 'doing wrong against God — and everyone everywhere has done it' },
    gospel: 'All people are born as sinners and choose to sin against God.',
    questions: [
      {
        ask: 'How many people does the passage say are righteous on their own?',
        options: ['Not even one', 'A few very good ones', 'About half', 'Most people'],
        correct: 0,
        teach: 'Not even one. Not the best kid in class, not the kindest grown-up. Everyone needs help.',
      },
      {
        ask: 'What does the law help us know?',
        options: ['Our sin', 'How to get rich', 'The future', 'Nothing at all'],
        correct: 0,
        teach: 'Through the law comes the knowledge of sin — like a mirror showing us the smudges on our face.',
      },
      {
        ask: 'The law is like a mirror. What can a mirror do, and what can it NOT do?',
        accept: ['show', 'it shows dirt but cannot clean', 'it cannot wash you', 'shows the problem', 'cannot fix'],
        sample: 'A mirror shows the dirt on your face, but it cannot wash it off.',
        teach: 'Exactly. The law shows sin but cannot remove it. Something else must do the washing.',
        grades: [3],
      },
      {
        ask: 'Is anyone too good to need Jesus?',
        options: ['No — everyone needs Him', 'Yes, very good people', 'Only grown-ups need Him', 'Only kids need Him'],
        correct: 0,
        teach: 'No one is too good. That is why this lesson matters before next week’s good news.',
        grades: [1],
      },
      {
        ask: 'Why do you think Paul wants "every mouth to be closed" before God?',
        accept: ['no excuses', 'no one can brag', 'no boasting', 'everyone is guilty', 'we cannot argue'],
        sample: 'So no one can make excuses or brag about being good enough.',
        teach: 'When every excuse goes quiet, we are finally ready to hear about rescue.',
        grades: [3],
      },
    ],
  },
  {
    week: 5,
    title: 'How God Saves Sinners',
    reference: 'Romans 3:21-26',
    summary:
      'Last week ended with everyone guilty and no way out. This week is the turning point of the whole letter — the great BUT NOW. God Himself made the way.',
    art: 'cross',
    minutes: 17,
    passage: [
      "But now apart from the law, a righteousness of God has been revealed, being testified by the law and the prophets; even the righteousness of God through faith in Jesus Christ to all and on all those who believe. For there is no distinction, for all have sinned, and fall short of the glory of God;",
      "being justified freely by his grace through the redemption that is in Christ Jesus; whom God sent to be an atoning sacrifice, through faith in his blood, for a demonstration of his righteousness through the passing over of prior sins, in God’s forbearance; to demonstrate his righteousness at this present time; that he might himself be just, and the justifier of him who has faith in Jesus.",
    ],
    memoryVerse: {
      text: 'And all are justified freely by his grace through the redemption that came by Christ Jesus.',
      reference: 'Romans 3:24',
    },
    truth: 'God has made the way for sinners to be forgiven.',
    attribute: { name: 'Savior', meaning: 'Jesus Christ, the Son of God, is the only Savior from sin.' },
    doctrine: { term: 'Salvation', meaning: 'being rescued by God from sin' },
    gospel: 'God sent His only Son, Jesus, to save people from sin.',
    questions: [
      {
        ask: 'The passage begins "But now..." What changed?',
        options: [
          'God revealed a righteousness apart from the law — through faith in Jesus',
          'The law got easier',
          'People stopped sinning',
          'Nothing changed',
        ],
        correct: 0,
        teach: 'God opened a way the law never could: righteousness through faith in Jesus.',
      },
      {
        ask: 'Who has sinned and falls short of the glory of God?',
        options: ['All people', 'Only the worst people', 'Only people long ago', 'Nobody'],
        correct: 0,
        teach: 'All. The same "all" who sinned are the "all" who are offered rescue. No one left out either way.',
      },
      {
        ask: 'Our verse says we are justified FREELY by his grace. What does freely mean?',
        accept: ['free', 'no cost', 'we do not pay', 'a gift', 'without paying', 'for nothing'],
        sample: 'It costs us nothing — it is a gift.',
        teach: 'Free for us — because Jesus paid the whole cost Himself.',
      },
      {
        ask: 'Who did God send to save people from sin?',
        options: ['Jesus, His Son', 'An angel', 'Moses', 'A king'],
        correct: 0,
        teach: 'His own Son. That is how much God wanted to save sinners.',
        grades: [1],
      },
      {
        ask: 'God is called both "just" and "the justifier." How can He punish sin fairly AND forgive sinners?',
        accept: ['jesus took the punishment', 'jesus paid', 'the cross', 'jesus died for us', 'sin was punished on jesus'],
        sample: 'Jesus took the punishment, so sin was paid for and sinners go free.',
        teach: 'The cross is where perfect fairness and perfect love meet. Sin punished; sinners freed.',
        grades: [3],
      },
    ],
  },
  {
    week: 6,
    title: 'Justification by Faith, Part 1',
    reference: 'Romans 3:27-31',
    summary:
      'If God saves us as a free gift, is there anything left to brag about? Paul answers with a question of his own — and the answer is wonderful news for everyone.',
    art: 'gift_hands',
    minutes: 16,
    passage: [
      "Where then is the boasting? It is excluded. By what kind of law? Of works? No, but by a law of faith. We maintain therefore that a man is justified by faith apart from the works of the law. Or is God the God of Jews only? Isn’t he the God of Gentiles also? Yes, of Gentiles also,",
      "since indeed there is one God who will justify the circumcised by faith, and the uncircumcised through faith. Do we then nullify the law through faith? May it never be! No, we establish the law.",
    ],
    memoryVerse: {
      text: 'For we maintain that a person is justified by faith apart from the works of the law.',
      reference: 'Romans 3:28',
    },
    truth: 'God justifies people through faith in Jesus alone.',
    attribute: { name: 'Impartial', meaning: 'God gives eternal life to anyone who trusts in Jesus.' },
    doctrine: { term: 'Faith', meaning: 'trusting Jesus with your whole heart' },
    gospel: 'Jesus gives eternal life to those who trust in Him to save them.',
    questions: [
      {
        ask: 'Where is the boasting, now that God saves by faith?',
        options: ['It is excluded — shut out', 'It is allowed on Sundays', 'Only heroes may boast', 'Everywhere'],
        correct: 0,
        teach: 'Shut out completely. A gift you did not earn leaves nothing to brag about.',
      },
      {
        ask: 'Is a person justified by doing good works, or by faith?',
        options: ['By faith', 'By works', 'By being born lucky', 'By waiting'],
        correct: 0,
        teach: 'By faith, apart from works. Trusting Jesus, not earning points.',
      },
      {
        ask: 'Is God the God of just one group of people?',
        options: ['No — He is God of all peoples', 'Yes, one country only', 'Only of grown-ups', 'Only of long ago'],
        correct: 0,
        teach: 'One God, for Jews and Gentiles alike — every nation, every language, every child.',
      },
      {
        ask: 'What is faith?',
        accept: ['trusting', 'trusting jesus', 'believing', 'trusting god', 'believing in jesus'],
        sample: 'Trusting Jesus with my whole heart.',
        teach: 'Trusting Jesus — leaning your whole weight on Him, like sitting down on a chair you believe will hold you.',
        grades: [1],
      },
      {
        ask: 'If salvation cannot be earned, why do believers still do good works?',
        accept: ['love', 'to thank god', 'because they love god', 'gratitude', 'not to earn', 'because they are saved'],
        sample: 'Out of love and thankfulness — not to earn what is already given.',
        teach: 'Good works become a thank-you instead of a payment. Same actions, whole new reason.',
        grades: [3],
      },
    ],
  },
  {
    week: 7,
    title: 'Justification by Faith, Part 2',
    reference: 'Romans 4',
    summary:
      'To show that faith has always been the way, Paul tells the story of Abraham — an old man, a huge promise, and a sky full of stars.',
    art: 'stars_promise',
    minutes: 19,
    passage: [
      "What then will we say that Abraham, our forefather, has found according to the flesh? For if Abraham was justified by works, he has something to boast about, but not toward God. For what does the Scripture say? “Abraham believed God, and it was accounted to him for righteousness.”",
      "Now to him who works, the reward is not counted as grace, but as something owed. But to him who doesn’t work, but believes in him who justifies the ungodly, his faith is accounted for righteousness. Even as David also pronounces blessing on the man to whom God counts righteousness apart from works,",
      "“Blessed are they whose iniquities are forgiven, whose sins are covered. Blessed is the man whom the Lord will by no means charge with sin.”",
      "For the promise to Abraham and to his offspring that he should be heir of the world wasn’t through the law, but through the righteousness of faith. As it is written, “I have made you a father of many nations.” This is in the presence of him whom he believed: God, who gives life to the dead, and calls the things that are not, as though they were. Besides hope, Abraham in hope believed, to the end that he might become a father of many nations, according to that which had been spoken, “So will your offspring be.”",
      "Without being weakened in faith, he didn’t consider his own body, already having been worn out, (he being about a hundred years old), and the deadness of Sarah’s womb. Yet, looking to the promise of God, he didn’t waver through unbelief, but grew strong through faith, giving glory to God, and being fully assured that what he had promised, he was also able to perform.",
      "Therefore it also was “credited to him for righteousness.” Now it was not written that it was accounted to him for his sake alone, but for our sake also, to whom it will be accounted, who believe in him who raised Jesus, our Lord, from the dead, who was delivered up for our trespasses, and was raised for our justification.",
    ],
    memoryVerse: {
      text: 'Yet he did not waver through unbelief regarding the promise of God, but was strengthened in his faith and gave glory to God, being fully persuaded that God had power to do what he had promised.',
      reference: 'Romans 4:20-21',
    },
    truth: 'God gives Jesus’s righteousness to those who believe in Him.',
    attribute: { name: 'Faithful', meaning: 'God always keeps His promises.' },
    doctrine: { term: 'Justification', meaning: 'God declaring a sinner not guilty because of Jesus' },
    gospel: 'God declares sinners righteous forever when they trust in Jesus for salvation.',
    questions: [
      {
        ask: 'What did Abraham do that God counted as righteousness?',
        options: ['He believed God', 'He built a tower', 'He gave money', 'He fought a battle'],
        correct: 0,
        teach: '"Abraham believed God, and it was accounted to him for righteousness." Faith, not works.',
      },
      {
        ask: 'How old was Abraham when he trusted God’s promise of a child?',
        options: ['About one hundred years old', 'Twenty', 'Forty', 'Ten'],
        correct: 0,
        teach: 'About a hundred! The promise looked impossible — and he believed God anyway.',
      },
      {
        ask: 'Abraham was "fully persuaded that God had power to do what he had promised." What does fully persuaded mean?',
        accept: ['completely sure', 'totally sure', 'no doubt', 'certain', 'really believed', 'sure'],
        sample: 'Completely sure, with no doubt left.',
        teach: 'Sure all the way through. That is the faith our memory verse describes.',
      },
      {
        ask: 'God promised Abraham as many children as the stars. Did God keep His promise?',
        options: ['Yes — God always keeps His promises', 'No', 'Only partly', 'Nobody knows'],
        correct: 0,
        teach: 'Yes. Abraham became the father of many nations, just as God said. God is faithful.',
        grades: [1],
      },
      {
        ask: 'Paul says Abraham’s story was written down "for our sake also." How is our faith like Abraham’s?',
        accept: ['we believe god too', 'we trust the promise', 'we believe in jesus', 'trusting what god says', 'same kind of faith'],
        sample: 'We trust God’s promise too — that Jesus was raised for us.',
        teach: 'Same trust, same faithful God. Abraham looked forward to the promise; we look back at the cross.',
        grades: [3],
      },
    ],
  },
  {
    week: 8,
    title: 'Peace with God',
    reference: 'Romans 5:1-11',
    summary:
      'What do believers get when God declares them righteous? Paul opens this chapter with the answer: peace with God — a peace that holds even on the hardest days.',
    art: 'dove',
    minutes: 17,
    passage: [
      "Being therefore justified by faith, we have peace with God through our Lord Jesus Christ; through whom we also have our access by faith into this grace in which we stand. We rejoice in hope of the glory of God. Not only this, but we also rejoice in our sufferings, knowing that suffering produces perseverance;",
      "and perseverance, proven character; and proven character, hope: and hope doesn’t disappoint us, because God’s love has been poured out into our hearts through the Holy Spirit who was given to us. For while we were yet weak, at the right time Christ died for the ungodly.",
      "For one will hardly die for a righteous man. Yet perhaps for a righteous person someone would even dare to die. But God commends his own love toward us, in that while we were yet sinners, Christ died for us. Much more then, being now justified by his blood, we will be saved from God’s wrath through him.",
      "For if, while we were enemies, we were reconciled to God through the death of his Son, much more, being reconciled, we will be saved by his life. Not only so, but we also rejoice in God through our Lord Jesus Christ, through whom we have now received the reconciliation.",
    ],
    memoryVerse: {
      text: 'Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ.',
      reference: 'Romans 5:1',
    },
    truth: 'Believers have peace with God that gives hope at all times.',
    attribute: { name: 'Love', meaning: 'God proved His love for us when Jesus died on the cross.' },
    doctrine: { term: 'Reconciliation', meaning: 'becoming friends with God again' },
    gospel: 'Jesus is the only way to have peace with God.',
    questions: [
      {
        ask: 'What do believers have with God, now that they are justified by faith?',
        options: ['Peace', 'A contest', 'A long list of chores', 'Nothing'],
        correct: 0,
        teach: 'Peace with God, through our Lord Jesus Christ. The war is over.',
      },
      {
        ask: 'The passage builds a chain: suffering produces perseverance, perseverance produces character, and character produces...',
        options: ['Hope', 'Money', 'Sleep', 'Worry'],
        correct: 0,
        teach: 'Hope — and hope does not disappoint, because God’s love is already poured into our hearts.',
      },
      {
        ask: 'When did Christ die for us — after we became good, or while we were still sinners?',
        options: ['While we were still sinners', 'After we became good', 'Only for perfect people', 'The passage does not say'],
        correct: 0,
        teach: 'While we were still sinners. That is how God proves His love — He did not wait for us to deserve it.',
      },
      {
        ask: 'What does it mean to be reconciled with someone?',
        accept: ['friends again', 'make up', 'peace again', 'become friends', 'not enemies anymore'],
        sample: 'To become friends again after being apart.',
        teach: 'Friends again. We were far from God, and Jesus brought us near.',
        grades: [1],
      },
      {
        ask: 'How can believers "rejoice in sufferings"? What do hard times produce, according to this passage?',
        accept: ['perseverance', 'character', 'hope', 'they make us stronger', 'endurance', 'patience'],
        sample: 'Hard times build perseverance, then character, then hope.',
        teach: 'God wastes nothing — even suffering becomes a workshop where hope is built.',
        grades: [3],
      },
    ],
  },
  {
    week: 9,
    title: 'God’s Gift of Righteousness',
    reference: 'Romans 5:12-21',
    summary:
      'One man’s choice brought sin into the world. One Man’s obedience brought the free gift of life. This week Paul sets Adam and Jesus side by side.',
    art: 'gift',
    minutes: 17,
    passage: [
      "Therefore as sin entered into the world through one man, and death through sin; and so death passed to all men, because all sinned. For until the law, sin was in the world; but sin is not charged when there is no law. Nevertheless death reigned from Adam until Moses, even over those whose sins weren’t like Adam’s disobedience, who is a foreshadowing of him who was to come.",
      "But the free gift isn’t like the trespass. For if by the trespass of the one the many died, much more did the grace of God, and the gift by the grace of the one man, Jesus Christ, abound to the many. The gift is not as through one who sinned: for the judgment came by one to condemnation, but the free gift came of many trespasses to justification. For if by the trespass of the one, death reigned through the one; so much more will those who receive the abundance of grace and of the gift of righteousness reign in life through the one, Jesus Christ.",
      "So then as through one trespass, all men were condemned; even so through one act of righteousness, all men were justified to life. For as through the one man’s disobedience many were made sinners, even so through the obedience of the one, many will be made righteous. The law came in besides, that the trespass might abound; but where sin abounded, grace abounded more exceedingly;",
      "that as sin reigned in death, even so grace might reign through righteousness to eternal life through Jesus Christ our Lord.",
    ],
    memoryVerse: {
      text: 'Consequently, just as one trespass resulted in condemnation for all people, so also one righteous act resulted in justification and life for all people.',
      reference: 'Romans 5:18',
    },
    truth: 'Jesus’s righteousness defeated sin.',
    attribute: { name: 'Gracious', meaning: 'God shows kindness to people who deserve His wrath.' },
    doctrine: { term: 'Grace', meaning: 'God’s kindness that we did not earn' },
    gospel: 'Salvation is given by God’s grace through faith in Jesus.',
    questions: [
      {
        ask: 'Through which man did sin enter the world?',
        options: ['Adam', 'Abraham', 'Moses', 'David'],
        correct: 0,
        teach: 'Adam — one man’s disobedience, and sin spread to everyone after him.',
      },
      {
        ask: 'Paul compares Adam and Jesus. What did each one bring?',
        options: [
          'Adam brought sin and death; Jesus brought righteousness and life',
          'They both brought the same thing',
          'Adam brought life; Jesus brought rules',
          'Neither brought anything',
        ],
        correct: 0,
        teach: 'One trespass brought condemnation; one righteous act brought justification and life.',
      },
      {
        ask: 'Where sin abounded, what abounded even more?',
        options: ['Grace', 'Rules', 'Sadness', 'Silence'],
        correct: 0,
        teach: 'Grace abounded more exceedingly. However big sin grew, grace grew bigger.',
      },
      {
        ask: 'What is grace?',
        accept: ['kindness we did not earn', 'a free gift', 'god being kind', 'kindness', 'undeserved kindness'],
        sample: 'God’s kindness that we did not earn.',
        teach: 'Kindness we never earned and could never buy. That is grace.',
        grades: [1],
      },
      {
        ask: 'Why does Paul call righteousness a GIFT and not a wage?',
        accept: ['we did not earn it', 'gifts are free', 'wages are earned', 'it is free', 'jesus earned it'],
        sample: 'A wage is earned; a gift is free. Jesus earned it and gives it away.',
        teach: 'Wages you work for. Gifts you simply receive. Righteousness comes wrapped, not paid.',
        grades: [3],
      },
    ],
  },
  {
    week: 10,
    title: 'Death to Sin',
    reference: 'Romans 6:1-11',
    summary:
      'If grace covers sin, should we just keep sinning? Paul answers with the strongest no in the whole letter — because believers have been set free.',
    art: 'chains',
    minutes: 17,
    passage: [
      "What shall we say then? Shall we continue in sin, that grace may abound? May it never be! We who died to sin, how could we live in it any longer? Or don’t you know that all we who were baptized into Christ Jesus were baptized into his death?",
      "We were buried therefore with him through baptism into death, that just as Christ was raised from the dead through the glory of the Father, so we also might walk in newness of life. For if we have become united with him in the likeness of his death, we will also be part of his resurrection; knowing this, that our old man was crucified with him, that the body of sin might be done away with, so that we would no longer be in bondage to sin.",
      "For he who has died has been freed from sin. But if we died with Christ, we believe that we will also live with him; knowing that Christ, being raised from the dead, dies no more. Death no more has dominion over him!",
      "For the death that he died, he died to sin one time; but the life that he lives, he lives to God. Thus consider yourselves also to be dead to sin, but alive to God in Christ Jesus our Lord.",
    ],
    memoryVerse: {
      text: 'In the same way, count yourselves dead to sin but alive to God in Christ Jesus.',
      reference: 'Romans 6:11',
    },
    truth: 'Jesus frees believers from sin’s power.',
    attribute: { name: 'Omnipotent', meaning: 'God can do anything.' },
    doctrine: { term: 'Freedom from Sin', meaning: 'being set free from sin’s penalty and power' },
    gospel: 'Everyone who trusts in Jesus for salvation is set free from sin’s penalty and power.',
    questions: [
      {
        ask: 'Paul asks: "Shall we continue in sin, that grace may abound?" What is his answer?',
        options: ['May it never be!', 'Yes, a little', 'Only on weekends', 'He does not answer'],
        correct: 0,
        teach: 'May it never be! Grace is freedom FROM sin, never permission FOR it.',
      },
      {
        ask: 'Believers walk in newness of life because Christ was...',
        options: ['Raised from the dead', 'Very famous', 'A good teacher only', 'Always traveling'],
        correct: 0,
        teach: 'Raised from the dead. His new life becomes our new life.',
      },
      {
        ask: 'How many times did Christ die to sin?',
        options: ['One time — once for all', 'Every year', 'Seven times', 'It never happened'],
        correct: 0,
        teach: 'Once, for all. The work is finished and never needs repeating.',
      },
      {
        ask: 'A prisoner whose chains fall off does not keep sitting in the cell. What should someone freed from sin do?',
        accept: ['walk out', 'live free', 'leave the cell', 'live for god', 'stop sinning', 'walk in new life'],
        sample: 'Walk out and live free — alive to God.',
        teach: 'Freedom is for walking in. Dead to sin, alive to God.',
        grades: [3],
      },
      {
        ask: 'Our verse says believers are "alive to God." Who makes that possible?',
        options: ['Jesus', 'Ourselves', 'Teachers', 'No one'],
        correct: 0,
        teach: 'Jesus — in Christ Jesus our Lord, says the verse. He is the one who sets people free.',
        grades: [1],
      },
    ],
  },
  {
    week: 11,
    title: 'Alive to God',
    reference: 'Romans 6:12-23',
    summary:
      'Free people still choose whom they will serve. Paul says our hands, feet, and words can be tools for wrong — or instruments for God.',
    art: 'sunrise',
    minutes: 17,
    passage: [
      "Therefore don’t let sin reign in your mortal body, that you should obey it in its lusts. Also, do not present your members to sin as instruments of unrighteousness, but present yourselves to God, as alive from the dead, and your members as instruments of righteousness to God. For sin will not have dominion over you. For you are not under law, but under grace.",
      "What then? Shall we sin, because we are not under law, but under grace? May it never be! Don’t you know that when you present yourselves as servants and obey someone, you are the servants of whomever you obey; whether of sin to death, or of obedience to righteousness? But thanks be to God, that, whereas you were bondservants of sin, you became obedient from the heart to that form of teaching to which you were delivered.",
      "Being made free from sin, you became bondservants of righteousness. For when you were servants of sin, you were free in regard to righteousness. What fruit then did you have at that time in the things of which you are now ashamed? For the end of those things is death. But now, being made free from sin, and having become servants of God, you have your fruit of sanctification, and the result of eternal life. For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.",
    ],
    memoryVerse: {
      text: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.',
      reference: 'Romans 6:23',
    },
    truth: 'Jesus frees believers to live holy lives.',
    attribute: { name: 'Good', meaning: 'God is perfectly loving and always does what is right.' },
    doctrine: { term: 'Redemption', meaning: 'being bought back and set free' },
    gospel: 'The Holy Spirit helps believers live to please God.',
    questions: [
      {
        ask: 'What are the wages of sin?',
        options: ['Death', 'Gold', 'A day off', 'Candy'],
        correct: 0,
        teach: 'The wages of sin is death — that is what sin pays out in the end.',
      },
      {
        ask: 'What is the GIFT of God?',
        options: ['Eternal life in Christ Jesus our Lord', 'A new house', 'Long summers', 'Silver coins'],
        correct: 0,
        teach: 'Eternal life. Sin pays wages; God gives gifts. Our whole verse in one contrast.',
      },
      {
        ask: 'Paul says to offer our bodies as instruments of righteousness. Name one way your hands or words could be an instrument for good this week.',
        accept: ['help', 'kind words', 'share', 'hug', 'encourage', 'clean up', 'pray', 'i can'],
        sample: 'My hands can help carry things, and my words can encourage my sister.',
        teach: 'Yes — the same hands and words, pointed at goodness. That is what instruments of righteousness means.',
      },
      {
        ask: 'Everyone serves something. According to Paul, what are the two choices?',
        options: ['Sin, or obedience to God', 'Work or play', 'School or home', 'There are no choices'],
        correct: 0,
        teach: 'Sin leading to death, or obedience leading to righteousness. Every heart serves one or the other.',
        grades: [3],
      },
      {
        ask: 'Is eternal life something we buy or something God gives?',
        options: ['God gives it as a free gift', 'We buy it', 'We win it in a race', 'We find it'],
        correct: 0,
        teach: 'A free gift, in Christ Jesus our Lord.',
        grades: [1],
      },
    ],
  },
  {
    week: 12,
    title: 'The Law and the Believer',
    reference: 'Romans 7',
    summary:
      'Paul gets very honest this week: even people who love God still struggle with sin. If you have ever done the wrong thing you did not want to do, this chapter understands you.',
    art: 'tablets_heart',
    minutes: 18,
    passage: [
      "What shall we say then? Is the law sin? May it never be! However, I wouldn’t have known sin, except through the law. For I wouldn’t have known coveting, unless the law had said, “You shall not covet.” Therefore the law indeed is holy, and the commandment holy, and righteous, and good.",
      "For we know that the law is spiritual, but I am fleshly, sold under sin. For I don’t know what I am doing. For I don’t practice what I desire to do; but what I hate, that I do.",
      "For the good which I desire, I don’t do; but the evil which I don’t desire, that I practice. But if what I don’t desire, that I do, it is no more I that do it, but sin which dwells in me. I find then the law, that, to me, while I desire to do good, evil is present.",
      "For I delight in God’s law after the inward man, but I see a different law in my members, warring against the law of my mind, and bringing me into captivity under the law of sin which is in my members. What a wretched man I am! Who will deliver me out of the body of this death?",
      "I thank God through Jesus Christ, our Lord! So then with the mind, I myself serve God’s law, but with the flesh, the sin’s law.",
    ],
    memoryVerse: {
      text: 'Thanks be to God, who delivers me through Jesus Christ our Lord!',
      reference: 'Romans 7:25a',
    },
    truth: 'Believers belong to God even though they still sin.',
    attribute: { name: 'Father', meaning: 'God has a loving relationship with every believer that lasts forever.' },
    doctrine: { term: 'Sanctification', meaning: 'God making a believer more like Jesus, little by little' },
    gospel: 'Jesus frees believers from sin’s power.',
    questions: [
      {
        ask: 'Is the law sin, according to Paul?',
        options: ['No — the law is holy, righteous, and good', 'Yes, the law is bad', 'The law is a secret', 'Paul does not say'],
        correct: 0,
        teach: 'Never! The law is good — it shows us sin the way light shows dust.',
      },
      {
        ask: 'What honest struggle does Paul describe?',
        options: [
          'He does the wrong he hates instead of the good he wants',
          'He cannot read',
          'He is afraid of Rome',
          'He has no struggles',
        ],
        correct: 0,
        teach: 'The good he wants, he does not do; the wrong he hates, he does. Even apostles know that fight.',
      },
      {
        ask: 'Paul cries, "Who will deliver me?" What is his answer?',
        options: ['Thanks be to God — through Jesus Christ our Lord!', 'No one can', 'He must try harder', 'The law will'],
        correct: 0,
        teach: 'The cry becomes our memory verse: God delivers, through Jesus.',
      },
      {
        ask: 'Have you ever done something wrong even though you knew better? How did it feel?',
        accept: ['yes', 'bad', 'sorry', 'sad', 'guilty', 'i felt'],
        sample: 'Yes — I felt sorry afterward.',
        teach: 'That feeling is what Paul describes. And his rescue is ours too: Jesus, not trying harder alone.',
        grades: [1],
      },
      {
        ask: 'Believers still sin, yet still belong to God. Why is that comforting rather than an excuse to sin?',
        accept: ['god keeps us', 'we are still his', 'he forgives', 'we keep fighting sin', 'his love does not quit', 'not an excuse'],
        sample: 'God does not give up on us — so we keep fighting sin without fear of losing His love.',
        teach: 'A child who stumbles is still in the family. That security is fuel for the fight, not a pass from it.',
        grades: [3],
      },
    ],
  },
  {
    week: 13,
    title: 'Life Through the Spirit',
    reference: 'Romans 8:1-17',
    summary:
      'After the struggle of chapter seven comes the most freeing sentence in the letter: no condemnation. And God does not leave believers to try alone — His own Spirit moves in.',
    art: 'flame',
    minutes: 18,
    passage: [
      "There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit. For the law of the Spirit of life in Christ Jesus made me free from the law of sin and of death. For what the law couldn’t do, in that it was weak through the flesh, God did, sending his own Son in the likeness of sinful flesh and for sin, he condemned sin in the flesh;",
      "that the ordinance of the law might be fulfilled in us, who walk not after the flesh, but after the Spirit. For those who live according to the flesh set their minds on the things of the flesh, but those who live according to the Spirit, the things of the Spirit. For the mind of the flesh is death, but the mind of the Spirit is life and peace;",
      "But you are not in the flesh but in the Spirit, if it is so that the Spirit of God dwells in you. If Christ is in you, the body is dead because of sin, but the spirit is alive because of righteousness. But if the Spirit of him who raised up Jesus from the dead dwells in you, he who raised up Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.",
      "For if you live after the flesh, you must die; but if by the Spirit you put to death the deeds of the body, you will live. For as many as are led by the Spirit of God, these are children of God. For you didn’t receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, “Abba! Father!”",
      "The Spirit himself testifies with our spirit that we are children of God; and if children, then heirs; heirs of God, and joint heirs with Christ; if indeed we suffer with him, that we may also be glorified with him.",
    ],
    memoryVerse: {
      text: 'Therefore, there is now no condemnation for those who are in Christ Jesus.',
      reference: 'Romans 8:1',
    },
    truth: 'The Holy Spirit gives believers power to live for God.',
    attribute: { name: 'Guide', meaning: 'The Holy Spirit leads believers to live for God.' },
    doctrine: { term: 'The Holy Spirit', meaning: 'God living in believers to help them' },
    gospel: 'Believers receive the Holy Spirit through faith in Christ.',
    questions: [
      {
        ask: 'What is there NONE of for those who are in Christ Jesus?',
        options: ['Condemnation', 'Homework', 'Weather', 'Waiting'],
        correct: 0,
        teach: 'No condemnation. Not less — none. That is our memory verse.',
      },
      {
        ask: 'Who comes to live inside believers?',
        options: ['The Spirit of God', 'An angel', 'Nobody', 'A prophet'],
        correct: 0,
        teach: 'God’s own Spirit dwells in believers — a helper closer than breath.',
      },
      {
        ask: 'What special name do God’s children get to call Him?',
        options: ['Abba — Father', 'Sir', 'Judge only', 'Stranger'],
        correct: 0,
        teach: '"Abba! Father!" — the warm word a child uses for a dad who is near.',
      },
      {
        ask: 'The Spirit tells our hearts something wonderful. What are believers called?',
        accept: ['children of god', 'children', 'gods children', 'his kids', 'heirs'],
        sample: 'Children of God.',
        teach: 'Children of God — and if children, then heirs, sharing everything with Jesus.',
        grades: [1],
      },
      {
        ask: 'The law was weak to save us. What did God do that the law could not?',
        accept: ['sent his son', 'sent jesus', 'god did it himself', 'jesus condemned sin', 'the cross'],
        sample: 'God sent His own Son to do what the law never could.',
        teach: 'Rules could point the way but not carry us there. So God came Himself.',
        grades: [3],
      },
    ],
  },
  {
    week: 14,
    title: 'Suffering and Glory',
    reference: 'Romans 8:18-27',
    summary:
      'Our last lesson looks at hard days with honest eyes — and then looks up. What is coming, Paul says, will outshine every suffering. And until then, the Spirit helps us pray.',
    art: 'crown',
    minutes: 18,
    passage: [
      "For I consider that the sufferings of this present time are not worthy to be compared with the glory which will be revealed toward us. For the creation waits with eager expectation for the children of God to be revealed. For the creation was subjected to vanity, not of its own will, but because of him who subjected it, in hope",
      "that the creation itself also will be delivered from the bondage of decay into the liberty of the glory of the children of God. For we know that the whole creation groans and travails in pain together until now. Not only so, but ourselves also, who have the first fruits of the Spirit, even we ourselves groan within ourselves, waiting for adoption, the redemption of our body.",
      "For we were saved in hope, but hope that is seen is not hope. For who hopes for that which he sees? But if we hope for that which we don’t see, we wait for it with patience. In the same way, the Spirit also helps our weaknesses, for we don’t know how to pray as we ought. But the Spirit himself makes intercession for us with groanings which can’t be uttered.",
      "He who searches the hearts knows what is on the Spirit’s mind, because he makes intercession for the saints according to God.",
    ],
    memoryVerse: {
      text: 'I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.',
      reference: 'Romans 8:18',
    },
    truth: 'Believers eagerly wait for God’s promised future glory.',
    attribute: { name: 'Glory', meaning: 'God’s glory is the total of all His attributes.' },
    doctrine: { term: 'Suffering', meaning: 'hard times, which God promises to one day end' },
    gospel: 'One day God will remove all suffering from the lives of His children.',
    questions: [
      {
        ask: 'How do today’s sufferings compare with the glory that is coming?',
        options: [
          'They are not worth comparing — the glory is far greater',
          'They are about equal',
          'Suffering is greater',
          'Paul does not say',
        ],
        correct: 0,
        teach: 'Not worth comparing. Put them on a scale and glory outweighs everything.',
      },
      {
        ask: 'What is the whole creation doing while it waits?',
        options: ['Groaning, like waiting in pain for something better', 'Sleeping', 'Celebrating', 'Nothing'],
        correct: 0,
        teach: 'Groaning — the whole world aches for the day God makes everything new.',
      },
      {
        ask: 'When we do not know how to pray, who helps us?',
        options: ['The Spirit himself', 'Nobody', 'Only pastors', 'The weather'],
        correct: 0,
        teach: 'The Spirit himself prays for us, deeper than words. You are never praying alone.',
      },
      {
        ask: 'Hope means waiting for something we cannot see yet. What is something you hope for?',
        accept: ['i hope', 'heaven', 'to see', 'one day', 'that'],
        sample: 'I hope for the day when nothing hurts anymore.',
        teach: 'Hold that hope. Waiting with patience is what hope looks like on ordinary days.',
        grades: [1],
      },
      {
        ask: 'You finished all fourteen lessons of Romans! What is one thing from this whole letter you want to remember?',
        accept: ['grace', 'faith', 'jesus', 'no condemnation', 'peace', 'the gospel', 'god', 'i want to remember'],
        sample: 'That there is now no condemnation for those in Christ Jesus.',
        teach: 'Carry it with you. Paul wrote this letter so it would travel — and now it travels with you.',
        grades: [3],
      },
    ],
  },
];
