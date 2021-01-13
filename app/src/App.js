import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import { routeBase } from "./lib/utils";

import "./App.css";

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
	const [futuremostDate, setFuturemostDate] = useState("");

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

	useEffect(() => {
		fetch(`${routeBase}/posts/futuremost`)
			.then((response) => response.json())
			.then((future) => {
				setFuturemostDate(new Date(future));
			});

		fetch(`${routeBase}/user/calendario_view_mode/0`)
			.then((response) => response.json())
			.then((viewMode) => {
				viewMode = viewMode === false ? "3" : viewMode;
				setViewMode(viewMode);
			});
	}, []);

	useEffect(() => {
		fetch(`${routeBase}/user/calendario_view_mode/${viewMode}`, {
			method: "POST",
		})
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
			});
	}, [viewMode]);

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
				futuremostDate={futuremostDate}
			/>
			<Sidebar />
		</div>
	);
}
