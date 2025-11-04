# 🚀 Quick Start - Supabase Integration

Follow these steps to get your Perfect Wedding app running with Supabase in **under 10 minutes**!

---

## ⚡ Step 1: Install Dependencies (2 min)

```bash
npm install
```

This installs:
- `@supabase/supabase-js@^2.45.4`
- `@supabase/ssr` (for server-side support)
- `zod@^3.23.8` (for validation)

---

## 🔑 Step 2: Create Supabase Project (3 min)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `perfect-wedding`
   - Password: (create a strong one)
   - Region: (choose closest to you)
4. Click "Create project" and wait ~2 minutes

---

## 📊 Step 3: Setup Database (2 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy **ALL** contents from `supabase/schema.sql`
4. Paste and click "Run"
5. ✅ You should see "Success. No rows returned"

---

## 🔐 Step 4: Get API Keys (1 min)

1. Go to **Settings** → **API** in Supabase
2. Copy these two values:
   - **Project URL**
   - **anon public** key

---

## ⚙️ Step 5: Configure Environment (1 min)

1. Create `.env` file in project root:

```bash
cp .env.example .env
```

2. Edit `.env` and paste your values:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 Step 6: Update Root Component (1 min)

Edit `app/root.tsx`:

```tsx
import { AuthProvider } from "~/contexts/auth-context";
import { json, useLoaderData } from "react-router";

// Add loader to expose env vars
export async function loader() {
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  });
}

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
        {/* Expose ENV to client */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        
        {/* Wrap with AuthProvider */}
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

---

## 🚀 Step 7: Start Dev Server

```bash
npm run dev
```

Navigate to: `http://localhost:5173`

---

## ✅ Step 8: Test Authentication

### Test Sign Up:

1. Go to `http://localhost:5173/signup`
2. Choose "Couple" or "Vendor"
3. Fill in the form
4. Click "Create Account"

### Verify in Supabase:

1. Go to **Authentication** → **Users**
2. You should see your new user!
3. Go to **Table Editor** → **profiles**
4. Profile created automatically with correct role ✅

### Test Sign In:

1. Go to `http://localhost:5173/login`
2. Enter your credentials
3. Should redirect to home page ✅

---

## 🎯 What You Have Now

✅ **Authentication System**
- Sign up (couple/vendor)
- Sign in
- Sign out
- Session management
- Protected routes

✅ **Database Tables**
- `profiles` - User profiles
- `weddings` - Wedding planning data
- `guests` - Guest lists
- `services` - Vendor services
- `reviews` - Service reviews
- `bookings` - Service bookings
- `seating_charts` - Seating arrangements

✅ **Security**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Vendors can only edit their services
- Automatic profile creation on signup

✅ **Storage Buckets**
- `avatars` - Profile pictures
- `service-images` - Service photos
- `service-videos` - Service videos
- `portfolios` - Vendor portfolios

---

## 📝 Next Steps

### 1. Update Wedding Planning Form

Replace mock data with real database:

```tsx
// app/routes/planning.step-4.tsx
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  
  const formData = await request.formData();
  
  const { data, error } = await supabase
    .from('weddings')
    .insert({
      user_id: user.id,
      partner1_name: formData.get('partner1Name'),
      partner2_name: formData.get('partner2Name'),
      wedding_date: formData.get('weddingDate'),
      guest_count: parseInt(formData.get('guestCount') as string),
      location: formData.get('location'),
      // ... add other fields from your form
    })
    .select()
    .single();
  
  if (error) {
    return json({ error: error.message }, { status: 400 });
  }
  
  return redirect('/my-wedding');
}
```

### 2. Update Vendor Service Creation

```tsx
// app/routes/add-service.step-4.tsx
export async function action({ request }: Route.ActionArgs) {
  const user = await requireVendor(request); // Ensures user is a vendor
  const { supabase } = createSupabaseServerClient(request);
  
  const formData = await request.formData();
  
  const { data, error } = await supabase
    .from('services')
    .insert({
      vendor_id: user.id,
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      price_min: parseFloat(formData.get('priceMin') as string),
      price_max: parseFloat(formData.get('priceMax') as string),
      location: formData.get('location'),
      // ... add other fields
    })
    .select()
    .single();
  
  if (error) {
    return json({ error: error.message }, { status: 400 });
  }
  
  return redirect('/vendor/dashboard');
}
```

### 3. Fetch Real Services

```tsx
// app/routes/venues._index.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      vendor:profiles!vendor_id(
        first_name,
        last_name,
        business_name,
        avatar_url
      )
    `)
    .eq('category', 'venue')
    .eq('is_active', true)
    .order('rating', { ascending: false });
  
  return json({ services });
}
```

### 4. Implement Guest List with Real Data

```tsx
// app/routes/guests._index.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  
  // Get user's wedding
  const { data: wedding } = await supabase
    .from('weddings')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (!wedding) {
    return json({ guests: [] });
  }
  
  // Get guests for this wedding
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('name');
  
  return json({ guests });
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'add') {
    const { data: wedding } = await supabase
      .from('weddings')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    await supabase.from('guests').insert({
      wedding_id: wedding.id,
      name: formData.get('name'),
      email: formData.get('email'),
      relationship: formData.get('relationship'),
      // ... other fields
    });
  }
  
  return redirect('/guests');
}
```

---

## 🔧 Troubleshooting

**TypeScript Errors?**
```bash
npm install
# Restart your editor/TypeScript server
```

**"Invalid API key"?**
- Check `.env` file
- Restart dev server after changing `.env`

**"Table does not exist"?**
- Re-run the SQL schema in Supabase
- Check for errors in SQL Editor

**Can't sign in?**
- Check email confirmation settings in Supabase
- Go to **Authentication** → **Email Templates**
- Disable email confirmation for development

---

## 📚 Full Documentation

See `SUPABASE_SETUP_GUIDE.md` for complete documentation including:
- File uploads
- Real-time features
- Search implementation
- Security best practices
- Production deployment

---

## 🎉 You're Ready!

You now have a fully functional authentication system and database! Start replacing your mock data with real Supabase queries.

**Happy coding! 💍✨**
