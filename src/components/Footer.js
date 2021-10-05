import React from "react";

export default function Footer() {
    return <footer className="footer-container">
        <span className="footer-item">{`A webapp that, surprisingly, isn't about food \nby `}</span>
        <span className="footer-item">
            <a
                href="http://thomasberg.me/"
                target="_blank"
                rel="noopener noreferrer"
            >Thomas Berg</a>
        </span>
        <span className="footer-item">
            <a
                href="https://github.com/brystmar/"
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
    </footer>
}
