import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

import "./App.scss";

export default function App() {
	return (
		<div className="calendario">
			<Header />
			<Main />
			<Sidebar />
		</div>
	);
}
