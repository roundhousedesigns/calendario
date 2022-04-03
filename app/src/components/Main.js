import React, { forwardRef, useContext } from 'react';
import Calendar from './Calendar';
import List from './List';
import EditPost from './EditPost';
import { useFetchScheduledPosts, useFetchTaxonomyTerms } from '../lib/hooks';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';
import Loading from './common/Loading';

const Main = forwardRef(({ todayRef, isUpdating }, ref) => {
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
				{isUpdating ? <Loading /> : null}
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
