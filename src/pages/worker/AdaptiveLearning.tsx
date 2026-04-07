import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookMarked,
  CheckCircle2,
  Cuboid,
  Layers3,
  Mic,
  Palette,
  PlayCircle,
  Sparkles,
  Star,
  TimerReset,
  Video,
  Wand2,
} from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { average, cn, getProgressStatus } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { mockChildren, quickAssessments, mockThemePlans, monthlyThemes, learningJourneyByTheme } from '../../data/mockData';
import type { TranslationKey } from '../../data/translations';
import type { MonthlyTheme, AssessmentResponse, DailyActivity } from '../../types';

const responseOptions: AssessmentResponse[] = ['Yes', 'No', 'Needs Help'];

type TeachingModule = {
  id: string;
  title: string;
  focus: string;
  objective: string;
  duration: string;
  teacherSteps: string[];
  childTasks: string[];
  materials: string[];
};

type StoryVideo = {
  id: string;
  title: string;
  duration: string;
  language: string;
  summary: string;
  learningGoals: string[];
  discussionPrompts: string[];
};

type ShapeStudioItem = {
  id: string;
  name: string;
  foundIn: string[];
  teachPoints: string[];
  miniTask: string;
  shapeClassName: string;
};

type ExercisePack = {
  id: string;
  title: string;
  difficulty: string;
  duration: string;
  description: string;
  outcomes: string[];
};

