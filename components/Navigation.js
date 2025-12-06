// Navigation component - bottom navigation bar with icons
import { Home, Clock, BookOpen, User, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  
  return (
    <div className="navigation">
      <Link href="/" className={router.pathname === '/' ? 'active' : ''}>
        <Home />
      </Link>
      <Link href="/timer" className={router.pathname === '/timer' ? 'active' : ''}>
        <Clock />
      </Link>
      <Link href="/tasks" className={router.pathname === '/tasks' ? 'active' : ''}>
        <BookOpen />
      </Link>
      <Link href="/homework-help" className={router.pathname === '/homework-help' ? 'active' : ''}>
        <MessageCircleQuestion />
      </Link>
      <Link href="/profile" className={router.pathname === '/profile' ? 'active' : ''}>
        <User />
      </Link>
    </div>
  );
}
