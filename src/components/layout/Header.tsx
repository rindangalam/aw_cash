interface HeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export function Header({ title, rightAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
        <h1 className="text-lg font-bold tracking-tight text-text dark:text-text-dark">{title}</h1>
        {rightAction}
      </div>
    </header>
  );
}
