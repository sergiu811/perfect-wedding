# 🚀 Supabase Integration Setup Guide

Complete guide to integrate Supabase authentication and database into your Perfect Wedding app.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Setup](#database-schema-setup)
4. [Local Environment Configuration](#local-environment-configuration)
5. [Install Dependencies](#install-dependencies)
6. [Update Root Component](#update-root-component)
7. [Testing the Integration](#testing-the-integration)
8. [Next Steps](#next-steps)

---

## 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Basic understanding of SQL and React

---

## 2. Supabase Project Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - **Project name**: `perfect-wedding` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

6. Click "Create new project" and wait 2-3 minutes

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## 3. Database Schema Setup

### Step 1: Run the SQL Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)

This will create:
- ✅ All database tables (profiles, weddings, guests, services, reviews, bookings, seating_charts)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamps and ratings
- ✅ Storage buckets for images

### Step 2: Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `profiles`
   - `weddings`
   - `guests`
   - `services`
   - `reviews`
   - `bookings`
   - `seating_charts`

### Step 3: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates under **Email Templates**
4. Optional: Enable other providers (Google, Facebook, etc.)

### Step 4: Configure Storage

1. Go to **Storage**
2. Verify these buckets were created:
   - `avatars`
   - `service-images`
   - `service-videos`
   - `portfolios`

3. If not created automatically, create them manually with public access

---

## 4. Local Environment Configuration

### Step 1: Create .env File

```bash
# In your project root
cp .env.example .env
```

### Step 2: Add Your Supabase Credentials

Edit `.env` and add your values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit `.env` to git! It's already in `.gitignore`.

---

## 5. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client library
- `@supabase/ssr` - Server-side rendering support
- `zod` - Schema validation

---

## 6. Update Root Component

### Step 1: Update `app/root.tsx`

Add the AuthProvider and expose environment variables:

```tsx
import { AuthProvider } from "~/contexts/auth-context";

// Add this to your loader
export async function loader() {
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
}

// In your App component, wrap with AuthProvider
export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

### Step 2: Add Type Declaration for window.ENV

Create `app/types/window.d.ts`:

```typescript
declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

export {};
```

---

## 7. Testing the Integration

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Test Sign Up

1. Navigate to `http://localhost:5173/signup`
2. Choose "Couple" or "Vendor"
3. Fill in the form
4. Click "Create Account"
5. Check your email for confirmation (if email confirmation is enabled)

### Step 3: Verify in Supabase

1. Go to **Authentication** → **Users** in Supabase dashboard
2. You should see your new user
3. Go to **Table Editor** → **profiles**
4. You should see a profile created automatically with the correct role

### Step 4: Test Sign In

1. Navigate to `http://localhost:5173/login`
2. Enter your credentials
3. You should be redirected to the home page

### Step 5: Test Protected Routes

Try accessing a protected route (you'll create these next):

```tsx
// Example protected route
import { requireAuth } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  
  // User is authenticated, fetch their data
  const { supabase } = createSupabaseServerClient(request);
  
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', user.id);
  
  return json({ weddings });
}
```

---

## 8. Next Steps

### A. Update Existing Pages to Use Real Data

#### Example: Wedding Planning Form

```tsx
// app/routes/planning.step-4.tsx
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  
  const formData = await request.formData();
  
  // Create wedding in database
  const { data, error } = await supabase
    .from('weddings')
    .insert({
      user_id: user.id,
      partner1_name: formData.get('partner1Name'),
      partner2_name: formData.get('partner2Name'),
      wedding_date: formData.get('weddingDate'),
      guest_count: parseInt(formData.get('guestCount')),
      location: formData.get('location'),
      // ... other fields
    })
    .select()
    .single();
  
  if (error) {
    return json({ error: error.message }, { status: 400 });
  }
  
  return redirect('/my-wedding');
}
```

#### Example: Vendor Service Listing

```tsx
// app/routes/services._index.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      vendor:profiles(first_name, last_name, business_name, avatar_url)
    `)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(50);
  
  return json({ services });
}
```

### B. Implement File Uploads

```tsx
// Example: Upload service images
import { useSupabase } from "~/lib/supabase.client";

const uploadImage = async (file: File) => {
  const supabase = useSupabase();
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Math.random()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('service-images')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('service-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

### C. Add Real-time Features

```tsx
// Example: Real-time guest RSVP updates
useEffect(() => {
  const supabase = useSupabase();
  
  const channel = supabase
    .channel('guests-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'guests',
        filter: `wedding_id=eq.${weddingId}`,
      },
      (payload) => {
        console.log('Guest updated:', payload);
        // Refresh guest list
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}, [weddingId]);
```

### D. Implement Search

```tsx
// Example: Search services
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const category = url.searchParams.get('category');
  
  const { supabase } = createSupabaseServerClient(request);
  
  let queryBuilder = supabase
    .from('services')
    .select('*')
    .eq('is_active', true);
  
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }
  
  if (category) {
    queryBuilder = queryBuilder.eq('category', category);
  }
  
  const { data: services } = await queryBuilder;
  
  return json({ services });
}
```

---

## 🔒 Security Best Practices

1. **Never expose service_role key** - Only use anon key in client
2. **Always use RLS policies** - Already configured in schema
3. **Validate all inputs** - Use Zod schemas
4. **Use HTTPS in production** - Supabase enforces this
5. **Rotate keys if compromised** - Can be done in Supabase dashboard

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
- Check your `.env` file has correct values
- Restart dev server after changing `.env`
- Verify keys in Supabase dashboard

### Issue: "Row Level Security policy violation"
- Check RLS policies in Supabase dashboard
- Verify user is authenticated
- Check if user has permission for the operation

### Issue: "Table does not exist"
- Verify SQL schema was run successfully
- Check for errors in SQL Editor
- Try running schema again

### Issue: TypeScript errors
- Run `npm install` to ensure all packages are installed
- Restart TypeScript server in VS Code
- Check that `database.types.ts` exists

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✅ Checklist

Before deploying to production:

- [ ] Database schema created
- [ ] RLS policies verified
- [ ] Environment variables configured
- [ ] Authentication tested (sign up, sign in, sign out)
- [ ] File uploads working
- [ ] Email templates customized
- [ ] Production Supabase project created
- [ ] Production environment variables set
- [ ] Database backed up
- [ ] Monitoring configured

---

**Need Help?** Check the Supabase Discord or create an issue in the repo!
