import React, { forwardRef, useContext } from 'react';
import Calendar from './Calendar';
import List from './List';
import EditPost from './EditPost';
import { useFetchTaxonomyTerms } from '../lib/hooks';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';

const Main = forwardRef(({ todayRef }, ref) => {
	const { posts, postsDispatch } = useContext(PostsContext);
	const {
		viewOptions: { viewMode },
	} = useContext(ViewContext);

	useFetchTaxonomyTerms('category', posts, postsDispatch);
	useFetchTaxonomyTerms('post_tag', posts, postsDispatch);

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