const teachingModulesByTheme: Record<string, TeachingModule[]> = {
  'data.theme.family': [
    {
      id: 'family-module-1',
      title: 'Family Circle and Identity',
      focus: 'Language + social-emotional',
      objective: 'Help children introduce family members, speak in simple sentences, and build emotional connection.',
      duration: '20 min',
      teacherSteps: [
        'Begin with a greeting song and ask every child to name one family member.',
        'Use flashcards of mother, father, grandmother, brother, and sister for repetition.',
        'Model 2-line responses such as "This is my mother. She cooks for me."',
        'Invite two children at a time to describe who takes care of them at home.',
      ],
      childTasks: [
        'Say names of family members aloud.',
        'Point to family cards when the worker names them.',
        'Tell one thing they enjoy doing with family.',
      ],
      materials: ['Family picture cards', 'Name tags', 'Soft floor mat'],
    },
    {
      id: 'family-module-2',
      title: 'Home Helpers and Routine',
      focus: 'Cognitive + life skills',
      objective: 'Teach sequencing of home routines and understanding of family roles.',
      duration: '25 min',
      teacherSteps: [
        'Show a morning routine sequence: wake up, brush, eat, travel.',
        'Ask children to place routine cards in the correct order.',
        'Connect the routine to family support, such as who helps with meals or bathing.',
        'Close with a recap where children repeat the routine aloud.',
      ],
      childTasks: [
        'Arrange four picture cards in sequence.',
        'Match helper roles to daily activities.',
        'Repeat the full routine in order.',
      ],
      materials: ['Routine cards', 'Velcro board', 'Markers'],
    },
  ],
  'data.theme.animals': [
    {
      id: 'animal-module-1',
      title: 'Animal Habitats and Sounds',
      focus: 'Observation + language',
      objective: 'Build vocabulary, sound recognition, and understanding of where animals live.',
      duration: '25 min',
      teacherSteps: [
        'Play animal sound clips and ask children to identify the animal.',
        'Show habitat images such as pond, farm, forest, and home.',
        'Guide children to connect each animal to its home.',
        'Use movement breaks where children act like the named animal.',
      ],
      childTasks: [
        'Name the animal after hearing its sound.',
        'Point to the correct habitat card.',
        'Copy the movement of the animal.',
      ],
      materials: ['Animal cards', 'Habitat posters', 'Audio speaker'],
    },
    {
      id: 'animal-module-2',
      title: 'Wild and Domestic Sorting',
      focus: 'Cognitive classification',
      objective: 'Teach children to group animals by use and environment.',
      duration: '20 min',
      teacherSteps: [
        'Introduce the words wild and domestic using familiar examples.',
        'Lay out 8 to 10 animal cards and demonstrate one sorting example.',
        'Encourage children to work in pairs for the remaining cards.',
        'Ask why one animal belongs in a certain group.',
      ],
      childTasks: [
        'Sort cards into two baskets.',
        'Explain one reason for a choice.',
        'Say whether the animal lives near people or away from people.',
      ],
      materials: ['Animal cards', 'Two baskets', 'Picture chart'],
    },
  ],
  'data.theme.seasons': [
    {
      id: 'season-module-1',
      title: 'Weather Watch and Clothing',
      focus: 'Environmental awareness',
      objective: 'Teach how weather changes and how people respond through clothing, food, and daily habits.',
      duration: '20 min',
      teacherSteps: [
        'Show sunny, rainy, windy, and cold weather images.',
        'Ask children what they wear and eat in each season.',
        'Match umbrellas, sweaters, caps, and water bottles to the right weather.',
        'End with a quick weather movement game.',
      ],
      childTasks: [
        'Point to the right weather image.',
        'Match the correct clothing item.',
        'Say one safety habit for the season.',
      ],
      materials: ['Weather cards', 'Season props', 'Clothing cut-outs'],
    },
    {
      id: 'season-module-2',
      title: 'Seasonal Food and Care',
      focus: 'Nutrition + self-care',
      objective: 'Connect seasonal change with hydration, healthy foods, and body care.',
      duration: '20 min',
      teacherSteps: [
        'Display foods eaten more often during summer, monsoon, and winter.',
        'Discuss water, fruits, and warm foods using local examples.',
        'Use yes-no questions to check safe habits.',
        'Ask children to sort foods into seasonal baskets.',
      ],
      childTasks: [
        'Sort foods by season.',
        'Answer whether the habit is healthy or unhealthy.',
        'Repeat two self-care rules.',
      ],
      materials: ['Food cards', 'Sorting mats', 'Drinking cup'],
    },
  ],
  'data.theme.helpers': [
    {
      id: 'helper-module-1',
      title: 'Meet the Helpers',
      focus: 'Social awareness + vocabulary',
      objective: 'Introduce local community helpers and the tools they use.',
      duration: '25 min',
      teacherSteps: [
        'Show pictures of a doctor, teacher, farmer, police officer, and shopkeeper.',
        'Talk about what each helper does for the community.',
        'Match helper images with tools such as stethoscope, chalk, and whistle.',
        'Ask children who they meet most often in the village.',
      ],
      childTasks: [
        'Name the helper.',
        'Match the helper to one tool.',
        'Say one sentence about why the helper is important.',
      ],
      materials: ['Helper posters', 'Tool cards', 'Pocket chart'],
    },
    {
      id: 'helper-module-2',
      title: 'Role Play Corner',
      focus: 'Creativity + expression',
      objective: 'Use pretend play to strengthen confidence, speech, and social interaction.',
      duration: '30 min',
      teacherSteps: [
        'Set up a mini clinic, classroom, or shop using low-cost props.',
        'Give children one role card each.',
        'Model a short conversation to begin the role-play.',
        'Rotate roles after 5 minutes so every child gets a turn.',
      ],
      childTasks: [
        'Act out one helper role.',
        'Use short functional language such as "How can I help?"',
        'Take turns with peers.',
      ],
      materials: ['Role cards', 'Pretend props', 'Table and chairs'],
    },
  ],
};

