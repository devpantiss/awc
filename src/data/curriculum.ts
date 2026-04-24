// ============================================================
// ECCE CURRICULUM DATA - Based on India's NEP 2020 Guidelines
// Foundational Stage: 3-6 years (Anganwadi + Pre-Primary)
// 5 Holistic Development Domains
// ============================================================

export interface CurriculumActivity {
  id: string;
  title: string;
  type: 'story' | 'game' | 'craft' | 'song' | 'exercise' | 'tracing' | 'counting' | 'observation' | 'role-play' | 'board';
  duration: string;
  description: string;
  materials?: string[];
  steps: string[];
}

export interface CurriculumLesson {
  id: string;
  title: string;
  objective: string;
  weekNumber: number;
  activities: CurriculumActivity[];
  completed: boolean;
}

export interface CurriculumModule {
  id: string;
  title: string;
  domainId: string;
  ageGroup: '3-4' | '4-5' | '5-6';
  totalLessons: number;
  completedLessons: number;
  description: string;
  icon: string;
  lessons: CurriculumLesson[];
}

export interface DevelopmentDomain {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  darkBgColor: string;
  darkBorderColor: string;
  icon: string;
  modules: CurriculumModule[];
}

// ---- HOLISTIC DEVELOPMENT DOMAINS (NEP 2020 / ECCE Framework) ----

