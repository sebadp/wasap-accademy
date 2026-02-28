import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { Terminal } from "./Terminal";
import { Step } from "./Step";
import { FileTree } from "./FileTree";
import { Highlight } from "./Highlight";
import { Concept } from "./Concept";
import { Quiz } from "./Quiz";
import { ProgressBar } from "./ProgressBar";

export function getMDXComponents(): MDXComponents {
  return {
    // Custom components available in MDX files
    Callout,
    Terminal,
    Step,
    FileTree,
    Highlight,
    Concept,
    Quiz,
    ProgressBar,

    // Override default HTML elements
    h1: (props) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3 border-b border-border pb-2" {...props} />,
    h3: (props) => <h3 className="text-xl font-semibold text-foreground mt-6 mb-2" {...props} />,
    p:  (props) => <p className="text-muted-foreground leading-7 my-4" {...props} />,
    ul: (props) => <ul className="my-4 space-y-2 list-disc list-inside text-muted-foreground" {...props} />,
    ol: (props) => <ol className="my-4 space-y-2 list-decimal list-inside text-muted-foreground" {...props} />,
    li: (props) => <li className="leading-7" {...props} />,
    // Inline code (not inside pre — shiki handles pre blocks)
    code: (props) => {
      // If inside a pre block (shiki), render as-is
      if (typeof props.children === "string" && !props.className) {
        return <code className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono text-accent" {...props} />;
      }
      return <code {...props} />;
    },
    // pre is handled by shiki rehype plugin — just add wrapper styles
    pre: (props) => (
      <div className="my-6 rounded-lg overflow-hidden border border-border [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:leading-relaxed">
        <pre {...props} />
      </div>
    ),
    blockquote: (props) => (
      <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground" {...props} />
    ),
    hr: () => <hr className="my-8 border-border" />,
    strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
    a: (props) => <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />,
  };
}
