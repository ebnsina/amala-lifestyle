# আমালা (Amala)

An offline Bangla lifestyle app for everyday people in Bangladesh. Android first.

- **খাবারের হিসাব**: pick what was cooked at home today and get suggested portions in household measures (কাপ, বাটি, টুকরা), based on a daily calorie estimate.
- **BMI**: BMI with the WHO Asian cut-offs and the normal weight range for your height.
- **Backup**: export and import all data as a JSON file on the phone.

No account, no backend, no network: everything is stored on the phone in SQLite.

> Nutrition values in `src/data/foods.ts` are placeholders for UI review, not verified data.

## Run

```bash
npm install
npx expo start        # scan the QR code with Expo Go on Android
npm test              # unit tests for calculations, search and backup parsing
npm run typecheck && npm run lint
```

## Build an APK

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

## Layout

- `src/app/`: screens (Expo Router). `(tabs)/` holds হোম, খাবার and প্রোফাইল.
- `src/lib/`: pure logic (`nutrition`, `bmi`, `search`, `backup`), SQLite (`db`), and the app store.
- `src/data/foods.ts`: the bundled food list.
- `src/components/ui.tsx`: shared UI components.
