import type { CSSProperties } from 'react';
import './FoundationsPreview.scss';
import { cssVar, runtimeTokenData } from '../../theme/runtimeTokens';

type TypographyEntry = {
  label: string;
  style: string;
  variant: string;
  sample: string;
};

const surfaceSwatches = [
  {
    label: 'Surface / Primary',
    background: 'color-background-default-primary',
    foreground: 'color-text-default-primary',
    token: '--color-background-default-primary'
  },
  {
    label: 'Surface / Secondary',
    background: 'color-background-default-secondary',
    foreground: 'color-text-default-primary',
    token: '--color-background-default-secondary'
  },
  {
    label: 'Brand / Default',
    background: 'color-background-brand-default',
    foreground: 'color-text-brand-on-brand',
    token: '--color-background-brand-default'
  },
  {
    label: 'Info / Secondary',
    background: 'color-background-info-secondary',
    foreground: 'color-text-info-on-info-secondary',
    token: '--color-background-info-secondary'
  },
  {
    label: 'Positive / Secondary',
    background: 'color-background-positive-secondary',
    foreground: 'color-text-positive-on-positive-secondary',
    token: '--color-background-positive-secondary'
  },
  {
    label: 'Danger / Secondary',
    background: 'color-background-danger-secondary',
    foreground: 'color-text-danger-on-danger-secondary',
    token: '--color-background-danger-secondary'
  }
] as const;

const typographyEntries: TypographyEntry[] = [
  {
    label: 'Display 2 / Regular',
    style: 'display-2',
    variant: 'regular',
    sample: 'A visual scale that should feel product-ready before the first component ships.'
  },
  {
    label: 'Heading 1 / Regular',
    style: 'heading-1',
    variant: 'regular',
    sample: 'Storybook should mirror the design system, not just host isolated widgets.'
  },
  {
    label: 'Subheading 1 / Emphasized',
    style: 'subheading-1',
    variant: 'emphasized',
    sample: 'This gives us a stable baseline for components, states and documentation.'
  },
  {
    label: 'Body / Regular',
    style: 'body',
    variant: 'regular',
    sample: 'Raw Figma tokens are now normalized into runtime-friendly values, so components can consume theme variables without hand-cleaning every export.'
  },
  {
    label: 'Body / Emphasized',
    style: 'body',
    variant: 'emphasized',
    sample: 'Use this as the first validation surface before building buttons, inputs and more complex controls.'
  },
  {
    label: 'Footnote / Regular',
    style: 'footnote',
    variant: 'regular',
    sample: 'The toolbar theme switch should instantly restyle these samples through semantic variables.'
  }
];

function typographyStyle(style: string, variant: string): CSSProperties {
  const prefix = `typography-${style}-${variant}`;

  return {
    fontFamily: cssVar(`${prefix}-font-family`),
    fontSize: cssVar(`${prefix}-font-size`),
    fontWeight: cssVar(`${prefix}-font-weight`),
    fontStyle: cssVar(`${prefix}-font-style`),
    lineHeight: cssVar(`${prefix}-line-height`),
    letterSpacing: cssVar(`${prefix}-letter-spacing`),
    textTransform: cssVar(`${prefix}-text-transform`),
    textDecoration: cssVar(`${prefix}-text-decoration`)
  };
}

const shadowToken = runtimeTokenData.semantic.shadow.flyout;
const breakpointToken = runtimeTokenData.primitive.breakpoint;