const storyVideosByTheme: Record<string, StoryVideo[]> = {
  'data.theme.family': [
    {
      id: 'family-video-1',
      title: 'My Family, My Safe Place',
      duration: '6 min',
      language: 'Odia + Hindi',
      summary: 'A child introduces grandparents, parents, and siblings while showing care, routines, and togetherness.',
      learningGoals: ['Listening comprehension', 'Family vocabulary', 'Emotional security'],
      discussionPrompts: ['Who helps you at home?', 'What do you do with your grandparents?', 'How do we speak kindly at home?'],
    },
    {
      id: 'family-video-2',
      title: 'Helping Hands at Home',
      duration: '5 min',
      language: 'Hindi',
      summary: 'A playful story about children helping set plates, fold clothes, and keep the home clean.',
      learningGoals: ['Responsibility', 'Sequencing', 'Home habits'],
      discussionPrompts: ['What work can you do at home?', 'What comes first before eating?', 'Why do we keep things clean?'],
    },
  ],
  'data.theme.animals': [
    {
      id: 'animal-video-1',
      title: 'Where Do Animals Live?',
      duration: '7 min',
      language: 'Odia',
      summary: 'Animated animals travel across farm, forest, river, and home, helping children identify habitats.',
      learningGoals: ['Animal vocabulary', 'Habitat awareness', 'Listening recall'],
      discussionPrompts: ['Which animal lived in the forest?', 'Which animal stays near us?', 'What sound did the cow make?'],
    },
    {
      id: 'animal-video-2',
      title: 'Friends of the Farm',
      duration: '5 min',
      language: 'Hindi + English keywords',
      summary: 'A short farm visit story introducing cow, goat, hen, and dog with food and movement cues.',
      learningGoals: ['Classification', 'Observation', 'Speaking'],
      discussionPrompts: ['Which animals give us food?', 'Which one runs fastest?', 'Which one has wings?'],
    },
  ],
  'data.theme.seasons': [
    {
      id: 'season-video-1',
      title: 'The Rainy Day Song Story',
      duration: '6 min',
      language: 'Odia + Hindi',
      summary: 'Children prepare for rain, carry umbrellas, and enjoy rainy-day rhythms while learning safety habits.',
      learningGoals: ['Seasonal awareness', 'Rhythm', 'Safety'],
      discussionPrompts: ['What do we carry in rain?', 'Why should we dry ourselves?', 'What sound does rain make?'],
    },
    {
      id: 'season-video-2',
      title: 'Summer, Winter, Monsoon',
      duration: '8 min',
      language: 'Hindi',
      summary: 'A comparative story showing how food, clothes, and play change with the seasons.',
      learningGoals: ['Comparison', 'Vocabulary', 'Self-care'],
      discussionPrompts: ['What do we drink in summer?', 'What do we wear in winter?', 'How is rainy weather different?'],
    },
  ],
  'data.theme.helpers': [
    {
      id: 'helper-video-1',
      title: 'A Day with Community Helpers',
      duration: '7 min',
      language: 'Odia',
      summary: 'A child visits the school, clinic, and market while learning the roles of local helpers.',
      learningGoals: ['Community awareness', 'Functional vocabulary', 'Respect'],
      discussionPrompts: ['Who helps when we are sick?', 'Who teaches us?', 'Who helps keep us safe?'],
    },
    {
      id: 'helper-video-2',
      title: 'Thank You Helpers',
      duration: '4 min',
      language: 'Hindi + English keywords',
      summary: 'A song video with simple actions and thank-you phrases for doctors, teachers, and farmers.',
      learningGoals: ['Courtesy language', 'Memory', 'Speaking'],
      discussionPrompts: ['How do we say thank you?', 'Which helper do you see every day?', 'Why are farmers important?'],
    },
  ],
};

