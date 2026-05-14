# DropClip Setup Guide - Complete Wiring Instructions

## 📦 Installation

First, install the required dependency:

```bash
npm install @supabase/supabase-js
```

## 🔧 Step 1: Set Up .env.local

Create a `.env.local` file in your project root with your credentials:

```env
# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# RapidAPI Key
RAPIDAPI_KEY=c9d1594db6mshc4cf9c54c0efd2bp1a7e50jsn26c549bd7771
```

## 📊 Step 2: Supabase Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for it to initialize

### 2.2 Get Your API Keys
1. Go to **Project Settings → API**
2. Copy these three values into `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Secret** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this SECRET — server-side only!)

### 2.3 Create Database Table
1. Go to **SQL Editor** in Supabase
2. Paste this SQL:

```sql
create table if not exists download_requests (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  platform text,
  ip text,
  status text default 'pending',  -- pending | success | failed
  created_at timestamptz default now()
);

-- Indexes for faster queries
create index if not exists idx_download_platform on download_requests (platform);
create index if not exists idx_download_created on download_requests (created_at desc);

-- Disable RLS (service role key bypasses it anyway)
alter table download_requests disable row level security;
```

3. Click **Run**
4. You should see "Success! No rows returned"

## 🎬 Step 3: RapidAPI Setup

### 3.1 Get Your API Key
**You already have this!** Your RapidAPI key is:
```
c9d1594db6mshc4cf9c54c0efd2bp1a7e50jsn26c549bd7771
```

Just add it to `.env.local` as shown in Step 1.

### 3.2 Verify Subscription
1. Go to [rapidapi.com/api/social-download-all-in-one](https://rapidapi.com/api/social-download-all-in-one) (or search for "Social Download All In One")
2. Click **Subscribe**
3. Select **Free** tier (if not already subscribed)
4. You're set!

## ✅ Step 4: Test Everything

### 4.1 Start Dev Server
```bash
npm run dev
```

### 4.2 Test the Download Flow
1. Go to `http://localhost:3000`
2. Paste a **public** video URL (TikTok, YouTube, Instagram, etc.)
3. Click **Download**
4. Check for:
   - ✅ Loading spinner appears
   - ✅ Success message with video title
   - ✅ Download button appears

### 4.3 Verify Supabase Logging
1. Go back to Supabase → **Table Editor**
2. Open `download_requests` table
3. You should see a new row with:
   - `url` = the URL you pasted
   - `platform` = detected platform (TikTok, YouTube, etc.)
   - `status` = "success" or "failed"
   - `created_at` = current timestamp

## 🐛 Troubleshooting

### "Invalid RapidAPI Key"
- Check that `RAPIDAPI_KEY` is correctly copied to `.env.local`
- Restart your dev server: `npm run dev`

### "Supabase connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` format: `https://xxxxx.supabase.co`
- Check both ANON and SERVICE ROLE keys are in `.env.local`
- Restart dev server

### "Download URL not working"
- Make sure the video URL is **public** (not private/age-restricted)
- Try a different video link
- Check RapidAPI status: go to rapidapi.com, find "Social Download All In One", check remaining requests

### "No data in Supabase table"
- Check that `download_requests` table was created (see Step 2.3)
- Verify service role key is being used (it's in the API route)
- Check browser console for errors: Press F12 → Console tab

## 📁 File Structure

Your project should now have:

```
dropclip/
├── components/
│   └── Hero.tsx                    ← Updated ✅
├── app/
│   ├── api/
│   │   └── download/
│   │       └── route.ts            ← Created ✅
│   ├── layout.tsx
│   └── page.tsx
├── .env.local                      ← Created ✅
├── package.json
└── ...
```

## 🚀 What Happens When You Download

1. **Frontend** (Hero.tsx)
   - User pastes URL and clicks Download
   - Sends POST to `/api/download`

2. **Backend** (app/api/download/route.ts)
   - Detects platform from URL
   - Logs request to Supabase
   - Calls RapidAPI with URL
   - Returns download link

3. **Database** (Supabase)
   - Stores each download request
   - Tracks success/failure
   - Useful for analytics/abuse prevention

## 💡 Next Steps

Once everything works:

1. **Deploy to Vercel** (free tier works!)
2. **Monitor Supabase** for download analytics
3. **Add error handling** (catch private videos, rate limiting, etc.)
4. **Customize UI** to match your brand

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **RapidAPI**: https://rapidapi.com
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

That's it! You're all set. Test it out and let me know if you hit any issues! 🎉
