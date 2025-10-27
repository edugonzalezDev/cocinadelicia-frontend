import { useRole } from "@/hooks/useRole";

export default function IfRole({ anyOf = [], allOf = [], children, otherwise = null }) {
  const { hasAny, hasAll } = useRole();
  const okAny = anyOf.length ? hasAny(anyOf) : true;
  const okAll = allOf.length ? hasAll(allOf) : true;

  if (okAny && okAll) return children;
  return otherwise;
}