const shapeStudioByTheme: Record<string, ShapeStudioItem[]> = {
  'data.theme.family': [
    {
      id: 'cube',
      name: 'Cube',
      foundIn: ['Toy blocks', 'Gift boxes', 'Dice'],
      teachPoints: ['6 equal faces', 'Flat sides', 'Can stack easily'],
      miniTask: 'Ask children to build a small home wall using cubes and count how many were used.',
      shapeClassName: 'bg-[linear-gradient(135deg,#38bdf8_0%,#0ea5e9_45%,#0369a1_100%)] before:bg-sky-300 after:bg-sky-700',
    },
    {
      id: 'cylinder',
      name: 'Cylinder',
      foundIn: ['Water bottle', 'Tiffin box', 'Rolling pin'],
      teachPoints: ['Two round faces', 'One curved surface', 'Can roll and stand'],
      miniTask: 'Let children compare which household object rolls faster: cylinder or cube.',
      shapeClassName: 'bg-[linear-gradient(180deg,#f59e0b_0%,#fb923c_50%,#ea580c_100%)] before:bg-amber-200 after:bg-orange-700',
    },
  ],
  'data.theme.animals': [
    {
      id: 'sphere',
      name: 'Sphere',
      foundIn: ['Ball', 'Orange', 'Marble'],
      teachPoints: ['Perfectly round', 'No corners', 'Rolls in every direction'],
      miniTask: 'Use a ball and ask children to push it gently in different directions.',
      shapeClassName: 'bg-[radial-gradient(circle_at_30%_30%,#bbf7d0_0%,#22c55e_45%,#166534_100%)] before:hidden after:hidden',
    },
    {
      id: 'cone',
      name: 'Cone',
      foundIn: ['Party hat', 'Ice cream cone', 'Funnel'],
      teachPoints: ['One pointed top', 'One round base', 'Can spin but not roll like a sphere'],
      miniTask: 'Show a party hat and ask children to find the pointed top and the round bottom.',
      shapeClassName: 'bg-[linear-gradient(180deg,#fca5a5_0%,#f97316_100%)] before:hidden after:hidden',
    },
  ],
  'data.theme.seasons': [
    {
      id: 'cone-season',
      name: 'Cone',
      foundIn: ['Winter cap top', 'Funnel for rainy water play', 'Decoration item'],
      teachPoints: ['Pointed top', 'Round bottom', 'Can spin on its base'],
      miniTask: 'Compare the cone with a cap or funnel and ask which part is narrow and which part is wide.',
      shapeClassName: 'bg-[linear-gradient(180deg,#a78bfa_0%,#7c3aed_100%)] before:hidden after:hidden',
    },
    {
      id: 'cube-season',
      name: 'Cube',
      foundIn: ['Storage box', 'Ice cube', 'Toy block'],
      teachPoints: ['Equal faces', 'Corners', 'Stable stacking shape'],
      miniTask: 'Stack 3 cubes and ask children which one is on top, middle, and bottom.',
      shapeClassName: 'bg-[linear-gradient(135deg,#22c55e_0%,#4ade80_40%,#15803d_100%)] before:bg-green-300 after:bg-green-700',
    },
  ],
  'data.theme.helpers': [
    {
      id: 'cylinder-helper',
      name: 'Cylinder',
      foundIn: ['Medicine bottle', 'Water pipe', 'Drum'],
      teachPoints: ['Round top and bottom', 'Curved side', 'Can stand and roll'],
      miniTask: 'Let children identify which helper might use a bottle, pipe, or drum.',
      shapeClassName: 'bg-[linear-gradient(180deg,#38bdf8_0%,#0f766e_100%)] before:bg-cyan-200 after:bg-teal-700',
    },
    {
      id: 'sphere-helper',
      name: 'Sphere',
      foundIn: ['Ball in playground', 'Round lamp', 'Fruit in market'],
      teachPoints: ['Round all over', 'No edges', 'Moves smoothly'],
      miniTask: 'Ask children which community helper may sell or use round objects.',
      shapeClassName: 'bg-[radial-gradient(circle_at_30%_30%,#fde68a_0%,#f59e0b_45%,#b45309_100%)] before:hidden after:hidden',
    },
  ],
};

