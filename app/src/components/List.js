import React, { useContext } from 'react';
import DayPosts from './DayPosts';
import Loading from './common/Loading';
import { dateFormat, dayKey } from '../lib/utils';
import { format, addDays, endOfDay, isToday, isPast } from 'date-fns';

import { useFetchScheduledPosts } from '../lib/hooks';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';

export default function List({ className }) {
	const { posts, postsDispatch } = useContext(PostsContext);
	const {
		viewOptions: {
			viewRange: { start, end },
		},
	} = useContext(ViewContext);

	const { scheduled } = posts;

	var isLoading = useFetchScheduledPosts(start, end, posts, postsDispatch);

	const renderDays = () => {
		let days = [];
		let day = start;
		let classes = ['listDay'];

		if (end !== 'undefined' && end !== null) {
			while (endOfDay(day) <= endOfDay(end)) {
				if (isToday(day)) {
					classes.push('today');
				}
				if (isPast(day) && !isToday(day)) {
					classes.push('past');
				}

				days.push(
					<li key={day} className={classes.join(' ')}>
						<DayPosts
							date={day}
							posts={scheduled[dayKey(day)]}
							allowDrag={true}
							title={format(day, dateFormat.fullDate)}
							newPostButton={true}
						/>
					</li>
				);

				day = addDays(day, 1);
			}
		}

		return days;
	};

	const renderList = () => {
		return (
			<div className="view__list__days">
				<ul>{renderDays()}</ul>
			</div>
		);
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={className}>
					{start !== null && end !== null ? renderList() : null}
				</div>
			)}
		</>
	);
}
