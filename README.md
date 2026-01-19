# Portfolio WebsiteThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A professional portfolio website built with Next.js, TypeScript, Prisma, and Tailwind CSS.## Getting Started



## FeaturesFirst, run the development server:



- 🎨 Clean and professional design with light theme```bash

- 👤 Admin panel to manage contentnpm run dev

- 📱 Fully responsive design# or

- 🖼️ Multiple image upload support with thumbnailsyarn dev

- 📝 Sections and Projects management# or

- 🔐 Authentication for adminpnpm dev

# or

## Tech Stackbun dev

```

- **Framework**: Next.js 14 with App Router

- **Language**: TypeScriptOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **Styling**: Tailwind CSS

- **Database**: PostgreSQLYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **ORM**: Prisma

- **Authentication**: NextAuth.jsThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## Getting Started## Learn More



### PrerequisitesTo learn more about Next.js, take a look at the following resources:



- Node.js 18+- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- PostgreSQL database- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



### InstallationYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



1. Clone the repository:## Deploy on Vercel

```bash

git clone https://github.com/raflihafdz/portofolio.gitThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

cd portofolio

```Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A random secret string
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

4. Generate Prisma client and push schema:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database (creates admin user and sample data):
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.


**⚠️ Change these credentials in production!**

## Deployment to Vercel

### 1. Database Setup

You need a PostgreSQL database. Options:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)

### 2. Deploy to Vercel

1. Push your code to GitHub

2. Import the repository in Vercel

3. Add environment variables in Vercel:
   - `DATABASE_URL`: Your production database URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., https://your-app.vercel.app)

4. Deploy!

### 3. After Deployment

Run database migrations:
```bash
npx prisma db push
```

Seed the database with admin user:
```bash
npm run db:seed
```

## Project Structure

```
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/
│   └── uploads/          # Uploaded images
├── src/
│   ├── app/
│   │   ├── admin/        # Admin panel pages
│   │   ├── api/          # API routes
│   │   └── page.tsx      # Homepage
│   ├── components/       # React components
│   ├── lib/              # Utilities (Prisma client)
│   └── types/            # TypeScript types
├── .env                  # Environment variables
└── package.json
```

## License

MIT
