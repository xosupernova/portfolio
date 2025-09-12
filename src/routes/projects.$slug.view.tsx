/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ProjectDef } from '@/lib/projects';

export type ProjectsSlugViewProps = {
  proj: ProjectDef | null;
  md: { markdown: string; url: string } | null;
};

export default function ProjectsSlugView({ proj, md }: ProjectsSlugViewProps) {
  const baseDir = md?.url ? new URL('.', md.url).toString() : undefined;

  if (!proj) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <p className="opacity-80">Project not found.</p>
        <a href="/projects" className="underline">
          Back to Projects
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{proj.title}</h1>
        <div className="flex gap-2 text-sm">
          <a
            href={`https://github.com/${proj.owner}/${proj.repo}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            View on GitHub
          </a>
          {proj.homepage && (
            <a
              href={proj.homepage}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Website
            </a>
          )}
        </div>
      </div>
      {proj.description && <p className="opacity-80 mb-8">{proj.description}</p>}
      {proj.tags && proj.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {proj.tags.map((t: string) => (
            <span key={t} className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="markdown max-w-none text-base leading-relaxed space-y-4 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_code]:bg-black/5 dark:[&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_table]:w-full [&_th]:text-left [&_td]:align-top">
        {md?.markdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                const rawHref = href || '';
                const isHttp = /^https?:\/\//i.test(rawHref);
                const resolved = !isHttp && baseDir ? new URL(rawHref, baseDir).toString() : rawHref;
                return (
                  <a
                    {...props}
                    href={resolved}
                    target={isHttp ? '_blank' : undefined}
                    rel={isHttp ? 'noopener noreferrer' : undefined}
                    className="underline"
                  >
                    {children}
                  </a>
                );
              },
              img: ({ src, alt, ...props }) => {
                let resolved = src || '';
                if (resolved && !/^https?:\/\//i.test(resolved) && baseDir) {
                  resolved = new URL(resolved, baseDir).toString();
                }
                return <img {...props} src={resolved} alt={alt || ''} loading="lazy" />;
              },
            }}
          >
            {md.markdown}
          </ReactMarkdown>
        ) : (
          <p className="opacity-70">README not found.</p>
        )}
      </div>
    </div>
  );
}