const exercisePacksByTheme: Record<string, ExercisePack[]> = {
  'data.theme.family': [
    {
      id: 'family-ex-1',
      title: 'Picture to Sentence Practice',
      difficulty: 'Level 1',
      duration: '10 min',
      description: 'Children look at family cards and speak or repeat one simple sentence for each card.',
      outcomes: ['Speaking confidence', 'Vocabulary building', 'Sentence recall'],
    },
    {
      id: 'family-ex-2',
      title: 'Routine Sequencing Worksheet',
      difficulty: 'Level 2',
      duration: '12 min',
      description: 'Arrange 4 home routine pictures in order and explain what happens first and next.',
      outcomes: ['Sequencing', 'Memory', 'Logical thinking'],
    },
  ],
  'data.theme.animals': [
    {
      id: 'animal-ex-1',
      title: 'Habitat Matching Exercise',
      difficulty: 'Level 1',
      duration: '12 min',
      description: 'Match animal cards with pond, forest, farm, or home backgrounds.',
      outcomes: ['Observation', 'Classification', 'Recall'],
    },
    {
      id: 'animal-ex-2',
      title: 'Animal Movement Challenge',
      difficulty: 'Level 2',
      duration: '8 min',
      description: 'Children respond to movement cues by hopping, crawling, or tiptoeing like named animals.',
      outcomes: ['Gross motor skills', 'Listening', 'Body control'],
    },
  ],
  'data.theme.seasons': [
    {
      id: 'season-ex-1',
      title: 'Dress for the Weather',
      difficulty: 'Level 1',
      duration: '10 min',
      description: 'Choose the right clothing and accessory for sunny, rainy, or cold weather cards.',
      outcomes: ['Decision-making', 'Season understanding', 'Self-care'],
    },
    {
      id: 'season-ex-2',
      title: 'Healthy Season Basket',
      difficulty: 'Level 2',
      duration: '12 min',
      description: 'Sort drinks and foods into the season where they help the body most.',
      outcomes: ['Nutrition awareness', 'Sorting', 'Reasoning'],
    },
  ],
  'data.theme.helpers': [
    {
      id: 'helper-ex-1',
      title: 'Tool Matching Drill',
      difficulty: 'Level 1',
      duration: '10 min',
      description: 'Match helper images to objects they use in everyday work.',
      outcomes: ['Association', 'Vocabulary', 'Recall'],
    },
    {
      id: 'helper-ex-2',
      title: 'Mini Role-play Exercise',
      difficulty: 'Level 2',
      duration: '15 min',
      description: 'Children act out a short situation such as clinic visit, class activity, or buying from a shop.',
      outcomes: ['Social confidence', 'Speaking', 'Turn-taking'],
    },
  ],
};

