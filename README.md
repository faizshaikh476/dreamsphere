# DreamSphere MVP

DreamSphere is a mobile-first social dream journal built with Next.js, Tailwind CSS, Firebase, and the OpenAI API.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS
- Firebase Auth + Firestore
- Next.js API routes for AI processing, feed aggregation, reactions, heatmap, matching, and profile data
- OpenAI API for dream story generation, tagging, and emotion classification

## Folder structure

```text
.
├── app
│   ├── api
│   │   ├── dreams
│   │   │   ├── feed/route.ts
│   │   │   ├── heatmap/route.ts
│   │   │   ├── process/route.ts
│   │   │   └── similar/route.ts
│   │   ├── interactions/route.ts
│   │   └── profile/route.ts
│   ├── heatmap/page.tsx
│   ├── profile/page.tsx
│   ├── similar/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── auth
│   ├── dashboard
│   ├── dreams
│   ├── heatmap
│   ├── layout
│   ├── profile
│   └── providers
├── lib
│   ├── firebase
│   ├── ai.ts
│   ├── api.ts
│   ├── constants.ts
│   ├── dream-analytics.ts
│   ├── firestore-serializers.ts
│   └── utils.ts
├── types
├── firestore.indexes.json
├── firestore.rules
├── firebase.json
└── .env.example
```

## Firestore data model

### `users`

```ts
{
  id: string;
  name: string;
  email: string | null;
  avatar_seed: string;
  streak_count: number;
  created_at: Timestamp;
  last_dream_at?: string;
}
```

### `dreams`

```ts
{
  id: string;
  user_id: string;
  user_name: string;
  dream_text: string;
  story_text: string;
  summary: string;
  tags: string[];
  mood: string;
  ai_emotion: string;
  privacy: "private" | "anonymous" | "public";
  reactions: {
    like: number;
    same_dream: number;
  };
  created_at: Timestamp;
}
```

### `interactions`

```ts
{
  id: string;
  dream_id: string;
  user_id: string;
  type: "like" | "same_dream";
  created_at: Timestamp;
}
```

## Running locally

1. Install Node.js 20+.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and fill in Firebase + OpenAI credentials.
4. Create a Firebase project and enable:
   - Authentication: Email/Password, Google, Anonymous
   - Firestore database
5. Deploy Firestore config:
   - `firebase deploy --only firestore:rules`
   - `firebase deploy --only firestore:indexes`
6. Start the app with `npm run dev`.

## Deploying

- Vercel works well for the Next.js app.
- Add the environment variables in Vercel.
- Use Firebase for auth + database.

## Notes

- The AI route falls back to a lightweight local formatter if `OPENAI_API_KEY` is missing.
- Dream similarity currently uses shared tag overlap plus emotion matching for MVP simplicity.
- Voice-to-text uses the browser Speech Recognition API where available.
