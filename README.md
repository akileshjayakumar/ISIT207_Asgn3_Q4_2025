# Pet Heaven - Animal Welfare Society Website

A React-based single-page application for Pet Heaven Animal Welfare Society, featuring pet adoption, member registration, and pet surrender services.

## Features

- **Pet Gallery**: Browse cats and dogs with filtering capabilities
- **Adoption System**: View available pets and submit adoption applications
- **Member Registration**: Register as a member or supporter
- **Pet Surrender**: Submit pets for surrender to the society
- **User Authentication**: Login/logout functionality for members
- **Responsive Design**: Mobile-friendly interface
- **REST API Integration**: Uses The Cat API and The Dog API for pet images

## Technology Stack

- React 19.2.0
- React Context API for state management
- **Supabase** (PostgreSQL database + Authentication)
- REST APIs: The Cat API & The Dog API
- CSS3 with custom styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
```

3. Set up backend services:

   - **Supabase**: Database automatically initializes on first app startup
   - **Pet APIs**: Get free API keys from:
     - [The Cat API](https://thecatapi.com/)
     - [The Dog API](https://docs.thedogapi.com/docs/intro)

   Create a `.env` file in the root directory:

```env
# Supabase Configuration (Required)
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Forms/          # Form components (reusable)
│   ├── Layout/         # Header, Footer
│   ├── Pets/           # Pet-related components
│   ├── Sections/       # Page sections (Home, About, etc.)
│   └── UI/             # Reusable UI components
├── contexts/           # React Context providers
├── services/           # API service functions (Supabase, Pet APIs)
├── config/             # Configuration files (Supabase, API configs)
├── utils/              # Utility functions
└── App.js              # Main app component

supabase/
└── schema.sql          # Database schema and RLS policies
```

## Key Components

### Reusable Components

- `Button` - Styled button with variants
- `Card` - Card container component
- `Modal` - Modal dialog component
- `FormInput`, `FormSelect`, `FormTextarea` - Form input components
- `LoadingSpinner` - Loading indicator
- `PetCard` - Pet display card

### Page Sections

- `HomeSection` - Hero and features
- `AboutSection` - About Pet Heaven
- `PetGallery` - Pet gallery with filters
- `AdoptionSection` - Adoption listings and forms
- `ContactSection` - Contact info and login/register

### Forms

- `MemberRegistrationForm` - New member registration
- `PetSurrenderForm` - Pet surrender submission
- `AdoptionForm` - Adoption application
- `LoginForm` - User authentication

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Deployment

The app can be deployed to:

- **Netlify**: Connect your GitHub repo and deploy automatically
- **GitHub Pages**: Use `npm run build` and deploy the `build` folder
- **Firebase**: Use Firebase Hosting
- **Vercel**: Connect repository for automatic deployments

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Features Implementation

### Authentication

- Member registration with Supabase Auth
- Login/logout functionality with session management
- User session persistence (Supabase handles this)
- Protected content for members
- Member profiles stored in PostgreSQL database

### Pet Management

- Fetch pets from The Cat API and The Dog API
- Filter pets by type (cats/dogs)
- Search pets by breed or name
- Display pet information with images

### Forms

- Client-side validation
- Error handling and display
- Success messages
- **Database integration**: All form submissions saved to Supabase
- Adoption applications stored in database
- Pet surrender requests stored in database

## Technical Implementation & Backend Services

### Supabase Integration

- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Tables**:
  - `members` - Member profiles
  - `adoption_applications` - Adoption form submissions
  - `pet_surrender_requests` - Surrender form submissions
