import CollapsibleProjectSection from "../components/CollapsibleProjectSection";

export default function Infrastructure() {
    return (
        <CollapsibleProjectSection id="infrastructure" number="05" title="The Infrastructure">
        
            <p>
                We wanted SkyMesh to stand out among other implementations
                of the same mini project. Developing an interactive,
                publicly accessible web application allowed us to present
                our work more effectively while exploring technologies
                beyond the scope of the original assignment.
            </p>
        
            <h4>Cloud Infrastructure</h4>
        
            <p>
                We selected Amazon Web Services (AWS) to host SkyMesh,
                provisioning an EC2 virtual server with the following
                specifications:
            </p>
        
            <ul>
                <li><strong>Instance type:</strong> m7i-flex.large</li>
                <li><strong>Operating system:</strong> Amazon Linux 2023</li>
                <li><strong>Region:</strong> US East (Ohio)</li>
                <li><strong>Architecture:</strong> x86-64</li>
            </ul>
        
            <h4>Server Configuration</h4>
        
            <p>
                Using SSH, we remotely accessed and configured the EC2
                instance with the software necessary to host SkyMesh.
            </p>
        
            <div className="infrastructure-table">
                <table>
                    <thead>
                        <tr>
                            <th>Technology</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
        
                    <tbody>
                        <tr>
                            <td>Python</td>
                            <td>Backend execution</td>
                        </tr>
        
                        <tr>
                            <td>Python virtual environment</td>
                            <td>Dependency isolation</td>
                        </tr>
        
                        <tr>
                            <td>Node.js and npm</td>
                            <td>Frontend compilation and dependency management</td>
                        </tr>
        
                        <tr>
                            <td>Gunicorn</td>
                            <td>Production backend server</td>
                        </tr>
        
                        <tr>
                            <td>Nginx</td>
                            <td>Web server and reverse proxy</td>
                        </tr>
        
                        <tr>
                            <td>systemd</td>
                            <td>Persistent service management</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        
            <h4>Production Architecture</h4>
        
            <p>
                Nginx serves as the public entry point for SkyMesh.
                The React frontend is compiled using Vite and served
                directly by Nginx.
            </p>
        
            <p>
                API requests are forwarded to Gunicorn, which runs
                the Flask backend and executes the application's
                graph operations.
            </p>
        
            <p>
                Gunicorn is managed through systemd, allowing the
                backend to remain operational independently of an
                active SSH session and automatically start when
                the server boots.
            </p>
        
            <h4>Public Accessibility</h4>
        
            <p>
                A dedicated domain name provides SkyMesh with a
                recognizable identity and an easily accessible web
                address. DNS connects the domain to our EC2 instance,
                while HTTPS secures communication between the browser
                and server.
            </p>
        
            <h4>Automated Deployment</h4>
        
            <p>
                To eliminate the need to manually update the production
                server after every modification, we implemented
                continuous deployment using GitHub Actions.
            </p>
        
            <p>
                A self-hosted GitHub Actions runner operates directly
                on the EC2 instance as a persistent system service.
                Deployments are automatically triggered whenever changes
                are pushed to the main branch of our repository.
            </p>
        
            <p>Each deployment performs the following operations:</p>
        
            <ol>
                <li>Retrieve and synchronize the latest source code.</li>
                <li>Install backend and frontend dependencies.</li>
                <li>Compile the frontend using Vite.</li>
                <li>Restart the necessary application services.</li>
            </ol>
        
            <p>
                This allows us to develop locally, push changes to
                GitHub and automatically deploy them to production.
            </p>
        
            <div className="architecture">
        
                <h4 className="architecture-title">
                    SkyMesh Infrastructure
                </h4>
        
                <p className="architecture-description">
                    AWS hosting, production architecture, and automated deployment
                </p>
        
                {/* APPLICATION FLOW */}
        
                <div className="architecture-flow">
        
                    <h5 className="flow-heading application-heading">
                        Application Flow
                    </h5>
        
                    <div className="application-flow">
        
                        <div className="architecture-node browser-node">
                            <svg viewBox="0 0 48 48" className="architecture-icon">
                                <rect x="6" y="6" width="36" height="28" rx="3"
                                    fill="none" stroke="currentColor" strokeWidth="3" />
                                <path d="M2 39 H46 L42 34 H6 Z"
                                    fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <strong>User Browser</strong>
                        </div>
        
                        <div className="architecture-arrow blue-arrow">
                            <span>HTTPS</span>
                        </div>
        
                        <div className="architecture-node nginx-node">
                            <img src="/logos/nginx.svg" alt="Nginx" />
                            <strong>Nginx</strong>
                        </div>
        
                        <div className="application-branches">
        
                            <div className="architecture-branch">
        
                                <div className="architecture-arrow blue-arrow">
                                    <span>Static assets</span>
                                </div>
        
                                <div className="architecture-node">
                                    <img src="/logos/react.svg" alt="React" />
                                    <div>
                                        <strong>React Frontend</strong>
                                        <small>Vite production build</small>
                                    </div>
                                </div>
        
                            </div>
        
                            <div className="architecture-branch">
        
                                <div className="architecture-arrow blue-arrow">
                                    <span>API requests</span>
                                </div>
        
                                <div className="backend-flow">
        
                                    <div className="architecture-node">
                                        <img src="/logos/flask.svg" alt="Flask" />
                                        <strong>Gunicorn + Flask API</strong>
                                    </div>
        
                                    <div className="vertical-arrow"></div>
        
                                    <div className="architecture-node">
                                        <img src="/logos/networkx.svg" alt="NetworkX" />
                                        <strong>NetworkX</strong>
                                    </div>
        
                                    <div className="vertical-arrow"></div>
        
                                    <div className="architecture-node">
                                        <svg viewBox="0 0 32 32" className="architecture-icon">
                                            <path d="M7 3 H20 L26 9 V29 H7 Z"
                                                fill="none" stroke="currentColor"
                                                strokeWidth="2" strokeLinejoin="round" />
                                            <path d="M20 3 V9 H26 M11 15 H22 M11 20 H22"
                                                fill="none" stroke="currentColor"
                                                strokeWidth="2" />
                                        </svg>
                                        <strong>airports.gexf</strong>
                                    </div>
        
                                </div>
        
                            </div>
        
                        </div>
        
                    </div>
        
                </div>
        
                {/* DEPLOYMENT FLOW */}
        
                <div className="architecture-flow">
        
                    <h5 className="flow-heading deployment-heading">
                        Deployment Flow
                    </h5>
        
                    <div className="deployment-flow">
        
                        <div className="deployment-pipeline">
        
                            <div className="deployment-node">
                                <img src="/logos/vscode.svg" alt="VS Code" />
                                <strong>Development Environment</strong>
                                <small>VS Code</small>
                            </div>
        
                            <div className="architecture-arrow red-arrow"></div>
        
                            <div className="deployment-node">
                                <img src="/logos/github.svg" alt="GitHub" />
                                <strong>GitHub Repository</strong>
                                <small>main branch</small>
                            </div>
        
                            <div className="architecture-arrow red-arrow"></div>
        
                            <div className="deployment-node">
                                <img src="/logos/githubactions.svg" alt="GitHub Actions" />
                                <strong>GitHub Actions Runner</strong>
                                <small>Self-hosted</small>
                                <small>systemd service</small>
                            </div>
        
                            <div className="architecture-arrow red-arrow"></div>
        
                            <div className="deployment-node deployment-server">
                                <img src="/logos/ec2.png" alt="Amazon EC2" />
                                <strong>EC2 Server</strong>
        
                                <ul>
                                    <li>Sync source code</li>
                                    <li>Install dependencies</li>
                                    <li>Build frontend</li>
                                    <li>Restart services</li>
                                </ul>
        
                            </div>
        
                        </div>
        
                        {/* AWS ENVIRONMENT */}
        
                        <div className="aws-environment">
        
                            <div className="aws-heading">
                                <img src="/logos/aws.svg" alt="AWS" />
                                <div>
                                    <strong>AWS EC2</strong>
                                    <small>Amazon Linux 2023</small>
                                </div>
                            </div>
        
                            <div className="aws-components">
        
                                <div className="aws-component">
                                    <img src="/logos/nginx.svg" alt="Nginx" />
                                    <strong>Nginx</strong>
                                </div>
        
                                <div className="aws-component">
                                    <img src="/logos/react.svg" alt="React" />
                                    <strong>React Frontend</strong>
                                </div>
        
                                <div className="aws-component">
                                    <img src="/logos/githubactions.svg" alt="GitHub Actions" />
                                    <strong>GitHub Actions Runner</strong>
                                </div>
        
                                <div className="aws-component">
                                    <img src="/logos/flask.svg" alt="Flask" />
                                    <strong>Gunicorn + Flask API</strong>
                                </div>
        
                                <div className="aws-component">
                                    <img src="/logos/networkx.svg" alt="NetworkX" />
                                    <strong>NetworkX</strong>
                                </div>
        
                                <div className="aws-component">
                                    <svg viewBox="0 0 32 32" className="architecture-icon">
                                        <path d="M7 3 H20 L26 9 V29 H7 Z"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinejoin="round" />
                                        <path d="M20 3 V9 H26 M11 15 H22 M11 20 H22"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="2" />
                                    </svg>
                                    <strong>airports.gexf</strong>
                                </div>
        
                            </div>
        
                        </div>
        
                    </div>
        
                </div>
        
                {/* LEGEND */}
        
                <div className="architecture-legend">
                    <div>
                        <span className="legend-line application-line"></span>
                        Application flow
                    </div>
                    <div>
                        <span className="legend-line deployment-line"></span>
                        Deployment flow
                    </div>
                </div>
        
            </div>
        
            <h4>Beyond the Assignment</h4>
        
            <p>
                What began as an exercise in graph theory evolved
                into a full-stack software development project
                incorporating cloud infrastructure, Linux server
                administration, production hosting and automated
                deployment.
            </p>
        
        </CollapsibleProjectSection>
    )
}