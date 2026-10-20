// General beginner guidance, not a personal programme.
// One set per tick; timed steps like warm-ups are a single set.
export type Exercise = { bn: string; sets: number; reps: string; tip: string };
export type Workout = {
  id: string; bn: string; sub: string; emoji: string; minutes: number; place: 'home' | 'gym'; rest: number; exercises: Exercise[];
};

export const workouts: Workout[] = [
  {
    id: 'walk', bn: 'দ্রুত হাঁটা', sub: 'একদম শুরু করার জন্য', emoji: '🚶', minutes: 30, place: 'home', rest: 0,
    exercises: [
      { bn: 'আস্তে হাঁটা', sets: 1, reps: '৫ মিনিট', tip: 'শরীর গরম করে নিন।' },
      { bn: 'জোরে হাঁটা', sets: 1, reps: '২০ মিনিট', tip: 'কথা বলা যায়, কিন্তু গান গাওয়া কঠিন — এমন গতি।' },
      { bn: 'আস্তে হাঁটা', sets: 1, reps: '৫ মিনিট', tip: 'ধীরে ধীরে থামুন, তারপর একটু পানি খান।' },
    ],
  },
  {
    id: 'home', bn: 'ঘরে ব্যায়াম', sub: 'কোনো যন্ত্র লাগবে না', emoji: '🏠', minutes: 20, place: 'home', rest: 45,
    exercises: [
      { bn: 'জায়গায় দাঁড়িয়ে হাঁটা', sets: 1, reps: '৩ মিনিট', tip: 'হাত দুলিয়ে শরীর গরম করুন।' },
      { bn: 'স্কোয়াট (ওঠা-বসা)', sets: 3, reps: '১২টি', tip: 'চেয়ারে বসার মতো নামুন, হাঁটু পায়ের আঙুল ছাড়াবে না।' },
      { bn: 'দেয়ালে পুশ-আপ', sets: 3, reps: '১০টি', tip: 'সহজ হলে হাঁটু গেড়ে মেঝেতে করুন।' },
      { bn: 'গ্লুট ব্রিজ', sets: 3, reps: '১২টি', tip: 'চিত হয়ে শুয়ে কোমর ওপরে তুলুন, ২ সেকেন্ড ধরে রাখুন।' },
      { bn: 'প্ল্যাংক', sets: 3, reps: '২০ সেকেন্ড', tip: 'মাথা থেকে গোড়ালি এক লাইনে, শ্বাস আটকাবেন না।' },
    ],
  },
  {
    id: 'gym-upper', bn: 'জিম: বুক, পিঠ, হাত', sub: 'সপ্তাহে ১–২ দিন', emoji: '🏋️', minutes: 45, place: 'gym', rest: 90,
    exercises: [
      { bn: 'ট্রেডমিল বা সাইকেল', sets: 1, reps: '৫ মিনিট', tip: 'হালকা গতিতে গরম হয়ে নিন।' },
      { bn: 'বেঞ্চ প্রেস', sets: 3, reps: '৮–১০টি', tip: 'শেষ ২টি কষ্ট হবে — এমন ওজন নিন।' },
      { bn: 'ল্যাট পুলডাউন', sets: 3, reps: '১০টি', tip: 'বার বুকের দিকে টানুন, পিঠ সোজা।' },
      { bn: 'শোল্ডার প্রেস', sets: 3, reps: '১০টি', tip: 'কোমর বাঁকাবেন না।' },
      { bn: 'সিটেড রো', sets: 3, reps: '১০টি', tip: 'কাঁধ পেছনে চেপে টানুন।' },
      { bn: 'বাইসেপ কার্ল', sets: 2, reps: '১২টি', tip: 'কনুই শরীরের পাশে স্থির রাখুন।' },
    ],
  },
  {
    id: 'gym-lower', bn: 'জিম: পা ও কোমর', sub: 'সপ্তাহে ১–২ দিন', emoji: '🦵', minutes: 45, place: 'gym', rest: 90,
    exercises: [
      { bn: 'ট্রেডমিল বা সাইকেল', sets: 1, reps: '৫ মিনিট', tip: 'হালকা গতিতে গরম হয়ে নিন।' },
      { bn: 'লেগ প্রেস', sets: 3, reps: '১০টি', tip: 'হাঁটু পুরো লক করবেন না।' },
      { bn: 'রোমানিয়ান ডেডলিফট', sets: 3, reps: '১০টি', tip: 'পিঠ সোজা রেখে কোমর থেকে ঝুঁকুন; হালকা ওজনে শুরু করুন।' },
      { bn: 'লাঞ্জ', sets: 3, reps: 'প্রতি পায়ে ৮টি', tip: 'পেছনের হাঁটু মেঝের কাছে নামান।' },
      { bn: 'লেগ কার্ল', sets: 3, reps: '১২টি', tip: 'ধীরে নামান।' },
      { bn: 'কাফ রেইজ', sets: 3, reps: '১৫টি', tip: 'গোড়ালি যতটা পারেন ওপরে তুলুন।' },
    ],
  },
  {
    id: 'stretch', bn: 'স্ট্রেচিং', sub: 'বিশ্রামের দিন বা ঘুমের আগে', emoji: '🧘', minutes: 10, place: 'home', rest: 0,
    exercises: [
      { bn: 'ঘাড় ঘোরানো', sets: 1, reps: '১ মিনিট', tip: 'আস্তে, দুই দিকেই।' },
      { bn: 'কাঁধ ও হাতের স্ট্রেচ', sets: 1, reps: '২ মিনিট', tip: 'প্রতিটি ভঙ্গি ২০–৩০ সেকেন্ড ধরে রাখুন।' },
      { bn: 'পায়ের পেছনের স্ট্রেচ', sets: 1, reps: '২ মিনিট', tip: 'ঝাঁকি না দিয়ে ধীরে টানুন।' },
      { bn: 'কোমরের স্ট্রেচ', sets: 1, reps: '২ মিনিট', tip: 'ব্যথা নয়, শুধু টান অনুভব হবে।' },
      { bn: 'লম্বা শ্বাস', sets: 1, reps: '৩ মিনিট', tip: '৪ সেকেন্ড শ্বাস নিন, ৬ সেকেন্ডে ছাড়ুন।' },
    ],
  },
];

export const workoutById = Object.fromEntries(workouts.map((w) => [w.id, w]));

export const setCount = (w: Workout) => w.exercises.reduce((n, e) => n + e.sets, 0);