export function FoundationsPreview() {
  return (
    <div className="foundations-preview">
      <section className="foundations-preview__hero">
        <span className="foundations-preview__eyebrow">Foundation Readiness Check</span>
        <div className="foundations-preview__hero-copy">
          <h1
            className="foundations-preview__section-title"
            style={typographyStyle('display-2', 'regular')}
          >
            Storybook is ready to become the first visual contract between Figma and code.
          </h1>
          <p
            className="foundations-preview__section-copy"
            style={typographyStyle('body', 'regular')}
          >
            This preview validates theme switching, semantic colors, typography styles,
            spacing rhythm and interactive surface language before we start building real UI kit
            components.
          </p>
        </div>
        <div className="foundations-preview__hero-actions">
          <button className="foundations-preview__button" type="button">
            Primary Action
          </button>
          <button className="foundations-preview__button foundations-preview__button--secondary" type="button">
            Secondary Action
          </button>
        </div>
      </section>

      <div className="foundations-preview__grid">
        <section className="foundations-preview__section">
          <h2 className="foundations-preview__section-title" style={typographyStyle('heading-2', 'regular')}>
            Semantic colors
          </h2>
          <p className="foundations-preview__section-copy" style={typographyStyle('footnote', 'regular')}>
            These swatches are driven by semantic CSS variables, so the toolbar theme switch should
            update them without changing component code.
          </p>
          <div className="foundations-preview__swatches">
            {surfaceSwatches.map((swatch) => (
              <article
                key={swatch.label}
                className="foundations-preview__swatch"
                style={{
                  background: cssVar(swatch.background),
                  color: cssVar(swatch.foreground)
                }}
              >
                <div>
                  <p className="foundations-preview__swatch-label" style={typographyStyle('body', 'emphasized')}>
                    {swatch.label}
                  </p>
                  <p className="foundations-preview__token" style={typographyStyle('footnote', 'regular')}>
                    {swatch.token}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="foundations-preview__section">
          <h2 className="foundations-preview__section-title" style={typographyStyle('heading-2', 'regular')}>
            Runtime typography
          </h2>
          <p className="foundations-preview__section-copy" style={typographyStyle('footnote', 'regular')}>
            Normalized typography now exposes explicit <code>fontWeight</code> and{' '}
            <code>fontStyle</code>, which makes the styles predictable in code.
          </p>
          <div className="foundations-preview__type-list">
            {typographyEntries.map((entry) => (
              <article className="foundations-preview__type-sample" key={`${entry.style}-${entry.variant}`}>
                <p className="foundations-preview__meta" style={typographyStyle('footnote', 'regular')}>
                  {entry.label}
                </p>
                <p style={typographyStyle(entry.style, entry.variant)}>{entry.sample}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="foundations-preview__section">
        <h2 className="foundations-preview__section-title" style={typographyStyle('heading-2', 'regular')}>
          Component surface baseline
        </h2>
        <p className="foundations-preview__section-copy" style={typographyStyle('footnote', 'regular')}>
          A minimal interaction surface to validate border, radius, shadow, motion and form-field
          treatment before implementing real components.
        </p>
        <div className="foundations-preview__component-list">
          <article className="foundations-preview__component-card">
            <p className="foundations-preview__component-meta" style={typographyStyle('footnote', 'regular')}>
              Pill states
            </p>
            <div className="foundations-preview__component-row">
              <span className="foundations-preview__chip" style={typographyStyle('body', 'regular')}>
                Neutral
              </span>
              <span className="foundations-preview__chip foundations-preview__chip--positive" style={typographyStyle('body', 'regular')}>
                Positive
              </span>
              <span className="foundations-preview__chip foundations-preview__chip--danger" style={typographyStyle('body', 'regular')}>
                Danger
              </span>
            </div>
          </article>

          <article className="foundations-preview__component-card">
            <p className="foundations-preview__component-meta" style={typographyStyle('footnote', 'regular')}>
              Field treatment
            </p>
            <div className="foundations-preview__component-row">
              <div className="foundations-preview__field" style={typographyStyle('body', 'regular')}>
                Default input field
              </div>
              <div
                className="foundations-preview__field foundations-preview__field--focus"
                style={typographyStyle('body', 'regular')}
              >
                Focus state
              </div>
              <div
                className="foundations-preview__field foundations-preview__field--danger"
                style={typographyStyle('body', 'regular')}
              >
                Validation state
              </div>
            </div>
          </article>

          <article className="foundations-preview__component-card">
            <p className="foundations-preview__component-meta" style={typographyStyle('footnote', 'regular')}>
              Baseline tokens in play
            </p>
            <p style={typographyStyle('body', 'regular')}>
              Breakpoints: {Object.entries(breakpointToken)
                .map(([name, value]) => `${name.toUpperCase()} ${value}`)
                .join(' · ')}
            </p>
            <p style={typographyStyle('body', 'regular')}>
              Flyout shadow: {shadowToken.map((layer) => `${layer.offsetX} ${layer.offsetY} ${layer.blur}`).join(', ')}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
