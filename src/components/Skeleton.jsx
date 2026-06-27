export default function Skeleton({ width = "100%", height = 16, radius = 8, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg, var(--border, #e7eaf0) 25%, var(--surface, #f5f6f8) 50%, var(--border, #e7eaf0) 75%)",
      backgroundSize: "200% 100%",
      animation: "skeletonShimmer 1.4s ease infinite",
      ...style,
    }} aria-hidden="true" />
  );
}

export function SkeletonText({ lines = 3, gap = 10 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "60%" : "100%"} height={14} />
      ))}
    </div>
  );
}

export const skeletonStyles = `@keyframes skeletonShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
