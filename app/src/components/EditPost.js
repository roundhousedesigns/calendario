import React, {
	useContext,
	useRef,
	useEffect,
	useState,
	useReducer,
	useCallback,
} from 'react';
import FieldGroup from './common/FieldGroup';
import Icon from './common/Icon';
import { useClickOutside } from '../lib/hooks';
import {
	dateFormat,
	dayKey,
	filterPostStatus,
	filterStatusList,
	getPostList,
	moveItem,
	stripPermalinkSlug,
} from '../lib/utils';
import DatePicker from 'react-datepicker';
import { isFuture, isPast, isToday } from 'date-fns';
import { isEmpty } from 'lodash';
import { decode } from 'html-entities';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';

const initialEditPost = {
	post: {},
	editMode: false,
	ogPost: null,
};

const initialTaxFilter = {
	category: '',
	post_tag: '',
};

function editPostReducer(state, action) {
	switch (action.type) {
		case 'SET':
			return {
				post: action.post,
				editMode: true,
				ogPost: action.post,
			};

		case 'EDIT':
			const { field } = action;
			var { value } = action;

			if (field === 'post_date') {
				value = new Date(value);
			}

			return {
				...state,
				post: {
					...state.post,
					[field]: value,
				},
			};

		case 'TOGGLE_TAXONOMY':
			const term_id = parseInt(action.term_id);
			const index = state.post.taxonomies.hasOwnProperty(action.taxonomy)
				? state.post.taxonomies[action.taxonomy].indexOf(term_id)
				: false;
			let termList =
				index === -1
					? [...state.post.taxonomies[action.taxonomy], term_id]
					: index === false
					? [term_id]
					: [
							...state.post.taxonomies[action.taxonomy].slice(0, index),
							...state.post.taxonomies[action.taxonomy].slice(index + 1),
					  ];

			return {
				...state,
				post: {
					...state.post,
					taxonomies: {
						...state.post.taxonomies,
						[action.taxonomy]: termList,
					},
				},
			};

		case 'CLEAR':
			return initialEditPost;

		default:
			return { state };
	}
}

function taxFilterReducer(state, action) {
	switch (action.type) {
		case 'category':
			return {
				...state,
				category: action.filter,
			};

		case 'post_tag':
			return {
				...state,
				post_tag: action.filter,
			};

		default:
			return state;
	}
}

