import CollapsibleProjectSection from '../components/CollapsibleProjectSection';

export default function References() {
    return (
<CollapsibleProjectSection id="references" number="09" title="References and Resources">

    <h4>Data References</h4>

    <p>
        [1] U.S. Department of Transportation, Bureau of
        Transportation Statistics, “Origin and Destination Survey
        Data (Coupon), DB1C,” July 2026 dataset.
        Accessed: Nov. 25, 2026. [Online]. Available:{' '}
        <a
            href="https://www.bts.gov/topics/airlines-and-airports/origin-and-destination-survey-data-coupon"
            target="_blank"
            rel="noopener noreferrer"
        >
            Origin and Destination Survey Data (Coupon)
        </a>
    </p>

    <p>
        [2] U.S. Department of Transportation, Bureau of
        Transportation Statistics, Office of Airline Information,
        “Data Bank 1C: Public Coupon Version, File and Record
        Descriptions.” Accessed: Nov. 25, 2026. [Online].
        Available:{' '}
        <a
            href="https://www.bts.gov/sites/bts.dot.gov/files/DB1C_Description_for_Coupon_3.pdf"
            target="_blank"
            rel="noopener noreferrer"
        >
            DB1C File and Record Descriptions
        </a>
    </p>

    <h4>Academic References</h4>

    <ul>
        <li>Course lecture notes</li>
        <li>Assignments 5 and 6</li>
        <li>Graph Theory Mini Project assignment</li>
    </ul>

    <h4>Development Resources</h4>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Resources</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>Development tools</td>
                    <td>Visual Studio Code, Git, GitHub</td>
                </tr>

                <tr>
                    <td>Languages</td>
                    <td>Python, JavaScript, CSS</td>
                </tr>

                <tr>
                    <td>Libraries and frameworks</td>
                    <td>
                        NetworkX, airportsdata, Matplotlib,
                        Flask, React, Cytoscape.js
                    </td>
                </tr>

                <tr>
                    <td>Graph visualization</td>
                    <td>Gephi</td>
                </tr>

                <tr>
                    <td>Frontend development</td>
                    <td>Node.js, npm, Vite</td>
                </tr>

                <tr>
                    <td>Cloud infrastructure</td>
                    <td>AWS, Amazon EC2, Amazon Linux 2023</td>
                </tr>

                <tr>
                    <td>Production hosting</td>
                    <td>Gunicorn, Nginx, systemd</td>
                </tr>

                <tr>
                    <td>Automated deployment</td>
                    <td>GitHub Actions</td>
                </tr>

                <tr>
                    <td>Artificial intelligence</td>
                    <td>ChatGPT (GPT-6, GPT-6 Luna, GPT-6.2), GitHub Copilot</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4>Project Repository</h4>

    <p>
        <a
            href="https://github.com/Tjprimc09/CS291-Mini"
            target="_blank"
            rel="noopener noreferrer"
        >
            SkyMesh Source Code and Documentation
        </a>
    </p>

</CollapsibleProjectSection>
    )
}