export function AdaptiveLearning() {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<MonthlyTheme>('data.theme.family');
  const [selectedActivity, setSelectedActivity] = useState(learningJourneyByTheme['data.theme.family'][0].id);
  const [selectedModuleId, setSelectedModuleId] = useState(teachingModulesByTheme['data.theme.family'][0].id);

  const themeToKey: Record<MonthlyTheme, TranslationKey> = {
    'data.theme.family': 'data.theme.family',
    'data.theme.animals': 'data.theme.animals',
    'data.theme.seasons': 'data.theme.seasons',
    'data.theme.helpers': 'data.theme.helpers'
  };

  const themeToKeyTyped = themeToKey as Record<string, TranslationKey>;

  const domainToKey: Record<string, TranslationKey> = {
    'Cognitive': 'domain.cognitive',
    'Language': 'domain.language',
    'Physical': 'domain.physical',
    'Social': 'domain.social',
    'Socio-Emotional': 'domain.social',
    'Creativity': 'domain.creativity',
    'Nutrition': 'domain.nutrition'
  };

  const activities = learningJourneyByTheme[selectedTheme];
  const activity = activities.find((entry) => entry.id === selectedActivity) ?? activities[0];
  const themePlan = mockThemePlans.find((entry) => entry.theme === selectedTheme);
  const teachingModules = teachingModulesByTheme[selectedTheme];
  const selectedModule = teachingModules.find((module) => module.id === selectedModuleId) ?? teachingModules[0];
  const storyVideos = storyVideosByTheme[selectedTheme];
  const shapes = shapeStudioByTheme[selectedTheme];
  const exercises = exercisePacksByTheme[selectedTheme];

  const radarData = useMemo(() => [
    { domain: t('domain.cognitive'), score: average(mockChildren.map((child: any) => child.domainScores.cognitive)) },
    { domain: t('domain.language'), score: average(mockChildren.map((child: any) => child.domainScores.language)) },
    { domain: t('domain.physical'), score: average(mockChildren.map((child: any) => Math.min(100, (child.attendanceRate || 0) + 2))) },
    { domain: t('domain.social'), score: average(mockChildren.map((child: any) => child.domainScores.socio_emotional)) },
    { domain: t('domain.creativity'), score: average(mockChildren.map((child: any) => Math.min(100, (child.learningScore || 0) + 5))) },
  ], [t]);

  const switchTheme = (theme: MonthlyTheme) => {
    setSelectedTheme(theme);
    setSelectedActivity(learningJourneyByTheme[theme][0].id);
    setSelectedModuleId(teachingModulesByTheme[theme][0].id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.2),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.22),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.72))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Sparkles size={14} />
                {t('learning.hero.badge')}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t('learning.hero.title')}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t('learning.hero.desc')}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[30rem]">
              {[
                { label: t('learning.stats.theme_active'), value: t(themeToKey[selectedTheme]) },
                { label: t('learning.stats.modules'), value: teachingModules.length.toString() },
                { label: t('learning.stats.videos'), value: storyVideos.length.toString() },
                { label: t('learning.stats.assessment'), value: t('learning.stats.autosave') },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/50">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{t('learning.theme.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('learning.theme.desc')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(monthlyThemes) as MonthlyTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => switchTheme(theme)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  selectedTheme === theme
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'border border-border bg-card text-foreground hover:bg-accent'
                )}
              >
                {t(themeToKey[theme])}
              </button>
            ))}
          </div>
        </div>
        {themePlan && (
          <div className="mt-5 rounded-3xl border border-border bg-background/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{themePlan.week}</p>
            <h4 className="mt-2 text-lg font-semibold text-foreground">{themePlan.focus}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {themePlan.activities?.map((entry: string) => (
                <span key={entry} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  {entry}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BookMarked size={18} className="text-primary" />
              <h3 className="text-xl font-semibold text-foreground">{t('learning.modules.title')}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t('learning.modules.desc')}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {teachingModules.map((module, index) => (
                <motion.button
                  key={module.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={cn(
                    'rounded-[1.75rem] border p-5 text-left transition-all',
                    selectedModuleId === module.id
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-background/70 hover:bg-accent'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{module.focus}</p>
                      <h4 className="mt-2 text-lg font-semibold text-foreground">{module.title}</h4>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {module.duration}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{module.objective}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{selectedModule.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedModule.focus} · {selectedModule.duration}</p>
              </div>
              <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                {t('learning.modules.start')}
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <div className="flex items-center gap-2">
                  <Layers3 size={18} className="text-sky-500" />
                  <h4 className="font-semibold text-foreground">{t('learning.modules.flow')}</h4>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedModule.teacherSteps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3 rounded-2xl bg-card px-3 py-3 shadow-sm">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        {index + 1}
                      </span>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-amber-500" />
                  <h4 className="font-semibold text-foreground">{t('learning.modules.tasks')}</h4>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedModule.childTasks.map((task) => (
                    <div key={task} className="rounded-2xl bg-card px-3 py-3 text-sm text-muted-foreground shadow-sm">
                      {task}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedModule.materials.map((material) => (
                    <span key={material} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">{t('learning.activity.title')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('learning.activity.desc')}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {activities.map((entry, index) => (
                <motion.button
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedActivity(entry.id)}
                  className={cn(
                    'rounded-[1.75rem] border p-5 text-left transition-all',
                    selectedActivity === entry.id
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-background/70 hover:bg-accent'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {domainToKey[entry.category] ? t(domainToKey[entry.category] as TranslationKey) : entry.category}
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-foreground">{entry.title}</h4>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                      {entry.stars} ⭐
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{entry.instructions}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.outcomeTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Cuboid size={18} className="text-primary" />
              <h3 className="text-xl font-semibold text-foreground">{t('learning.shapes.title')}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t('learning.shapes.desc')}</p>
            <div className="mt-5 space-y-4">
              {shapes.map((shape) => (
                <div key={shape.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-card shadow-inner">
                      <div className={cn('shape-visual relative h-14 w-14 rounded-xl', shape.shapeClassName, shape.id.includes('sphere') && 'rounded-full', shape.id.includes('cone') && 'h-0 w-0 rounded-none border-l-[28px] border-r-[28px] border-b-[52px] border-l-transparent border-r-transparent border-b-orange-500 bg-transparent')} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-lg font-semibold text-foreground">{shape.name}</h4>
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          {t('learning.shapes.concept')}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {shape.foundIn.map((item) => (
                          <span key={item} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 space-y-2">
                        {shape.teachPoints.map((point) => (
                          <div key={point} className="rounded-2xl bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
                            {point}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                        {t('learning.shapes.minitask', { task: shape.miniTask })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Video size={18} className="text-red-500" />
              <h3 className="text-xl font-semibold text-foreground">{t('learning.videos.title')}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t('learning.videos.desc')}</p>
            <div className="mt-5 space-y-4">
              {storyVideos.map((video) => (
                <div key={video.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#111827_0%,#1f2937_40%,#334155_100%)] p-4 text-white shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-white/60">{video.language}</p>
                        <h4 className="mt-2 text-lg font-semibold">{video.title}</h4>
                        <p className="mt-2 text-sm text-white/75">{video.summary}</p>
                      </div>
                      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors">
                        <PlayCircle size={24} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                      <TimerReset size={14} />
                      {video.duration}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t('learning.videos.goals')}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {video.learningGoals.map((goal) => (
                          <span key={goal} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t('learning.videos.prompts')}</p>
                      <div className="mt-2 space-y-2">
                        {video.discussionPrompts.map((prompt) => (
                          <div key={prompt} className="rounded-2xl bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
                            {prompt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">{t('learning.activity.detail')}</h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <div className="flex items-center gap-2">
                  <PlayCircle size={18} className="text-primary" />
                  <h4 className="font-semibold text-foreground">{activity.title}</h4>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{activity.instructions}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <TimerReset size={16} />
                  {t('learning.activity.mins', { count: activity.durationMin })}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-sky-500" />
                  <h4 className="font-semibold text-foreground">Interactive Child Mode</h4>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{activity.childMode}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activity.outcomeTags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">Practice Exercise Packs</h3>
            <p className="mt-1 text-sm text-muted-foreground">Detailed classroom exercises for revision, peer practice, and mixed-ability teaching.</p>
            <div className="mt-5 space-y-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{exercise.difficulty}</p>
                      <h4 className="mt-2 text-lg font-semibold text-foreground">{exercise.title}</h4>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                      {exercise.duration}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{exercise.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exercise.outcomes.map((outcome: string) => (
                      <span key={outcome} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">Quick Assessment</h3>
            <p className="mt-1 text-sm text-muted-foreground">One-tap responses with auto-save daily observations.</p>
            <div className="mt-5 space-y-4">
              {['cognitive', 'language', 'physical', 'social', 'creativity'].map((domain) => (
                <div key={domain} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold capitalize text-foreground">{domain}</p>
                    <span className="text-xs text-muted-foreground">Tap to evaluate</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {responseOptions.map((response) => (
                      <button
                        key={response}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                          response === 'Yes' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                          response === 'Needs Help' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                          response === 'No' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                        )}
                      >
                        {response}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
              Auto-save is enabled. Today&apos;s notes will sync when connectivity is available.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">Progress Radar</h3>
            <p className="mt-1 text-sm text-muted-foreground">Status labels: Needs Attention, Developing, and On Track.</p>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="domain" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.28} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {radarData.map((entry: any) => (
                <div key={entry.domain} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{entry.domain}</span>
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    getProgressStatus(entry.score) === 'On Track' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                    getProgressStatus(entry.score) === 'Developing' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    getProgressStatus(entry.score) === 'Needs Attention' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}>
                    {getProgressStatus(entry.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">Gamification Layer</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-500" />
                  <p className="font-semibold text-foreground">Stars for completion</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Children earn stars for every completed activity, exercise, or storytelling reflection.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <p className="font-semibold text-foreground">Badge system</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Use badges like Active Learner, Shape Explorer, Story Star, and Good Communicator.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2">
                  <Mic size={18} className="text-sky-500" />
                  <p className="font-semibold text-foreground">Voice-style prompts</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Workers can ask for age-wise teaching help, video suggestions, and quick revision ideas.</p>
              </div>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                <Wand2 size={16} />
                Plan My Day
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">Recent Auto-Saved Observations</h3>
            <div className="mt-4 grid gap-4">
              {quickAssessments.map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <p className="text-sm font-semibold text-foreground">{mockChildren.find((child) => child.id === entry.childId)?.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{entry.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
