import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// WP Dashboard admin rendering
const reactAppData = window.rhdReactPlugin || {};
const { appSelector } = reactAppData;
const appAnchorElement = document.querySelector(appSelector);

// dev only
// const appAnchorElement = document.getElementById("root");

if (appAnchorElement) {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		appAnchorElement
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
