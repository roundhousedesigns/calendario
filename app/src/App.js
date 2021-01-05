import React, { useEffect, useState } from "react";
// import { Component } from "@fullcalendar/react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";

import "./App.css";

export const AppContext = React.createContext();

const maxViewMonths = 3;

function getThisMonth() {
	let thisMonth = new Date();
	thisMonth.setDate(1);
	return thisMonth;
}

export default function App() {
	const baseMonth = getThisMonth();
	const [viewMode, setViewMode] = useState("3");
	const [calendarRef, setCalendarRefs] = useState([]);

	const createCalendarRefs = () => {
		let refs = [];
		for (let i = 0; i < maxViewMonths; i++) {
			refs[i] = React.createRef();
		}
		setCalendarRefs(refs);
	};

	useEffect(() => {
		setCalendarRefs(createCalendarRefs);
	}, []);

	const handleViewChange = (viewMode) => {
		setViewMode(viewMode);
	};

	return (
		<div className="calendario">
			<Header
				calendarRef={calendarRef}
				viewMode={viewMode}
				maxViewMonths={maxViewMonths}
				onViewChange={handleViewChange}
			/>

			<MainView
				calendarRef={calendarRef}
				baseMonth={baseMonth}
				viewMode={viewMode}
				maxViewMonths={maxViewMonths}
				onViewChange={handleViewChange}
			/>
			<Sidebar />
		</div>
	);
}
