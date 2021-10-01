import React from "react";

export default function Footer() {
    return <footer className="footer-container">
        <div className="tagline">
            {`Another surprisingly-not-food-centric app \nby `}
            <a
                href="http://thomasberg.me/"
                target="_blank"
                rel="noopener noreferrer"
            >Thomas Berg</a>
        </div>

        <div className="links">
            <span className="logo-container">
                <a
                    href="https://github.com/brystmar/greeting-cards-ui/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="./logos/github.svg"
                        alt="GitHub logo"
                        className="logo"
                    />
                </a>
            </span>

            <span className="logo-container">
                <a
                    href="http://breadsheet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="./logos/bread-loaf-long.png"
                        alt="Spinning rustic baguette"
                        className="logo"
                    />
                </a>
            </span>
        </div>
    </footer>
}
