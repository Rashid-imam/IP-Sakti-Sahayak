import type { ReactNode } from 'react';

export default function PageFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full py-10 pb-16">
      <div
        className="
          w-full
          px-6
          md:px-10
          lg:px-16
          xl:px-[70px]
        "
      >
        {children}
      </div>
    </div>
  );
}