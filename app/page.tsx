// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
  
  // The rest of this code won't execute
  return (
    <main className="min-h-screen">
      {/* This content will never render */}
    </main>
  );
}