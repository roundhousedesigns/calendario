/**
 * @typedef {Object} Post A collection of parameters representing a Post item
 * @property {number} id The post id
 * @property {string} post_title The post_title attribute
 * @property {Date} post_date The post_date attribute
 * @property {string} post_status The post_status attribute
 * @property {string} post_excerpt The post_excerpt content
 * @property {string} edit_link The post edit link
 * @property {string} image The featured image URL
 * @property {Object} taxonomies
 * @property {Array} taxonomies.category Category term IDs
 * @property {Array} taxonomies.post_tag Tag term IDs
 * @property {boolean} unscheduled Is the post unscheduled?
 */

/**
 * @typedef {Object} DraggedPostDate
 * @property {Date} date The raw post_date parameter
 * @property {string} formatted A formatted date string
 */

/**
 * @typedef {Object} Taxonomies A collection of post categories and tags
 * @property {Taxonomy} category A collection of categories
 * @property {Taxonomy} post_tag A collection of post tags
 */

/**
 * @typedef {Object} Taxonomy A post taxonomy and associated taxonomy terms
 * @property {Object} taxonomy Taxonomy attributes
 * @property {string} taxonomy.name The plural taxonomy name
 * @property {string} taxonomy.singular_name The singular taxonomy name
 * @property {string} taxonomy.slug The taxonomy slug
 * @property {Array.Term} terms A list of Term objects
 */

/**
 * @typedef {Object} Term Taxonomy term data
 * @property {number} term_id
 * @property {string} name The term display name
 * @property {string} slug The term slug
 */
