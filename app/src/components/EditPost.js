import React, {
	useContext,
	useRef,
	useEffect,
	useState,
	useReducer,
	useCallback,
} from 'react';
import { wp } from '../lib/globals';
import FieldGroup from './common/FieldGroup';
import { dateFormat } from '../lib/globals';
import {
	dayKey,
	filterPostStatus,
	filterStatusList,
	getPostList,
	moveItem,
} from '../lib/utils';
import { useAddTaxonomyTerm, useClickOutside } from '../lib/hooks';
import DatePicker from 'react-datepicker';
import { isFuture, isPast, isToday } from 'date-fns';
import { isEmpty } from 'lodash';
import { decode } from 'html-entities';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';
import Loading from './common/Loading';
import Icon from './common/Icon';
import ProWrapper from './common/ProWrapper';

const initialEditPost = {
	post: {},
	editMode: false,
	ogPost: null,
};

const initialTaxFilter = {
	category: '',
	post_tag: '',
};

const initialNewTerm = {
	taxonomy: '',
	term: '',
	update: false,
};

function editPostReducer(state, action) {
	switch (action.type) {
		case 'SET':
			const { post } = action;

			return {
				post: post,
				editMode: true,
				ogPost: post,
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

function newTermReducer(state, action) {
	switch (action.type) {
		case 'EDIT':
			const { taxonomy, term } = action;

			return {
				...state,
				taxonomy,
				term,
			};

		case 'UPDATE': {
			return { ...state, update: true };
		}

		case 'UPDATING': {
			return { ...state, update: false };
		}

		case 'CLEAR':
			return initialNewTerm;

		default: {
			return state;
		}
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
	const [newTerm, newTermDispatch] = useReducer(newTermReducer, initialNewTerm);

	const node = useRef(null);
	const initial = useRef({});
	const [date, setDate] = useState(null);
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
		comment_status,
		post_author,
		image,
		edit_link,
		view_link,
		taxonomies: post_taxonomies,
		unscheduled: isUnscheduled,
	} = post;
	const { postAuthors } = wp;

	var termsLoading = useAddTaxonomyTerm(
		newTerm,
		postsDispatch,
		newTermDispatch
	);

	const closeModal = useCallback(() => {
		editPostDispatch({
			type: 'CLEAR',
		});

		postsDispatch({
			type: 'UNSET_CURRENTPOST',
		});

		newTermDispatch({ type: 'CLEAR' });
	}, [editPostDispatch, postsDispatch]);

	useClickOutside(node, closeModal);

	useEffect(() => {
		if (post_date && post_date !== 'undefined') {
			setDate(post_date);
		}

		return () => {
			setDate(null);
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

	const handleNewTermInputChange = (e) => {
		newTermDispatch({
			type: 'EDIT',
			taxonomy: e.target.dataset.taxonomy,
			term: e.target.value,
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

	const handleSubmit = (e) => {
		e.preventDefault();

		const { ogPost, post } = editPost;
		const posts = { scheduled, unscheduled };

		const index = isUnscheduled
			? unscheduled.findIndex((item) => item.id === id)
			: null;

		/**
		 * Move from one list to another.
		 */
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

			newTermDispatch({ type: 'CLEAR' });
		}

		/**
		 * Prepare the update.
		 */
		postsDispatch({
			type: 'PREPARE_UPDATE',
			id,
			params: {
				post_title,
				post_name,
				post_date,
				post_author,
				post_status: filterPostStatus(post_status, isUnscheduled),
				post_excerpt,
				comment_status,
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

	const handleNewTermSubmit = (e) => {
		if (e.key === 'Enter') {
			newTermDispatch({ type: 'UPDATE' });
		}
	};

	const trashHandler = () => {
		postsDispatch({
			type: 'PREPARE_REMOVE_POST',
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

	const renderOptionsList = (list) => {
		return Object.keys(list).map((item) => (
			<option key={item} value={item}>
				{list[item].name}
			</option>
		));
	};

	const renderTermsList = (taxonomy, terms) => {
		return terms.map(({ name, slug, term_id }, index) => {
			return name.toLowerCase().includes(taxFilter[taxonomy].toLowerCase()) ||
				taxFilter[taxonomy] === '' ? (
				<label key={index} htmlFor={slug}>
					<input
						type="checkbox"
						name={slug}
						id={slug}
						value={term_id}
						onChange={handleTermCheckboxChange}
						checked={
							!isEmpty(post_taxonomies) &&
							!isEmpty(post_taxonomies[taxonomy]) &&
							post_taxonomies[taxonomy].includes(term_id)
						}
					/>
					{decode(name, {
						scope: 'strict',
					})}
				</label>
			) : (
				''
			);
		});
	};

	const editPostLink = () => {
		return (
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
		);
	};

	return (
		<div
			className={`editPost ${editMode ? 'active' : 'inactive'}`}
			ref={initial}
		>
			<div className="editPost__container">
				{editMode ? (
					<div ref={node} className="editPost__editor">
						<form
							className={`editPost__form ${
								trashPostClicked ? 'trashConfirm' : ''
							}`}
							onSubmit={handleSubmit}
						>
							{editPostLink()}
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
										<div className="slug">
											{id === 0 ? (
												// Adding a new post
												'Save this post to edit its permalink.'
											) : (
												// Editing a post
												<>
													<div className="permalink__label">
														<span className="label">Permalink/URL Slug:</span>
													</div>
													<div className="permalink__field">
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
												dateFormat={dateFormat.fullDateTime}
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
											rows={14}
											value={decode(post_excerpt, {
												scope: 'strict',
											})}
										/>
									</FieldGroup>
								</div>
								<div className="header__right">
									<div
										className={`editPost__buttons ${
											trashPostClicked === true ? 'trash-open' : 'trash-closed'
										}`}
									>
										{trashPostClicked === true ? (
											<div className="trash confirm">
												<p
													style={{
														fontWeight: 'bold',
													}}
												>
													Are you sure you want to Trash this post?
												</p>
												<div className="confirmButtons">
													<input
														type="button"
														onClick={trashHandler}
														value="Yes"
														autoFocus={true}
														className="yes"
													/>
													<input
														type="button"
														onClick={() => setTrashPostClicked(false)}
														value="No"
														className="no"
													/>
												</div>
												{/* TODO bind ESC to cancel */}
											</div>
										) : (
											<>
												<input
													type="submit"
													className="save button"
													value={id === 0 ? 'Save' : 'Update'}
													disabled={newTerm.term ? true : false}
												/>
												<input
													type="button"
													className="cancel button"
													onClick={closeModal}
													value="Cancel"
												/>
												<input
													type="button"
													className="trash button"
													onClick={() => setTrashPostClicked(true)}
													value="Delete"
												/>
											</>
										)}
									</div>
									<FieldGroup name="fieldGroup__status">
										<label htmlFor="post_status">Post Status</label>
										<select
											name="post_status"
											onChange={handleInputChange}
											value={post_status}
										>
											{renderOptionsList(allowedStatuses)}
										</select>
									</FieldGroup>
									<FieldGroup name="fieldGroup__status">
										<label htmlFor="post_author">Author</label>
										<select
											name="post_author"
											onChange={handleInputChange}
											value={post_author}
										>
											{Object.keys(postAuthors).map((item) => {
												return (
													<option value={item} key={item}>
														{postAuthors[item]}
													</option>
												);
											})}
										</select>
									</FieldGroup>
									<FieldGroup name="fieldGroup__status">
										<label htmlFor="comment_status">Comments</label>
										<select
											name="comment_status"
											onChange={handleInputChange}
											value={comment_status}
										>
											<option value="open">Open</option>
											<option value="closed">Closed</option>
										</select>
									</FieldGroup>
									<FieldGroup name="post_thumb">
										<a
											className={`featured-image-link ${
												image ? 'has-image' : 'no-image'
											}`}
											href={decode(edit_link)}
											rel="noreferrer"
										>
											{image ? (
												<figure>
													<figcaption>Featured Image</figcaption>
													<img src={image} alt={`${post_title}`} />
												</figure>
											) : (
												<Icon
													className="image add_photo_alternate"
													tooltip="Set featured image"
												>
													add_photo_alternate
												</Icon>
											)}
										</a>
									</FieldGroup>
									{editPostLink()}
								</div>
							</div>
							<ProWrapper showMessage="Unlock Categories and Tags by going PRO!">
								<FieldGroup name="taxonomies">
									<div className="taxonomy">
										<fieldset name="category">
											<legend>Categories</legend>
											<div className="filter">
												<label htmlFor="category_filter">
													Search Categories
												</label>
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
												<div className="newTerm">
													<label
														htmlFor="new_term__category"
														className="newTerm__icon icon"
													>
														add_circle_outline
													</label>
													<input
														id="new_term__category"
														name="new_term__category"
														data-taxonomy="category"
														className="newTerm__input"
														type="text"
														placeholder="Add a new category"
														value={
															newTerm.taxonomy === 'category'
																? newTerm.term
																: ''
														}
														onChange={handleNewTermInputChange}
														onKeyPress={handleNewTermSubmit}
													/>
												</div>
												{termsLoading ? <Loading /> : ''}
												{taxonomies.category.terms
													? renderTermsList(
															'category',
															taxonomies.category.terms
													  )
													: ''}
											</div>
										</fieldset>
									</div>
									<div className="taxonomy">
										<fieldset name="post_tag">
											<legend>Tags</legend>
											<div className="filter">
												<label htmlFor="category_filter">
													Search Post Tags
												</label>
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
												<div className="newTerm">
													<label
														htmlFor="new_term__post_tag"
														className="newTerm__icon icon"
													>
														add_circle_outline
													</label>
													<input
														id="new_term__post_tag"
														name="new_term__post_tag"
														data-taxonomy="post_tag"
														className="newTerm__input"
														type="text"
														placeholder="Add a new tag"
														value={
															newTerm.taxonomy === 'post_tag'
																? newTerm.term
																: ''
														}
														onChange={handleNewTermInputChange}
														onKeyPress={handleNewTermSubmit}
													/>
												</div>
												{termsLoading ? <Loading /> : ''}
												{taxonomies.post_tag.terms
													? renderTermsList(
															'post_tag',
															taxonomies.post_tag.terms
													  )
													: ''}
											</div>
										</fieldset>
									</div>
								</FieldGroup>
							</ProWrapper>
						</form>
					</div>
				) : null}
			</div>
		</div>
	);
}
