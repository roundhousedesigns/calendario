import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// TODO: DEV MODE
import { DEBUG_MODE } from "./lib/utils";

var reactAppData, appAnchorElement;
if (DEBUG_MODE !== true) {
	// live values
	reactAppData = window.rhdReactPlugin || {};
	const { appSelector } = reactAppData;
	appAnchorElement = document.querySelector(appSelector);
} else {
	// Dev
	appAnchorElement = document.getElementById("root");
}
// ODOT

if (appAnchorElement) {
	console.log('yes', appAnchorElement);
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		appAnchorElement
	);
} else {
	console.log('no', appAnchorElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
