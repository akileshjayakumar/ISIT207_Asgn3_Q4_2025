# Pet Heaven - Animal Welfare Society Website

A React single-page app for Pet Heaven Animal Welfare Society, with pet adoption, member signup, and pet surrender.

## Features

- Browse and filter available cats and dogs
- Adopt pets or apply online
- Register as a member or supporter
- Surrender pets to the society
- Login/logout for members
- Mobile-friendly design
- Uses The Cat API and The Dog API for images

## Tech Stack

- React 19.2.0
- React Context API
- Supabase (PostgreSQL + Auth)
- The Cat API & The Dog API
- CSS3

## Getting Started

**Prerequisites**

- Node.js (v14+)
- npm or yarn

**Installation**

1. Clone the repo:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Supabase by creating a `.env` in the root:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/     # UI, Auth, Forms, Pet display, Layout
├── contexts/       # React Providers
├── services/       # Supabase & API logic
├── config/         # Config files
├── utils/          # Utility functions
└── App.js

supabase/
└── schema.sql      # Database schema & RLS
```

## Main Components

- `Button`, `Card`, `Modal`, `FormInput`, `FormSelect`, `FormTextarea`, `LoadingSpinner`, `PetCard`
- Page Sections: `HomeSection`, `AboutSection`, `PetGallery`, `AdoptionSection`, `ContactSection`
- Forms: `MemberRegistrationForm`, `PetSurrenderForm`, `AdoptionForm`, `LoginForm`

## Scripts

- `npm start` – Dev mode
- `npm run build` – Production build
- `npm test` – Run tests

## Deployment

Deploy to:

- **Netlify**: Auto-deploy from GitHub
- **GitHub Pages**: Use `npm run build` and deploy `build` folder
- **Firebase**: Firebase Hosting
- **Vercel**: Auto-deploy from repo

### Production Build

```bash
npm run build
```

Creates optimized output in the `build` folder.

## Details

### Authentication

- Member registration/login via Supabase Auth
- Session management and protected member-only content

### Pets

- Fetch and filter cats/dogs from APIs
- Search by breed or name
- Display info/images

### Forms

- Client-side validation, error/success states
- All forms submit to Supabase

### Backend

- Supabase/postgres with RLS
- Auth: Email/password
- Tables: `members`, `adoption_applications`, `pet_surrender_requests`
