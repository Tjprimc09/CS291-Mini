import { useState } from 'react'

export default function CollapsibleProjectSection({ id, number, title, children }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <section id={id} className="project-subsection">

            <span className="section-number">{number}</span>

            <h3>
                <button
                    type="button"
                    className="project-section-toggle"
                    onClick={() => setExpanded(previous => !previous)}
                    aria-expanded={expanded}
                    aria-controls={`${id}-content`}
                >
                    <span>{title}</span>

                    <svg
                        className={`section-chevron ${expanded ? 'expanded' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M6 9 L12 15 L18 9" />
                    </svg>
                </button>
            </h3>

            <div
                id={`${id}-content`}
                className={`project-section-content ${expanded ? 'expanded' : ''}`}
                inert={!expanded}
            >
                <div className="project-section-clip">
                    <div className="project-section-body">
                        {children}
                    </div>
                </div>
            </div>

        </section>
    );
}