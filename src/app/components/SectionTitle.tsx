"use client";

import FadeIn from "./FadeIn";

export default function SectionTitle({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-10">
      <FadeIn delay={0.1}>
        <h1 className="text-5xl font-black">{title}</h1>
      </FadeIn>

      {text ? (
        <FadeIn delay={0.2}>
          <p className="mt-3 text-zinc-400">{text}</p>
        </FadeIn>
      ) : null}
    </div>
  );
}