export default function EditPost() {
	const {
		viewOptions: { postStatuses },
	} = useContext(ViewContext);
	const {
		posts: { currentPost, taxonomies, scheduled, unscheduled },
		postsDispatch,
	} = useContext(PostsContext);
	const [editPost, editPostDispatch] = useReducer(
		editPostReducer,
		initialEditPost
	);
	const [taxFilter, taxFilterDispatch] = useReducer(
		taxFilterReducer,
		initialTaxFilter
	);
	const node = useRef(null);
	const initial = useRef({});
	const [date, setDate] = useState(new Date());
	const [allowedStatuses, setAllowedStatuses] = useState({});
	const [datePickerDisabled, setDatePickerDisabled] = useState(false);
	const [trashPostClicked, setTrashPostClicked] = useState(false);

	const { post, editMode } = editPost;
	const {
		id,
		post_title,
		post_name,
		post_date,
		post_status,
		post_excerpt,
		image,
		edit_link,
		view_link,
		taxonomies: post_taxonomies,
		unscheduled: isUnscheduled,
	} = post;

	// Save the original slug
	// useEffect(() => {
	// 	if (!initial.current.post_status) {
	// 		initial.current.post_status = post_status;
	// 	}

	// 	if (!initial.current.slug) {
	// 		initial.current.slug = post_name;
	// 	}

	// 	return () => {
	// 		initial.current = {};
	// 	};
	// }, [post_name, post_status]);

	useEffect(() => {
		if (post_date && post_date !== 'undefined') {
			setDate(new Date(post_date));
		}

		return () => {
			setDate(new Date());
		};
	}, [post_date]);

	useEffect(() => {
		let exclude = [];

		if (isUnscheduled === true) {
			exclude.push('publish', 'future');
		} else if (isFuture(date)) {
			exclude.push('publish');
		} else if (isPast(date)) {
			exclude.push('future');
		}

		const statusList = filterStatusList(postStatuses, exclude);

		setAllowedStatuses(statusList);

		return () => {
			setAllowedStatuses({});
		};
	}, [date, isUnscheduled, postStatuses]);

	useEffect(() => {
		const { post_date, post_status } = currentPost;

		setDatePickerDisabled(
			post_date &&
				(isToday(post_date) || isPast(post_date)) &&
				post_status === 'publish'
				? true
				: false
		);

		return () => {
			setDatePickerDisabled(false);
		};
	}, [currentPost]);

	useEffect(() => {
		const { id } = currentPost;
		if (id > 0 || id === 0) {
			editPostDispatch({
				type: 'SET',
				post: currentPost,
			});
		}

		return () => {
			editPostDispatch({
				type: 'CLEAR',
			});
		};
	}, [currentPost]);

	const closeModal = useCallback(() => {
		editPostDispatch({
			type: 'CLEAR',
		});

		postsDispatch({
			type: 'UNSET_CURRENTPOST',
		});
	}, [editPostDispatch, postsDispatch]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const { ogPost, post } = editPost;
		const posts = { scheduled, unscheduled };

		const index = isUnscheduled
			? unscheduled.findIndex((item) => item.id === id)
			: null;

		// Move from one list to another
		const postLists = {
			source: ogPost.unscheduled ? 'unscheduled' : dayKey(ogPost.post_date),
			destination: isUnscheduled ? 'unscheduled' : dayKey(post.post_date),
		};

		if (postLists.source !== postLists.destination) {
			const result = moveItem(
				getPostList(postLists.source, posts),
				getPostList(postLists.destination, posts),
				{ droppableId: postLists.source },
				{ droppableId: postLists.destination }
			);

			postsDispatch({
				type: 'MOVE_POST',
				source: result[postLists.source],
				destination: result[postLists.destination],
				sourceId: result.sourceId,
				destinationId: result.destinationId,
			});
		}

		postsDispatch({
			type: 'PREPARE_UPDATE',
			id,
			params: {
				post_title,
				post_name,
				post_date: new Date(post.post_date),
				post_status: filterPostStatus(post_status, isUnscheduled),
				post_excerpt,
				taxonomies: post_taxonomies,
			},
			unscheduled: isUnscheduled,
			newIndex: index,
		});

		postsDispatch({
			type: 'UNSET_CURRENTPOST',
		});

		editPostDispatch({
			type: 'CLEAR',
		});
	};

	const trashHandler = () => {
		postsDispatch({
			type: 'SEND_TO_TRASH',
			id,
			params: {
				post_date,
			},
			unscheduled: isUnscheduled,
		});

		editPostDispatch({
			type: 'CLEAR',
		});

		setTrashPostClicked(false);
	};

	const handleInputChange = (e) => {
		editPostDispatch({
			type: 'EDIT',
			field: e.target.name,
			value: e.target.value,
		});
	};

	const handleCheckboxToggle = (e) => {
		editPostDispatch({
			type: 'EDIT',
			field: e.target.name,
			value: !post[e.target.name],
		});
	};

	const handleTermCheckboxChange = (e) => {
		editPostDispatch({
			type: 'TOGGLE_TAXONOMY',
			taxonomy: e.target.closest('fieldset').name,
			term_id: e.target.value,
		});
	};

	const handleInputDateChange = (date) => {
		if (date === null) {
			date = new Date();
		}

		editPostDispatch({
			type: 'EDIT',
			field: 'post_date',
			value: date,
		});
	};

	const renderStatusOptions = (statusList) => {
		return Object.keys(statusList).map((status) => (
			<option key={status} value={status}>
				{statusList[status].name}
			</option>
		));
	};

	useClickOutside(node, closeModal);

	return (
		<div
			className={`editPost ${editMode ? 'active' : 'inactive'}`}
			ref={initial}
		>
			<div className="editPost__container">
				{editMode ? (
					<div ref={node} className="editPost__editor">
						<button className="close icon" onClick={closeModal}>
							highlight_off
						</button>
						<form
							className={`editPost__form ${
								trashPostClicked ? 'trashConfirm' : ''
							}`}
							onSubmit={handleSubmit}
						>
							<div className="editPost__title">
								<FieldGroup name="post_title">
									<input
										name="post_title"
										id="post_title"
										value={decode(post_title, {
											scope: 'strict',
										})}
										placeholder="New Post Title"
										onChange={handleInputChange}
									/>
								</FieldGroup>
							</div>
							<div className="header">
								<div className="header__left">
									<FieldGroup name="post_name">
										<div className="permalink">
											{id === 0 ? (
												// Adding a new post
												'Save this post to edit its permalink.'
											) : (
												// Editing a post
												<>
													<div className="permalink__label">
														<span className="label">Permalink:</span>
													</div>
													<div className="permalink__field">
														<span className="base">
															{stripPermalinkSlug(view_link)}
														</span>
														<input
															name="post_name"
															id="post_name"
															value={post_name}
															onChange={handleInputChange}
															placeholder="post-slug"
														/>
													</div>
												</>
											)}
										</div>
									</FieldGroup>
									<FieldGroup name="date">
										<div
											className={`post_date ${
												isUnscheduled === true ? 'inactive' : 'active'
											}`}
										>
											<label htmlFor="post_date">Post Date</label>
											<DatePicker
												closeOnScroll={(e) => e.target === document}
												selected={date}
												timeInputLabel="Time:"
												showTimeInput
												dateFormat={dateFormat.dateTime}
												onChange={handleInputDateChange}
												disabled={datePickerDisabled}
											/>
										</div>
										<div className="unscheduled">
											<input
												type="checkbox"
												name="unscheduled"
												id="unscheduled"
												checked={isUnscheduled}
												onChange={handleCheckboxToggle}
											/>
											<label htmlFor="unscheduled">Unscheduled</label>
										</div>
									</FieldGroup>
									<FieldGroup name="post_excerpt" label="Excerpt">
										<textarea
											name="post_excerpt"
											onChange={handleInputChange}
											rows={4}
											value={decode(post_excerpt, {
												scope: 'strict',
											})}
										/>
									</FieldGroup>
								</div>
								<div className="header__right">
									<div className="editPost__buttons">
										{trashPostClicked === true ? (
											<div className="trash confirm">
												<p
													style={{
														fontWeight: 'bold',
													}}
												>
													Are you sure you want to Trash this post?
												</p>
												<input
													type="button"
													onClick={trashHandler}
													value="Yes"
													autoFocus={true}
												/>
												{/* TODO bind ESC to cancel */}
												<input
													type="button"
													onClick={() => setTrashPostClicked(false)}
													value="No"
												/>
											</div>
										) : (
											<>
												<input
													type="submit"
													className="save"
													value={id === 0 ? 'Save' : 'Update'}
												/>
												<input
													type="button"
													className="trash"
													onClick={() => setTrashPostClicked(true)}
													value="Delete"
												/>
											</>
										)}
									</div>
									<div className="editPost__links">
										<a
											className="editLink"
											href={decode(edit_link)}
											target="_blank"
											rel="noreferrer"
										>
											Edit Post
										</a>
										<a
											className="viewLink"
											href={decode(view_link)}
											target="_blank"
											rel="noreferrer"
										>
											View Post
										</a>
									</div>
									<div className="fieldGroup__status">
										<label htmlFor="post_status">Post Status</label>
										<select
											name="post_status"
											onChange={handleInputChange}
											value={post_status}
										>
											{renderStatusOptions(allowedStatuses)}
										</select>
									</div>
									<FieldGroup name="post_thumb">
										<a
											href={decode(edit_link)}
											target="_blank"
											rel="noreferrer"
										>
											Featured Image{' '}
											<Icon className="open_in_new">open_in_new</Icon>
											{image ? <img src={image} alt={`${post_title}`} /> : ''}
										</a>
									</FieldGroup>
								</div>
							</div>
							<FieldGroup name="taxonomies">
								<div className="taxonomy">
									<fieldset name="category">
										<legend>Categories</legend>
										<div className="filter">
											<label htmlFor="category_filter">Search Categories</label>
											<input
												id="category_filter"
												name="category_filter"
												type="text"
												value={taxFilter.category}
												onChange={(e) =>
													taxFilterDispatch({
														type: 'category',
														filter: e.target.value,
													})
												}
											/>
										</div>
										<div className="terms">
											{taxonomies.category.terms.map(
												({ name, slug, term_id }, index) => {
													return name
														.toLowerCase()
														.includes(taxFilter.category.toLowerCase()) ||
														taxFilter.category === '' ? (
														<label key={index} htmlFor={slug}>
															<input
																type="checkbox"
																name={slug}
																id={slug}
																value={term_id}
																onChange={handleTermCheckboxChange}
																checked={
																	!isEmpty(post_taxonomies) &&
																	!isEmpty(post_taxonomies.category) &&
																	post_taxonomies.category.includes(term_id)
																}
															/>
															{decode(name, {
																scope: 'strict',
															})}
														</label>
													) : (
														''
													);
												}
											)}
										</div>
									</fieldset>
								</div>
								<div className="taxonomy">
									<fieldset name="post_tag">
										<legend>Tags</legend>
										<div className="filter">
											<label htmlFor="category_filter">Search Post Tags</label>
											<input
												id="post_tag_filter"
												name="post_tag_filter"
												type="text"
												value={taxFilter.post_tag}
												onChange={(e) =>
													taxFilterDispatch({
														type: 'post_tag',
														filter: e.target.value,
													})
												}
											/>
										</div>
										<div className="terms">
											{taxonomies.post_tag.terms.map(
												({ name, slug, term_id }, index) => {
													return name
														.toLowerCase()
														.includes(taxFilter.post_tag.toLowerCase()) ||
														taxFilter.post_tag === '' ? (
														<label key={index}>
															<input
																type="checkbox"
																name={slug}
																id={slug}
																value={term_id}
																onChange={handleTermCheckboxChange}
																checked={
																	!isEmpty(post_taxonomies) &&
																	!isEmpty(post_taxonomies.post_tag) &&
																	post_taxonomies.post_tag.includes(term_id)
																}
															/>
															{decode(name, {
																scope: 'strict',
															})}
														</label>
													) : (
														''
													);
												}
											)}
										</div>
									</fieldset>
								</div>
							</FieldGroup>
						</form>
					</div>
				) : null}
			</div>
		</div>
	);
}
