import React, { forwardRef, useContext, useEffect } from 'react';
import Calendar from './Calendar';
import List from './List';
import EditPost from './EditPost';
import { useFetchScheduledPosts, useFetchTaxonomyTerms } from '../lib/hooks';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';

const Main = forwardRef(({ todayRef }, ref) => {
	const { posts, postsDispatch } = useContext(PostsContext);
	const {
		viewOptions: {
			viewMode,
			viewRange: { start, end },
		},
	} = useContext(ViewContext);

	useFetchTaxonomyTerms('category', posts, postsDispatch);
	useFetchTaxonomyTerms('post_tag', posts, postsDispatch);

	/**
	 * Dated posts
	 */
	useFetchScheduledPosts(start, end, posts, postsDispatch);

	return (
		<main className="calendarioMain__main">
			<div className="view" ref={ref}>
				{viewMode === 'calendar' ? (
					<Calendar className="view__calendar" todayRef={todayRef} />
				) : (
					<List className="view__list" todayRef={todayRef} />
				)}
			</div>
			<EditPost />
		</main>
	);
});
export default Main;