export const curriculumDomains: DevelopmentDomain[] = [
  // ========== 1. PHYSICAL DEVELOPMENT ==========
  {
    id: 'physical',
    title: 'Physical Development',
    subtitle: 'Gross & Fine Motor Skills',
    description: 'Develops body coordination, strength, balance, and fine motor control through structured physical activities, yoga, and hand-eye coordination exercises.',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    darkBgColor: 'dark:bg-orange-950/20',
    darkBorderColor: 'dark:border-orange-800',
    icon: '🏃',
    modules: [
      {
        id: 'phys-gross',
        title: 'Gross Motor & Yoga',
        domainId: 'physical',
        ageGroup: '3-4',
        totalLessons: 4,
        completedLessons: 3,
        description: 'Running, jumping, balancing, and basic yoga asanas for body awareness.',
        icon: '🧘',
        lessons: [
          {
            id: 'phys-g-1', title: 'Animal Walk Parade', objective: 'Develop crawling, hopping, and galloping movements', weekNumber: 1, completed: true,
            activities: [
              { id: 'a1', title: 'Frog Jumps', type: 'exercise', duration: '10 min', description: 'Children squat and jump like frogs across the mat', steps: ['Demonstrate the frog squat position', 'Children jump forward 5 times', 'Add a "lily pad" target to jump to', 'Sing the frog song while jumping'] },
              { id: 'a2', title: 'Bear Walk Race', type: 'game', duration: '10 min', description: 'Walk on hands and feet like bears from one end to another', steps: ['Show bear walk position — hands and feet on floor', 'Race in pairs to the finish line', 'Cheer for all participants'] },
              { id: 'a3', title: 'Butterfly Stretch', type: 'exercise', duration: '5 min', description: 'Cool-down butterfly sitting pose with flapping legs', steps: ['Sit with feet together, knees out', 'Hold feet and flap knees gently', 'Deep breaths — "smell the flower, blow the candle"'] },
            ]
          },
          {
            id: 'phys-g-2', title: 'Balance & Beam Walk', objective: 'Develop static and dynamic balance', weekNumber: 2, completed: true,
            activities: [
              { id: 'a4', title: 'Line Walking', type: 'exercise', duration: '10 min', description: 'Walk heel-to-toe along a chalk line', steps: ['Draw a straight chalk line on floor', 'Walk placing heel touching the toe', 'Try with arms stretched out', 'Try with a book on the head'] },
              { id: 'a5', title: 'Tree Pose (Vrikshasana)', type: 'exercise', duration: '8 min', description: 'Stand on one leg like a tree', steps: ['Stand tall, feet together', 'Lift one foot to the inner calf', 'Raise arms overhead like branches', 'Hold for 5 breaths each side'] },
            ]
          },
          {
            id: 'phys-g-3', title: 'Ball Skills', objective: 'Develop throwing, catching, and kicking precision', weekNumber: 3, completed: true,
            activities: [
              { id: 'a6', title: 'Target Throw', type: 'game', duration: '12 min', description: 'Underarm throw a ball into buckets at different distances', materials: ['Soft balls', 'Plastic buckets', 'Chalk for distance marks'], steps: ['Set up 3 buckets at different distances', 'Each child gets 5 throws', 'Count how many land in the bucket', 'Celebrate improvements'] },
            ]
          },
          {
            id: 'phys-g-4', title: 'Obstacle Course', objective: 'Combine crawling, jumping, and balance in sequence', weekNumber: 4, completed: false,
            activities: [
              { id: 'a7', title: 'Indoor Adventure Course', type: 'game', duration: '15 min', description: 'Crawl under tables, jump over ropes, balance on beam', materials: ['Chairs', 'Rope', 'Mats', 'Hula hoops'], steps: ['Set up 5 stations around the room', 'Demo each station\'s movement', 'Children go one at a time', 'Time each child — aim to beat your own time'] },
            ]
          },
        ]
      },
      {
        id: 'phys-fine',
        title: 'Fine Motor & Handwriting Readiness',
        domainId: 'physical',
        ageGroup: '4-5',
        totalLessons: 4,
        completedLessons: 1,
        description: 'Cutting, tearing, stringing beads, clay work, and pre-writing patterns.',
        icon: '✂️',
        lessons: [
          {
            id: 'phys-f-1', title: 'Pattern Tracing', objective: 'Practice straight lines, curves, and zig-zags', weekNumber: 1, completed: true,
            activities: [
              { id: 'a8', title: 'Green Board Tracing', type: 'board', duration: '10 min', description: 'Trace standing lines, sleeping lines, and curves on the Green Board', steps: ['Open the Green Board', 'Select the pattern guide for "Standing Lines"', 'Children trace the dotted pattern with chalk', 'Move to sleeping lines, then curves'] },
              { id: 'a9', title: 'Sand Tray Writing', type: 'tracing', duration: '8 min', description: 'Trace patterns in a sand-filled tray for tactile learning', materials: ['Flat tray', 'Fine sand', 'Pattern cards'], steps: ['Fill tray with sand and smooth it flat', 'Show pattern card (zig-zag)', 'Child traces in the sand with finger', 'Smooth and repeat with next pattern'] },
            ]
          },
          {
            id: 'phys-f-2', title: 'Bead Stringing & Threading', objective: 'Strengthen pincer grip and hand-eye coordination', weekNumber: 2, completed: false,
            activities: [
              { id: 'a10', title: 'Color Pattern Beads', type: 'craft', duration: '12 min', description: 'String beads following a red-blue-red-blue color pattern', materials: ['Large wooden beads', 'Thick string/shoelace'], steps: ['Show the pattern: red, blue, red, blue', 'Child picks beads and strings them', 'Check pattern together', 'Try a new pattern: red, red, blue'] },
            ]
          },
          {
            id: 'phys-f-3', title: 'Clay & Dough Play', objective: 'Strengthen hand muscles through squeezing, rolling, and shaping', weekNumber: 3, completed: false,
            activities: [
              { id: 'a11', title: 'Make Your Name Letters', type: 'craft', duration: '15 min', description: 'Roll clay into ropes and shape into the letters of their name', materials: ['Play dough or clay', 'Name cards'], steps: ['Give each child their name card', 'Show how to roll a thin rope', 'Shape rope into the first letter', 'Complete all letters of the name'] },
            ]
          },
          {
            id: 'phys-f-4', title: 'Scissor Skills', objective: 'Practice safe cutting along straight and curved lines', weekNumber: 4, completed: false,
            activities: [
              { id: 'a12', title: 'Snip and Cut', type: 'craft', duration: '10 min', description: 'Cut along thick lines — straight, then wavy, then zig-zag', materials: ['Child-safe scissors', 'Printed cutting sheets'], steps: ['Review safe scissor grip', 'Practice snipping paper strips', 'Cut along straight thick lines', 'Progress to wavy and zig-zag lines'] },
            ]
          },
        ]
      },
    ]
  },

  // ========== 2. COGNITIVE DEVELOPMENT ==========
  {
    id: 'cognitive',
    title: 'Cognitive Development',
    subtitle: 'Thinking, Reasoning & Problem Solving',
    description: 'Builds logical thinking, classification, sequencing, pattern recognition, and early scientific inquiry through hands-on exploration.',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    darkBgColor: 'dark:bg-blue-950/20',
    darkBorderColor: 'dark:border-blue-800',
    icon: '🧠',
    modules: [
      {
        id: 'cog-sort',
        title: 'Sorting & Classification',
        domainId: 'cognitive',
        ageGroup: '3-4',
        totalLessons: 3,
        completedLessons: 2,
        description: 'Sort objects by color, shape, size, and use. Group and regroup by attributes.',
        icon: '🔷',
        lessons: [
          {
            id: 'cog-s-1', title: 'Color Sorting', objective: 'Sort objects into groups by color', weekNumber: 1, completed: true,
            activities: [
              { id: 'a13', title: 'Color Basket Game', type: 'game', duration: '10 min', description: 'Sort colored buttons into matching bowls', materials: ['Colored buttons/blocks', '4 colored bowls'], steps: ['Place mixed objects in center', 'Children pick one and say the color', 'Place in the matching bowl', 'Count how many in each bowl'] },
            ]
          },
          {
            id: 'cog-s-2', title: 'Shape Sorting', objective: 'Recognize and sort circle, square, triangle', weekNumber: 2, completed: true,
            activities: [
              { id: 'a14', title: 'Shape Hunt', type: 'observation', duration: '12 min', description: 'Find shapes in the classroom — wheels are circles, windows are rectangles', steps: ['Introduce 3 shapes with cut-outs', 'Walk around the room together', 'Point and name shapes you find', 'Draw discovered shapes on board'] },
            ]
          },
          {
            id: 'cog-s-3', title: 'Multi-Attribute Sorting', objective: 'Sort by TWO attributes (big red vs small blue)', weekNumber: 3, completed: false,
            activities: [
              { id: 'a15', title: 'Two-Rule Sort', type: 'game', duration: '10 min', description: 'Sort objects using two rules at once: big AND red vs small AND blue', materials: ['Mixed size/color blocks'], steps: ['Review single-attribute sorting', 'Introduce: "find all BIG RED ones"', 'Children sort into 2-rule groups', 'Discuss — what makes them the same?'] },
            ]
          },
        ]
      },
      {
        id: 'cog-pattern',
        title: 'Patterns & Sequencing',
        domainId: 'cognitive',
        ageGroup: '4-5',
        totalLessons: 3,
        completedLessons: 0,
        description: 'Recognize, extend, and create AB/ABB/ABC patterns. Sequence daily routines and stories.',
        icon: '🔁',
        lessons: [
          {
            id: 'cog-p-1', title: 'AB Patterns', objective: 'Create and extend simple alternating patterns', weekNumber: 1, completed: false,
            activities: [
              { id: 'a16', title: 'Clap-Tap Pattern', type: 'song', duration: '8 min', description: 'Create sound patterns: clap-tap-clap-tap', steps: ['Teacher demos: clap-tap-clap-tap', 'Children join in and repeat', 'Ask: "What comes next?"', 'Try new patterns: clap-clap-tap'] },
              { id: 'a17', title: 'Bead Pattern String', type: 'craft', duration: '10 min', description: 'String beads in red-yellow-red-yellow pattern', materials: ['Colored beads', 'String'], steps: ['Show AB pattern with 4 beads', 'Children continue the pattern', 'Check together', 'Display on the wall'] },
            ]
          },
          {
            id: 'cog-p-2', title: 'Story Sequencing', objective: 'Order 3-4 picture cards showing a story sequence', weekNumber: 2, completed: false,
            activities: [
              { id: 'a18', title: 'What Comes First?', type: 'story', duration: '12 min', description: 'Sequence cards: egg → chick → chicken', materials: ['Sequence picture cards'], steps: ['Shuffle 3 picture cards', 'Ask "what happened first?"', 'Children arrange in order', 'Tell the story together using the cards'] },
            ]
          },
          {
            id: 'cog-p-3', title: 'Daily Routine Sequence', objective: 'Understand before/after in daily activities', weekNumber: 3, completed: false,
            activities: [
              { id: 'a19', title: 'My Day Pictures', type: 'craft', duration: '15 min', description: 'Draw or paste pictures showing morning routine in order', materials: ['Drawing sheets', 'Crayons', 'Glue', 'Magazine cut-outs'], steps: ['Discuss: "What do you do when you wake up?"', 'Give 4 routine pictures to each child', 'Children paste in correct order', 'Present to the class: "First I... then I..."'] },
            ]
          },
        ]
      },
      {
        id: 'cog-3dshapes',
        title: '3D Shapes Identification',
        domainId: 'cognitive',
        ageGroup: '5-6',
        totalLessons: 2,
        completedLessons: 0,
        description: 'Recognize, match, and construct basic 3D shapes: sphere, cylinder, cube, and cone.',
        icon: '🧊',
        lessons: [
          {
            id: 'cog-3d-1', title: 'Everyday 3D Shapes', objective: 'Identify spheres and cylinders in the real world', weekNumber: 1, completed: false,
            activities: [
              { id: 'a-3d-1', title: 'Roll and Slide', type: 'game', duration: '15 min', description: 'Test which objects roll (sphere/cylinder) and which slide (cube)', materials: ['Ball', 'Can', 'Box', 'Ramp'], steps: ['Set up a small ramp', 'Test rolling a ball (sphere) down', 'Test sliding a box (cube) down', 'Test rolling and sliding a can (cylinder)'] },
            ]
          },
          {
            id: 'cog-3d-2', title: 'Cube and Cone Discovery', objective: 'Identify cubes and cones', weekNumber: 2, completed: false,
            activities: [
              { id: 'a-3d-2', title: 'Shape Sorting 3D', type: 'observation', duration: '12 min', description: 'Sort classroom objects into boxes labeled "Cube" and "Cone"', materials: ['Dice', 'Blocks', 'Funnel', 'Party Hat'], steps: ['Show a block (cube) and a party hat (cone)', 'Walk around the room to find similar objects', 'Sort them into two piles', 'Discuss corners and flat sides'] },
            ]
          }
        ]
      },
    ]
  },

  // ========== 3. LANGUAGE & LITERACY ==========
  {
    id: 'language',
    title: 'Language & Literacy',
    subtitle: 'Odia & Hindi Readiness',
    description: 'Develops listening, speaking, pre-reading and pre-writing skills through stories, rhymes, letter recognition, and conversation in mother tongue (Odia) and Hindi.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    darkBgColor: 'dark:bg-emerald-950/20',
    darkBorderColor: 'dark:border-emerald-800',
    icon: '📖',
    modules: [
      {
        id: 'lang-listen',
        title: 'Listening & Speaking',
        domainId: 'language',
        ageGroup: '3-4',
        totalLessons: 4,
        completedLessons: 4,
        description: 'Rhymes, story listening, picture description, and verbal expression in Odia.',
        icon: '👂',
        lessons: [
          {
            id: 'lang-l-1', title: 'Odia Rhyme Time', objective: 'Recite 3 Odia nursery rhymes with actions', weekNumber: 1, completed: true,
            activities: [
              { id: 'a20', title: 'Chanda Mama Door Ke', type: 'song', duration: '10 min', description: 'Sing the Odia moon rhyme with hand gestures', steps: ['Teacher sings the rhyme slowly with actions', 'Children repeat line by line', 'Sing together 3 times', 'Ask: "Who is Chanda Mama?"'] },
            ]
          },
          {
            id: 'lang-l-2', title: 'Story Circle', objective: 'Listen to a story and answer 3 questions about it', weekNumber: 2, completed: true,
            activities: [
              { id: 'a21', title: 'The Clever Fox', type: 'story', duration: '15 min', description: 'Tell the Panchatantra story of the clever fox using picture cards', materials: ['Story cards or picture book'], steps: ['Gather children in a circle', 'Tell story with picture cards', 'After: "Who was clever? Why?"', 'Children retell to a partner'] },
            ]
          },
          {
            id: 'lang-l-3', title: 'Picture Talk', objective: 'Describe a picture using 3-4 sentences', weekNumber: 3, completed: true,
            activities: [
              { id: 'a22', title: 'What Do You See?', type: 'observation', duration: '10 min', description: 'Show a colorful scene picture and ask children to describe it', materials: ['Large scene picture (market/festival)'], steps: ['Hold up the picture', 'Ask: "What do you see?"', 'Guide: "Who is in the picture?"', 'Each child says one thing they see'] },
            ]
          },
          {
            id: 'lang-l-4', title: 'Show & Tell', objective: 'Speak in front of the group about a favourite object', weekNumber: 4, completed: true,
            activities: [
              { id: 'a23', title: 'My Favourite Thing', type: 'role-play', duration: '15 min', description: 'Each child brings a small object and tells the class about it', steps: ['Each child stands and shows their object', 'They say: "This is my ___. I like it because ___."', 'Class asks one question', 'Clap for each speaker'] },
            ]
          },
        ]
      },
      {
        id: 'lang-letters',
        title: 'Odia Akshar (Letter) Recognition',
        domainId: 'language',
        ageGroup: '4-5',
        totalLessons: 4,
        completedLessons: 1,
        description: 'Recognize and write the first 10 Odia vowels (ସ୍ୱରବର୍ଣ୍ଣ) with tracing exercises.',
        icon: 'ଅ',
        lessons: [
          {
            id: 'lang-a-1', title: 'ଅ ଆ Introduction', objective: 'Recognize and trace the first two Odia vowels', weekNumber: 1, completed: true,
            activities: [
              { id: 'a24', title: 'Letter Song: ଅ ଆ', type: 'song', duration: '8 min', description: 'Sing the ଅ ଆ song with pictures (ଅ = ଅଁଳା, ଆ = ଆମ୍ବ)', steps: ['Show flashcard: ଅ for ଅଁଳା (amla)', 'Sing the letter song', 'Show: ଆ for ଆମ୍ବ (mango)', 'Children repeat with actions'] },
              { id: 'a25', title: 'Trace ଅ and ଆ on Green Board', type: 'board', duration: '10 min', description: 'Use the Green Board to trace ଅ and ଆ multiple times', steps: ['Open Green Board with ଅ guide', 'Children trace the dotted letter', 'Practice 5 times each', 'Try writing without the guide'] },
            ]
          },
          {
            id: 'lang-a-2', title: 'ଇ ଈ ଉ ଊ', objective: 'Recognize vowels ଇ, ଈ, ଉ, ଊ', weekNumber: 2, completed: false,
            activities: [
              { id: 'a26', title: 'Flashcard Match', type: 'game', duration: '10 min', description: 'Match letter flashcards to picture flashcards', materials: ['Letter cards', 'Picture cards'], steps: ['Spread picture cards on floor', 'Hold up a letter card', 'Children find the matching picture', 'Say the letter and word together'] },
            ]
          },
          {
            id: 'lang-a-3', title: 'ଏ ଐ ଓ ଔ', objective: 'Recognize remaining Odia vowels', weekNumber: 3, completed: false,
            activities: [
              { id: 'a27', title: 'Vowel Song Chain', type: 'song', duration: '10 min', description: 'Sing all vowels in sequence with clapping rhythm', steps: ['Review ଅ ଆ ଇ ଈ ଉ ଊ', 'Add ଏ ଐ ଓ ଔ', 'Sing entire vowel chain', 'Challenge: how fast can we say them?'] },
            ]
          },
          {
            id: 'lang-a-4', title: 'Vowel Review & Writing', objective: 'Write all 10 vowels from memory', weekNumber: 4, completed: false,
            activities: [
              { id: 'a28', title: 'Vowel Writing Test (Green Board)', type: 'board', duration: '15 min', description: 'Write all 10 Odia vowels on the Green Board without guides', steps: ['Clear the Green Board', 'Teacher calls out a vowel', 'Child writes it on the board', 'Check formation and celebrate'] },
            ]
          },
        ]
      },
      {
        id: 'lang-multi',
        title: 'Multilingual Readiness (English & Hindi)',
        domainId: 'language',
        ageGroup: '5-6',
        totalLessons: 2,
        completedLessons: 0,
        description: 'Introduction to basic English alphabets and Hindi vowels.',
        icon: '🔤',
        lessons: [
          {
            id: 'lang-m-1', title: 'English Alphabet A-E', objective: 'Recognize capital letters A to E', weekNumber: 1, completed: false,
            activities: [
              { id: 'a-m-1', title: 'Alphabet Trace A-E', type: 'board', duration: '15 min', description: 'Trace letters A, B, C, D, E on the Green Board', steps: ['Open the Green Board English guides', 'Show A for Apple', 'Trace A together', 'Practice B, C, D, E'] }
            ]
          },
          {
            id: 'lang-m-2', title: 'Hindi Vowels अ आ इ ई', objective: 'Recognize first 4 Hindi vowels', weekNumber: 2, completed: false,
            activities: [
              { id: 'a-m-2', title: 'Hindi Swar Geet', type: 'song', duration: '10 min', description: 'Sing a song with अ, आ, इ, ई', steps: ['Show flashcard for अ (Anar)', 'Show आ (Aam)', 'Sing rhyme together', 'Match cards on the floor'] }
            ]
          }
        ]
      },
    ]
  },

  // ========== 4. NUMERACY ==========
  {
    id: 'numeracy',
    title: 'Early Numeracy',
    subtitle: 'Numbers, Counting & Shapes',
    description: 'Develops number sense (1-20), counting, shape recognition, measurement concepts, and spatial awareness through play-based math activities.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    darkBgColor: 'dark:bg-purple-950/20',
    darkBorderColor: 'dark:border-purple-800',
    icon: '🔢',
    modules: [
      {
        id: 'num-count',
        title: 'Counting 1-10',
        domainId: 'numeracy',
        ageGroup: '3-4',
        totalLessons: 4,
        completedLessons: 3,
        description: 'Rote counting, one-to-one correspondence, number recognition 1-10.',
        icon: '🔟',
        lessons: [
          {
            id: 'num-c-1', title: 'Count with Me (1-5)', objective: 'Count objects 1 to 5 with one-to-one correspondence', weekNumber: 1, completed: true,
            activities: [
              { id: 'a29', title: 'Stone Counting', type: 'counting', duration: '10 min', description: 'Touch and count stones one by one up to 5', materials: ['Small stones or seeds'], steps: ['Give each child 5 stones', 'Touch and count: "one, two, three..."', 'Ask "give me 3 stones"', 'Repeat with different numbers'] },
            ]
          },
          {
            id: 'num-c-2', title: 'Count with Me (6-10)', objective: 'Extend counting to 10 with materials', weekNumber: 2, completed: true,
            activities: [
              { id: 'a30', title: 'Clap Counting', type: 'song', duration: '8 min', description: 'Clap and count together from 1 to 10', steps: ['Clap once: "one!", clap twice: "two!"...', 'Count up to 10', 'Count backwards from 10', 'Count by stomping feet'] },
            ]
          },
          {
            id: 'num-c-3', title: 'Number Recognition 1-5', objective: 'Match numeral symbols to quantities', weekNumber: 3, completed: true,
            activities: [
              { id: 'a31', title: 'Number-Object Match', type: 'game', duration: '10 min', description: 'Place number card next to the matching group of objects', materials: ['Number cards 1-5', 'Small objects'], steps: ['Lay out number cards', 'Count objects into groups', 'Place groups next to matching number', 'Check together'] },
              { id: 'a32', title: 'Write Numbers on Green Board', type: 'board', duration: '10 min', description: 'Trace and write numbers 1-5 on the Green Board', steps: ['Show number formation for 1', 'Children trace on Green Board', 'Progress through 2, 3, 4, 5', 'Practice writing without guides'] },
            ]
          },
          {
            id: 'num-c-4', title: 'Number Recognition 6-10', objective: 'Recognize and write numbers 6 to 10', weekNumber: 4, completed: false,
            activities: [
              { id: 'a33', title: 'Number Bingo', type: 'game', duration: '12 min', description: 'Play bingo with numbers 1-10', materials: ['Bingo cards', 'Number tokens'], steps: ['Give each child a bingo card', 'Call out numbers randomly', 'Children mark their card', 'First to fill a row wins'] },
            ]
          },
        ]
      },
    ]
  },

  // ========== 5. SOCIO-EMOTIONAL & CREATIVE ==========
  {
    id: 'socioemotional',
    title: 'Socio-Emotional & Creative',
    subtitle: 'Feelings, Friendship & Expression',
    description: 'Nurtures emotional awareness, self-regulation, cooperation, empathy, and creative expression through art, music, drama, and collaborative play.',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    darkBgColor: 'dark:bg-pink-950/20',
    darkBorderColor: 'dark:border-pink-800',
    icon: '❤️',
    modules: [
      {
        id: 'se-feelings',
        title: 'Understanding Feelings',
        domainId: 'socioemotional',
        ageGroup: '3-4',
        totalLessons: 3,
        completedLessons: 1,
        description: 'Name and express basic emotions — happy, sad, angry, scared. Learn calming strategies.',
        icon: '😊',
        lessons: [
          {
            id: 'se-f-1', title: 'Feelings Faces', objective: 'Identify and name 4 basic emotions', weekNumber: 1, completed: true,
            activities: [
              { id: 'a34', title: 'Mirror Faces', type: 'game', duration: '10 min', description: 'Make facial expressions in pairs — happy, sad, angry, surprised', steps: ['Pair up children facing each other', 'Teacher says: "Show me HAPPY!"', 'Children make the face', 'Partner copies the face'] },
              { id: 'a35', title: 'Draw My Feeling', type: 'craft', duration: '10 min', description: 'Draw a face showing how you feel today on the Green Board', materials: ['Green Board'], steps: ['Ask: "How do you feel today?"', 'Children draw a face on Green Board', 'Share with a partner', 'Discuss: "Why do you feel that way?"'] },
            ]
          },
          {
            id: 'se-f-2', title: 'When I Feel Angry', objective: 'Learn 2 calming strategies for anger', weekNumber: 2, completed: false,
            activities: [
              { id: 'a36', title: 'Balloon Breathing', type: 'exercise', duration: '8 min', description: 'Breathe in slowly to "inflate" an imaginary balloon, breathe out to deflate', steps: ['Stand with hands on tummy', 'Breathe in: tummy puffs out like a balloon', 'Breathe out slowly: balloon deflates', 'Repeat 5 times — notice feeling calm'] },
              { id: 'a37', title: 'The Angry Octopus Story', type: 'story', duration: '10 min', description: 'Story about an octopus who learns to calm down', steps: ['Read the story with expressions', 'Discuss: "What did the octopus do when angry?"', 'Practice the octopus breathing', 'Create a "calm corner" in the classroom'] },
            ]
          },
          {
            id: 'se-f-3', title: 'Kindness Chain', objective: 'Practice acts of kindness and cooperation', weekNumber: 3, completed: false,
            activities: [
              { id: 'a38', title: 'Paper Chain of Kindness', type: 'craft', duration: '15 min', description: 'Each child writes/draws one kind act on a paper strip, linked into a chain', materials: ['Colored paper strips', 'Glue', 'Crayons'], steps: ['Discuss: "What is a kind thing to do?"', 'Each child draws one kind act', 'Link strips into a paper chain', 'Hang the "Kindness Chain" in the classroom'] },
            ]
          },
        ]
      },
      {
        id: 'se-creative',
        title: 'Creative Expression',
        domainId: 'socioemotional',
        ageGroup: '4-5',
        totalLessons: 3,
        completedLessons: 0,
        description: 'Free drawing, painting, puppet making, and dramatic play to express ideas and imagination.',
        icon: '🎨',
        lessons: [
          {
            id: 'se-c-1', title: 'Free Drawing Day', objective: 'Express freely through drawing without prompts', weekNumber: 1, completed: false,
            activities: [
              { id: 'a39', title: 'Draw Anything', type: 'craft', duration: '15 min', description: 'Free drawing time with crayons, chalks, and paper', materials: ['Paper', 'Crayons', 'Chalks'], steps: ['Give each child paper and crayons', 'Say: "Draw anything you like!"', 'Walk around and ask about drawings', 'Display artwork on the wall'] },
              { id: 'a40', title: 'Green Board Free Draw', type: 'board', duration: '10 min', description: 'Free drawing time on the Green Board', steps: ['Open Green Board', 'Children take turns drawing', 'Share and describe their drawing', 'Save the artwork'] },
            ]
          },
          {
            id: 'se-c-2', title: 'Puppet Show', objective: 'Create finger puppets and perform a short skit', weekNumber: 2, completed: false,
            activities: [
              { id: 'a41', title: 'Paper Finger Puppets', type: 'craft', duration: '15 min', description: 'Make simple animal finger puppets from paper', materials: ['Paper', 'Crayons', 'Tape'], steps: ['Draw a simple animal face on a paper strip', 'Wrap around finger and tape', 'Practice moving the puppet', 'Perform a small skit in pairs'] },
            ]
          },
          {
            id: 'se-c-3', title: 'Festival Celebration Skit', objective: 'Role-play a local festival scene cooperatively', weekNumber: 3, completed: false,
            activities: [
              { id: 'a42', title: 'Let\'s Play Raja Parba!', type: 'role-play', duration: '20 min', description: 'Children act out the Odisha Raja festival — swinging, making pitha, singing', steps: ['Discuss: "What happens at Raja?"', 'Assign roles: cook, singer, swing pusher', 'Set up props and act the scene', 'Sing a Raja song together'] },
            ]
          },
        ]
      },
    ]
  },
];

// ---- HELPER: Get all modules flat ----
export function getAllModules(): CurriculumModule[] {
  return curriculumDomains.flatMap(d => d.modules);
}

// ---- HELPER: Get curriculum stats ----
export function getCurriculumStats() {
  const allModules = getAllModules();
  const totalLessons = allModules.reduce((a, m) => a + m.totalLessons, 0);
  const completedLessons = allModules.reduce((a, m) => a + m.completedLessons, 0);
  return {
    totalDomains: curriculumDomains.length,
    totalModules: allModules.length,
    totalLessons,
    completedLessons,
    progressPercent: Math.round((completedLessons / totalLessons) * 100),
  };
}
