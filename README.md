[![test](/public/images/thumbnail.png)](https://claise.hexaa.sh/)
# Claisse - Educational Platform for improving studying technique

Claisse is an educational platform that utalize AI for making automated quiz based on the student perference of study and their study interest. 
Built with Next.js for frontend and backend, Supabase and Hono for database. 


## Features
- User Authentication (Teachers and Students)
- Classroom Management
- Assignment/quiz System
- Student Progress Tracking
- Personalized Learning Experience

## Language, Framework, tools, and external script used in this project.

- **Frontend**:
  - Next.js 15.4
  - React 19.1
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Sonner for notifications

- **Backend**:
  - Hono.js for API routes
  - Supabase for database and authentication
  - TypeScript

- **Packages**:
  - `@nexora/database`: Database client and schema definitions
  - `@nexora/types`: TypeScript type definitions
  - `@nexora/ai`: AI-related functionalities


## Setup

1. Clone the repository
```bash
git clone https://github.com/hexaaagon/claiss
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Start the development server
```bash
bun run dev
```

## API Routes

### Teacher Routes
- `POST /teacher/classroom` - Create a new classroom
- `GET /teacher/classroom` - Get all classrooms
- `GET /teacher/classroom/:token` - Get classroom by token
- `PUT /teacher/classroom/:token` - Update classroom
- `DELETE /teacher/classroom/:token` - Delete classroom

### Student Routes
- `POST /student` - Create a new student
- `GET /student` - Get all students
- `GET /student/:token` - Get student by token
- `PUT /student/:token` - Update student
- `DELETE /student/:token` - Delete student

## License

MIT License