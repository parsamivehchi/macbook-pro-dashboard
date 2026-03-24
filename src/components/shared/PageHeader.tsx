interface PageHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
}

export function PageHeader({ icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-[22px] font-extrabold tracking-tight m-0">
        {icon} {title}
      </h2>
      <p className="text-[13px] mt-1" style={{ color: 'var(--color-sub)' }}>{subtitle}</p>
    </div>
  );
}
