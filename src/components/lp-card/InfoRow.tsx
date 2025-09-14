import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export function InfoRow({ label, children }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">{label}</span>
      {children}
    </div>
  );
}

