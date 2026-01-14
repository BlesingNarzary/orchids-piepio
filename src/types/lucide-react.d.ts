declare module "lucide-react" {
  import * as React from "react";

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
  }

  export type LucideIcon = (props: LucideProps) => JSX.Element;

  export const ArrowRight: LucideIcon;
  export const CodeXml: LucideIcon;
  export const Search: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Box: LucideIcon;
  export const Atom: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Paperclip: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ArrowUp: LucideIcon;

  export const ChevronDownIcon: LucideIcon;
}

