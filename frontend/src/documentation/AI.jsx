import CollapsibleProjectSection from "../components/CollapsibleProjectSection";

export default function AI() {
    return (
        <CollapsibleProjectSection id="ai" number="07" title="The Role of AI">

            <p>
                AI was used as a learning, development and collaborative resource
                throughout SkyMesh. We approached it as one of several technologies
                available to us, using it to supplement our knowledge, improve our
                work and expand the scope of the project.
            </p>

            <h4>Backend Development</h4>

            <p>
                We developed the Python backend ourselves, including data
                processing, graph construction and the implementation of
                Dijkstra's algorithm. GitHub Copilot provided code suggestions
                within Visual Studio Code, which we either accepted or rejected
                based on our own knowledge. ChatGPT was used to review our
                code after implementation, identify potential errors and
                examine edge cases.
            </p>

            <h4>Infrastructure</h4>

            <p>
                AI provided step-by-step guidance in configuring our cloud
                infrastructure, establishing our production environment and
                automating deployment. We performed these configurations ourselves
                and used AI to help us understand unfamiliar technologies and
                troubleshoot issues.
            </p>

            <h4>Frontend Development</h4>

            <p>
                After developing a working terminal application, we decided to
                build an interactive web application to make our project more
                accessible and presentable. We used AI to generate the frontend
                under our close direction, providing instructions regarding its
                design, functionality and behavior.
            </p>

            <p>
                Tyler's existing knowledge of React and CSS allowed him to inspect,
                understand and modify the generated code. Recognizing the limitations
                of the initial implementation, we manually refactored approximately
                2,500 lines of monolithic frontend code into modular components,
                reducing the main application script to just 56 lines. This
                established a clear separation of concerns and improved the
                readability and maintainability of the codebase.
            </p>

            <p>
                We recognized AI as a valuable development tool with its own
                limitations. Its effective use required technical knowledge,
                critical evaluation and active involvement throughout the
                development process.
            </p>

            <h4>Brainstorming and Collaboration</h4>

            <p>
                We developed our own ideas throughout the project and used AI
                as a collaborative resource to explore, challenge and expand
                upon them. This helped us consider alternative approaches,
                identify overlooked details and refine our decisions.
            </p>

            <h4>Writing and Documentation</h4>

            <p>
                AI assisted in developing our written documentation. We supplied
                the ideas, observations, technical details, mathematical findings,
                organizational framework, and initial drafts. AI was used to refine our writing,
                improve clarity and organize our documentation for a web audience.
            </p>

            <p>
                Throughout the project, we maintained control over the design,
                implementation and direction of SkyMesh. We provided instructions,
                evaluated AI-generated output at every step and made corrections where necessary.
                Using AI allowed us to extend the scope of our project while
                remaining actively involved in its development.
            </p>

        </CollapsibleProjectSection>
    )
}