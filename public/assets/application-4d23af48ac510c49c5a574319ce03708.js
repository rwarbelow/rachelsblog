/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  pageCache = {};

  cacheSize = 10;

  currentState = null;

  loadedAssets = null;

  referer = null;

  createDocument = null;

  xhr = null;

  fetchReplacement = function(url) {
    rememberReferer();
    cacheCurrentPage();
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        resetScrollPosition();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    cacheCurrentPage();
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.position]) {
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', installHistoryChangeHandler, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  installDocumentReadyPageEventTriggers();

  installJqueryAjaxSuccessPageUpdateTrigger();

  if (browserSupportsTurbolinks) {
    visit = fetchReplacement;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    supported: browserSupportsTurbolinks
  };

}).call(this);
$(document).ready(function(){
	alert("hello");
	$('.my-wymeditor').wymeditor();
})
;
(function() {


}).call(this);
(function() {


}).call(this);
if(typeof WYMeditor==="undefined"){WYMeditor={}}!function(){if(typeof window.console==="undefined"&&typeof console==="undefined"){var names=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"],noOp=function(){},i;WYMeditor.console={};for(i=0;i<names.length;i+=1){WYMeditor.console[names[i]]=noOp}}else if(console){WYMeditor.console=console}else if(window.console.firebug){WYMeditor.console=window.console}else if(window.console){WYMeditor.console=window.console}}();jQuery.extend(WYMeditor,{VERSION:"1.0.0b5",INSTANCES:[],STRINGS:[],SKINS:[],NAME:"name",INDEX:"{Wym_Index}",WYM_INDEX:"wym_index",BASE_PATH:"{Wym_Base_Path}",CSS_PATH:"{Wym_Css_Path}",WYM_PATH:"{Wym_Wym_Path}",SKINS_DEFAULT_PATH:"skins/",SKINS_DEFAULT_CSS:"skin.css",SKINS_DEFAULT_JS:"skin.js",LANG_DEFAULT_PATH:"lang/",IFRAME_BASE_PATH:"{Wym_Iframe_Base_Path}",IFRAME_DEFAULT:"iframe/default/",JQUERY_PATH:"{Wym_Jquery_Path}",DIRECTION:"{Wym_Direction}",LOGO:"{Wym_Logo}",TOOLS:"{Wym_Tools}",TOOLS_ITEMS:"{Wym_Tools_Items}",TOOL_NAME:"{Wym_Tool_Name}",TOOL_TITLE:"{Wym_Tool_Title}",TOOL_CLASS:"{Wym_Tool_Class}",CLASSES:"{Wym_Classes}",CLASSES_ITEMS:"{Wym_Classes_Items}",CLASS_NAME:"{Wym_Class_Name}",CLASS_TITLE:"{Wym_Class_Title}",CONTAINERS:"{Wym_Containers}",CONTAINERS_ITEMS:"{Wym_Containers_Items}",CONTAINER_NAME:"{Wym_Container_Name}",CONTAINER_TITLE:"{Wym_Containers_Title}",CONTAINER_CLASS:"{Wym_Container_Class}",HTML:"{Wym_Html}",IFRAME:"{Wym_Iframe}",STATUS:"{Wym_Status}",DIALOG_TITLE:"{Wym_Dialog_Title}",DIALOG_BODY:"{Wym_Dialog_Body}",NEWLINE:"\n",STRING:"string",BODY:"body",DIV:"div",P:"p",H1:"h1",H2:"h2",H3:"h3",H4:"h4",H5:"h5",H6:"h6",PRE:"pre",BLOCKQUOTE:"blockquote",A:"a",BR:"br",IMG:"img",TABLE:"table",TR:"tr",TD:"td",TH:"th",UL:"ul",OL:"ol",LI:"li",CLASS:"class",HREF:"href",SRC:"src",TITLE:"title",REL:"rel",ALT:"alt",DIALOG_LINK:"Link",DIALOG_IMAGE:"Image",DIALOG_TABLE:"Table",DIALOG_PASTE:"Paste_From_Word",BOLD:"Bold",ITALIC:"Italic",CREATE_LINK:"CreateLink",INSERT_IMAGE:"InsertImage",INSERT_TABLE:"InsertTable",INSERT_HTML:"InsertHTML",PASTE:"Paste",INDENT:"Indent",OUTDENT:"Outdent",TOGGLE_HTML:"ToggleHtml",FORMAT_BLOCK:"FormatBlock",PREVIEW:"Preview",UNLINK:"Unlink",INSERT_UNORDEREDLIST:"InsertUnorderedList",INSERT_ORDEREDLIST:"InsertOrderedList",MAIN_CONTAINERS:["p","div","h1","h2","h3","h4","h5","h6","pre","blockquote"],FORBIDDEN_MAIN_CONTAINERS:["strong","b","em","i","sub","sup","a","span"],BLOCKS:["address","blockquote","div","dl","fieldset","form","h1","h2","h3","h4","h5","h6","hr","noscript","ol","p","pre","table","ul","dd","dt","li","tbody","td","tfoot","th","thead","tr"],BLOCKING_ELEMENTS:["table","blockquote","pre"],NON_BLOCKING_ELEMENTS:["p","div","h1","h2","h3","h4","h5","h6"],LIST_TYPE_ELEMENTS:["ul","ol"],HEADING_ELEMENTS:["h1","h2","h3","h4","h5","h6"],POTENTIAL_LIST_ELEMENTS:["p","div","h1","h2","h3","h4","h5","h6","pre","blockquote","td"],POTENTIAL_TABLE_INSERT_ELEMENTS:["p","div","h1","h2","h3","h4","h5","h6","pre","blockquote","li"],INLINE_TABLE_INSERTION_ELEMENTS:["li"],SELECTABLE_TABLE_ELEMENTS:["td","th","caption"],BLOCKING_ELEMENT_SPACER_CLASS:"wym-blocking-element-spacer",EDITOR_ONLY_CLASS:"wym-editor-only",CLASSES_REMOVED_BY_PARSER:["apple-style-span"],KEY:{BACKSPACE:8,TAB:9,ENTER:13,CTRL:17,END:35,HOME:36,CURSOR:[37,38,39,40],LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46,B:66,I:73,R:82,COMMAND:224},POTENTIAL_BLOCK_ELEMENT_CREATION_KEYS:[8,13,37,38,39,40,46],NODE:{ELEMENT:1,ATTRIBUTE:2,TEXT:3},editor:function(elem,options){this._index=WYMeditor.INSTANCES.push(this)-1;this._element=elem;this._options=options;if(!this._options.html){this._options.html=jQuery(elem).val()}this._options.wymPath=this._options.wymPath||WYMeditor.computeWymPath();this._options.basePath=this._options.basePath||WYMeditor.computeBasePath(this._options.wymPath);this._options.jQueryPath=this._options.jQueryPath||WYMeditor.computeJqueryPath();this._options.skinPath=this._options.skinPath||this._options.basePath+WYMeditor.SKINS_DEFAULT_PATH+this._options.skin+"/";this._options.langPath=this._options.langPath||this._options.basePath+WYMeditor.LANG_DEFAULT_PATH;this._options.iframeBasePath=this._options.iframeBasePath||this._options.basePath+WYMeditor.IFRAME_DEFAULT;this.init()}});jQuery.fn.wymeditor=function(options){options=jQuery.extend({html:"",basePath:false,skinPath:false,wymPath:false,iframeBasePath:false,jQueryPath:false,styles:false,stylesheet:false,skin:"default",initSkin:true,loadSkin:true,lang:"en",direction:"ltr",customCommands:[],structureRules:{defaultRootContainer:"p"},boxHtml:String()+"<div class='wym_box'>"+"<div class='wym_area_top'>"+WYMeditor.TOOLS+"</div>"+"<div class='wym_area_left'></div>"+"<div class='wym_area_right'>"+WYMeditor.CONTAINERS+WYMeditor.CLASSES+"</div>"+"<div class='wym_area_main'>"+WYMeditor.HTML+WYMeditor.IFRAME+WYMeditor.STATUS+"</div>"+"<div class='wym_area_bottom'>"+WYMeditor.LOGO+"</div>"+"</div>",logoHtml:String()+'<a class="wym_wymeditor_link" '+'href="http://www.wymeditor.org/">WYMeditor</a>',iframeHtml:String()+'<div class="wym_iframe wym_section">'+'<iframe src="'+WYMeditor.IFRAME_BASE_PATH+'wymiframe.html" '+'onload="this.contentWindow.parent.WYMeditor.INSTANCES['+WYMeditor.INDEX+'].initIframe(this)">'+"</iframe>"+"</div>",editorStyles:[],toolsHtml:String()+'<div class="wym_tools wym_section">'+"<h2>{Tools}</h2>"+"<ul>"+WYMeditor.TOOLS_ITEMS+"</ul>"+"</div>",toolsItemHtml:String()+'<li class="'+WYMeditor.TOOL_CLASS+'">'+'<a href="#" name="'+WYMeditor.TOOL_NAME+'" '+'title="'+WYMeditor.TOOL_TITLE+'">'+WYMeditor.TOOL_TITLE+"</a>"+"</li>",toolsItems:[{name:"Bold",title:"Strong",css:"wym_tools_strong"},{name:"Italic",title:"Emphasis",css:"wym_tools_emphasis"},{name:"Superscript",title:"Superscript",css:"wym_tools_superscript"},{name:"Subscript",title:"Subscript",css:"wym_tools_subscript"},{name:"InsertOrderedList",title:"Ordered_List",css:"wym_tools_ordered_list"},{name:"InsertUnorderedList",title:"Unordered_List",css:"wym_tools_unordered_list"},{name:"Indent",title:"Indent",css:"wym_tools_indent"},{name:"Outdent",title:"Outdent",css:"wym_tools_outdent"},{name:"Undo",title:"Undo",css:"wym_tools_undo"},{name:"Redo",title:"Redo",css:"wym_tools_redo"},{name:"CreateLink",title:"Link",css:"wym_tools_link"},{name:"Unlink",title:"Unlink",css:"wym_tools_unlink"},{name:"InsertImage",title:"Image",css:"wym_tools_image"},{name:"InsertTable",title:"Table",css:"wym_tools_table"},{name:"Paste",title:"Paste_From_Word",css:"wym_tools_paste"},{name:"ToggleHtml",title:"HTML",css:"wym_tools_html"},{name:"Preview",title:"Preview",css:"wym_tools_preview"}],containersHtml:String()+'<div class="wym_containers wym_section">'+"<h2>{Containers}</h2>"+"<ul>"+WYMeditor.CONTAINERS_ITEMS+"</ul>"+"</div>",containersItemHtml:String()+'<li class="'+WYMeditor.CONTAINER_CLASS+'">'+'<a href="#" name="'+WYMeditor.CONTAINER_NAME+'">'+WYMeditor.CONTAINER_TITLE+"</a>"+"</li>",containersItems:[{name:"P",title:"Paragraph",css:"wym_containers_p"},{name:"H1",title:"Heading_1",css:"wym_containers_h1"},{name:"H2",title:"Heading_2",css:"wym_containers_h2"},{name:"H3",title:"Heading_3",css:"wym_containers_h3"},{name:"H4",title:"Heading_4",css:"wym_containers_h4"},{name:"H5",title:"Heading_5",css:"wym_containers_h5"},{name:"H6",title:"Heading_6",css:"wym_containers_h6"},{name:"PRE",title:"Preformatted",css:"wym_containers_pre"},{name:"BLOCKQUOTE",title:"Blockquote",css:"wym_containers_blockquote"},{name:"TH",title:"Table_Header",css:"wym_containers_th"}],classesHtml:String()+'<div class="wym_classes wym_section">'+"<h2>{Classes}</h2>"+"<ul>"+WYMeditor.CLASSES_ITEMS+"</ul>"+"</div>",classesItemHtml:String()+'<li class="wym_classes_'+WYMeditor.CLASS_NAME+'">'+'<a href="#" name="'+WYMeditor.CLASS_NAME+'">'+WYMeditor.CLASS_TITLE+"</a>"+"</li>",classesItems:[],statusHtml:String()+'<div class="wym_status wym_section">'+"<h2>{Status}</h2>"+"</div>",htmlHtml:String()+'<div class="wym_html wym_section">'+"<h2>{Source_Code}</h2>"+'<textarea class="wym_html_val"></textarea>'+"</div>",boxSelector:".wym_box",toolsSelector:".wym_tools",toolsListSelector:" ul",containersSelector:".wym_containers",classesSelector:".wym_classes",htmlSelector:".wym_html",iframeSelector:".wym_iframe iframe",iframeBodySelector:".wym_iframe",statusSelector:".wym_status",toolSelector:".wym_tools a",containerSelector:".wym_containers a",classSelector:".wym_classes a",htmlValSelector:".wym_html_val",hrefSelector:".wym_href",srcSelector:".wym_src",titleSelector:".wym_title",relSelector:".wym_rel",altSelector:".wym_alt",textSelector:".wym_text",rowsSelector:".wym_rows",colsSelector:".wym_cols",captionSelector:".wym_caption",summarySelector:".wym_summary",submitSelector:"form",cancelSelector:".wym_cancel",previewSelector:"",dialogTypeSelector:".wym_dialog_type",dialogLinkSelector:".wym_dialog_link",dialogImageSelector:".wym_dialog_image",dialogTableSelector:".wym_dialog_table",dialogPasteSelector:".wym_dialog_paste",dialogPreviewSelector:".wym_dialog_preview",updateSelector:".wymupdate",updateEvent:"click",dialogFeatures:"menubar=no,titlebar=no,toolbar=no,resizable=no"+",width=560,height=300,top=0,left=0",dialogFeaturesPreview:"menubar=no,titlebar=no,toolbar=no,resizable=no"+",scrollbars=yes,width=560,height=300,top=0,left=0",dialogHtml:String()+'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" '+'"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'+'<html dir="'+WYMeditor.DIRECTION+'">'+"<head>"+'<link rel="stylesheet" type="text/css" media="screen" '+'href="'+WYMeditor.CSS_PATH+'" />'+"<title>"+WYMeditor.DIALOG_TITLE+"</title>"+'<script type="text/javascript" '+'src="'+WYMeditor.JQUERY_PATH+'"></script>'+'<script type="text/javascript" '+'src="'+WYMeditor.WYM_PATH+'"></script>'+"</head>"+WYMeditor.DIALOG_BODY+"</html>",dialogLinkHtml:String()+'<body class="wym_dialog wym_dialog_link" '+' onload="WYMeditor.INIT_DIALOG('+WYMeditor.INDEX+')">'+"<form>"+"<fieldset>"+'<input type="hidden" class="wym_dialog_type" '+'value="'+WYMeditor.DIALOG_LINK+'" />'+"<legend>{Link}</legend>"+'<div class="row">'+"<label>{URL}</label>"+'<input type="text" class="wym_href" value="" '+'size="40" autofocus="autofocus" />'+"</div>"+'<div class="row">'+"<label>{Title}</label>"+'<input type="text" class="wym_title" value="" '+'size="40" />'+"</div>"+'<div class="row">'+"<label>{Relationship}</label>"+'<input type="text" class="wym_rel" value="" '+'size="40" />'+"</div>"+'<div class="row row-indent">'+'<input class="wym_submit" type="submit" '+'value="{Submit}" />'+'<input class="wym_cancel" type="button" '+'value="{Cancel}" />'+"</div>"+"</fieldset>"+"</form>"+"</body>",dialogImageHtml:String()+'<body class="wym_dialog wym_dialog_image" '+'onload="WYMeditor.INIT_DIALOG('+WYMeditor.INDEX+')">'+"<form>"+"<fieldset>"+'<input type="hidden" class="wym_dialog_type" '+'value="'+WYMeditor.DIALOG_IMAGE+'" />'+"<legend>{Image}</legend>"+'<div class="row">'+"<label>{URL}</label>"+'<input type="text" class="wym_src" value="" '+'size="40" autofocus="autofocus" />'+"</div>"+'<div class="row">'+"<label>{Alternative_Text}</label>"+'<input type="text" class="wym_alt" value="" size="40" />'+"</div>"+'<div class="row">'+"<label>{Title}</label>"+'<input type="text" class="wym_title" value="" size="40" />'+"</div>"+'<div class="row row-indent">'+'<input class="wym_submit" type="submit" '+'value="{Submit}" />'+'<input class="wym_cancel" type="button" '+'value="{Cancel}" />'+"</div>"+"</fieldset>"+"</form>"+"</body>",dialogTableHtml:String()+'<body class="wym_dialog wym_dialog_table" '+'onload="WYMeditor.INIT_DIALOG('+WYMeditor.INDEX+')">'+"<form>"+"<fieldset>"+'<input type="hidden" class="wym_dialog_type" '+'value="'+WYMeditor.DIALOG_TABLE+'" />'+"<legend>{Table}</legend>"+'<div class="row">'+"<label>{Caption}</label>"+'<input type="text" class="wym_caption" value="" '+'size="40" />'+"</div>"+'<div class="row">'+"<label>{Summary}</label>"+'<input type="text" class="wym_summary" value="" '+'size="40" />'+"</div>"+'<div class="row">'+"<label>{Number_Of_Rows}</label>"+'<input type="text" class="wym_rows" value="3" size="3" />'+"</div>"+'<div class="row">'+"<label>{Number_Of_Cols}</label>"+'<input type="text" class="wym_cols" value="2" size="3" />'+"</div>"+'<div class="row row-indent">'+'<input class="wym_submit" type="submit" '+'value="{Submit}" />'+'<input class="wym_cancel" type="button" '+'value="{Cancel}" />'+"</div>"+"</fieldset>"+"</form>"+"</body>",dialogPasteHtml:String()+'<body class="wym_dialog wym_dialog_paste" '+'onload="WYMeditor.INIT_DIALOG('+WYMeditor.INDEX+')">'+"<form>"+'<input type="hidden" class="wym_dialog_type" '+'value="'+WYMeditor.DIALOG_PASTE+'" />'+"<fieldset>"+"<legend>{Paste_From_Word}</legend>"+'<div class="row">'+'<textarea class="wym_text" rows="10" cols="50" '+'autofocus="autofocus"></textarea>'+"</div>"+'<div class="row">'+'<input class="wym_submit" type="submit" '+'value="{Submit}" />'+'<input class="wym_cancel" type="button" '+'value="{Cancel}" />'+"</div>"+"</fieldset>"+"</form>"+"</body>",dialogPreviewHtml:String()+'<body class="wym_dialog wym_dialog_preview" '+'onload="WYMeditor.INIT_DIALOG('+WYMeditor.INDEX+')"></body>',dialogStyles:[],stringDelimiterLeft:"{",stringDelimiterRight:"}",preInit:null,preBind:null,postInit:null,preInitDialog:null,postInitDialog:null},options);return this.each(function(){var _editor=new WYMeditor.editor(jQuery(this),options)})};jQuery.extend({wymeditors:function(i){return WYMeditor.INSTANCES[i]}});WYMeditor.computeWymPath=function(){var script=jQuery(jQuery.grep(jQuery("script"),function(s){if(!s.src){return null}return s.src.match(/jquery\.wymeditor(\.pack|\.min|\.packed)?\.js(\?.*)?$/)||s.src.match(/\/core\.js(\?.*)?$/)}));if(script.length>0){return script.attr("src")}WYMeditor.console.warn("Error determining wymPath. No base WYMeditor file located.");WYMeditor.console.warn("Assuming wymPath to be the current URL");WYMeditor.console.warn("Please pass a correct wymPath option");return""};WYMeditor.computeBasePath=function(wymPath){var lastSlashIndex=wymPath.lastIndexOf("/");return wymPath.substr(0,lastSlashIndex+1)};WYMeditor.computeJqueryPath=function(){return jQuery(jQuery.grep(jQuery("script"),function(s){return s.src&&s.src.match(/jquery(-(.*)){0,1}(\.pack|\.min|\.packed)?\.js(\?.*)?$/)})).attr("src")};WYMeditor.INIT_DIALOG=function(index){var wym=window.opener.WYMeditor.INSTANCES[index],doc=window.document,selected=wym.selected(),dialogType=jQuery(wym._options.dialogTypeSelector).val(),sStamp=wym.uniqueStamp(),styles,aCss,tableOnClick;if(dialogType===WYMeditor.DIALOG_LINK){if(selected&&selected.tagName&&selected.tagName.toLowerCase!==WYMeditor.A){selected=jQuery(selected).parentsOrSelf(WYMeditor.A)}if(!selected&&wym._selected_image){selected=jQuery(wym._selected_image).parentsOrSelf(WYMeditor.A)}}if(jQuery.isFunction(wym._options.preInitDialog)){wym._options.preInitDialog(wym,window)}styles=doc.styleSheets[0];aCss=eval(wym._options.dialogStyles);wym.addCssRules(doc,aCss);if(selected){jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMeditor.HREF));jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMeditor.SRC));jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMeditor.TITLE));jQuery(wym._options.relSelector).val(jQuery(selected).attr(WYMeditor.REL));jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMeditor.ALT))}if(wym._selected_image){jQuery(wym._options.dialogImageSelector+" "+wym._options.srcSelector).val(jQuery(wym._selected_image).attr(WYMeditor.SRC));jQuery(wym._options.dialogImageSelector+" "+wym._options.titleSelector).val(jQuery(wym._selected_image).attr(WYMeditor.TITLE));jQuery(wym._options.dialogImageSelector+" "+wym._options.altSelector).val(jQuery(wym._selected_image).attr(WYMeditor.ALT))}jQuery(wym._options.dialogLinkSelector+" "+wym._options.submitSelector).submit(function(){var sUrl=jQuery(wym._options.hrefSelector).val(),link;if(sUrl.length>0){if(selected[0]&&selected[0].tagName.toLowerCase()===WYMeditor.A){link=selected}else{wym._exec(WYMeditor.CREATE_LINK,sStamp);link=jQuery("a[href="+sStamp+"]",wym._doc.body)}link.attr(WYMeditor.HREF,sUrl);link.attr(WYMeditor.TITLE,jQuery(wym._options.titleSelector).val());link.attr(WYMeditor.REL,jQuery(wym._options.relSelector).val())}window.close()});jQuery(wym._options.dialogImageSelector+" "+wym._options.submitSelector).submit(function(){var sUrl=jQuery(wym._options.srcSelector).val(),$img;if(sUrl.length>0){wym._exec(WYMeditor.INSERT_IMAGE,sStamp);$img=jQuery("img[src$="+sStamp+"]",wym._doc.body);$img.attr(WYMeditor.SRC,sUrl);$img.attr(WYMeditor.TITLE,jQuery(wym._options.titleSelector).val());$img.attr(WYMeditor.ALT,jQuery(wym._options.altSelector).val())}window.close()});tableOnClick=WYMeditor.MAKE_TABLE_ONCLICK(wym);jQuery(wym._options.dialogTableSelector+" "+wym._options.submitSelector).submit(tableOnClick);jQuery(wym._options.dialogPasteSelector+" "+wym._options.submitSelector).submit(function(){var sText=jQuery(wym._options.textSelector).val();wym.paste(sText);window.close()});jQuery(wym._options.dialogPreviewSelector+" "+wym._options.previewSelector).html(wym.xhtml());jQuery(wym._options.cancelSelector).mousedown(function(){window.close()});if(jQuery.isFunction(wym._options.postInitDialog)){wym._options.postInitDialog(wym,window)}};WYMeditor.MAKE_TABLE_ONCLICK=function(wym){var tableOnClick=function(){var numRows=jQuery(wym._options.rowsSelector).val(),numColumns=jQuery(wym._options.colsSelector).val(),caption=jQuery(wym._options.captionSelector).val(),summary=jQuery(wym._options.summarySelector).val(),table=wym.insertTable(numRows,numColumns,caption,summary);window.close()};return tableOnClick};jQuery.fn.isPhantomNode=function(){if(this[0].nodeType===3){return!/[^\t\n\r ]/.test(this[0].data)}return false};jQuery.fn.nextContentsUntil=function(selector,filter){var matched=[],$matched,cur=this.get(0);selector=selector?selector:"";filter=filter?filter:"";if(!cur){return jQuery()}cur=cur.nextSibling;while(cur){if(!jQuery(cur).is(selector)){matched.push(cur);cur=cur.nextSibling}else{break}}$matched=jQuery(matched);if(filter){return $matched.filter(filter)}return $matched};jQuery.fn.nextAllContents=function(){return jQuery(this).nextContentsUntil("","")};jQuery.fn.prevContentsUntil=function(selector,filter){var matched=[],$matched,cur=this.get(0);selector=selector?selector:"";filter=filter?filter:"";if(!cur){return jQuery()}cur=cur.previousSibling;while(cur){if(!jQuery(cur).is(selector)){matched.push(cur);cur=cur.previousSibling}else{break}}$matched=jQuery(matched);if(filter){return $matched.filter(filter)}return $matched};jQuery.fn.prevAllContents=function(){return jQuery(this).prevContentsUntil("","")};WYMeditor.isPhantomNode=function(n){if(n.nodeType===3){return!/[^\t\n\r ]/.test(n.data)}return false};WYMeditor.isPhantomString=function(str){return!/[^\t\n\r ]/.test(str)};jQuery.fn.parentsOrSelf=function(jqexpr){var n=this;if(n[0].nodeType===3){n=n.parents().slice(0,1)}if(n.filter(jqexpr).size()===1){return n}else{return n.parents(jqexpr).slice(0,1)}};WYMeditor.changeNodeType=function(node,newTag){var newNode,i,attributes=node.attributes;jQuery(node).wrapInner("<"+newTag+">");newNode=jQuery(node).children().get(0);for(i=0;i<attributes.length;i++){if(attributes[i].specified){newNode.setAttribute(attributes[i].nodeName,attributes[i].nodeValue)}}jQuery(node).contents().unwrap();return newNode};WYMeditor.Helper={replaceAll:function(str,old,rep){var rExp=new RegExp(old,"g");return str.replace(rExp,rep)},insertAt:function(str,inserted,pos){return str.substr(0,pos)+inserted+str.substring(pos)},trim:function(str){return str.replace(/^(\s*)|(\s*)$/gm,"")},contains:function(arr,elem){var i;for(i=0;i<arr.length;i+=1){if(arr[i]===elem){return true}}return false},indexOf:function(arr,item){var ret=-1,i;for(i=0;i<arr.length;i+=1){if(arr[i]===item){ret=i;break}}return ret},findByName:function(arr,name){var i,item;for(i=0;i<arr.length;i+=1){item=arr[i];if(item.name===name){return item}}return null}};window["rangy"]=function(){var OBJECT="object",FUNCTION="function",UNDEFINED="undefined";var domRangeProperties=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer","START_TO_START","START_TO_END","END_TO_START","END_TO_END"];var domRangeMethods=["setStart","setStartBefore","setStartAfter","setEnd","setEndBefore","setEndAfter","collapse","selectNode","selectNodeContents","compareBoundaryPoints","deleteContents","extractContents","cloneContents","insertNode","surroundContents","cloneRange","toString","detach"];var textRangeProperties=["boundingHeight","boundingLeft","boundingTop","boundingWidth","htmlText","text"];var textRangeMethods=["collapse","compareEndPoints","duplicate","getBookmark","moveToBookmark","moveToElementText","parentElement","pasteHTML","select","setEndPoint","getBoundingClientRect"];function isHostMethod(o,p){var t=typeof o[p];return t==FUNCTION||!!(t==OBJECT&&o[p])||t=="unknown"}function isHostObject(o,p){return!!(typeof o[p]==OBJECT&&o[p])}function isHostProperty(o,p){return typeof o[p]!=UNDEFINED}function createMultiplePropertyTest(testFunc){return function(o,props){var i=props.length;while(i--){if(!testFunc(o,props[i])){return false}}return true}}var areHostMethods=createMultiplePropertyTest(isHostMethod);var areHostObjects=createMultiplePropertyTest(isHostObject);var areHostProperties=createMultiplePropertyTest(isHostProperty);function isTextRange(range){return range&&areHostMethods(range,textRangeMethods)&&areHostProperties(range,textRangeProperties)}var api={version:"1.2.2",initialized:false,supported:true,util:{isHostMethod:isHostMethod,isHostObject:isHostObject,isHostProperty:isHostProperty,areHostMethods:areHostMethods,areHostObjects:areHostObjects,areHostProperties:areHostProperties,isTextRange:isTextRange},features:{},modules:{},config:{alertOnWarn:false,preferTextRange:false}};function fail(reason){window.alert("Rangy not supported in your browser. Reason: "+reason);api.initialized=true;api.supported=false}api.fail=fail;function warn(msg){var warningMessage="Rangy warning: "+msg;if(api.config.alertOnWarn){window.alert(warningMessage)}else if(typeof window.console!=UNDEFINED&&typeof window.console.log!=UNDEFINED){window.console.log(warningMessage)}}api.warn=warn;if({}.hasOwnProperty){api.util.extend=function(o,props){for(var i in props){if(props.hasOwnProperty(i)){o[i]=props[i]}}}}else{fail("hasOwnProperty not supported")}var initListeners=[];var moduleInitializers=[];function init(){if(api.initialized){return}var testRange;var implementsDomRange=false,implementsTextRange=false;if(isHostMethod(document,"createRange")){testRange=document.createRange();if(areHostMethods(testRange,domRangeMethods)&&areHostProperties(testRange,domRangeProperties)){implementsDomRange=true}testRange.detach()}var body=isHostObject(document,"body")?document.body:document.getElementsByTagName("body")[0];if(body&&isHostMethod(body,"createTextRange")){testRange=body.createTextRange();if(isTextRange(testRange)){implementsTextRange=true}}if(!implementsDomRange&&!implementsTextRange){fail("Neither Range nor TextRange are implemented")}api.initialized=true;api.features={implementsDomRange:implementsDomRange,implementsTextRange:implementsTextRange};var allListeners=moduleInitializers.concat(initListeners);for(var i=0,len=allListeners.length;i<len;++i){try{allListeners[i](api)}catch(ex){if(isHostObject(window,"console")&&isHostMethod(window.console,"log")){window.console.log("Init listener threw an exception. Continuing.",ex)}}}}api.init=init;api.addInitListener=function(listener){if(api.initialized){listener(api)}else{initListeners.push(listener)}};var createMissingNativeApiListeners=[];api.addCreateMissingNativeApiListener=function(listener){createMissingNativeApiListeners.push(listener)};function createMissingNativeApi(win){win=win||window;init();for(var i=0,len=createMissingNativeApiListeners.length;i<len;++i){createMissingNativeApiListeners[i](win)}}api.createMissingNativeApi=createMissingNativeApi;function Module(name){this.name=name;this.initialized=false;this.supported=false}Module.prototype.fail=function(reason){this.initialized=true;this.supported=false;throw new Error("Module '"+this.name+"' failed to load: "+reason)};Module.prototype.warn=function(msg){api.warn("Module "+this.name+": "+msg)};Module.prototype.createError=function(msg){return new Error("Error in Rangy "+this.name+" module: "+msg)};api.createModule=function(name,initFunc){var module=new Module(name);api.modules[name]=module;moduleInitializers.push(function(api){initFunc(api,module);module.initialized=true;module.supported=true})};api.requireModules=function(modules){for(var i=0,len=modules.length,module,moduleName;i<len;++i){moduleName=modules[i];module=api.modules[moduleName];if(!module||!(module instanceof Module)){throw new Error("Module '"+moduleName+"' not found")}if(!module.supported){throw new Error("Module '"+moduleName+"' not supported")}}};var docReady=false;var loadHandler=function(e){if(!docReady){docReady=true;if(!api.initialized){init()}}};if(typeof window==UNDEFINED){fail("No window found");return}if(typeof document==UNDEFINED){fail("No document found");return}if(isHostMethod(document,"addEventListener")){document.addEventListener("DOMContentLoaded",loadHandler,false)}if(isHostMethod(window,"addEventListener")){window.addEventListener("load",loadHandler,false)}else if(isHostMethod(window,"attachEvent")){window.attachEvent("onload",loadHandler)}else{fail("Window does not have required addEventListener or attachEvent method")}return api}();rangy.createModule("DomUtil",function(api,module){var UNDEF="undefined";var util=api.util;if(!util.areHostMethods(document,["createDocumentFragment","createElement","createTextNode"])){module.fail("document missing a Node creation method")}if(!util.isHostMethod(document,"getElementsByTagName")){module.fail("document missing getElementsByTagName method")}var el=document.createElement("div");if(!util.areHostMethods(el,["insertBefore","appendChild","cloneNode"]||!util.areHostObjects(el,["previousSibling","nextSibling","childNodes","parentNode"]))){module.fail("Incomplete Element implementation")}if(!util.isHostProperty(el,"innerHTML")){module.fail("Element is missing innerHTML property")}var textNode=document.createTextNode("test");if(!util.areHostMethods(textNode,["splitText","deleteData","insertData","appendData","cloneNode"]||!util.areHostObjects(el,["previousSibling","nextSibling","childNodes","parentNode"])||!util.areHostProperties(textNode,["data"]))){module.fail("Incomplete Text Node implementation")}var arrayContains=function(arr,val){var i=arr.length;while(i--){if(arr[i]===val){return true}}return false};function isHtmlNamespace(node){var ns;return typeof node.namespaceURI==UNDEF||(ns=node.namespaceURI)===null||ns=="http://www.w3.org/1999/xhtml"}function parentElement(node){var parent=node.parentNode;return parent.nodeType==1?parent:null}function getNodeIndex(node){var i=0;while(node=node.previousSibling){i++}return i}function getNodeLength(node){var childNodes;return isCharacterDataNode(node)?node.length:(childNodes=node.childNodes)?childNodes.length:0}function getCommonAncestor(node1,node2){var ancestors=[],n;for(n=node1;n;n=n.parentNode){ancestors.push(n)}for(n=node2;n;n=n.parentNode){if(arrayContains(ancestors,n)){return n}}return null}function isAncestorOf(ancestor,descendant,selfIsAncestor){var n=selfIsAncestor?descendant:descendant.parentNode;while(n){if(n===ancestor){return true}else{n=n.parentNode}}return false}function getClosestAncestorIn(node,ancestor,selfIsAncestor){var p,n=selfIsAncestor?node:node.parentNode;while(n){p=n.parentNode;if(p===ancestor){return n}n=p}return null}function isCharacterDataNode(node){var t=node.nodeType;return t==3||t==4||t==8}function insertAfter(node,precedingNode){var nextNode=precedingNode.nextSibling,parent=precedingNode.parentNode;if(nextNode){parent.insertBefore(node,nextNode)}else{parent.appendChild(node)}return node}function splitDataNode(node,index){var newNode=node.cloneNode(false);newNode.deleteData(0,index);node.deleteData(index,node.length-index);insertAfter(newNode,node);return newNode}function getDocument(node){if(node.nodeType==9){return node}else if(typeof node.ownerDocument!=UNDEF){return node.ownerDocument}else if(typeof node.document!=UNDEF){return node.document}else if(node.parentNode){return getDocument(node.parentNode)}else{throw new Error("getDocument: no document found for node")}}function getWindow(node){var doc=getDocument(node);if(typeof doc.defaultView!=UNDEF){return doc.defaultView}else if(typeof doc.parentWindow!=UNDEF){return doc.parentWindow}else{throw new Error("Cannot get a window object for node")}}function getIframeDocument(iframeEl){if(typeof iframeEl.contentDocument!=UNDEF){return iframeEl.contentDocument}else if(typeof iframeEl.contentWindow!=UNDEF){return iframeEl.contentWindow.document}else{throw new Error("getIframeWindow: No Document object found for iframe element")}}function getIframeWindow(iframeEl){if(typeof iframeEl.contentWindow!=UNDEF){return iframeEl.contentWindow}else if(typeof iframeEl.contentDocument!=UNDEF){return iframeEl.contentDocument.defaultView}else{throw new Error("getIframeWindow: No Window object found for iframe element")}}function getBody(doc){return util.isHostObject(doc,"body")?doc.body:doc.getElementsByTagName("body")[0]}function getRootContainer(node){var parent;while(parent=node.parentNode){node=parent}return node}function comparePoints(nodeA,offsetA,nodeB,offsetB){var nodeC,root,childA,childB,n;if(nodeA==nodeB){return offsetA===offsetB?0:offsetA<offsetB?-1:1}else if(nodeC=getClosestAncestorIn(nodeB,nodeA,true)){return offsetA<=getNodeIndex(nodeC)?-1:1}else if(nodeC=getClosestAncestorIn(nodeA,nodeB,true)){return getNodeIndex(nodeC)<offsetB?-1:1}else{root=getCommonAncestor(nodeA,nodeB);childA=nodeA===root?root:getClosestAncestorIn(nodeA,root,true);childB=nodeB===root?root:getClosestAncestorIn(nodeB,root,true);if(childA===childB){throw new Error("comparePoints got to case 4 and childA and childB are the same!")}else{n=root.firstChild;while(n){if(n===childA){return-1}else if(n===childB){return 1}n=n.nextSibling}throw new Error("Should not be here!")}}}function fragmentFromNodeChildren(node){var fragment=getDocument(node).createDocumentFragment(),child;while(child=node.firstChild){fragment.appendChild(child)}return fragment}function inspectNode(node){if(!node){return"[No node]"}if(isCharacterDataNode(node)){return'"'+node.data+'"'}else if(node.nodeType==1){var idAttr=node.id?' id="'+node.id+'"':"";return"<"+node.nodeName+idAttr+">["+node.childNodes.length+"]"}else{return node.nodeName}}function NodeIterator(root){this.root=root;this._next=root}NodeIterator.prototype={_current:null,hasNext:function(){return!!this._next},next:function(){var n=this._current=this._next;var child,next;if(this._current){child=n.firstChild;if(child){this._next=child}else{next=null;while(n!==this.root&&!(next=n.nextSibling)){n=n.parentNode}this._next=next}}return this._current},detach:function(){this._current=this._next=this.root=null}};function createIterator(root){return new NodeIterator(root)}function DomPosition(node,offset){this.node=node;this.offset=offset}DomPosition.prototype={equals:function(pos){return this.node===pos.node&this.offset==pos.offset},inspect:function(){return"[DomPosition("+inspectNode(this.node)+":"+this.offset+")]"}};function DOMException(codeName){this.code=this[codeName];this.codeName=codeName;this.message="DOMException: "+this.codeName}DOMException.prototype={INDEX_SIZE_ERR:1,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INVALID_STATE_ERR:11};DOMException.prototype.toString=function(){return this.message};api.dom={arrayContains:arrayContains,isHtmlNamespace:isHtmlNamespace,parentElement:parentElement,getNodeIndex:getNodeIndex,getNodeLength:getNodeLength,getCommonAncestor:getCommonAncestor,isAncestorOf:isAncestorOf,getClosestAncestorIn:getClosestAncestorIn,isCharacterDataNode:isCharacterDataNode,insertAfter:insertAfter,splitDataNode:splitDataNode,getDocument:getDocument,getWindow:getWindow,getIframeWindow:getIframeWindow,getIframeDocument:getIframeDocument,getBody:getBody,getRootContainer:getRootContainer,comparePoints:comparePoints,inspectNode:inspectNode,fragmentFromNodeChildren:fragmentFromNodeChildren,createIterator:createIterator,DomPosition:DomPosition};
api.DOMException=DOMException});rangy.createModule("DomRange",function(api,module){api.requireModules(["DomUtil"]);var dom=api.dom;var DomPosition=dom.DomPosition;var DOMException=api.DOMException;function isNonTextPartiallySelected(node,range){return node.nodeType!=3&&(dom.isAncestorOf(node,range.startContainer,true)||dom.isAncestorOf(node,range.endContainer,true))}function getRangeDocument(range){return dom.getDocument(range.startContainer)}function dispatchEvent(range,type,args){var listeners=range._listeners[type];if(listeners){for(var i=0,len=listeners.length;i<len;++i){listeners[i].call(range,{target:range,args:args})}}}function getBoundaryBeforeNode(node){return new DomPosition(node.parentNode,dom.getNodeIndex(node))}function getBoundaryAfterNode(node){return new DomPosition(node.parentNode,dom.getNodeIndex(node)+1)}function insertNodeAtPosition(node,n,o){var firstNodeInserted=node.nodeType==11?node.firstChild:node;if(dom.isCharacterDataNode(n)){if(o==n.length){dom.insertAfter(node,n)}else{n.parentNode.insertBefore(node,o==0?n:dom.splitDataNode(n,o))}}else if(o>=n.childNodes.length){n.appendChild(node)}else{n.insertBefore(node,n.childNodes[o])}return firstNodeInserted}function cloneSubtree(iterator){var partiallySelected;for(var node,frag=getRangeDocument(iterator.range).createDocumentFragment(),subIterator;node=iterator.next();){partiallySelected=iterator.isPartiallySelectedSubtree();node=node.cloneNode(!partiallySelected);if(partiallySelected){subIterator=iterator.getSubtreeIterator();node.appendChild(cloneSubtree(subIterator));subIterator.detach(true)}if(node.nodeType==10){throw new DOMException("HIERARCHY_REQUEST_ERR")}frag.appendChild(node)}return frag}function iterateSubtree(rangeIterator,func,iteratorState){var it,n;iteratorState=iteratorState||{stop:false};for(var node,subRangeIterator;node=rangeIterator.next();){if(rangeIterator.isPartiallySelectedSubtree()){if(func(node)===false){iteratorState.stop=true;return}else{subRangeIterator=rangeIterator.getSubtreeIterator();iterateSubtree(subRangeIterator,func,iteratorState);subRangeIterator.detach(true);if(iteratorState.stop){return}}}else{it=dom.createIterator(node);while(n=it.next()){if(func(n)===false){iteratorState.stop=true;return}}}}}function deleteSubtree(iterator){var subIterator;while(iterator.next()){if(iterator.isPartiallySelectedSubtree()){subIterator=iterator.getSubtreeIterator();deleteSubtree(subIterator);subIterator.detach(true)}else{iterator.remove()}}}function extractSubtree(iterator){for(var node,frag=getRangeDocument(iterator.range).createDocumentFragment(),subIterator;node=iterator.next();){if(iterator.isPartiallySelectedSubtree()){node=node.cloneNode(false);subIterator=iterator.getSubtreeIterator();node.appendChild(extractSubtree(subIterator));subIterator.detach(true)}else{iterator.remove()}if(node.nodeType==10){throw new DOMException("HIERARCHY_REQUEST_ERR")}frag.appendChild(node)}return frag}function getNodesInRange(range,nodeTypes,filter){var filterNodeTypes=!!(nodeTypes&&nodeTypes.length),regex;var filterExists=!!filter;if(filterNodeTypes){regex=new RegExp("^("+nodeTypes.join("|")+")$")}var nodes=[];iterateSubtree(new RangeIterator(range,false),function(node){if((!filterNodeTypes||regex.test(node.nodeType))&&(!filterExists||filter(node))){nodes.push(node)}});return nodes}function inspect(range){var name=typeof range.getName=="undefined"?"Range":range.getName();return"["+name+"("+dom.inspectNode(range.startContainer)+":"+range.startOffset+", "+dom.inspectNode(range.endContainer)+":"+range.endOffset+")]"}function RangeIterator(range,clonePartiallySelectedTextNodes){this.range=range;this.clonePartiallySelectedTextNodes=clonePartiallySelectedTextNodes;if(!range.collapsed){this.sc=range.startContainer;this.so=range.startOffset;this.ec=range.endContainer;this.eo=range.endOffset;var root=range.commonAncestorContainer;if(this.sc===this.ec&&dom.isCharacterDataNode(this.sc)){this.isSingleCharacterDataNode=true;this._first=this._last=this._next=this.sc}else{this._first=this._next=this.sc===root&&!dom.isCharacterDataNode(this.sc)?this.sc.childNodes[this.so]:dom.getClosestAncestorIn(this.sc,root,true);this._last=this.ec===root&&!dom.isCharacterDataNode(this.ec)?this.ec.childNodes[this.eo-1]:dom.getClosestAncestorIn(this.ec,root,true)}}}RangeIterator.prototype={_current:null,_next:null,_first:null,_last:null,isSingleCharacterDataNode:false,reset:function(){this._current=null;this._next=this._first},hasNext:function(){return!!this._next},next:function(){var current=this._current=this._next;if(current){this._next=current!==this._last?current.nextSibling:null;if(dom.isCharacterDataNode(current)&&this.clonePartiallySelectedTextNodes){if(current===this.ec){(current=current.cloneNode(true)).deleteData(this.eo,current.length-this.eo)}if(this._current===this.sc){(current=current.cloneNode(true)).deleteData(0,this.so)}}}return current},remove:function(){var current=this._current,start,end;if(dom.isCharacterDataNode(current)&&(current===this.sc||current===this.ec)){start=current===this.sc?this.so:0;end=current===this.ec?this.eo:current.length;if(start!=end){current.deleteData(start,end-start)}}else{if(current.parentNode){current.parentNode.removeChild(current)}else{}}},isPartiallySelectedSubtree:function(){var current=this._current;return isNonTextPartiallySelected(current,this.range)},getSubtreeIterator:function(){var subRange;if(this.isSingleCharacterDataNode){subRange=this.range.cloneRange();subRange.collapse()}else{subRange=new Range(getRangeDocument(this.range));var current=this._current;var startContainer=current,startOffset=0,endContainer=current,endOffset=dom.getNodeLength(current);if(dom.isAncestorOf(current,this.sc,true)){startContainer=this.sc;startOffset=this.so}if(dom.isAncestorOf(current,this.ec,true)){endContainer=this.ec;endOffset=this.eo}updateBoundaries(subRange,startContainer,startOffset,endContainer,endOffset)}return new RangeIterator(subRange,this.clonePartiallySelectedTextNodes)},detach:function(detachRange){if(detachRange){this.range.detach()}this.range=this._current=this._next=this._first=this._last=this.sc=this.so=this.ec=this.eo=null}};function RangeException(codeName){this.code=this[codeName];this.codeName=codeName;this.message="RangeException: "+this.codeName}RangeException.prototype={BAD_BOUNDARYPOINTS_ERR:1,INVALID_NODE_TYPE_ERR:2};RangeException.prototype.toString=function(){return this.message};function RangeNodeIterator(range,nodeTypes,filter){this.nodes=getNodesInRange(range,nodeTypes,filter);this._next=this.nodes[0];this._position=0}RangeNodeIterator.prototype={_current:null,hasNext:function(){return!!this._next},next:function(){this._current=this._next;this._next=this.nodes[++this._position];return this._current},detach:function(){this._current=this._next=this.nodes=null}};var beforeAfterNodeTypes=[1,3,4,5,7,8,10];var rootContainerNodeTypes=[2,9,11];var readonlyNodeTypes=[5,6,10,12];var insertableNodeTypes=[1,3,4,5,7,8,10,11];var surroundNodeTypes=[1,3,4,5,7,8];function createAncestorFinder(nodeTypes){return function(node,selfIsAncestor){var t,n=selfIsAncestor?node:node.parentNode;while(n){t=n.nodeType;if(dom.arrayContains(nodeTypes,t)){return n}n=n.parentNode}return null}}var getRootContainer=dom.getRootContainer;var getDocumentOrFragmentContainer=createAncestorFinder([9,11]);var getReadonlyAncestor=createAncestorFinder(readonlyNodeTypes);var getDocTypeNotationEntityAncestor=createAncestorFinder([6,10,12]);function assertNoDocTypeNotationEntityAncestor(node,allowSelf){if(getDocTypeNotationEntityAncestor(node,allowSelf)){throw new RangeException("INVALID_NODE_TYPE_ERR")}}function assertNotDetached(range){if(!range.startContainer){throw new DOMException("INVALID_STATE_ERR")}}function assertValidNodeType(node,invalidTypes){if(!dom.arrayContains(invalidTypes,node.nodeType)){throw new RangeException("INVALID_NODE_TYPE_ERR")}}function assertValidOffset(node,offset){if(offset<0||offset>(dom.isCharacterDataNode(node)?node.length:node.childNodes.length)){throw new DOMException("INDEX_SIZE_ERR")}}function assertSameDocumentOrFragment(node1,node2){if(getDocumentOrFragmentContainer(node1,true)!==getDocumentOrFragmentContainer(node2,true)){throw new DOMException("WRONG_DOCUMENT_ERR")}}function assertNodeNotReadOnly(node){if(getReadonlyAncestor(node,true)){throw new DOMException("NO_MODIFICATION_ALLOWED_ERR")}}function assertNode(node,codeName){if(!node){throw new DOMException(codeName)}}function isOrphan(node){return!dom.arrayContains(rootContainerNodeTypes,node.nodeType)&&!getDocumentOrFragmentContainer(node,true)}function isValidOffset(node,offset){return offset<=(dom.isCharacterDataNode(node)?node.length:node.childNodes.length)}function assertRangeValid(range){assertNotDetached(range);if(isOrphan(range.startContainer)||isOrphan(range.endContainer)||!isValidOffset(range.startContainer,range.startOffset)||!isValidOffset(range.endContainer,range.endOffset)){throw new Error("Range error: Range is no longer valid after DOM mutation ("+range.inspect()+")")}}var styleEl=document.createElement("style");var htmlParsingConforms=false;try{styleEl.innerHTML="<b>x</b>";htmlParsingConforms=styleEl.firstChild.nodeType==3}catch(e){}api.features.htmlParsingConforms=htmlParsingConforms;var createContextualFragment=htmlParsingConforms?function(fragmentStr){var node=this.startContainer;var doc=dom.getDocument(node);if(!node){throw new DOMException("INVALID_STATE_ERR")}var el=null;if(node.nodeType==1){el=node}else if(dom.isCharacterDataNode(node)){el=dom.parentElement(node)}if(el===null||el.nodeName=="HTML"&&dom.isHtmlNamespace(dom.getDocument(el).documentElement)&&dom.isHtmlNamespace(el)){el=doc.createElement("body")}else{el=el.cloneNode(false)}el.innerHTML=fragmentStr;return dom.fragmentFromNodeChildren(el)}:function(fragmentStr){assertNotDetached(this);var doc=getRangeDocument(this);var el=doc.createElement("body");el.innerHTML=fragmentStr;return dom.fragmentFromNodeChildren(el)};var rangeProperties=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"];var s2s=0,s2e=1,e2e=2,e2s=3;var n_b=0,n_a=1,n_b_a=2,n_i=3;function RangePrototype(){}RangePrototype.prototype={attachListener:function(type,listener){this._listeners[type].push(listener)},compareBoundaryPoints:function(how,range){assertRangeValid(this);assertSameDocumentOrFragment(this.startContainer,range.startContainer);var nodeA,offsetA,nodeB,offsetB;var prefixA=how==e2s||how==s2s?"start":"end";var prefixB=how==s2e||how==s2s?"start":"end";nodeA=this[prefixA+"Container"];offsetA=this[prefixA+"Offset"];nodeB=range[prefixB+"Container"];offsetB=range[prefixB+"Offset"];return dom.comparePoints(nodeA,offsetA,nodeB,offsetB)},insertNode:function(node){assertRangeValid(this);assertValidNodeType(node,insertableNodeTypes);assertNodeNotReadOnly(this.startContainer);if(dom.isAncestorOf(node,this.startContainer,true)){throw new DOMException("HIERARCHY_REQUEST_ERR")}var firstNodeInserted=insertNodeAtPosition(node,this.startContainer,this.startOffset);this.setStartBefore(firstNodeInserted)},cloneContents:function(){assertRangeValid(this);var clone,frag;if(this.collapsed){return getRangeDocument(this).createDocumentFragment()}else{if(this.startContainer===this.endContainer&&dom.isCharacterDataNode(this.startContainer)){clone=this.startContainer.cloneNode(true);clone.data=clone.data.slice(this.startOffset,this.endOffset);frag=getRangeDocument(this).createDocumentFragment();frag.appendChild(clone);return frag}else{var iterator=new RangeIterator(this,true);clone=cloneSubtree(iterator);iterator.detach()}return clone}},canSurroundContents:function(){assertRangeValid(this);assertNodeNotReadOnly(this.startContainer);assertNodeNotReadOnly(this.endContainer);var iterator=new RangeIterator(this,true);var boundariesInvalid=iterator._first&&isNonTextPartiallySelected(iterator._first,this)||iterator._last&&isNonTextPartiallySelected(iterator._last,this);iterator.detach();return!boundariesInvalid},surroundContents:function(node){assertValidNodeType(node,surroundNodeTypes);if(!this.canSurroundContents()){throw new RangeException("BAD_BOUNDARYPOINTS_ERR")}var content=this.extractContents();if(node.hasChildNodes()){while(node.lastChild){node.removeChild(node.lastChild)}}insertNodeAtPosition(node,this.startContainer,this.startOffset);node.appendChild(content);this.selectNode(node)},cloneRange:function(){assertRangeValid(this);var range=new Range(getRangeDocument(this));var i=rangeProperties.length,prop;while(i--){prop=rangeProperties[i];range[prop]=this[prop]}return range},toString:function(){assertRangeValid(this);var sc=this.startContainer;if(sc===this.endContainer&&dom.isCharacterDataNode(sc)){return sc.nodeType==3||sc.nodeType==4?sc.data.slice(this.startOffset,this.endOffset):""}else{var textBits=[],iterator=new RangeIterator(this,true);iterateSubtree(iterator,function(node){if(node.nodeType==3||node.nodeType==4){textBits.push(node.data)}});iterator.detach();return textBits.join("")}},compareNode:function(node){assertRangeValid(this);var parent=node.parentNode;var nodeIndex=dom.getNodeIndex(node);if(!parent){throw new DOMException("NOT_FOUND_ERR")}var startComparison=this.comparePoint(parent,nodeIndex),endComparison=this.comparePoint(parent,nodeIndex+1);if(startComparison<0){return endComparison>0?n_b_a:n_b}else{return endComparison>0?n_a:n_i}},comparePoint:function(node,offset){assertRangeValid(this);assertNode(node,"HIERARCHY_REQUEST_ERR");assertSameDocumentOrFragment(node,this.startContainer);if(dom.comparePoints(node,offset,this.startContainer,this.startOffset)<0){return-1}else if(dom.comparePoints(node,offset,this.endContainer,this.endOffset)>0){return 1}return 0},createContextualFragment:createContextualFragment,toHtml:function(){assertRangeValid(this);var container=getRangeDocument(this).createElement("div");container.appendChild(this.cloneContents());return container.innerHTML},intersectsNode:function(node,touchingIsIntersecting){assertRangeValid(this);assertNode(node,"NOT_FOUND_ERR");if(dom.getDocument(node)!==getRangeDocument(this)){return false}var parent=node.parentNode,offset=dom.getNodeIndex(node);assertNode(parent,"NOT_FOUND_ERR");var startComparison=dom.comparePoints(parent,offset,this.endContainer,this.endOffset),endComparison=dom.comparePoints(parent,offset+1,this.startContainer,this.startOffset);return touchingIsIntersecting?startComparison<=0&&endComparison>=0:startComparison<0&&endComparison>0},isPointInRange:function(node,offset){assertRangeValid(this);assertNode(node,"HIERARCHY_REQUEST_ERR");assertSameDocumentOrFragment(node,this.startContainer);return dom.comparePoints(node,offset,this.startContainer,this.startOffset)>=0&&dom.comparePoints(node,offset,this.endContainer,this.endOffset)<=0},intersectsRange:function(range,touchingIsIntersecting){assertRangeValid(this);if(getRangeDocument(range)!=getRangeDocument(this)){throw new DOMException("WRONG_DOCUMENT_ERR")}var startComparison=dom.comparePoints(this.startContainer,this.startOffset,range.endContainer,range.endOffset),endComparison=dom.comparePoints(this.endContainer,this.endOffset,range.startContainer,range.startOffset);return touchingIsIntersecting?startComparison<=0&&endComparison>=0:startComparison<0&&endComparison>0},intersection:function(range){if(this.intersectsRange(range)){var startComparison=dom.comparePoints(this.startContainer,this.startOffset,range.startContainer,range.startOffset),endComparison=dom.comparePoints(this.endContainer,this.endOffset,range.endContainer,range.endOffset);var intersectionRange=this.cloneRange();if(startComparison==-1){intersectionRange.setStart(range.startContainer,range.startOffset)}if(endComparison==1){intersectionRange.setEnd(range.endContainer,range.endOffset)}return intersectionRange}return null},union:function(range){if(this.intersectsRange(range,true)){var unionRange=this.cloneRange();if(dom.comparePoints(range.startContainer,range.startOffset,this.startContainer,this.startOffset)==-1){unionRange.setStart(range.startContainer,range.startOffset)}if(dom.comparePoints(range.endContainer,range.endOffset,this.endContainer,this.endOffset)==1){unionRange.setEnd(range.endContainer,range.endOffset)}return unionRange}else{throw new RangeException("Ranges do not intersect")}},containsNode:function(node,allowPartial){if(allowPartial){return this.intersectsNode(node,false)}else{return this.compareNode(node)==n_i}},containsNodeContents:function(node){return this.comparePoint(node,0)>=0&&this.comparePoint(node,dom.getNodeLength(node))<=0},containsRange:function(range){return this.intersection(range).equals(range)},containsNodeText:function(node){var nodeRange=this.cloneRange();nodeRange.selectNode(node);var textNodes=nodeRange.getNodes([3]);if(textNodes.length>0){nodeRange.setStart(textNodes[0],0);var lastTextNode=textNodes.pop();nodeRange.setEnd(lastTextNode,lastTextNode.length);var contains=this.containsRange(nodeRange);nodeRange.detach();return contains}else{return this.containsNodeContents(node)}},createNodeIterator:function(nodeTypes,filter){assertRangeValid(this);return new RangeNodeIterator(this,nodeTypes,filter)},getNodes:function(nodeTypes,filter){assertRangeValid(this);return getNodesInRange(this,nodeTypes,filter)},getDocument:function(){return getRangeDocument(this)},collapseBefore:function(node){assertNotDetached(this);this.setEndBefore(node);this.collapse(false)},collapseAfter:function(node){assertNotDetached(this);this.setStartAfter(node);this.collapse(true)},getName:function(){return"DomRange"},equals:function(range){return Range.rangesEqual(this,range)},inspect:function(){return inspect(this)}};function copyComparisonConstantsToObject(obj){obj.START_TO_START=s2s;obj.START_TO_END=s2e;obj.END_TO_END=e2e;obj.END_TO_START=e2s;obj.NODE_BEFORE=n_b;obj.NODE_AFTER=n_a;obj.NODE_BEFORE_AND_AFTER=n_b_a;obj.NODE_INSIDE=n_i}function copyComparisonConstants(constructor){copyComparisonConstantsToObject(constructor);copyComparisonConstantsToObject(constructor.prototype)}function createRangeContentRemover(remover,boundaryUpdater){return function(){assertRangeValid(this);var sc=this.startContainer,so=this.startOffset,root=this.commonAncestorContainer;var iterator=new RangeIterator(this,true);var node,boundary;if(sc!==root){node=dom.getClosestAncestorIn(sc,root,true);boundary=getBoundaryAfterNode(node);sc=boundary.node;so=boundary.offset}iterateSubtree(iterator,assertNodeNotReadOnly);iterator.reset();var returnValue=remover(iterator);iterator.detach();boundaryUpdater(this,sc,so,sc,so);return returnValue}}function createPrototypeRange(constructor,boundaryUpdater,detacher){function createBeforeAfterNodeSetter(isBefore,isStart){return function(node){assertNotDetached(this);assertValidNodeType(node,beforeAfterNodeTypes);assertValidNodeType(getRootContainer(node),rootContainerNodeTypes);var boundary=(isBefore?getBoundaryBeforeNode:getBoundaryAfterNode)(node);(isStart?setRangeStart:setRangeEnd)(this,boundary.node,boundary.offset)}}function setRangeStart(range,node,offset){var ec=range.endContainer,eo=range.endOffset;if(node!==range.startContainer||offset!==range.startOffset){if(getRootContainer(node)!=getRootContainer(ec)||dom.comparePoints(node,offset,ec,eo)==1){ec=node;eo=offset}boundaryUpdater(range,node,offset,ec,eo)}}function setRangeEnd(range,node,offset){var sc=range.startContainer,so=range.startOffset;if(node!==range.endContainer||offset!==range.endOffset){if(getRootContainer(node)!=getRootContainer(sc)||dom.comparePoints(node,offset,sc,so)==-1){sc=node;so=offset}boundaryUpdater(range,sc,so,node,offset)}}function setRangeStartAndEnd(range,node,offset){if(node!==range.startContainer||offset!==range.startOffset||node!==range.endContainer||offset!==range.endOffset){boundaryUpdater(range,node,offset,node,offset)}}constructor.prototype=new RangePrototype;api.util.extend(constructor.prototype,{setStart:function(node,offset){assertNotDetached(this);assertNoDocTypeNotationEntityAncestor(node,true);assertValidOffset(node,offset);setRangeStart(this,node,offset)},setEnd:function(node,offset){assertNotDetached(this);assertNoDocTypeNotationEntityAncestor(node,true);assertValidOffset(node,offset);setRangeEnd(this,node,offset)},setStartBefore:createBeforeAfterNodeSetter(true,true),setStartAfter:createBeforeAfterNodeSetter(false,true),setEndBefore:createBeforeAfterNodeSetter(true,false),setEndAfter:createBeforeAfterNodeSetter(false,false),collapse:function(isStart){assertRangeValid(this);if(isStart){boundaryUpdater(this,this.startContainer,this.startOffset,this.startContainer,this.startOffset)}else{boundaryUpdater(this,this.endContainer,this.endOffset,this.endContainer,this.endOffset)}},selectNodeContents:function(node){assertNotDetached(this);assertNoDocTypeNotationEntityAncestor(node,true);boundaryUpdater(this,node,0,node,dom.getNodeLength(node))},selectNode:function(node){assertNotDetached(this);assertNoDocTypeNotationEntityAncestor(node,false);assertValidNodeType(node,beforeAfterNodeTypes);var start=getBoundaryBeforeNode(node),end=getBoundaryAfterNode(node);boundaryUpdater(this,start.node,start.offset,end.node,end.offset)},extractContents:createRangeContentRemover(extractSubtree,boundaryUpdater),deleteContents:createRangeContentRemover(deleteSubtree,boundaryUpdater),canSurroundContents:function(){assertRangeValid(this);assertNodeNotReadOnly(this.startContainer);assertNodeNotReadOnly(this.endContainer);var iterator=new RangeIterator(this,true);var boundariesInvalid=iterator._first&&isNonTextPartiallySelected(iterator._first,this)||iterator._last&&isNonTextPartiallySelected(iterator._last,this);iterator.detach();return!boundariesInvalid},detach:function(){detacher(this)},splitBoundaries:function(){assertRangeValid(this);var sc=this.startContainer,so=this.startOffset,ec=this.endContainer,eo=this.endOffset;var startEndSame=sc===ec;if(dom.isCharacterDataNode(ec)&&eo>0&&eo<ec.length){dom.splitDataNode(ec,eo)}if(dom.isCharacterDataNode(sc)&&so>0&&so<sc.length){sc=dom.splitDataNode(sc,so);if(startEndSame){eo-=so;ec=sc}else if(ec==sc.parentNode&&eo>=dom.getNodeIndex(sc)){eo++}so=0}boundaryUpdater(this,sc,so,ec,eo)},normalizeBoundaries:function(){assertRangeValid(this);var sc=this.startContainer,so=this.startOffset,ec=this.endContainer,eo=this.endOffset;var mergeForward=function(node){var sibling=node.nextSibling;if(sibling&&sibling.nodeType==node.nodeType){ec=node;eo=node.length;node.appendData(sibling.data);sibling.parentNode.removeChild(sibling)}};var mergeBackward=function(node){var sibling=node.previousSibling;if(sibling&&sibling.nodeType==node.nodeType){sc=node;var nodeLength=node.length;so=sibling.length;node.insertData(0,sibling.data);sibling.parentNode.removeChild(sibling);if(sc==ec){eo+=so;ec=sc}else if(ec==node.parentNode){var nodeIndex=dom.getNodeIndex(node);if(eo==nodeIndex){ec=node;eo=nodeLength}else if(eo>nodeIndex){eo--}}}};var normalizeStart=true;if(dom.isCharacterDataNode(ec)){if(ec.length==eo){mergeForward(ec)}}else{if(eo>0){var endNode=ec.childNodes[eo-1];if(endNode&&dom.isCharacterDataNode(endNode)){mergeForward(endNode)}}normalizeStart=!this.collapsed}if(normalizeStart){if(dom.isCharacterDataNode(sc)){if(so==0){mergeBackward(sc)}}else{if(so<sc.childNodes.length){var startNode=sc.childNodes[so];if(startNode&&dom.isCharacterDataNode(startNode)){mergeBackward(startNode)}}}}else{sc=ec;so=eo}boundaryUpdater(this,sc,so,ec,eo)},collapseToPoint:function(node,offset){assertNotDetached(this);assertNoDocTypeNotationEntityAncestor(node,true);assertValidOffset(node,offset);setRangeStartAndEnd(this,node,offset)}});copyComparisonConstants(constructor)}function updateCollapsedAndCommonAncestor(range){range.collapsed=range.startContainer===range.endContainer&&range.startOffset===range.endOffset;range.commonAncestorContainer=range.collapsed?range.startContainer:dom.getCommonAncestor(range.startContainer,range.endContainer)}function updateBoundaries(range,startContainer,startOffset,endContainer,endOffset){var startMoved=range.startContainer!==startContainer||range.startOffset!==startOffset;var endMoved=range.endContainer!==endContainer||range.endOffset!==endOffset;range.startContainer=startContainer;range.startOffset=startOffset;range.endContainer=endContainer;range.endOffset=endOffset;updateCollapsedAndCommonAncestor(range);dispatchEvent(range,"boundarychange",{startMoved:startMoved,endMoved:endMoved})}function detach(range){assertNotDetached(range);range.startContainer=range.startOffset=range.endContainer=range.endOffset=null;range.collapsed=range.commonAncestorContainer=null;dispatchEvent(range,"detach",null);range._listeners=null}function Range(doc){this.startContainer=doc;this.startOffset=0;this.endContainer=doc;this.endOffset=0;this._listeners={boundarychange:[],detach:[]};updateCollapsedAndCommonAncestor(this)}createPrototypeRange(Range,updateBoundaries,detach);api.rangePrototype=RangePrototype.prototype;Range.rangeProperties=rangeProperties;Range.RangeIterator=RangeIterator;Range.copyComparisonConstants=copyComparisonConstants;Range.createPrototypeRange=createPrototypeRange;Range.inspect=inspect;Range.getRangeDocument=getRangeDocument;Range.rangesEqual=function(r1,r2){return r1.startContainer===r2.startContainer&&r1.startOffset===r2.startOffset&&r1.endContainer===r2.endContainer&&r1.endOffset===r2.endOffset};api.DomRange=Range;api.RangeException=RangeException});rangy.createModule("WrappedRange",function(api,module){api.requireModules(["DomUtil","DomRange"]);var WrappedRange;var dom=api.dom;var DomPosition=dom.DomPosition;var DomRange=api.DomRange;function getTextRangeContainerElement(textRange){var parentEl=textRange.parentElement();var range=textRange.duplicate();range.collapse(true);var startEl=range.parentElement();range=textRange.duplicate();range.collapse(false);var endEl=range.parentElement();var startEndContainer=startEl==endEl?startEl:dom.getCommonAncestor(startEl,endEl);return startEndContainer==parentEl?startEndContainer:dom.getCommonAncestor(parentEl,startEndContainer)}function textRangeIsCollapsed(textRange){return textRange.compareEndPoints("StartToEnd",textRange)==0}function getTextRangeBoundaryPosition(textRange,wholeRangeContainerElement,isStart,isCollapsed){var workingRange=textRange.duplicate();workingRange.collapse(isStart);var containerElement=workingRange.parentElement();if(!dom.isAncestorOf(wholeRangeContainerElement,containerElement,true)){containerElement=wholeRangeContainerElement}if(!containerElement.canHaveHTML){return new DomPosition(containerElement.parentNode,dom.getNodeIndex(containerElement))}var workingNode=dom.getDocument(containerElement).createElement("span");var comparison,workingComparisonType=isStart?"StartToStart":"StartToEnd";var previousNode,nextNode,boundaryPosition,boundaryNode;do{containerElement.insertBefore(workingNode,workingNode.previousSibling);workingRange.moveToElementText(workingNode)}while((comparison=workingRange.compareEndPoints(workingComparisonType,textRange))>0&&workingNode.previousSibling);boundaryNode=workingNode.nextSibling;if(comparison==-1&&boundaryNode&&dom.isCharacterDataNode(boundaryNode)){workingRange.setEndPoint(isStart?"EndToStart":"EndToEnd",textRange);var offset;if(/[\r\n]/.test(boundaryNode.data)){var tempRange=workingRange.duplicate();var rangeLength=tempRange.text.replace(/\r\n/g,"\r").length;offset=tempRange.moveStart("character",rangeLength);while((comparison=tempRange.compareEndPoints("StartToEnd",tempRange))==-1){offset++;tempRange.moveStart("character",1)}}else{offset=workingRange.text.length}boundaryPosition=new DomPosition(boundaryNode,offset)}else{previousNode=(isCollapsed||!isStart)&&workingNode.previousSibling;nextNode=(isCollapsed||isStart)&&workingNode.nextSibling;if(nextNode&&dom.isCharacterDataNode(nextNode)){boundaryPosition=new DomPosition(nextNode,0)}else if(previousNode&&dom.isCharacterDataNode(previousNode)){boundaryPosition=new DomPosition(previousNode,previousNode.length)}else{boundaryPosition=new DomPosition(containerElement,dom.getNodeIndex(workingNode))}}workingNode.parentNode.removeChild(workingNode);return boundaryPosition}function createBoundaryTextRange(boundaryPosition,isStart){var boundaryNode,boundaryParent,boundaryOffset=boundaryPosition.offset;var doc=dom.getDocument(boundaryPosition.node);var workingNode,childNodes,workingRange=doc.body.createTextRange();var nodeIsDataNode=dom.isCharacterDataNode(boundaryPosition.node);if(nodeIsDataNode){boundaryNode=boundaryPosition.node;boundaryParent=boundaryNode.parentNode}else{childNodes=boundaryPosition.node.childNodes;boundaryNode=boundaryOffset<childNodes.length?childNodes[boundaryOffset]:null;boundaryParent=boundaryPosition.node}workingNode=doc.createElement("span");workingNode.innerHTML="&#feff;";if(boundaryNode){boundaryParent.insertBefore(workingNode,boundaryNode)}else{boundaryParent.appendChild(workingNode)}workingRange.moveToElementText(workingNode);workingRange.collapse(!isStart);boundaryParent.removeChild(workingNode);if(nodeIsDataNode){workingRange[isStart?"moveStart":"moveEnd"]("character",boundaryOffset)}return workingRange}if(api.features.implementsDomRange&&(!api.features.implementsTextRange||!api.config.preferTextRange)){!function(){var rangeProto;var rangeProperties=DomRange.rangeProperties;var canSetRangeStartAfterEnd;function updateRangeProperties(range){var i=rangeProperties.length,prop;while(i--){prop=rangeProperties[i];range[prop]=range.nativeRange[prop]}}function updateNativeRange(range,startContainer,startOffset,endContainer,endOffset){var startMoved=range.startContainer!==startContainer||range.startOffset!=startOffset;var endMoved=range.endContainer!==endContainer||range.endOffset!=endOffset;if(startMoved||endMoved){range.setEnd(endContainer,endOffset);range.setStart(startContainer,startOffset)}}function detach(range){range.nativeRange.detach();range.detached=true;var i=rangeProperties.length,prop;while(i--){prop=rangeProperties[i];range[prop]=null}}var createBeforeAfterNodeSetter;WrappedRange=function(range){if(!range){throw new Error("Range must be specified")}this.nativeRange=range;updateRangeProperties(this)};DomRange.createPrototypeRange(WrappedRange,updateNativeRange,detach);rangeProto=WrappedRange.prototype;rangeProto.selectNode=function(node){this.nativeRange.selectNode(node);updateRangeProperties(this)};rangeProto.deleteContents=function(){this.nativeRange.deleteContents();updateRangeProperties(this)};rangeProto.extractContents=function(){var frag=this.nativeRange.extractContents();updateRangeProperties(this);return frag};rangeProto.cloneContents=function(){return this.nativeRange.cloneContents()};rangeProto.surroundContents=function(node){this.nativeRange.surroundContents(node);updateRangeProperties(this)};rangeProto.collapse=function(isStart){this.nativeRange.collapse(isStart);updateRangeProperties(this)};rangeProto.cloneRange=function(){return new WrappedRange(this.nativeRange.cloneRange())};rangeProto.refresh=function(){updateRangeProperties(this)};rangeProto.toString=function(){return this.nativeRange.toString()};var testTextNode=document.createTextNode("test");dom.getBody(document).appendChild(testTextNode);var range=document.createRange();range.setStart(testTextNode,0);range.setEnd(testTextNode,0);try{range.setStart(testTextNode,1);canSetRangeStartAfterEnd=true;rangeProto.setStart=function(node,offset){this.nativeRange.setStart(node,offset);updateRangeProperties(this)};rangeProto.setEnd=function(node,offset){this.nativeRange.setEnd(node,offset);updateRangeProperties(this)};createBeforeAfterNodeSetter=function(name){return function(node){this.nativeRange[name](node);updateRangeProperties(this)}}}catch(ex){canSetRangeStartAfterEnd=false;rangeProto.setStart=function(node,offset){try{this.nativeRange.setStart(node,offset)}catch(ex){this.nativeRange.setEnd(node,offset);this.nativeRange.setStart(node,offset)}updateRangeProperties(this)};rangeProto.setEnd=function(node,offset){try{this.nativeRange.setEnd(node,offset)}catch(ex){this.nativeRange.setStart(node,offset);this.nativeRange.setEnd(node,offset)}updateRangeProperties(this)};createBeforeAfterNodeSetter=function(name,oppositeName){return function(node){try{this.nativeRange[name](node)
}catch(ex){this.nativeRange[oppositeName](node);this.nativeRange[name](node)}updateRangeProperties(this)}}}rangeProto.setStartBefore=createBeforeAfterNodeSetter("setStartBefore","setEndBefore");rangeProto.setStartAfter=createBeforeAfterNodeSetter("setStartAfter","setEndAfter");rangeProto.setEndBefore=createBeforeAfterNodeSetter("setEndBefore","setStartBefore");rangeProto.setEndAfter=createBeforeAfterNodeSetter("setEndAfter","setStartAfter");range.selectNodeContents(testTextNode);if(range.startContainer==testTextNode&&range.endContainer==testTextNode&&range.startOffset==0&&range.endOffset==testTextNode.length){rangeProto.selectNodeContents=function(node){this.nativeRange.selectNodeContents(node);updateRangeProperties(this)}}else{rangeProto.selectNodeContents=function(node){this.setStart(node,0);this.setEnd(node,DomRange.getEndOffset(node))}}range.selectNodeContents(testTextNode);range.setEnd(testTextNode,3);var range2=document.createRange();range2.selectNodeContents(testTextNode);range2.setEnd(testTextNode,4);range2.setStart(testTextNode,2);if(range.compareBoundaryPoints(range.START_TO_END,range2)==-1&range.compareBoundaryPoints(range.END_TO_START,range2)==1){rangeProto.compareBoundaryPoints=function(type,range){range=range.nativeRange||range;if(type==range.START_TO_END){type=range.END_TO_START}else if(type==range.END_TO_START){type=range.START_TO_END}return this.nativeRange.compareBoundaryPoints(type,range)}}else{rangeProto.compareBoundaryPoints=function(type,range){return this.nativeRange.compareBoundaryPoints(type,range.nativeRange||range)}}if(api.util.isHostMethod(range,"createContextualFragment")){rangeProto.createContextualFragment=function(fragmentStr){return this.nativeRange.createContextualFragment(fragmentStr)}}dom.getBody(document).removeChild(testTextNode);range.detach();range2.detach()}();api.createNativeRange=function(doc){doc=doc||document;return doc.createRange()}}else if(api.features.implementsTextRange){WrappedRange=function(textRange){this.textRange=textRange;this.refresh()};WrappedRange.prototype=new DomRange(document);WrappedRange.prototype.refresh=function(){var start,end;var rangeContainerElement=getTextRangeContainerElement(this.textRange);if(textRangeIsCollapsed(this.textRange)){end=start=getTextRangeBoundaryPosition(this.textRange,rangeContainerElement,true,true)}else{start=getTextRangeBoundaryPosition(this.textRange,rangeContainerElement,true,false);end=getTextRangeBoundaryPosition(this.textRange,rangeContainerElement,false,false)}this.setStart(start.node,start.offset);this.setEnd(end.node,end.offset)};DomRange.copyComparisonConstants(WrappedRange);var globalObj=function(){return this}();if(typeof globalObj.Range=="undefined"){globalObj.Range=WrappedRange}api.createNativeRange=function(doc){doc=doc||document;return doc.body.createTextRange()}}if(api.features.implementsTextRange){WrappedRange.rangeToTextRange=function(range){if(range.collapsed){var tr=createBoundaryTextRange(new DomPosition(range.startContainer,range.startOffset),true);return tr}else{var startRange=createBoundaryTextRange(new DomPosition(range.startContainer,range.startOffset),true);var endRange=createBoundaryTextRange(new DomPosition(range.endContainer,range.endOffset),false);var textRange=dom.getDocument(range.startContainer).body.createTextRange();textRange.setEndPoint("StartToStart",startRange);textRange.setEndPoint("EndToEnd",endRange);return textRange}}}WrappedRange.prototype.getName=function(){return"WrappedRange"};api.WrappedRange=WrappedRange;api.createRange=function(doc){doc=doc||document;return new WrappedRange(api.createNativeRange(doc))};api.createRangyRange=function(doc){doc=doc||document;return new DomRange(doc)};api.createIframeRange=function(iframeEl){return api.createRange(dom.getIframeDocument(iframeEl))};api.createIframeRangyRange=function(iframeEl){return api.createRangyRange(dom.getIframeDocument(iframeEl))};api.addCreateMissingNativeApiListener(function(win){var doc=win.document;if(typeof doc.createRange=="undefined"){doc.createRange=function(){return api.createRange(this)}}doc=win=null})});rangy.createModule("WrappedSelection",function(api,module){api.requireModules(["DomUtil","DomRange","WrappedRange"]);api.config.checkSelectionRanges=true;var BOOLEAN="boolean",windowPropertyName="_rangySelection",dom=api.dom,util=api.util,DomRange=api.DomRange,WrappedRange=api.WrappedRange,DOMException=api.DOMException,DomPosition=dom.DomPosition,getSelection,selectionIsCollapsed,CONTROL="Control";function getWinSelection(winParam){return(winParam||window).getSelection()}function getDocSelection(winParam){return(winParam||window).document.selection}var implementsWinGetSelection=api.util.isHostMethod(window,"getSelection"),implementsDocSelection=api.util.isHostObject(document,"selection");var useDocumentSelection=implementsDocSelection&&(!implementsWinGetSelection||api.config.preferTextRange);if(useDocumentSelection){getSelection=getDocSelection;api.isSelectionValid=function(winParam){var doc=(winParam||window).document,nativeSel=doc.selection;return nativeSel.type!="None"||dom.getDocument(nativeSel.createRange().parentElement())==doc}}else if(implementsWinGetSelection){getSelection=getWinSelection;api.isSelectionValid=function(){return true}}else{module.fail("Neither document.selection or window.getSelection() detected.")}api.getNativeSelection=getSelection;var testSelection=getSelection();var testRange=api.createNativeRange(document);var body=dom.getBody(document);var selectionHasAnchorAndFocus=util.areHostObjects(testSelection,["anchorNode","focusNode"]&&util.areHostProperties(testSelection,["anchorOffset","focusOffset"]));api.features.selectionHasAnchorAndFocus=selectionHasAnchorAndFocus;var selectionHasExtend=util.isHostMethod(testSelection,"extend");api.features.selectionHasExtend=selectionHasExtend;var selectionHasRangeCount=typeof testSelection.rangeCount=="number";api.features.selectionHasRangeCount=selectionHasRangeCount;var selectionSupportsMultipleRanges=false;var collapsedNonEditableSelectionsSupported=true;if(util.areHostMethods(testSelection,["addRange","getRangeAt","removeAllRanges"])&&typeof testSelection.rangeCount=="number"&&api.features.implementsDomRange){!function(){var iframe=document.createElement("iframe");body.appendChild(iframe);var iframeDoc=dom.getIframeDocument(iframe);iframeDoc.open();iframeDoc.write("<html><head></head><body>12</body></html>");iframeDoc.close();var sel=dom.getIframeWindow(iframe).getSelection();var docEl=iframeDoc.documentElement;var iframeBody=docEl.lastChild,textNode=iframeBody.firstChild;var r1=iframeDoc.createRange();r1.setStart(textNode,1);r1.collapse(true);sel.addRange(r1);collapsedNonEditableSelectionsSupported=sel.rangeCount==1;sel.removeAllRanges();var r2=r1.cloneRange();r1.setStart(textNode,0);r2.setEnd(textNode,2);sel.addRange(r1);sel.addRange(r2);selectionSupportsMultipleRanges=sel.rangeCount==2;r1.detach();r2.detach();body.removeChild(iframe)}()}api.features.selectionSupportsMultipleRanges=selectionSupportsMultipleRanges;api.features.collapsedNonEditableSelectionsSupported=collapsedNonEditableSelectionsSupported;var implementsControlRange=false,testControlRange;if(body&&util.isHostMethod(body,"createControlRange")){testControlRange=body.createControlRange();if(util.areHostProperties(testControlRange,["item","add"])){implementsControlRange=true}}api.features.implementsControlRange=implementsControlRange;if(selectionHasAnchorAndFocus){selectionIsCollapsed=function(sel){return sel.anchorNode===sel.focusNode&&sel.anchorOffset===sel.focusOffset}}else{selectionIsCollapsed=function(sel){return sel.rangeCount?sel.getRangeAt(sel.rangeCount-1).collapsed:false}}function updateAnchorAndFocusFromRange(sel,range,backwards){var anchorPrefix=backwards?"end":"start",focusPrefix=backwards?"start":"end";sel.anchorNode=range[anchorPrefix+"Container"];sel.anchorOffset=range[anchorPrefix+"Offset"];sel.focusNode=range[focusPrefix+"Container"];sel.focusOffset=range[focusPrefix+"Offset"]}function updateAnchorAndFocusFromNativeSelection(sel){var nativeSel=sel.nativeSelection;sel.anchorNode=nativeSel.anchorNode;sel.anchorOffset=nativeSel.anchorOffset;sel.focusNode=nativeSel.focusNode;sel.focusOffset=nativeSel.focusOffset}function updateEmptySelection(sel){sel.anchorNode=sel.focusNode=null;sel.anchorOffset=sel.focusOffset=0;sel.rangeCount=0;sel.isCollapsed=true;sel._ranges.length=0}function getNativeRange(range){var nativeRange;if(range instanceof DomRange){nativeRange=range._selectionNativeRange;if(!nativeRange){nativeRange=api.createNativeRange(dom.getDocument(range.startContainer));nativeRange.setEnd(range.endContainer,range.endOffset);nativeRange.setStart(range.startContainer,range.startOffset);range._selectionNativeRange=nativeRange;range.attachListener("detach",function(){this._selectionNativeRange=null})}}else if(range instanceof WrappedRange){nativeRange=range.nativeRange}else if(api.features.implementsDomRange&&range instanceof dom.getWindow(range.startContainer).Range){nativeRange=range}return nativeRange}function rangeContainsSingleElement(rangeNodes){if(!rangeNodes.length||rangeNodes[0].nodeType!=1){return false}for(var i=1,len=rangeNodes.length;i<len;++i){if(!dom.isAncestorOf(rangeNodes[0],rangeNodes[i])){return false}}return true}function getSingleElementFromRange(range){var nodes=range.getNodes();if(!rangeContainsSingleElement(nodes)){throw new Error("getSingleElementFromRange: range "+range.inspect()+" did not consist of a single element")}return nodes[0]}function isTextRange(range){return!!range&&typeof range.text!="undefined"}function updateFromTextRange(sel,range){var wrappedRange=new WrappedRange(range);sel._ranges=[wrappedRange];updateAnchorAndFocusFromRange(sel,wrappedRange,false);sel.rangeCount=1;sel.isCollapsed=wrappedRange.collapsed}function updateControlSelection(sel){sel._ranges.length=0;if(sel.docSelection.type=="None"){updateEmptySelection(sel)}else{var controlRange=sel.docSelection.createRange();if(isTextRange(controlRange)){updateFromTextRange(sel,controlRange)}else{sel.rangeCount=controlRange.length;var range,doc=dom.getDocument(controlRange.item(0));for(var i=0;i<sel.rangeCount;++i){range=api.createRange(doc);range.selectNode(controlRange.item(i));sel._ranges.push(range)}sel.isCollapsed=sel.rangeCount==1&&sel._ranges[0].collapsed;updateAnchorAndFocusFromRange(sel,sel._ranges[sel.rangeCount-1],false)}}}function addRangeToControlSelection(sel,range){var controlRange=sel.docSelection.createRange();var rangeElement=getSingleElementFromRange(range);var doc=dom.getDocument(controlRange.item(0));var newControlRange=dom.getBody(doc).createControlRange();for(var i=0,len=controlRange.length;i<len;++i){newControlRange.add(controlRange.item(i))}try{newControlRange.add(rangeElement)}catch(ex){throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)")}newControlRange.select();updateControlSelection(sel)}var getSelectionRangeAt;if(util.isHostMethod(testSelection,"getRangeAt")){getSelectionRangeAt=function(sel,index){try{return sel.getRangeAt(index)}catch(ex){return null}}}else if(selectionHasAnchorAndFocus){getSelectionRangeAt=function(sel){var doc=dom.getDocument(sel.anchorNode);var range=api.createRange(doc);range.setStart(sel.anchorNode,sel.anchorOffset);range.setEnd(sel.focusNode,sel.focusOffset);if(range.collapsed!==this.isCollapsed){range.setStart(sel.focusNode,sel.focusOffset);range.setEnd(sel.anchorNode,sel.anchorOffset)}return range}}function WrappedSelection(selection,docSelection,win){this.nativeSelection=selection;this.docSelection=docSelection;this._ranges=[];this.win=win;this.refresh()}api.getSelection=function(win){win=win||window;var sel=win[windowPropertyName];var nativeSel=getSelection(win),docSel=implementsDocSelection?getDocSelection(win):null;if(sel){sel.nativeSelection=nativeSel;sel.docSelection=docSel;sel.refresh(win)}else{sel=new WrappedSelection(nativeSel,docSel,win);win[windowPropertyName]=sel}return sel};api.getIframeSelection=function(iframeEl){return api.getSelection(dom.getIframeWindow(iframeEl))};var selProto=WrappedSelection.prototype;function createControlSelection(sel,ranges){var doc=dom.getDocument(ranges[0].startContainer);var controlRange=dom.getBody(doc).createControlRange();for(var i=0,el;i<rangeCount;++i){el=getSingleElementFromRange(ranges[i]);try{controlRange.add(el)}catch(ex){throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)")}}controlRange.select();updateControlSelection(sel)}if(!useDocumentSelection&&selectionHasAnchorAndFocus&&util.areHostMethods(testSelection,["removeAllRanges","addRange"])){selProto.removeAllRanges=function(){this.nativeSelection.removeAllRanges();updateEmptySelection(this)};var addRangeBackwards=function(sel,range){var doc=DomRange.getRangeDocument(range);var endRange=api.createRange(doc);endRange.collapseToPoint(range.endContainer,range.endOffset);sel.nativeSelection.addRange(getNativeRange(endRange));sel.nativeSelection.extend(range.startContainer,range.startOffset);sel.refresh()};if(selectionHasRangeCount){selProto.addRange=function(range,backwards){if(implementsControlRange&&implementsDocSelection&&this.docSelection.type==CONTROL){addRangeToControlSelection(this,range)}else{if(backwards&&selectionHasExtend){addRangeBackwards(this,range)}else{var previousRangeCount;if(selectionSupportsMultipleRanges){previousRangeCount=this.rangeCount}else{this.removeAllRanges();previousRangeCount=0}this.nativeSelection.addRange(getNativeRange(range));this.rangeCount=this.nativeSelection.rangeCount;if(this.rangeCount==previousRangeCount+1){if(api.config.checkSelectionRanges){var nativeRange=getSelectionRangeAt(this.nativeSelection,this.rangeCount-1);if(nativeRange&&!DomRange.rangesEqual(nativeRange,range)){range=new WrappedRange(nativeRange)}}this._ranges[this.rangeCount-1]=range;updateAnchorAndFocusFromRange(this,range,selectionIsBackwards(this.nativeSelection));this.isCollapsed=selectionIsCollapsed(this)}else{this.refresh()}}}}}else{selProto.addRange=function(range,backwards){if(backwards&&selectionHasExtend){addRangeBackwards(this,range)}else{this.nativeSelection.addRange(getNativeRange(range));this.refresh()}}}selProto.setRanges=function(ranges){if(implementsControlRange&&ranges.length>1){createControlSelection(this,ranges)}else{this.removeAllRanges();for(var i=0,len=ranges.length;i<len;++i){this.addRange(ranges[i])}}}}else if(util.isHostMethod(testSelection,"empty")&&util.isHostMethod(testRange,"select")&&implementsControlRange&&useDocumentSelection){selProto.removeAllRanges=function(){try{this.docSelection.empty();if(this.docSelection.type!="None"){var doc;if(this.anchorNode){doc=dom.getDocument(this.anchorNode)}else if(this.docSelection.type==CONTROL){var controlRange=this.docSelection.createRange();if(controlRange.length){doc=dom.getDocument(controlRange.item(0)).body.createTextRange()}}if(doc){var textRange=doc.body.createTextRange();textRange.select();this.docSelection.empty()}}}catch(ex){}updateEmptySelection(this)};selProto.addRange=function(range){if(this.docSelection.type==CONTROL){addRangeToControlSelection(this,range)}else{WrappedRange.rangeToTextRange(range).select();this._ranges[0]=range;this.rangeCount=1;this.isCollapsed=this._ranges[0].collapsed;updateAnchorAndFocusFromRange(this,range,false)}};selProto.setRanges=function(ranges){this.removeAllRanges();var rangeCount=ranges.length;if(rangeCount>1){createControlSelection(this,ranges)}else if(rangeCount){this.addRange(ranges[0])}}}else{module.fail("No means of selecting a Range or TextRange was found");return false}selProto.getRangeAt=function(index){if(index<0||index>=this.rangeCount){throw new DOMException("INDEX_SIZE_ERR")}else{return this._ranges[index]}};var refreshSelection;if(useDocumentSelection){refreshSelection=function(sel){var range;if(api.isSelectionValid(sel.win)){range=sel.docSelection.createRange()}else{range=dom.getBody(sel.win.document).createTextRange();range.collapse(true)}if(sel.docSelection.type==CONTROL){updateControlSelection(sel)}else if(isTextRange(range)){updateFromTextRange(sel,range)}else{updateEmptySelection(sel)}}}else if(util.isHostMethod(testSelection,"getRangeAt")&&typeof testSelection.rangeCount=="number"){refreshSelection=function(sel){if(implementsControlRange&&implementsDocSelection&&sel.docSelection.type==CONTROL){updateControlSelection(sel)}else{sel._ranges.length=sel.rangeCount=sel.nativeSelection.rangeCount;if(sel.rangeCount){for(var i=0,len=sel.rangeCount;i<len;++i){sel._ranges[i]=new api.WrappedRange(sel.nativeSelection.getRangeAt(i))}updateAnchorAndFocusFromRange(sel,sel._ranges[sel.rangeCount-1],selectionIsBackwards(sel.nativeSelection));sel.isCollapsed=selectionIsCollapsed(sel)}else{updateEmptySelection(sel)}}}}else if(selectionHasAnchorAndFocus&&typeof testSelection.isCollapsed==BOOLEAN&&typeof testRange.collapsed==BOOLEAN&&api.features.implementsDomRange){refreshSelection=function(sel){var range,nativeSel=sel.nativeSelection;if(nativeSel.anchorNode){range=getSelectionRangeAt(nativeSel,0);sel._ranges=[range];sel.rangeCount=1;updateAnchorAndFocusFromNativeSelection(sel);sel.isCollapsed=selectionIsCollapsed(sel)}else{updateEmptySelection(sel)}}}else{module.fail("No means of obtaining a Range or TextRange from the user's selection was found");return false}selProto.refresh=function(checkForChanges){var oldRanges=checkForChanges?this._ranges.slice(0):null;refreshSelection(this);if(checkForChanges){var i=oldRanges.length;if(i!=this._ranges.length){return false}while(i--){if(!DomRange.rangesEqual(oldRanges[i],this._ranges[i])){return false}}return true}};var removeRangeManually=function(sel,range){var ranges=sel.getAllRanges(),removed=false;sel.removeAllRanges();for(var i=0,len=ranges.length;i<len;++i){if(removed||range!==ranges[i]){sel.addRange(ranges[i])}else{removed=true}}if(!sel.rangeCount){updateEmptySelection(sel)}};if(implementsControlRange){selProto.removeRange=function(range){if(this.docSelection.type==CONTROL){var controlRange=this.docSelection.createRange();var rangeElement=getSingleElementFromRange(range);var doc=dom.getDocument(controlRange.item(0));var newControlRange=dom.getBody(doc).createControlRange();var el,removed=false;for(var i=0,len=controlRange.length;i<len;++i){el=controlRange.item(i);if(el!==rangeElement||removed){newControlRange.add(controlRange.item(i))}else{removed=true}}newControlRange.select();updateControlSelection(this)}else{removeRangeManually(this,range)}}}else{selProto.removeRange=function(range){removeRangeManually(this,range)}}var selectionIsBackwards;if(!useDocumentSelection&&selectionHasAnchorAndFocus&&api.features.implementsDomRange){selectionIsBackwards=function(sel){var backwards=false;if(sel.anchorNode){backwards=dom.comparePoints(sel.anchorNode,sel.anchorOffset,sel.focusNode,sel.focusOffset)==1}return backwards};selProto.isBackwards=function(){return selectionIsBackwards(this)}}else{selectionIsBackwards=selProto.isBackwards=function(){return false}}selProto.toString=function(){var rangeTexts=[];for(var i=0,len=this.rangeCount;i<len;++i){rangeTexts[i]=""+this._ranges[i]}return rangeTexts.join("")};function assertNodeInSameDocument(sel,node){if(sel.anchorNode&&dom.getDocument(sel.anchorNode)!==dom.getDocument(node)){throw new DOMException("WRONG_DOCUMENT_ERR")}}selProto.collapse=function(node,offset){assertNodeInSameDocument(this,node);var range=api.createRange(dom.getDocument(node));range.collapseToPoint(node,offset);this.removeAllRanges();this.addRange(range);this.isCollapsed=true};selProto.collapseToStart=function(){if(this.rangeCount){var range=this._ranges[0];this.collapse(range.startContainer,range.startOffset)}else{throw new DOMException("INVALID_STATE_ERR")}};selProto.collapseToEnd=function(){if(this.rangeCount){var range=this._ranges[this.rangeCount-1];this.collapse(range.endContainer,range.endOffset)}else{throw new DOMException("INVALID_STATE_ERR")}};selProto.selectAllChildren=function(node){assertNodeInSameDocument(this,node);var range=api.createRange(dom.getDocument(node));range.selectNodeContents(node);this.removeAllRanges();this.addRange(range)};selProto.deleteFromDocument=function(){if(implementsControlRange&&implementsDocSelection&&this.docSelection.type==CONTROL){var controlRange=this.docSelection.createRange();var element;while(controlRange.length){element=controlRange.item(0);controlRange.remove(element);element.parentNode.removeChild(element)}this.refresh()}else if(this.rangeCount){var ranges=this.getAllRanges();this.removeAllRanges();for(var i=0,len=ranges.length;i<len;++i){ranges[i].deleteContents()}this.addRange(ranges[len-1])}};selProto.getAllRanges=function(){return this._ranges.slice(0)};selProto.setSingleRange=function(range){this.setRanges([range])};selProto.containsNode=function(node,allowPartial){for(var i=0,len=this._ranges.length;i<len;++i){if(this._ranges[i].containsNode(node,allowPartial)){return true}}return false};selProto.toHtml=function(){var html="";if(this.rangeCount){var container=DomRange.getRangeDocument(this._ranges[0]).createElement("div");for(var i=0,len=this._ranges.length;i<len;++i){container.appendChild(this._ranges[i].cloneContents())}html=container.innerHTML}return html};function inspect(sel){var rangeInspects=[];var anchor=new DomPosition(sel.anchorNode,sel.anchorOffset);var focus=new DomPosition(sel.focusNode,sel.focusOffset);var name=typeof sel.getName=="function"?sel.getName():"Selection";if(typeof sel.rangeCount!="undefined"){for(var i=0,len=sel.rangeCount;i<len;++i){rangeInspects[i]=DomRange.inspect(sel.getRangeAt(i))}}return"["+name+"(Ranges: "+rangeInspects.join(", ")+")(anchor: "+anchor.inspect()+", focus: "+focus.inspect()+"]"}selProto.getName=function(){return"WrappedSelection"};selProto.inspect=function(){return inspect(this)};selProto.detach=function(){this.win[windowPropertyName]=null;this.win=this.anchorNode=this.focusNode=null};WrappedSelection.inspect=inspect;api.Selection=WrappedSelection;api.selectionPrototype=selProto;api.addCreateMissingNativeApiListener(function(win){if(typeof win.getSelection=="undefined"){win.getSelection=function(){return api.getSelection(this)}}win=null})});rangy.createModule("SaveRestore",function(api,module){api.requireModules(["DomUtil","DomRange","WrappedRange"]);var dom=api.dom;var markerTextChar="﻿";function gEBI(id,doc){return(doc||document).getElementById(id)}function insertRangeBoundaryMarker(range,atStart){var markerId="selectionBoundary_"+ +new Date+"_"+(""+Math.random()).slice(2);var markerEl;var doc=dom.getDocument(range.startContainer);var boundaryRange=range.cloneRange();boundaryRange.collapse(atStart);markerEl=doc.createElement("span");markerEl.id=markerId;markerEl.style.lineHeight="0";markerEl.style.display="none";markerEl.className="rangySelectionBoundary";markerEl.appendChild(doc.createTextNode(markerTextChar));boundaryRange.insertNode(markerEl);boundaryRange.detach();return markerEl}function setRangeBoundary(doc,range,markerId,atStart){var markerEl=gEBI(markerId,doc);if(markerEl){range[atStart?"setStartBefore":"setEndBefore"](markerEl);markerEl.parentNode.removeChild(markerEl)}else{module.warn("Marker element has been removed. Cannot restore selection.")}}function compareRanges(r1,r2){return r2.compareBoundaryPoints(r1.START_TO_START,r1)}function saveSelection(win){win=win||window;var doc=win.document;if(!api.isSelectionValid(win)){module.warn("Cannot save selection. This usually happens when the selection is collapsed and the selection document has lost focus.");return}var sel=api.getSelection(win);var ranges=sel.getAllRanges();var rangeInfos=[],startEl,endEl,range;ranges.sort(compareRanges);for(var i=0,len=ranges.length;i<len;++i){range=ranges[i];if(range.collapsed){endEl=insertRangeBoundaryMarker(range,false);rangeInfos.push({markerId:endEl.id,collapsed:true})}else{endEl=insertRangeBoundaryMarker(range,false);startEl=insertRangeBoundaryMarker(range,true);rangeInfos[i]={startMarkerId:startEl.id,endMarkerId:endEl.id,collapsed:false,backwards:ranges.length==1&&sel.isBackwards()}}}for(i=len-1;i>=0;--i){range=ranges[i];if(range.collapsed){range.collapseBefore(gEBI(rangeInfos[i].markerId,doc))}else{range.setEndBefore(gEBI(rangeInfos[i].endMarkerId,doc));range.setStartAfter(gEBI(rangeInfos[i].startMarkerId,doc))}}sel.setRanges(ranges);return{win:win,doc:doc,rangeInfos:rangeInfos,restored:false}}function restoreSelection(savedSelection,preserveDirection){if(!savedSelection.restored){var rangeInfos=savedSelection.rangeInfos;var sel=api.getSelection(savedSelection.win);var ranges=[];for(var len=rangeInfos.length,i=len-1,rangeInfo,range;i>=0;--i){rangeInfo=rangeInfos[i];range=api.createRange(savedSelection.doc);if(rangeInfo.collapsed){var markerEl=gEBI(rangeInfo.markerId,savedSelection.doc);if(markerEl){markerEl.style.display="inline";var previousNode=markerEl.previousSibling;if(previousNode&&previousNode.nodeType==3){markerEl.parentNode.removeChild(markerEl);range.collapseToPoint(previousNode,previousNode.length)}else{range.collapseBefore(markerEl);markerEl.parentNode.removeChild(markerEl)}}else{module.warn("Marker element has been removed. Cannot restore selection.")}}else{setRangeBoundary(savedSelection.doc,range,rangeInfo.startMarkerId,true);setRangeBoundary(savedSelection.doc,range,rangeInfo.endMarkerId,false)}if(len==1){range.normalizeBoundaries()}ranges[i]=range}if(len==1&&preserveDirection&&api.features.selectionHasExtend&&rangeInfos[0].backwards){sel.removeAllRanges();sel.addRange(ranges[0],true)}else{sel.setRanges(ranges)}savedSelection.restored=true}}function removeMarkerElement(doc,markerId){var markerEl=gEBI(markerId,doc);if(markerEl){markerEl.parentNode.removeChild(markerEl)}}function removeMarkers(savedSelection){var rangeInfos=savedSelection.rangeInfos;for(var i=0,len=rangeInfos.length,rangeInfo;i<len;++i){rangeInfo=rangeInfos[i];if(rangeInfo.collapsed){removeMarkerElement(savedSelection.doc,rangeInfo.markerId)}else{removeMarkerElement(savedSelection.doc,rangeInfo.startMarkerId);removeMarkerElement(savedSelection.doc,rangeInfo.endMarkerId)}}}api.saveSelection=saveSelection;api.restoreSelection=restoreSelection;api.removeMarkerElement=removeMarkerElement;api.removeMarkers=removeMarkers});WYMeditor.editor.prototype.init=function(){var WymClass=false,SaxListener,prop,h,iframeHtml,boxHtml,aTools,sTools,oTool,sTool,i,aClasses,sClasses,oClass,sClass,aContainers,sContainers,sContainer,oContainer;if(jQuery.browser.msie){WymClass=new WYMeditor.WymClassExplorer(this)}else if(jQuery.browser.mozilla){WymClass=new WYMeditor.WymClassMozilla(this)}else if(jQuery.browser.opera){WymClass=new WYMeditor.WymClassOpera(this)}else if(jQuery.browser.safari||jQuery.browser.webkit||jQuery.browser.chrome){WymClass=new WYMeditor.WymClassSafari(this)}if(WymClass===false){return}if(jQuery.isFunction(this._options.preInit)){this._options.preInit(this)}this.parser=null;this.helper=null;SaxListener=new WYMeditor.XhtmlSaxListener;this.parser=new WYMeditor.XhtmlParser(SaxListener);if(this._options.styles||this._options.stylesheet){this.configureEditorUsingRawCss()}this.helper=new WYMeditor.XmlHelper;for(prop in WymClass){this[prop]=WymClass[prop]}this._box=jQuery(this._element).hide().after(this._options.boxHtml).next().addClass("wym_box_"+this._index);if(jQuery.isFunction(jQuery.fn.data)){jQuery.data(this._box.get(0),WYMeditor.WYM_INDEX,this._index);jQuery.data(this._element.get(0),WYMeditor.WYM_INDEX,this._index)}h=WYMeditor.Helper;iframeHtml=this._options.iframeHtml;iframeHtml=h.replaceAll(iframeHtml,WYMeditor.INDEX,this._index);iframeHtml=h.replaceAll(iframeHtml,WYMeditor.IFRAME_BASE_PATH,this._options.iframeBasePath);boxHtml=jQuery(this._box).html();boxHtml=h.replaceAll(boxHtml,WYMeditor.LOGO,this._options.logoHtml);boxHtml=h.replaceAll(boxHtml,WYMeditor.TOOLS,this._options.toolsHtml);boxHtml=h.replaceAll(boxHtml,WYMeditor.CONTAINERS,this._options.containersHtml);boxHtml=h.replaceAll(boxHtml,WYMeditor.CLASSES,this._options.classesHtml);boxHtml=h.replaceAll(boxHtml,WYMeditor.HTML,this._options.htmlHtml);boxHtml=h.replaceAll(boxHtml,WYMeditor.IFRAME,iframeHtml);boxHtml=h.replaceAll(boxHtml,WYMeditor.STATUS,this._options.statusHtml);aTools=eval(this._options.toolsItems);sTools="";for(i=0;i<aTools.length;i+=1){oTool=aTools[i];sTool="";if(oTool.name&&oTool.title){sTool=this._options.toolsItemHtml}sTool=h.replaceAll(sTool,WYMeditor.TOOL_NAME,oTool.name);sTool=h.replaceAll(sTool,WYMeditor.TOOL_TITLE,this._options.stringDelimiterLeft+oTool.title+this._options.stringDelimiterRight);sTool=h.replaceAll(sTool,WYMeditor.TOOL_CLASS,oTool.css);sTools+=sTool}boxHtml=h.replaceAll(boxHtml,WYMeditor.TOOLS_ITEMS,sTools);aClasses=eval(this._options.classesItems);sClasses="";for(i=0;i<aClasses.length;i+=1){oClass=aClasses[i];sClass="";if(oClass.name&&oClass.title){sClass=this._options.classesItemHtml}sClass=h.replaceAll(sClass,WYMeditor.CLASS_NAME,oClass.name);sClass=h.replaceAll(sClass,WYMeditor.CLASS_TITLE,oClass.title);sClasses+=sClass}boxHtml=h.replaceAll(boxHtml,WYMeditor.CLASSES_ITEMS,sClasses);aContainers=eval(this._options.containersItems);sContainers="";for(i=0;i<aContainers.length;i+=1){oContainer=aContainers[i];sContainer="";if(oContainer.name&&oContainer.title){sContainer=this._options.containersItemHtml}sContainer=h.replaceAll(sContainer,WYMeditor.CONTAINER_NAME,oContainer.name);sContainer=h.replaceAll(sContainer,WYMeditor.CONTAINER_TITLE,this._options.stringDelimiterLeft+oContainer.title+this._options.stringDelimiterRight);sContainer=h.replaceAll(sContainer,WYMeditor.CONTAINER_CLASS,oContainer.css);sContainers+=sContainer}boxHtml=h.replaceAll(boxHtml,WYMeditor.CONTAINERS_ITEMS,sContainers);boxHtml=this.replaceStrings(boxHtml);jQuery(this._box).html(boxHtml);jQuery(this._box).find(this._options.htmlSelector).hide();this.documentStructureManager=new WYMeditor.DocumentStructureManager(this,this._options.structureRules.defaultRootContainer);this.loadSkin()};WYMeditor.editor.prototype.bindEvents=function(){var wym=this,$html_val;jQuery(this._box).find(this._options.toolSelector).click(function(){wym._iframe.contentWindow.focus();wym.exec(jQuery(this).attr(WYMeditor.NAME));return false});jQuery(this._box).find(this._options.containerSelector).click(function(){wym.container(jQuery(this).attr(WYMeditor.NAME));return false});$html_val=jQuery(this._box).find(this._options.htmlValSelector);$html_val.keyup(function(){jQuery(wym._doc.body).html(jQuery(this).val())});$html_val.focus(function(){jQuery(this).toggleClass("hasfocus")});$html_val.blur(function(){jQuery(this).toggleClass("hasfocus")});jQuery(this._box).find(this._options.classSelector).click(function(){var aClasses=eval(wym._options.classesItems),sName=jQuery(this).attr(WYMeditor.NAME),oClass=WYMeditor.Helper.findByName(aClasses,sName),jqexpr;if(oClass){jqexpr=oClass.expr;wym.toggleClass(sName,jqexpr)}wym._iframe.contentWindow.focus();return false});jQuery(this._options.updateSelector).bind(this._options.updateEvent,function(){wym.update()})};WYMeditor.editor.prototype.ready=function(){return this._doc!==null};WYMeditor.editor.prototype.box=function(){return this._box};WYMeditor.editor.prototype._html=function(html){if(typeof html==="string"){jQuery(this._doc.body).html(html);this.update()}else{return jQuery(this._doc.body).html()}};WYMeditor.editor.prototype.html=function(html){WYMeditor.console.warn("The function WYMeditor.editor.html() is deprecated. "+"Use either WYMeditor.editor.xhtml() or "+"WYMeditor.editor._html() instead.");if(typeof html==="string"){this._html(html)}else{return this._html()}};WYMeditor.editor.prototype.xhtml=function(){return this.parser.parse(this._html())};WYMeditor.editor.prototype.exec=function(cmd){var container,custom_run,_this=this;switch(cmd){case WYMeditor.CREATE_LINK:container=this.container();if(container||this._selected_image){this.dialog(WYMeditor.DIALOG_LINK)}break;case WYMeditor.INSERT_IMAGE:this.dialog(WYMeditor.DIALOG_IMAGE);break;case WYMeditor.INSERT_TABLE:this.dialog(WYMeditor.DIALOG_TABLE);break;
case WYMeditor.PASTE:this.dialog(WYMeditor.DIALOG_PASTE);break;case WYMeditor.TOGGLE_HTML:this.update();this.toggleHtml();break;case WYMeditor.PREVIEW:this.dialog(WYMeditor.PREVIEW,this._options.dialogFeaturesPreview);break;case WYMeditor.INSERT_ORDEREDLIST:this.insertOrderedlist();break;case WYMeditor.INSERT_UNORDEREDLIST:this.insertUnorderedlist();break;case WYMeditor.INDENT:this.indent();break;case WYMeditor.OUTDENT:this.outdent();break;default:custom_run=false;jQuery.each(this._options.customCommands,function(){if(cmd===this.name){custom_run=true;this.run.apply(_this);return false}});if(!custom_run){this._exec(cmd)}break}};WYMeditor.editor.prototype.selection=function(){if(window.rangy&&!rangy.initialized){rangy.init()}var iframe=this._iframe,sel=rangy.getIframeSelection(iframe);return sel};WYMeditor.editor.prototype.selected=function(){var sel=this.selection(),node=sel.focusNode,caretPos;if(node){if(jQuery.browser.msie){var isBodyTag=node.tagName&&node.tagName.toLowerCase()==="body";var isTextNode=node.nodeName==="#text";if(sel.isCollapsed&&(isBodyTag||isTextNode)){caretPos=this._iframe.contentWindow.document.caretPos;if(caretPos&&caretPos.parentElement){node=caretPos.parentElement()}}}if(node.nodeName==="#text"){return node.parentNode}else{return node}}else{return null}};WYMeditor.editor.prototype.selection_collapsed=function(){var sel=this.selection(),collapsed=false;jQuery.each(sel.getAllRanges(),function(){if(this.collapsed){collapsed=true;return false}});return collapsed};WYMeditor.editor.prototype.selected_contains=function(selector){var sel=this.selection(),matches=[];jQuery.each(sel.getAllRanges(),function(){jQuery.each(this.getNodes(),function(){if(jQuery(this).is(selector)){matches.push(this)}})});return matches};WYMeditor.editor.prototype.selected_parents_contains=function(selector){var $matches=jQuery([]),$selected=jQuery(this.selected());if($selected.is(selector)){$matches=$matches.add($selected)}$matches=$matches.add($selected.parents(selector));return $matches};WYMeditor.editor.prototype.container=function(sType){if(typeof sType==="undefined"){return this.selected()}var container=null,validContainers,newNode,blockquote,nodes,lgt,firstNode,x;if(sType.toLowerCase()===WYMeditor.TH){container=this.container();switch(container.tagName.toLowerCase()){case WYMeditor.TD:case WYMeditor.TH:break;default:aTypes=[WYMeditor.TD,WYMeditor.TH];container=this.findUp(this.container(),aTypes);break}if(container!==null){sType=WYMeditor.TD;if(container.tagName.toLowerCase()===WYMeditor.TD){sType=WYMeditor.TH}this.switchTo(container,sType,false);this.update()}}else{aTypes=[WYMeditor.P,WYMeditor.DIV,WYMeditor.H1,WYMeditor.H2,WYMeditor.H3,WYMeditor.H4,WYMeditor.H5,WYMeditor.H6,WYMeditor.PRE,WYMeditor.BLOCKQUOTE];container=this.findUp(this.container(),aTypes);if(container){if(sType.toLowerCase()===WYMeditor.BLOCKQUOTE){blockquote=this.findUp(this.container(),WYMeditor.BLOCKQUOTE);if(blockquote===null){newNode=this._doc.createElement(sType);container.parentNode.insertBefore(newNode,container);newNode.appendChild(container);this.setFocusToNode(newNode.firstChild)}else{nodes=blockquote.childNodes;lgt=nodes.length;if(lgt>0){firstNode=nodes.item(0)}for(x=0;x<lgt;x+=1){blockquote.parentNode.insertBefore(nodes.item(0),blockquote)}blockquote.parentNode.removeChild(blockquote);if(firstNode){this.setFocusToNode(firstNode)}}}else{this.switchTo(container,sType)}this.update()}}return false};WYMeditor.editor.prototype.isForbiddenMainContainer=function(tagName){return jQuery.inArray(tagName.toLowerCase(),WYMeditor.FORBIDDEN_MAIN_CONTAINERS)>-1};WYMeditor.editor.prototype.keyCanCreateBlockElement=function(keyCode){return jQuery.inArray(keyCode,WYMeditor.POTENTIAL_BLOCK_ELEMENT_CREATION_KEYS)>-1};WYMeditor.editor.prototype.toggleClass=function(sClass,jqexpr){var container=null;if(this._selected_image){container=this._selected_image}else{container=jQuery(this.selected())}container=jQuery(container).parentsOrSelf(jqexpr);jQuery(container).toggleClass(sClass);if(!jQuery(container).attr(WYMeditor.CLASS)){jQuery(container).removeAttr(this._class)}};WYMeditor.editor.prototype.findUp=function(node,filter){if(typeof node==="undefined"||node===null){return null}if(node.nodeName==="#text"){node=node.parentNode}var tagname=node.tagName.toLowerCase(),bFound,i;if(typeof filter===WYMeditor.STRING){while(tagname!==filter&&tagname!==WYMeditor.BODY){node=node.parentNode;tagname=node.tagName.toLowerCase()}}else{bFound=false;while(!bFound&&tagname!==WYMeditor.BODY){for(i=0;i<filter.length;i+=1){if(tagname===filter[i]){bFound=true;break}}if(!bFound){node=node.parentNode;if(node===null){return null}tagname=node.tagName.toLowerCase()}}}if(tagname===WYMeditor.BODY){return null}return node};WYMeditor.editor.prototype.switchTo=function(node,sType,stripAttrs){var newNode=this._doc.createElement(sType),html=jQuery(node).html(),attrs=node.attributes,i;if(!stripAttrs){for(i=0;i<attrs.length;++i){newNode.setAttribute(attrs.item(i).nodeName,attrs.item(i).nodeValue)}}newNode.innerHTML=html;node.parentNode.replaceChild(newNode,node);this.setFocusToNode(newNode)};WYMeditor.editor.prototype.replaceStrings=function(sVal){var key;if(!WYMeditor.STRINGS[this._options.lang]){try{eval(jQuery.ajax({url:this._options.langPath+this._options.lang+".js",async:false}).responseText)}catch(e){WYMeditor.console.error("WYMeditor: error while parsing language file.");return sVal}}for(key in WYMeditor.STRINGS[this._options.lang]){if(WYMeditor.STRINGS[this._options.lang].hasOwnProperty(key)){sVal=WYMeditor.Helper.replaceAll(sVal,this._options.stringDelimiterLeft+key+this._options.stringDelimiterRight,WYMeditor.STRINGS[this._options.lang][key])}}return sVal};WYMeditor.editor.prototype.encloseString=function(sVal){return this._options.stringDelimiterLeft+sVal+this._options.stringDelimiterRight};WYMeditor.editor.prototype.status=function(sMessage){jQuery(this._box).find(this._options.statusSelector).html(sMessage)};WYMeditor.editor.prototype.update=function(){var html;html=this.xhtml();jQuery(this._element).val(html);jQuery(this._box).find(this._options.htmlValSelector).not(".hasfocus").val(html);this.fixBodyHtml()};WYMeditor.editor.prototype.fixBodyHtml=function(){this.spaceBlockingElements();this.fixDoubleBr()};WYMeditor.editor.prototype.spaceBlockingElements=function(){var blockingSelector=WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION.join(", "),$body=jQuery(this._doc).find("body.wym_iframe"),children=$body.children(),placeholderNode,$firstChild,$lastChild,blockSepSelector,blockInListSepSelector,$blockInList;if(jQuery.browser.mozilla){placeholderNode="<br "+'class="'+WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS+" "+WYMeditor.EDITOR_ONLY_CLASS+'" '+'_moz_editor_bogus_node="TRUE" '+'_moz_dirty=""'+"/>"}else{placeholderNode="<br "+'class="'+WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS+" "+WYMeditor.EDITOR_ONLY_CLASS+'"'+"/>"}if(children.length>0){$firstChild=jQuery(children[0]);$lastChild=jQuery(children[children.length-1]);if($firstChild.is(blockingSelector)){$firstChild.before(placeholderNode)}if($lastChild.is(blockingSelector)&&!(jQuery.browser.msie&&jQuery.browser.version<"7.0")){$lastChild.after(placeholderNode)}}blockSepSelector=this._getBlockSepSelector();$body.find(blockSepSelector).before(placeholderNode);blockInListSepSelector=this._getBlockInListSepSelector();$blockInList=$body.find(blockInListSepSelector);$blockInList.each(function(){var $block=jQuery(this);if(!$block.next(blockingSelector).length&&!$block.next(WYMeditor.BR).length){$block.after(placeholderNode)}})};WYMeditor.editor.prototype._getBlockSepSelector=function(){if(typeof this._blockSpacersSel!=="undefined"){return this._blockSpacersSel}var wym=this,blockCombo=[],containersBlockingNav=WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION,containersNotBlockingNav;containersNotBlockingNav=jQuery.grep(wym.documentStructureManager.structureRules.validRootContainers,function(item){return jQuery.inArray(item,containersBlockingNav)===-1});jQuery.each(containersBlockingNav,function(indexO,elementO){jQuery.each(containersBlockingNav,function(indexI,elementI){blockCombo.push(elementO+" + "+elementI)})});jQuery.each(containersBlockingNav,function(indexO,elementO){jQuery.each(containersNotBlockingNav,function(indexI,elementI){blockCombo.push(elementO+" + "+elementI);blockCombo.push(elementI+" + "+elementO)})});this._blockSpacersSel=blockCombo.join(", ");return this._blockSpacersSel};WYMeditor.editor.prototype._getBlockInListSepSelector=function(){if(typeof this._blockInListSpacersSel!=="undefined"){return this._blockInListSpacersSel}var blockCombo=[];jQuery.each(WYMeditor.LIST_TYPE_ELEMENTS,function(indexO,elementO){jQuery.each(WYMeditor.BLOCKING_ELEMENTS,function(indexI,elementI){blockCombo.push(elementO+" "+elementI)})});this._blockInListSpacersSel=blockCombo.join(", ");return this._blockInListSpacersSel};WYMeditor.editor.prototype.fixDoubleBr=function(){var $body=jQuery(this._doc).find("body.wym_iframe"),$last_br,blockingSelector=WYMeditor.BLOCKING_ELEMENTS.join(", ");$body.children("br + br").filter(":not(pre br)").remove();$body.find("p + br").next("p").prev("br").remove();$last_br=$body.find("p + br").slice(-1);if($last_br.length>0){if($last_br.next().length===0){$last_br.remove()}}};WYMeditor.editor.prototype.dialog=function(dialogType,dialogFeatures,bodyHtml){var features=dialogFeatures||this._wym._options.dialogFeatures,wDialog=window.open("","dialog",features),sBodyHtml,h=WYMeditor.Helper,dialogHtml,doc;if(wDialog){sBodyHtml="";switch(dialogType){case WYMeditor.DIALOG_LINK:sBodyHtml=this._options.dialogLinkHtml;break;case WYMeditor.DIALOG_IMAGE:sBodyHtml=this._options.dialogImageHtml;break;case WYMeditor.DIALOG_TABLE:sBodyHtml=this._options.dialogTableHtml;break;case WYMeditor.DIALOG_PASTE:sBodyHtml=this._options.dialogPasteHtml;break;case WYMeditor.PREVIEW:sBodyHtml=this._options.dialogPreviewHtml;break;default:sBodyHtml=bodyHtml;break}dialogHtml=this._options.dialogHtml;dialogHtml=h.replaceAll(dialogHtml,WYMeditor.BASE_PATH,this._options.basePath);dialogHtml=h.replaceAll(dialogHtml,WYMeditor.DIRECTION,this._options.direction);dialogHtml=h.replaceAll(dialogHtml,WYMeditor.CSS_PATH,this._options.skinPath+WYMeditor.SKINS_DEFAULT_CSS);dialogHtml=h.replaceAll(dialogHtml,WYMeditor.WYM_PATH,this._options.wymPath);dialogHtml=h.replaceAll(dialogHtml,WYMeditor.JQUERY_PATH,this._options.jQueryPath);dialogHtml=h.replaceAll(dialogHtml,WYMeditor.DIALOG_TITLE,this.encloseString(dialogType));dialogHtml=h.replaceAll(dialogHtml,WYMeditor.DIALOG_BODY,sBodyHtml);dialogHtml=h.replaceAll(dialogHtml,WYMeditor.INDEX,this._index);dialogHtml=this.replaceStrings(dialogHtml);doc=wDialog.document;doc.write(dialogHtml);doc.close()}};WYMeditor.editor.prototype.toggleHtml=function(){jQuery(this._box).find(this._options.htmlSelector).toggle()};WYMeditor.editor.prototype.uniqueStamp=function(){var now=new Date;return"wym-"+now.getTime()};WYMeditor.editor.prototype._handleMultilineBlockContainerPaste=function(wym,$container,range,paragraphStrings){var i,blockSplitter,leftSide,rightSide,rangeNodeComparison,$splitRightParagraph,firstParagraphString,firstParagraphHtml,blockParent,blockParentType;$insertAfter=jQuery(blockParent);blockSplitter="p";if($container.is("li")){blockSplitter="li"}range.splitBoundaries();blockParent=wym.findUp(range.startContainer,["p","h1","h2","h3","h4","h5","h6","li"]);blockParentType=blockParent.tagName;leftSide=[];rightSide=[];jQuery(blockParent).contents().each(function(index,element){rangeNodeComparison=range.compareNode(element);if(rangeNodeComparison===range.NODE_BEFORE||rangeNodeComparison===range.NODE_BEFORE_AND_AFTER&&range.startOffset===range.startContainer.length){leftSide.push(element)}else{rightSide.push(element)}});for(i=0;i<leftSide.length;i++){jQuery(leftSide[i]).remove()}for(i=0;i<rightSide.length;i++){jQuery(rightSide[i]).remove()}if(leftSide.length>0){jQuery(blockParent).prepend(leftSide)}if(rightSide.length>0){$splitRightParagraph=jQuery("<"+blockParentType+">"+"</"+blockParentType+">",wym._doc);$splitRightParagraph.insertAfter(jQuery(blockParent));$splitRightParagraph.append(rightSide)}firstParagraphString=paragraphStrings.splice(0,1)[0];firstParagraphHtml=firstParagraphString.split(WYMeditor.NEWLINE).join("<br />");jQuery(blockParent).html(jQuery(blockParent).html()+firstParagraphHtml);$insertAfter=jQuery(blockParent);for(i=0;i<paragraphStrings.length;i++){html="<"+blockSplitter+">"+paragraphStrings[i].split(WYMeditor.NEWLINE).join("<br />")+"</"+blockSplitter+">";$insertAfter=jQuery(html,wym._doc).insertAfter($insertAfter)}};WYMeditor.editor.prototype.paste=function(str){var container=this.selected(),$container,html="",paragraphs,focusNode,i,l,isSingleLine=false,sel,textNode,wym,range,insertionNodes;wym=this;sel=rangy.getIframeSelection(wym._iframe);range=sel.getRangeAt(0);$container=jQuery(container);range.collapse(true);paragraphStrings=str.split(new RegExp(WYMeditor.NEWLINE+"{2,}","g"));if(paragraphStrings.length===1){isSingleLine=true}if(typeof container==="undefined"||container&&container.tagName.toLowerCase()===WYMeditor.BODY){if(isSingleLine){paragraphs=jQuery("<p>"+paragraphStrings[0]+"</p>",this._doc).appendTo(this._doc.body)}else{blockSplitter="p";for(i=paragraphStrings.length-1;i>=0;i-=1){html="<"+blockSplitter+">"+paragraphStrings[i].split(WYMeditor.NEWLINE).join("<br />")+"</"+blockSplitter+">";insertionNodes=jQuery(html,wym._doc);for(j=insertionNodes.length-1;j>=0;j--){range.insertNode(insertionNodes[j])}}}}else{if(isSingleLine||$container.is("pre")){textNode=this._doc.createTextNode(str);range.insertNode(textNode)}else if($container.is("p,h1,h2,h3,h4,h5,h6,li")){wym._handleMultilineBlockContainerPaste(wym,$container,range,paragraphStrings)}else{textNodesToInsert=str.split(WYMeditor.NEWLINE);for(i=textNodesToInsert.length-1;i>=0;i-=1){textNode=this._doc.createTextNode(textNodesToInsert[i]);range.insertNode(textNode);if(i>0){range.insertNode(jQuery("<br />",wym._doc).get(0))}}}}};WYMeditor.editor.prototype.insert=function(html){var selection=this._iframe.contentWindow.getSelection(),range,node;if(selection.focusNode!==null){range=selection.getRangeAt(0);node=range.createContextualFragment(html);range.deleteContents();range.insertNode(node)}else{this.paste(html)}};WYMeditor.editor.prototype.wrap=function(left,right){this.insert(left+this._iframe.contentWindow.getSelection().toString()+right)};WYMeditor.editor.prototype.unwrap=function(){this.insert(this._iframe.contentWindow.getSelection().toString())};WYMeditor.editor.prototype.setFocusToNode=function(node,toStart){var range=rangy.createRange(this._doc),selection=rangy.getIframeSelection(this._iframe);toStart=toStart||false;range.selectNodeContents(node);range.collapse(toStart);selection.setSingleRange(range)};WYMeditor.editor.prototype.addCssRules=function(doc,aCss){var styles=doc.styleSheets[0],i,oCss;if(styles){for(i=0;i<aCss.length;i+=1){oCss=aCss[i];if(oCss.name&&oCss.css){this.addCssRule(styles,oCss)}}}};WYMeditor.editor.prototype.splitListItemContents=function($listItem){var $allContents,i,elmnt,hitSublist=false,splitObject={itemContents:[],sublistContents:[]};$allContents=$listItem.contents();for(i=0;i<$allContents.length;i++){elmnt=$allContents.get(i);if(hitSublist||jQuery(elmnt).is("ol,ul")){hitSublist=true;splitObject.sublistContents.push(elmnt)}else{splitObject.itemContents.push(elmnt)}}return splitObject};WYMeditor.editor.prototype.joinAdjacentLists=function(listOne,listTwo){var $listTwoContents;if(typeof listOne==="undefined"||typeof listTwo==="undefined"){return}if(listOne.nextSibling!==listTwo||listOne.tagName.toLowerCase()!==listTwo.tagName.toLowerCase()){return}$listTwoContents=jQuery(listTwo).contents();$listTwoContents.unwrap();$listTwoContents.detach();jQuery(listOne).append($listTwoContents)};WYMeditor.editor.prototype._indentSingleItem=function(listItem){var wym=this,$liToIndent,listType,spacerHtml,containerHtml,splitContent,$itemContents,$sublistContents,$prevLi,$prevSublist,$firstSublist,$spacer,$spacerContents;$liToIndent=jQuery(listItem);listType=$liToIndent.parent()[0].tagName.toLowerCase();splitContent=wym.splitListItemContents($liToIndent);$sublistContents=jQuery(splitContent.sublistContents);$itemContents=jQuery(splitContent.itemContents);$prevLi=$liToIndent.prev().filter("li");if($prevLi.length===0){spacerHtml='<li class="spacer_li"></li>';$liToIndent.before(spacerHtml);$prevLi=$liToIndent.prev()}$prevSublist=$prevLi.contents().last().filter("ol,ul");if($prevSublist.length>0){$prevSublist.append($liToIndent);$sublistContents.detach();$prevLi.append($sublistContents);$firstSublist=$sublistContents.first();wym.joinAdjacentLists($prevSublist.get(0),$firstSublist.get(0))}else{if($sublistContents.length>0){$sublistContents.detach();$prevLi.append($sublistContents);$prevSublist=$sublistContents.first()}else{containerHtml="<"+listType+"></"+listType+">";$prevLi.append(containerHtml);$prevSublist=$prevLi.contents().last()}$prevSublist.prepend($liToIndent)}if($liToIndent.next().is(".spacer_li")){$spacer=$liToIndent.next(".spacer_li");$spacerContents=$spacer.contents();$spacerContents.detach();$liToIndent.append($spacerContents);$spacer.remove()}};WYMeditor.editor.prototype._outdentSingleItem=function(listItem){var wym=this,$liToOutdent,listType,spacerListHtml,splitContent,$itemContents,$sublistContents,$parentLi,$parentList,$subsequentSiblingContent,$subsequentParentListSiblingContent,$sublist;$liToOutdent=jQuery(listItem);listType=$liToOutdent.parent()[0].tagName.toLowerCase();if(!$liToOutdent.parent().parent().is("ol,ul,li")){return}if(!$liToOutdent.parent().parent().is("li")){WYMeditor.console.log("Attempting to fix invalid list nesting before outdenting.");wym.correctInvalidListNesting(listItem)}splitContent=wym.splitListItemContents($liToOutdent);$sublistContents=jQuery(splitContent.sublistContents);$itemContents=jQuery(splitContent.itemContents);$parentLi=$liToOutdent.parent().parent("li");if($parentLi.length===0){WYMeditor.console.error("Invalid list. No parentLi found, so aborting outdent");return}$parentList=$liToOutdent.parent();$subsequentSiblingContent=$liToOutdent.nextAllContents();$subsequentParentListSiblingContent=$parentList.nextAllContents();$liToOutdent.detach();$parentLi.after($liToOutdent);if($sublistContents.length>0){spacerListHtml="<"+listType+">"+'<li class="spacer_li"></li>'+"</"+listType+">";$liToOutdent.append(spacerListHtml);$sublist=$liToOutdent.children().last();$sublistContents.detach();$sublist.children("li").append($sublistContents)}if($subsequentSiblingContent.length>0){if(typeof $sublist==="undefined"){spacerListHtml="<"+listType+"></"+listType+">";$liToOutdent.append(spacerListHtml);$sublist=$liToOutdent.children().last()}$subsequentSiblingContent.detach();$sublist.append($subsequentSiblingContent)}if($subsequentParentListSiblingContent.length>0){$subsequentParentListSiblingContent.detach();if($liToOutdent.contents().length>0&&$liToOutdent.contents().last()[0].nodeType===WYMeditor.NODE.TEXT&&$subsequentParentListSiblingContent[0].nodeType===WYMeditor.NODE.TEXT){$liToOutdent.append("<br />")}$liToOutdent.append($subsequentParentListSiblingContent)}if($parentList.contents().length===0){$parentList.remove()}if($parentLi.contents().length===0){$parentLi.remove()}};WYMeditor.editor.prototype.correctInvalidListNesting=function(listItem,alreadyCorrected){var currentNode=listItem,parentNode,tagName;if(typeof alreadyCorrected==="undefined"){alreadyCorrected=false}if(!currentNode){return alreadyCorrected}while(currentNode.parentNode){parentNode=currentNode.parentNode;if(parentNode.nodeType!==WYMeditor.NODE.ELEMENT){break}tagName=parentNode.tagName.toLowerCase();if(tagName!=="ol"&&tagName!=="ul"&&tagName!=="li"){break}currentNode=parentNode}if(jQuery(currentNode).is("li")){WYMeditor.console.log("Correcting orphaned root li before correcting invalid list nesting.");this._correctOrphanedListItem(currentNode);return this.correctInvalidListNesting(currentNode,true)}if(!jQuery(currentNode).is("ol,ul")){WYMeditor.console.error("Can't correct invalid list nesting. No root list found");return alreadyCorrected}return this._correctInvalidListNesting(currentNode,alreadyCorrected)};WYMeditor.editor.prototype._correctOrphanedListItem=function(listNode){var prevAdjacentLis,nextAdjacentLis,$adjacentLis=jQuery(),prevList,prevNode;prevAdjacentLis=jQuery(listNode).prevContentsUntil(":not(li)");nextAdjacentLis=jQuery(listNode).nextContentsUntil(":not(li)");$adjacentLis=$adjacentLis.add(prevAdjacentLis);$adjacentLis=$adjacentLis.add(listNode);$adjacentLis=$adjacentLis.add(nextAdjacentLis);prevNode=$adjacentLis[0].previousSibling;if(prevNode&&jQuery(prevNode).is("ol,ul")){prevList=prevNode}else{$adjacentLis.before("<ol></ol>");prevList=$adjacentLis.prev()[0]}jQuery(prevList).append($adjacentLis)};WYMeditor.editor.prototype._correctInvalidListNesting=function(listNode,alreadyCorrected){var rootNode=listNode,currentNode=listNode,wasCorrected=false,previousSibling,previousLi,$currentNode,tagName,ancestorNode,nodesToMove,targetLi,lastContentNode,spacerHtml='<li class="spacer_li"></li>';if(typeof alreadyCorrected!=="undefined"){wasCorrected=alreadyCorrected}while(currentNode){if(currentNode._wym_visited){currentNode._wym_visited=false;if(currentNode===rootNode){break}if(currentNode.previousSibling){currentNode=currentNode.previousSibling}else{currentNode=currentNode.parentNode}}else{if(currentNode!==rootNode&&!jQuery(currentNode).is("li")){ancestorNode=currentNode;while(ancestorNode.parentNode){ancestorNode=ancestorNode.parentNode;if(jQuery(ancestorNode).is("li")){break}if(ancestorNode.nodeType!==WYMeditor.NODE.ELEMENT){break}tagName=ancestorNode.tagName.toLowerCase();if(tagName==="ol"||tagName==="ul"){WYMeditor.console.log("Fixing orphaned list content");wasCorrected=true;nodesToMove=[currentNode];previousSibling=currentNode;targetLi=null;while(previousSibling.previousSibling){previousSibling=previousSibling.previousSibling;if(jQuery(previousSibling).is("li")){targetLi=previousSibling;break}nodesToMove.push(previousSibling)}nodesToMove.reverse();if(!targetLi&&nodesToMove.length===1){if(jQuery(currentNode.nextSibling).is("li")){targetLi=currentNode.nextSibling}}if(!targetLi){jQuery(nodesToMove[0]).before(spacerHtml);targetLi=jQuery(nodesToMove[0]).prev()[0]}lastContentNode=jQuery(targetLi).contents().last();if(lastContentNode.length===1&&lastContentNode[0].nodeType===WYMeditor.NODE.TEXT){if(nodesToMove[0].nodeType===WYMeditor.NODE.TEXT){jQuery(targetLi).append("<br />")}}jQuery(targetLi).append(jQuery(nodesToMove));break}}}if(currentNode.lastChild){currentNode._wym_visited=true;currentNode=currentNode.lastChild}else if(currentNode.previousSibling){currentNode=currentNode.previousSibling}else{currentNode=currentNode.parentNode}}}return wasCorrected};WYMeditor.editor.prototype.getCommonParentList=function(listItems){var firstLi,parentList,rootList;listItems=jQuery(listItems).filter("li");if(listItems.length===0){return null}firstLi=listItems[0];parentList=jQuery(firstLi).parent("ol,ul");if(parentList.length===0){return null}rootList=parentList[0];jQuery(listItems).each(function(index,elmnt){parentList=jQuery(elmnt).parent("ol,ul");if(parentList.length===0||parentList[0]!==rootList){return null}});return rootList};WYMeditor.editor.prototype._getSelectedListItems=function(sel){var wym=this,i,range,selectedLi,nodes=[],liNodes=[],containsNodeTextFilter,parentsToAdd,node,$node,$maybeParentLi;containsNodeTextFilter=function(testNode){var fullyContainsNodeText;if(rangy.dom.isCharacterDataNode(testNode)){return testNode}try{fullyContainsNodeText=range.containsNodeText(testNode)}catch(e){return true}if(fullyContainsNodeText===true){return true}};for(i=0;i<sel.rangeCount;i++){range=sel.getRangeAt(i);if(range.collapsed===true){selectedLi=wym.findUp(range.startContainer,"li");if(selectedLi){nodes=nodes.concat([selectedLi])}}else{nodes=nodes.concat(range.getNodes([],containsNodeTextFilter));parentsToAdd=[];for(j=0;j<nodes.length;j++){node=nodes[j];if(!jQuery(node).is("li,ol,ul")){while(node.parentNode){node=node.parentNode;if(jQuery(node).is("li")){parentsToAdd.push(node);break}}}}for(j=0;j<parentsToAdd.length;j++){if(jQuery.inArray(parentsToAdd[j],nodes)===-1){nodes.push(parentsToAdd[j])}}}}for(i=0;i<nodes.length;i++){if(nodes[i].nodeType===WYMeditor.NODE.ELEMENT&&nodes[i].tagName.toLowerCase()===WYMeditor.LI){liNodes.push(nodes[i])}}return liNodes};WYMeditor.editor.prototype.indent=function(){var wym=this._wym,sel=rangy.getIframeSelection(this._iframe),listItems,rootList,manipulationFunc;manipulationFunc=function(){var selectedBlock=wym.selected(),potentialListBlock=wym.findUp(selectedBlock,["ol","ul","li"]);return wym.correctInvalidListNesting(potentialListBlock)};if(wym.restoreSelectionAfterManipulation(manipulationFunc)){return true}sel=rangy.getIframeSelection(this._iframe);listItems=wym._getSelectedListItems(sel);if(listItems.length===0){return false}rootList=wym.getCommonParentList(listItems);if(rootList===null){return false}manipulationFunc=function(){var domChanged=false;for(i=0;i<listItems.length;i++){wym._indentSingleItem(listItems[i]);domChanged=true}return domChanged};return wym.restoreSelectionAfterManipulation(manipulationFunc)};WYMeditor.editor.prototype.outdent=function(){var wym=this._wym,sel=rangy.getIframeSelection(this._iframe),listItems,rootList,manipulationFunc;manipulationFunc=function(){var selectedBlock=wym.selected(),potentialListBlock=wym.findUp(selectedBlock,["ol","ul","li"]);return wym.correctInvalidListNesting(potentialListBlock)};if(wym.restoreSelectionAfterManipulation(manipulationFunc)){return true}sel=rangy.getIframeSelection(this._iframe);listItems=wym._getSelectedListItems(sel);if(listItems.length===0){return false}rootList=wym.getCommonParentList(listItems);if(rootList===null){return false}manipulationFunc=function(){var domChanged=false;for(i=0;i<listItems.length;i++){wym._outdentSingleItem(listItems[i]);domChanged=true}return domChanged};return wym.restoreSelectionAfterManipulation(manipulationFunc)};WYMeditor.editor.prototype.restoreSelectionAfterManipulation=function(manipulationFunc){var sel=rangy.getIframeSelection(this._iframe),savedSelection=rangy.saveSelection(rangy.dom.getIframeWindow(this._iframe)),changesMade=true;try{changesMade=manipulationFunc();if(changesMade){rangy.restoreSelection(savedSelection)}else{rangy.removeMarkers(savedSelection)}}catch(e){WYMeditor.console.error("Error during manipulation");WYMeditor.console.error(e);rangy.removeMarkers(savedSelection)}return changesMade};WYMeditor.editor.prototype.insertOrderedlist=function(){var wym=this,manipulationFunc;manipulationFunc=function(){var selectedBlock=wym.selected(),potentialListBlock=wym.findUp(selectedBlock,["ol","ul","li"]);return wym.correctInvalidListNesting(potentialListBlock)};if(wym.restoreSelectionAfterManipulation(manipulationFunc)){return true}manipulationFunc=function(){return wym._insertList("ol")};return wym.restoreSelectionAfterManipulation(manipulationFunc)};WYMeditor.editor.prototype.insertUnorderedlist=function(){var wym=this,manipulationFunc;manipulationFunc=function(){var selectedBlock=wym.selected(),potentialListBlock=wym.findUp(selectedBlock,["ol","ul","li"]);return wym.correctInvalidListNesting(potentialListBlock)};if(wym.restoreSelectionAfterManipulation(manipulationFunc)){return true}manipulationFunc=function(){return wym._insertList("ul")};return wym.restoreSelectionAfterManipulation(manipulationFunc)};WYMeditor.editor.prototype._insertList=function(listType){var wym=this._wym,sel=rangy.getIframeSelection(this._iframe),listItems,rootList,selectedBlock,potentialListBlock;listItems=wym._getSelectedListItems(sel);if(listItems.length!==0){rootList=wym.getCommonParentList(listItems);if(rootList){this._changeListType(rootList,listType);return true}else{return false}}selectedBlock=this.selected();potentialListBlock=this.findUp(selectedBlock,WYMeditor.POTENTIAL_LIST_ELEMENTS);if(potentialListBlock){this._convertToList(potentialListBlock,listType);return true}return false};WYMeditor.editor.prototype._changeListType=function(list,listType){return WYMeditor.changeNodeType(list,listType)};WYMeditor.editor.prototype._convertToList=function(blockElement,listType){var $blockElement=jQuery(blockElement),newListHtml,$newList;newListHtml="<"+listType+"><li></li></"+listType+">";if(this.findUp(blockElement,WYMeditor.MAIN_CONTAINERS)===blockElement){$blockElement.wrapInner(newListHtml);$newList=$blockElement.children();$newList.unwrap();return $newList.get(0)}$blockElement.wrapInner(newListHtml);$newList=$blockElement.children();return $newList.get(0)};WYMeditor.editor.prototype.insertTable=function(rows,columns,caption,summary){if(rows<=0||columns<=0){return}var table=this._doc.createElement(WYMeditor.TABLE),newRow=null,newCol=null,newCaption,x,y,container,selectedNode;newCaption=table.createCaption();newCaption.innerHTML=caption;for(x=0;x<rows;x+=1){newRow=table.insertRow(x);for(y=0;y<columns;y+=1){newRow.insertCell(y)}}if(summary!==""){jQuery(table).attr("summary",summary)}container=jQuery(this.findUp(this.container(),WYMeditor.POTENTIAL_TABLE_INSERT_ELEMENTS)).get(0);if(!container||!container.parentNode){jQuery(this._doc.body).append(table)}else if(jQuery.inArray(container.nodeName.toLowerCase(),WYMeditor.INLINE_TABLE_INSERTION_ELEMENTS)>-1){selectedNode=this.selection().focusNode;if(jQuery.inArray(selectedNode.nodeName.toLowerCase(),WYMeditor.SELECTABLE_TABLE_ELEMENTS)>-1||jQuery.inArray(selectedNode.parentNode.nodeName.toLowerCase(),WYMeditor.SELECTABLE_TABLE_ELEMENTS)>-1){while(selectedNode.nodeName.toLowerCase()!==WYMeditor.TABLE){selectedNode=selectedNode.parentNode}}if(selectedNode.nodeName.toLowerCase()===WYMeditor.LI){jQuery(selectedNode).append(table)}else{jQuery(selectedNode).after(table)}}else{jQuery(container).after(table)}this.afterInsertTable(table);this.fixBodyHtml();return table};WYMeditor.editor.prototype.afterInsertTable=function(table){};WYMeditor.editor.prototype.configureEditorUsingRawCss=function(){var CssParser=new WYMeditor.WymCssParser;if(this._options.stylesheet){CssParser.parse(jQuery.ajax({url:this._options.stylesheet,async:false}).responseText)}else{CssParser.parse(this._options.styles,false)}if(this._options.classesItems.length===0){this._options.classesItems=CssParser.css_settings.classesItems}if(this._options.editorStyles.length===0){this._options.editorStyles=CssParser.css_settings.editorStyles}if(this._options.dialogStyles.length===0){this._options.dialogStyles=CssParser.css_settings.dialogStyles}};WYMeditor.editor.prototype.listen=function(){var wym=this;jQuery(this._doc.body).bind("mousedown",function(e){wym.mousedown(e)})};WYMeditor.editor.prototype.mousedown=function(evt){this._selected_image=null;if(evt.target.tagName.toLowerCase()===WYMeditor.IMG){this._selected_image=evt.target}};WYMeditor.loadCss=function(href){var link=document.createElement("link"),head;link.rel="stylesheet";link.href=href;head=jQuery("head").get(0);head.appendChild(link)};WYMeditor.editor.prototype.loadSkin=function(){if(this._options.loadSkin&&!WYMeditor.SKINS[this._options.skin]){var found=false,rExp=new RegExp(this._options.skin+"/"+WYMeditor.SKINS_DEFAULT_CSS+"$");jQuery("link").each(function(){if(this.href.match(rExp)){found=true}});if(!found){WYMeditor.loadCss(this._options.skinPath+WYMeditor.SKINS_DEFAULT_CSS)}}jQuery(this._box).addClass("wym_skin_"+this._options.skin);if(this._options.initSkin&&!WYMeditor.SKINS[this._options.skin]){eval(jQuery.ajax({url:this._options.skinPath+WYMeditor.SKINS_DEFAULT_JS,async:false}).responseText)}if(WYMeditor.SKINS[this._options.skin]&&WYMeditor.SKINS[this._options.skin].init){WYMeditor.SKINS[this._options.skin].init(this)}};WYMeditor.DocumentStructureManager=function(wym,defaultRootContainer){this._wym=wym;this.structureRules=WYMeditor.DocumentStructureManager.DEFAULTS;this.setDefaultRootContainer(defaultRootContainer)};jQuery.extend(WYMeditor.DocumentStructureManager,{VALID_DEFAULT_ROOT_CONTAINERS:["p","div"],DEFAULT_ROOT_CONTAINER_TITLES:{p:"Paragraph",div:"Division"},CONTAINERS_BLOCKING_NAVIGATION:["table","blockquote","pre"],DEFAULTS:{defaultRootContainer:"p",notValidRootContainers:["div"],validRootContainers:["p","div","h1","h2","h3","h4","h5","h6","pre","blockquote","table","ol","ul"],convertIfRootContainers:["div"],validListConversionTargetContainers:["p","div","h1","h2","h3","h4","h5","h6","pre","blockquote","td","th"],wrapContentsInList:["td","th"]}});
WYMeditor.DocumentStructureManager.prototype.setDefaultRootContainer=function(defaultRootContainer){var validContainers,index;if(this.structureRules.defaultRootContainer===defaultRootContainer){return}validContainers=WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;index=jQuery.inArray(defaultRootContainer,validContainers);if(index===-1){throw new Error("a defaultRootContainer of '"+defaultRootContainer+"' is not supported")}this.structureRules.defaultRootContainer=defaultRootContainer;this.structureRules.notValidRootContainers=WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;this.structureRules.notValidRootContainers.splice(index,1);this.adjustDefaultRootContainerUI()};WYMeditor.DocumentStructureManager.prototype.adjustDefaultRootContainerUI=function(){var wym=this._wym,defaultRootContainer=this.structureRules.defaultRootContainer,$containerItems,$containerLink,$newContainerItem,containerName,newContainerLinkNeeded,newContainerLinkHtml,i;$containerItems=jQuery(wym._box).find(wym._options.containersSelector).find("li");newContainerLinkNeeded=true;for(i=0;i<$containerItems.length;++i){$containerLink=$containerItems.eq(i).find("a");containerName=$containerLink.attr("name").toLowerCase();if(jQuery.inArray(containerName,this.structureRules.notValidRootContainers)>-1){$containerItems.eq(i).remove()}if(containerName===defaultRootContainer){newContainerLinkNeeded=false}}if(newContainerLinkNeeded){newContainerLinkHtml=wym._options.containersItemHtml;newContainerLinkHtml=WYMeditor.Helper.replaceAll(newContainerLinkHtml,WYMeditor.CONTAINER_NAME,defaultRootContainer.toUpperCase());newContainerLinkHtml=WYMeditor.Helper.replaceAll(newContainerLinkHtml,WYMeditor.CONTAINER_TITLE,WYMeditor.DocumentStructureManager.DEFAULT_ROOT_CONTAINER_TITLES[defaultRootContainer]);newContainerLinkHtml=WYMeditor.Helper.replaceAll(newContainerLinkHtml,WYMeditor.CONTAINER_CLASS,"wym_containers_"+defaultRootContainer);$newContainerItem=jQuery(newContainerLinkHtml);$containerItems=jQuery(wym._box).find(wym._options.containersSelector).find("li");$containerItems.eq(0).before($newContainerItem);$newContainerItem.find("a").click(function(){wym.container(jQuery(this).attr(WYMeditor.NAME));return false})}};WYMeditor.WymClassExplorer=function(wym){this._wym=wym;this._class="className"};WYMeditor.WymClassExplorer.prototype.initIframe=function(iframe){this._iframe=iframe;this._doc=iframe.contentWindow.document;var styles=this._doc.styleSheets[0];var aCss=eval(this._options.editorStyles);this.addCssRules(this._doc,aCss);this._doc.title=this._wym._index;jQuery("html",this._doc).attr("dir",this._options.direction);jQuery(this._doc.body).html(this._wym._options.html);var wym=this;this._doc.body.onfocus=function(){wym._doc.designMode="on";wym._doc=iframe.contentWindow.document};this._doc.onbeforedeactivate=function(){wym.saveCaret()};jQuery(this._doc).bind("keyup",wym.keyup);var ieVersion=parseInt(jQuery.browser.version,10);if(ieVersion>=8&&ieVersion<9){jQuery(this._doc).bind("keydown",function(){wym.fixBluescreenOfDeath()})}this._doc.onkeyup=function(){wym.saveCaret()};this._doc.onclick=function(){wym.saveCaret()};this._doc.body.onbeforepaste=function(){wym._iframe.contentWindow.event.returnValue=false};this._doc.body.onpaste=function(){wym._iframe.contentWindow.event.returnValue=false;wym.paste(window.clipboardData.getData("Text"))};if(this._initialized){if(jQuery.isFunction(this._options.preBind)){this._options.preBind(this)}this._wym.bindEvents();if(jQuery.isFunction(this._options.postInit)){this._options.postInit(this)}this.listen()}this._initialized=true;this._doc.designMode="on";try{this._doc=iframe.contentWindow.document}catch(e){}};!function(editorLoadSkin){WYMeditor.WymClassExplorer.prototype.loadSkin=function(){jQuery(this._box).find(this._options.containerSelector).attr("unselectable","on");editorLoadSkin.call(this)}}(WYMeditor.editor.prototype.loadSkin);WYMeditor.WymClassExplorer.prototype.fixBluescreenOfDeath=function(){var position=jQuery(this._doc).find("p").eq(0).position();if(position!==null&&typeof position!=="undefined"&&position.left<0){jQuery(this._box).append('<br id="wym-bluescreen-bug-fix" />');jQuery(this._box).find("#wym-bluescreen-bug-fix").remove()}};WYMeditor.WymClassExplorer.prototype._exec=function(cmd,param){if(param){this._doc.execCommand(cmd,false,param)}else{this._doc.execCommand(cmd)}};WYMeditor.WymClassExplorer.prototype.saveCaret=function(){this._doc.caretPos=this._doc.selection.createRange()};WYMeditor.WymClassExplorer.prototype.addCssRule=function(styles,oCss){var selectors=oCss.name.split(","),i;for(i=0;i<selectors.length;i++){styles.addRule(selectors[i],oCss.css)}};WYMeditor.WymClassExplorer.prototype.insert=function(html){var range=this._doc.selection.createRange();if(jQuery(range.parentElement()).parents().is(this._options.iframeBodySelector)){try{range.pasteHTML(html)}catch(e){}}else{this.paste(html)}};WYMeditor.WymClassExplorer.prototype.wrap=function(left,right){var range=this._doc.selection.createRange();if(jQuery(range.parentElement()).parents().is(this._options.iframeBodySelector)){try{range.pasteHTML(left+range.text+right)}catch(e){}}};WYMeditor.WymClassExplorer.prototype.wrapWithContainer=function(node,containerType){var wym=this._wym,$wrappedNode,selection,range;$wrappedNode=jQuery(node).wrap("<"+containerType+" />");selection=rangy.getIframeSelection(wym._iframe);range=rangy.createRange(wym._doc);range.selectNodeContents($wrappedNode[0]);range.collapse();selection.setSingleRange(range)};WYMeditor.WymClassExplorer.prototype.unwrap=function(){var range=this._doc.selection.createRange();if(jQuery(range.parentElement()).parents().is(this._options.iframeBodySelector)){try{var text=range.text;this._exec("Cut");range.pasteHTML(text)}catch(e){}}};WYMeditor.WymClassExplorer.prototype.keyup=function(evt){var wym=WYMeditor.INSTANCES[this.title],container,defaultRootContainer,notValidRootContainers,name,parentName,forbiddenMainContainer=false;notValidRootContainers=wym.documentStructureManager.structureRules.notValidRootContainers;defaultRootContainer=wym.documentStructureManager.structureRules.defaultRootContainer;this._selected_image=null;if(!wym.keyCanCreateBlockElement(evt.which)&&evt.which!==WYMeditor.KEY.CTRL&&evt.which!==WYMeditor.KEY.COMMAND&&!evt.metaKey&&!evt.ctrlKey){container=wym.selected();selectedNode=wym.selection().focusNode;if(container!==null){name=container.tagName.toLowerCase()}if(container.parentNode){parentName=container.parentNode.tagName.toLowerCase()}if(wym.isForbiddenMainContainer(name)){name=parentName;forbiddenMainContainer=true}if(name===WYMeditor.BODY&&selectedNode.nodeName==="#text"){if(forbiddenMainContainer){selectedNode=selectedNode.parentNode}wym.wrapWithContainer(selectedNode,defaultRootContainer);wym.fixBodyHtml()}if(jQuery.inArray(name,notValidRootContainers)>-1&&parentName===WYMeditor.BODY){wym.switchTo(container,defaultRootContainer);wym.fixBodyHtml()}}if(wym.keyCanCreateBlockElement(evt.which)){container=wym.selected();name=container.tagName.toLowerCase();if(container.parentNode){parentName=container.parentNode.tagName.toLowerCase()}if(jQuery.inArray(name,notValidRootContainers)>-1&&parentName===WYMeditor.BODY){wym.switchTo(container,defaultRootContainer)}wym.fixBodyHtml()}};WYMeditor.WymClassMozilla=function(wym){this._wym=wym;this._class="class"};WYMeditor.WymClassMozilla.CELL_PLACEHOLDER='<br _moz_dirty="" />';WYMeditor.WymClassMozilla.NEEDS_CELL_FIX=parseInt(jQuery.browser.version,10)===1&&jQuery.browser.version>="1.9.1"&&jQuery.browser.version<"2.0";WYMeditor.WymClassMozilla.prototype.initIframe=function(iframe){var wym=this,styles,aCss;this._iframe=iframe;this._doc=iframe.contentDocument;styles=this._doc.styleSheets[0];aCss=eval(this._options.editorStyles);this.addCssRules(this._doc,aCss);this._doc.title=this._wym._index;jQuery("html",this._doc).attr("dir",this._options.direction);this._html(this._wym._options.html);this.enableDesignMode();if(jQuery.isFunction(this._options.preBind)){this._options.preBind(this)}this._wym.bindEvents();jQuery(this._doc).bind("keydown",this.keydown);jQuery(this._doc).bind("keyup",this.keyup);jQuery(this._doc).bind("click",this.click);jQuery(this._doc).bind("focus",function(){wym.enableDesignMode.call(wym)});if(jQuery.isFunction(this._options.postInit)){this._options.postInit(this)}this.listen()};WYMeditor.WymClassMozilla.prototype._html=function(html){if(typeof html==="string"){try{this._doc.designMode="off"}catch(e){}html=html.replace(/<em(\b[^>]*)>/gi,"<i$1>");html=html.replace(/<\/em>/gi,"</i>");html=html.replace(/<strong(\b[^>]*)>/gi,"<b$1>");html=html.replace(/<\/strong>/gi,"</b>");jQuery(this._doc.body).html(html);this._wym.fixBodyHtml();this.enableDesignMode()}else{return jQuery(this._doc.body).html()}return false};WYMeditor.WymClassMozilla.prototype._exec=function(cmd,param){if(!this.selected()){return false}if(param){this._doc.execCommand(cmd,"",param)}else{this._doc.execCommand(cmd,"",null)}var container=this.selected();if(container&&container.tagName.toLowerCase()===WYMeditor.BODY){this._exec(WYMeditor.FORMAT_BLOCK,WYMeditor.P);this.fixBodyHtml()}return true};WYMeditor.WymClassMozilla.prototype.addCssRule=function(styles,oCss){styles.insertRule(oCss.name+" {"+oCss.css+"}",styles.cssRules.length)};WYMeditor.WymClassMozilla.prototype.keydown=function(evt){var wym=WYMeditor.INSTANCES[this.title];if(evt.ctrlKey){if(evt.which===66){wym._exec(WYMeditor.BOLD);return false}if(evt.which===73){wym._exec(WYMeditor.ITALIC);return false}}return true};WYMeditor.WymClassMozilla.prototype.keyup=function(evt){var wym=WYMeditor.INSTANCES[this.title],container,defaultRootContainer,notValidRootContainers,name,parentName;notValidRootContainers=wym.documentStructureManager.structureRules.notValidRootContainers;defaultRootContainer=wym.documentStructureManager.structureRules.defaultRootContainer;wym._selected_image=null;container=null;if(!wym.keyCanCreateBlockElement(evt.which)&&evt.which!==WYMeditor.KEY.CTRL&&evt.which!==WYMeditor.KEY.COMMAND&&!evt.metaKey&&!evt.ctrlKey){container=wym.selected();name=container.tagName.toLowerCase();if(container.parentNode){parentName=container.parentNode.tagName.toLowerCase()}if(wym.isForbiddenMainContainer(name)){name=parentName}if(name===WYMeditor.BODY||jQuery.inArray(name,notValidRootContainers)>-1&&parentName===WYMeditor.BODY){wym._exec(WYMeditor.FORMAT_BLOCK,defaultRootContainer);wym.fixBodyHtml()}}if(wym.keyCanCreateBlockElement(evt.which)){container=wym.selected();name=container.tagName.toLowerCase();if(container.parentNode){parentName=container.parentNode.tagName.toLowerCase()}if(jQuery.inArray(name,notValidRootContainers)>-1&&parentName===WYMeditor.BODY){wym._exec(WYMeditor.FORMAT_BLOCK,defaultRootContainer)}wym.fixBodyHtml()}};WYMeditor.WymClassMozilla.prototype.click=function(evt){var wym=WYMeditor.INSTANCES[this.title],container=wym.selected(),sel;if(WYMeditor.WymClassMozilla.NEEDS_CELL_FIX===true){if(container&&container.tagName.toLowerCase()===WYMeditor.TR){jQuery(WYMeditor.TD,wym._doc.body).append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER)}}if(container&&container.tagName.toLowerCase()===WYMeditor.BODY){sel=wym._iframe.contentWindow.getSelection();if(sel.isCollapsed===true){wym._exec(WYMeditor.FORMAT_BLOCK,WYMeditor.P)}}};WYMeditor.WymClassMozilla.prototype.enableDesignMode=function(){if(this._doc.designMode==="off"){try{this._doc.designMode="on";this._doc.execCommand("styleWithCSS","",false);this._doc.execCommand("enableObjectResizing",false,true)}catch(e){}}};WYMeditor.WymClassMozilla.prototype.afterInsertTable=function(table){if(WYMeditor.WymClassMozilla.NEEDS_CELL_FIX===true){jQuery(table).find("td").each(function(index,element){jQuery(element).append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER)})}};WYMeditor.WymClassOpera=function(wym){this._wym=wym;this._class="class"};WYMeditor.WymClassOpera.prototype.initIframe=function(iframe){this._iframe=iframe;this._doc=iframe.contentWindow.document;var styles=this._doc.styleSheets[0];var aCss=eval(this._options.editorStyles);this.addCssRules(this._doc,aCss);this._doc.title=this._wym._index;jQuery("html",this._doc).attr("dir",this._options.direction);this._doc.designMode="on";this._html(this._wym._options.html);if(jQuery.isFunction(this._options.preBind)){this._options.preBind(this)}this._wym.bindEvents();jQuery(this._doc).bind("keydown",this.keydown);jQuery(this._doc).bind("keyup",this.keyup);if(jQuery.isFunction(this._options.postInit)){this._options.postInit(this)}this.listen()};WYMeditor.WymClassOpera.prototype._exec=function(cmd,param){if(param){this._doc.execCommand(cmd,false,param)}else{this._doc.execCommand(cmd)}};WYMeditor.WymClassOpera.prototype.selected=function(){var sel=this._iframe.contentWindow.getSelection();var node=sel.focusNode;if(node){if(node.nodeName==="#text"){return node.parentNode}else{return node}}else{return null}};WYMeditor.WymClassOpera.prototype.addCssRule=function(styles,oCss){styles.insertRule(oCss.name+" {"+oCss.css+"}",styles.cssRules.length)};WYMeditor.WymClassOpera.prototype.keydown=function(evt){var wym=WYMeditor.INSTANCES[this.title];var sel=wym._iframe.contentWindow.getSelection();startNode=sel.getRangeAt(0).startContainer;if(!jQuery(startNode).parentsOrSelf(WYMeditor.MAIN_CONTAINERS.join(","))[0]&&!jQuery(startNode).parentsOrSelf("li")&&!keyCanCreateBlockElement(evt.which)){wym._exec(WYMeditor.FORMAT_BLOCK,WYMeditor.P)}};WYMeditor.WymClassOpera.prototype.keyup=function(evt){var wym=WYMeditor.INSTANCES[this.title];wym._selected_image=null};WYMeditor.WymClassSafari=function(wym){this._wym=wym;this._class="class"};WYMeditor.WymClassSafari.prototype.initIframe=function(iframe){var wym=this,styles,aCss;this._iframe=iframe;this._doc=iframe.contentDocument;styles=this._doc.styleSheets[0];aCss=eval(this._options.editorStyles);this.addCssRules(this._doc,aCss);this._doc.title=this._wym._index;jQuery("html",this._doc).attr("dir",this._options.direction);this._doc.designMode="on";this._html(this._wym._options.html);if(jQuery.isFunction(this._options.preBind)){this._options.preBind(this)}this._wym.bindEvents();jQuery(this._doc).bind("keydown",this.keydown);jQuery(this._doc).bind("keyup",this.keyup);if(jQuery.isFunction(this._options.postInit)){this._options.postInit(this)}this.listen()};WYMeditor.WymClassSafari.prototype._exec=function(cmd,param){if(!this.selected()){return false}var container,$container,tagName;if(param){this._doc.execCommand(cmd,"",param)}else{this._doc.execCommand(cmd,"",null)}container=this.selected();if(container){$container=jQuery(container);tagName=container.tagName.toLowerCase();if(tagName===WYMeditor.BODY){this._exec(WYMeditor.FORMAT_BLOCK,this.documentStructureManager.structureRules.defaultRootContainer);this.fixBodyHtml()}if(cmd===WYMeditor.FORMAT_BLOCK&&$container.siblings("body.wym_iframe").length){$container.siblings("body.wym_iframe").append(container)}if(tagName==="span"&&(!$container.attr("class")||$container.attr("class").toLowerCase()==="apple-style-span")&&$container.attr("style")==="font-weight: normal;"){$container.contents().unwrap()}}return true};WYMeditor.WymClassSafari.prototype.addCssRule=function(styles,oCss){styles.insertRule(oCss.name+" {"+oCss.css+"}",styles.cssRules.length)};WYMeditor.WymClassSafari.prototype.keydown=function(e){var wym=WYMeditor.INSTANCES[this.title];if(e.ctrlKey){if(e.which===WYMeditor.KEY.B){wym._exec(WYMeditor.BOLD);e.preventDefault()}if(e.which===WYMeditor.KEY.I){wym._exec(WYMeditor.ITALIC);e.preventDefault()}}else if(e.shiftKey&&e.which===WYMeditor.KEY.ENTER){wym._exec("InsertLineBreak");e.preventDefault()}};WYMeditor.WymClassSafari.prototype.keyup=function(evt){var wym=WYMeditor.INSTANCES[this.title],container,defaultRootContainer,notValidRootContainers,name,parentName;notValidRootContainers=wym.documentStructureManager.structureRules.notValidRootContainers;defaultRootContainer=wym.documentStructureManager.structureRules.defaultRootContainer;wym._selected_image=null;if(jQuery.browser.version<534.1){if(evt.which===WYMeditor.KEY.ENTER&&evt.shiftKey){wym._exec("InsertLineBreak")}}if(!wym.keyCanCreateBlockElement(evt.which)&&evt.which!==WYMeditor.KEY.CTRL&&evt.which!==WYMeditor.KEY.COMMAND&&!evt.metaKey&&!evt.ctrlKey){container=wym.selected();name=container.tagName.toLowerCase();if(container.parentNode){parentName=container.parentNode.tagName.toLowerCase()}if(wym.isForbiddenMainContainer(name)){name=parentName}if(name===WYMeditor.BODY||jQuery.inArray(name,notValidRootContainers)>-1&&parentName===WYMeditor.BODY){wym._exec(WYMeditor.FORMAT_BLOCK,defaultRootContainer);wym.fixBodyHtml()}}if(wym.keyCanCreateBlockElement(evt.which)){container=wym.selected();name=container.tagName.toLowerCase();if(container.parentNode){parentName=container.parentNode.tagName.toLowerCase()}if(jQuery.inArray(name,notValidRootContainers)>-1&&parentName===WYMeditor.BODY){wym._exec(WYMeditor.FORMAT_BLOCK,defaultRootContainer)}wym.fixBodyHtml()}};WYMeditor.XmlHelper=function(){this._entitiesDiv=document.createElement("div");return this};WYMeditor.XmlHelper.prototype.tag=function(name,options,open){options=options||false;open=open||false;return"<"+name+(options?this.tagOptions(options):"")+(open?">":" />")};WYMeditor.XmlHelper.prototype.contentTag=function(name,content,options){options=options||false;return"<"+name+(options?this.tagOptions(options):"")+">"+content+"</"+name+">"};WYMeditor.XmlHelper.prototype.cdataSection=function(content){return"<![CDATA["+content+"]]>"};WYMeditor.XmlHelper.prototype.escapeOnce=function(xml){return this._fixDoubleEscape(this.escapeEntities(xml))};WYMeditor.XmlHelper.prototype._fixDoubleEscape=function(escaped){return escaped.replace(/&amp;([a-z]+|(#\d+));/gi,"&$1;")};WYMeditor.XmlHelper.prototype.tagOptions=function(options){var xml=this;xml._formated_options="";for(var key in options){var formated_options="";var value=options[key];if(typeof value!="function"&&value.length>0){if(parseInt(key,10)==key&&typeof value=="object"){key=value.shift();value=value.pop()}if(key!==""&&value!==""){xml._formated_options+=" "+key+'="'+xml.escapeOnce(value)+'"'}}}return xml._formated_options};WYMeditor.XmlHelper.prototype.escapeEntities=function(string,escape_quotes){this._entitiesDiv.innerHTML=string;this._entitiesDiv.textContent=string;var result=this._entitiesDiv.innerHTML;if(typeof escape_quotes=="undefined"){if(escape_quotes!==false)result=result.replace('"',"&quot;");if(escape_quotes===true)result=result.replace('"',"&#039;")}return result};WYMeditor.XmlHelper.prototype.parseAttributes=function(tag_attributes){var result=[];var matches=tag_attributes.split(/((=\s*")(")("))|((=\s*\')(\')(\'))|((=\s*[^>\s]*))/g);if(matches.toString()!=tag_attributes){for(var k in matches){var v=matches[k];if(typeof v!="function"&&v.length!==0){var re=new RegExp("(\\w+)\\s*"+v);var match=tag_attributes.match(re);if(match){var value=v.replace(/^[\s=]+/,"");var delimiter=value.charAt(0);delimiter=delimiter=='"'?'"':delimiter=="'"?"'":"";if(delimiter!==""){value=delimiter=='"'?value.replace(/^"|"+$/g,""):value.replace(/^'|'+$/g,"")}tag_attributes=tag_attributes.replace(match[0],"");result.push([match[1],value])}}}}return result};WYMeditor.XhtmlValidator={_attributes:{core:{except:["base","head","html","meta","param","script","style","title"],attributes:["class","id","style","title","accesskey","tabindex","/^data-.*/"]},language:{except:["base","br","hr","iframe","param","script"],attributes:{dir:["ltr","rtl"],0:"lang",1:"xml:lang"}},keyboard:{attributes:{accesskey:/^(\w){1}$/,tabindex:/^(\d)+$/}}},_events:{window:{only:["body"],attributes:["onload","onunload"]},form:{only:["form","input","textarea","select","a","label","button"],attributes:["onchange","onsubmit","onreset","onselect","onblur","onfocus"]},keyboard:{except:["base","bdo","br","frame","frameset","head","html","iframe","meta","param","script","style","title"],attributes:["onkeydown","onkeypress","onkeyup"]},mouse:{except:["base","bdo","br","head","html","meta","param","script","style","title"],attributes:["onclick","ondblclick","onmousedown","onmousemove","onmouseover","onmouseout","onmouseup"]}},_tags:{a:{attributes:{0:"charset",1:"coords",2:"href",3:"hreflang",4:"name",5:"rel",6:"rev",shape:/^(rect|rectangle|circ|circle|poly|polygon)$/,7:"type"}},0:"abbr",1:"acronym",2:"address",area:{attributes:{0:"alt",1:"coords",2:"href",nohref:/^(true|false)$/,shape:/^(rect|rectangle|circ|circle|poly|polygon)$/},required:["alt"]},3:"b",base:{attributes:["href"],required:["href"]},bdo:{attributes:{dir:/^(ltr|rtl)$/},required:["dir"]},4:"big",blockquote:{attributes:["cite"]},5:"body",6:"br",button:{attributes:{disabled:/^(disabled)$/,type:/^(button|reset|submit)$/,0:"value"},inside:"form"},7:"caption",8:"cite",9:"code",col:{attributes:{align:/^(right|left|center|justify)$/,0:"char",1:"charoff",span:/^(\d)+$/,valign:/^(top|middle|bottom|baseline)$/,2:"width"},inside:"colgroup"},colgroup:{attributes:{align:/^(right|left|center|justify)$/,0:"char",1:"charoff",span:/^(\d)+$/,valign:/^(top|middle|bottom|baseline)$/,2:"width"}},10:"dd",del:{attributes:{0:"cite",datetime:/^([0-9]){8}/}},11:"div",12:"dfn",13:"dl",14:"dt",15:"em",fieldset:{inside:"form"},form:{attributes:{0:"action",1:"accept",2:"accept-charset",3:"enctype",method:/^(get|post)$/},required:["action"]},head:{attributes:["profile"]},16:"h1",17:"h2",18:"h3",19:"h4",20:"h5",21:"h6",22:"hr",html:{attributes:["xmlns"]},23:"i",img:{attributes:["alt","src","height","ismap","longdesc","usemap","width"],required:["alt","src"]},input:{attributes:{0:"accept",1:"alt",checked:/^(checked)$/,disabled:/^(disabled)$/,maxlength:/^(\d)+$/,2:"name",readonly:/^(readonly)$/,size:/^(\d)+$/,3:"src",type:/^(button|checkbox|file|hidden|image|password|radio|reset|submit|text)$/,4:"value"},inside:"form"},ins:{attributes:{0:"cite",datetime:/^([0-9]){8}/}},24:"kbd",label:{attributes:["for"],inside:"form"},25:"legend",26:"li",link:{attributes:{0:"charset",1:"href",2:"hreflang",media:/^(all|braille|print|projection|screen|speech|,|;| )+$/i,rel:/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,rev:/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,3:"type"},inside:"head"},map:{attributes:["id","name"],required:["id"]},meta:{attributes:{0:"content","http-equiv":/^(content\-type|expires|refresh|set\-cookie)$/i,1:"name",2:"scheme"},required:["content"]},27:"noscript",object:{attributes:["archive","classid","codebase","codetype","data","declare","height","name","standby","type","usemap","width"]},28:"ol",optgroup:{attributes:{0:"label",disabled:/^(disabled)$/},required:["label"]},option:{attributes:{0:"label",disabled:/^(disabled)$/,selected:/^(selected)$/,1:"value"},inside:"select"},29:"p",param:{attributes:{0:"type",valuetype:/^(data|ref|object)$/,1:"valuetype",2:"value"},required:["name"]},30:"pre",q:{attributes:["cite"]},31:"samp",script:{attributes:{type:/^(text\/ecmascript|text\/javascript|text\/jscript|text\/vbscript|text\/vbs|text\/xml)$/,0:"charset",defer:/^(defer)$/,1:"src"},required:["type"]},select:{attributes:{disabled:/^(disabled)$/,multiple:/^(multiple)$/,0:"name",1:"size"},inside:"form"},32:"small",33:"span",34:"strong",style:{attributes:{0:"type",media:/^(screen|tty|tv|projection|handheld|print|braille|aural|all)$/},required:["type"]},35:"sub",36:"sup",table:{attributes:{0:"border",1:"cellpadding",2:"cellspacing",frame:/^(void|above|below|hsides|lhs|rhs|vsides|box|border)$/,rules:/^(none|groups|rows|cols|all)$/,3:"summary",4:"width"}},tbody:{attributes:{align:/^(right|left|center|justify)$/,0:"char",1:"charoff",valign:/^(top|middle|bottom|baseline)$/}},td:{attributes:{0:"abbr",align:/^(left|right|center|justify|char)$/,1:"axis",2:"char",3:"charoff",colspan:/^(\d)+$/,4:"headers",rowspan:/^(\d)+$/,scope:/^(col|colgroup|row|rowgroup)$/,valign:/^(top|middle|bottom|baseline)$/}},textarea:{attributes:["cols","rows","disabled","name","readonly"],required:["cols","rows"],inside:"form"},tfoot:{attributes:{align:/^(right|left|center|justify)$/,0:"char",1:"charoff",valign:/^(top|middle|bottom)$/,2:"baseline"}},th:{attributes:{0:"abbr",align:/^(left|right|center|justify|char)$/,1:"axis",2:"char",3:"charoff",colspan:/^(\d)+$/,4:"headers",rowspan:/^(\d)+$/,scope:/^(col|colgroup|row|rowgroup)$/,valign:/^(top|middle|bottom|baseline)$/}},thead:{attributes:{align:/^(right|left|center|justify)$/,0:"char",1:"charoff",valign:/^(top|middle|bottom|baseline)$/}},37:"title",tr:{attributes:{align:/^(right|left|center|justify|char)$/,0:"char",1:"charoff",valign:/^(top|middle|bottom|baseline)$/}},38:"tt",39:"ul",40:"var"},skiped_attributes:[],skiped_attribute_values:[],getValidTagAttributes:function(tag,attributes){var valid_attributes={};var possible_attributes=this.getPossibleTagAttributes(tag);for(var attribute in attributes){var value=attributes[attribute];attribute=attribute.toLowerCase();var h=WYMeditor.Helper;if(!h.contains(this.skiped_attributes,attribute)&&!h.contains(this.skiped_attribute_values,value)){if(typeof value!="function"&&h.contains(possible_attributes,attribute)){if(this.doesAttributeNeedsValidation(tag,attribute)){if(this.validateAttribute(tag,attribute,value)){valid_attributes[attribute]=value}}else{valid_attributes[attribute]=value}}else{jQuery.each(possible_attributes,function(){if(this.match(/\/(.*)\//)){regex=new RegExp(this.match(/\/(.*)\//)[1]);if(regex.test(attribute)){valid_attributes[attribute]=value}}})}}}return valid_attributes},getUniqueAttributesAndEventsForTag:function(tag){var result=[];if(this._tags[tag]&&this._tags[tag].attributes){for(var k in this._tags[tag].attributes){result.push(parseInt(k,10)==k?this._tags[tag].attributes[k]:k)}}return result},getDefaultAttributesAndEventsForTags:function(){var result=[];for(var key in this._events){result.push(this._events[key])}for(key in this._attributes){result.push(this._attributes[key])}return result},isValidTag:function(tag){if(this._tags[tag]){return true}for(var key in this._tags){if(this._tags[key]==tag){return true}}return false},getDefaultAttributesAndEventsForTag:function(tag){var default_attributes=[];if(this.isValidTag(tag)){var default_attributes_and_events=this.getDefaultAttributesAndEventsForTags();for(var key in default_attributes_and_events){var defaults=default_attributes_and_events[key];if(typeof defaults=="object"){var h=WYMeditor.Helper;if(defaults["except"]&&h.contains(defaults["except"],tag)||defaults["only"]&&!h.contains(defaults["only"],tag)){continue}var tag_defaults=defaults["attributes"]?defaults["attributes"]:defaults["events"];for(var k in tag_defaults){default_attributes.push(typeof tag_defaults[k]!="string"?k:tag_defaults[k])}}}}return default_attributes},doesAttributeNeedsValidation:function(tag,attribute){return this._tags[tag]&&(this._tags[tag]["attributes"]&&this._tags[tag]["attributes"][attribute]||this._tags[tag]["required"]&&WYMeditor.Helper.contains(this._tags[tag]["required"],attribute))},validateAttribute:function(tag,attribute,value){if(this._tags[tag]&&this._tags[tag]["attributes"]&&this._tags[tag]["attributes"][attribute]&&value.length>0&&!value.match(this._tags[tag]["attributes"][attribute])||this._tags[tag]&&this._tags[tag]["required"]&&WYMeditor.Helper.contains(this._tags[tag]["required"],attribute)&&value.length===0){return false}return typeof this._tags[tag]!="undefined"},getPossibleTagAttributes:function(tag){if(!this._possible_tag_attributes){this._possible_tag_attributes={}}if(!this._possible_tag_attributes[tag]){this._possible_tag_attributes[tag]=this.getUniqueAttributesAndEventsForTag(tag).concat(this.getDefaultAttributesAndEventsForTag(tag))}return this._possible_tag_attributes[tag]}};WYMeditor.ParallelRegex=function(case_sensitive){this._case=case_sensitive;this._patterns=[];this._labels=[];this._regex=null;return this};WYMeditor.ParallelRegex.prototype.addPattern=function(pattern,label){label=label||true;var count=this._patterns.length;this._patterns[count]=pattern;this._labels[count]=label;this._regex=null};WYMeditor.ParallelRegex.prototype.match=function(subject){if(this._patterns.length===0){return[false,""]}var matches=subject.match(this._getCompoundedRegex());if(!matches){return[false,""]}var match=matches[0];for(var i=1;i<matches.length;i++){if(matches[i]){return[this._labels[i-1],match]}}return[true,matches[0]]};WYMeditor.ParallelRegex.prototype._getCompoundedRegex=function(){if(this._regex===null){for(var i=0,count=this._patterns.length;i<count;i++){this._patterns[i]="("+this._untokenizeRegex(this._tokenizeRegex(this._patterns[i]).replace(/([\/\(\)])/g,"\\$1"))+")"}this._regex=new RegExp(this._patterns.join("|"),this._getPerlMatchingFlags())}return this._regex};WYMeditor.ParallelRegex.prototype._tokenizeRegex=function(regex){return regex.replace(/\(\?(i|m|s|x|U)\)/,"~~~~~~Tk1$1~~~~~~").replace(/\(\?(\-[i|m|s|x|U])\)/,"~~~~~~Tk2$1~~~~~~").replace(/\(\?\=(.*)\)/,"~~~~~~Tk3$1~~~~~~").replace(/\(\?\!(.*)\)/,"~~~~~~Tk4$1~~~~~~").replace(/\(\?\<\=(.*)\)/,"~~~~~~Tk5$1~~~~~~").replace(/\(\?\<\!(.*)\)/,"~~~~~~Tk6$1~~~~~~").replace(/\(\?\:(.*)\)/,"~~~~~~Tk7$1~~~~~~")};WYMeditor.ParallelRegex.prototype._untokenizeRegex=function(regex){return regex.replace(/~~~~~~Tk1(.{1})~~~~~~/,"(?$1)").replace(/~~~~~~Tk2(.{2})~~~~~~/,"(?$1)").replace(/~~~~~~Tk3(.*)~~~~~~/,"(?=$1)").replace(/~~~~~~Tk4(.*)~~~~~~/,"(?!$1)").replace(/~~~~~~Tk5(.*)~~~~~~/,"(?<=$1)").replace(/~~~~~~Tk6(.*)~~~~~~/,"(?<!$1)").replace(/~~~~~~Tk7(.*)~~~~~~/,"(?:$1)")};WYMeditor.ParallelRegex.prototype._getPerlMatchingFlags=function(){return this._case?"m":"mi"};WYMeditor.StateStack=function(start){this._stack=[start];return this};WYMeditor.StateStack.prototype.getCurrent=function(){return this._stack[this._stack.length-1]};WYMeditor.StateStack.prototype.enter=function(state){this._stack.push(state)};WYMeditor.StateStack.prototype.leave=function(){if(this._stack.length==1){return false}this._stack.pop();return true};WYMeditor.LEXER_ENTER=1;WYMeditor.LEXER_MATCHED=2;WYMeditor.LEXER_UNMATCHED=3;WYMeditor.LEXER_EXIT=4;WYMeditor.LEXER_SPECIAL=5;WYMeditor.Lexer=function(parser,start,case_sensitive){start=start||"accept";this._case=case_sensitive||false;this._regexes={};this._parser=parser;this._mode=new WYMeditor.StateStack(start);this._mode_handlers={};this._mode_handlers[start]=start;return this};WYMeditor.Lexer.prototype.addPattern=function(pattern,mode){mode=mode||"accept";if(typeof this._regexes[mode]=="undefined"){this._regexes[mode]=new WYMeditor.ParallelRegex(this._case)}this._regexes[mode].addPattern(pattern);if(typeof this._mode_handlers[mode]=="undefined"){this._mode_handlers[mode]=mode}};WYMeditor.Lexer.prototype.addEntryPattern=function(pattern,mode,new_mode){if(typeof this._regexes[mode]=="undefined"){this._regexes[mode]=new WYMeditor.ParallelRegex(this._case)}this._regexes[mode].addPattern(pattern,new_mode);if(typeof this._mode_handlers[new_mode]=="undefined"){this._mode_handlers[new_mode]=new_mode}};WYMeditor.Lexer.prototype.addExitPattern=function(pattern,mode){if(typeof this._regexes[mode]=="undefined"){this._regexes[mode]=new WYMeditor.ParallelRegex(this._case)}this._regexes[mode].addPattern(pattern,"__exit");if(typeof this._mode_handlers[mode]=="undefined"){this._mode_handlers[mode]=mode}};WYMeditor.Lexer.prototype.addSpecialPattern=function(pattern,mode,special){if(typeof this._regexes[mode]=="undefined"){this._regexes[mode]=new WYMeditor.ParallelRegex(this._case)}this._regexes[mode].addPattern(pattern,"_"+special);if(typeof this._mode_handlers[special]=="undefined"){this._mode_handlers[special]=special}};WYMeditor.Lexer.prototype.mapHandler=function(mode,handler){this._mode_handlers[mode]=handler};WYMeditor.Lexer.prototype.parse=function(raw){if(typeof this._parser=="undefined"){return false}var length=raw.length;var parsed;while(typeof(parsed=this._reduce(raw))=="object"){raw=parsed[0];var unmatched=parsed[1];var matched=parsed[2];var mode=parsed[3];if(!this._dispatchTokens(unmatched,matched,mode)){return false
}if(raw===""){return true}if(raw.length==length){return false}length=raw.length}if(!parsed){return false}return this._invokeParser(raw,WYMeditor.LEXER_UNMATCHED)};WYMeditor.Lexer.prototype._dispatchTokens=function(unmatched,matched,mode){mode=mode||false;if(!this._invokeParser(unmatched,WYMeditor.LEXER_UNMATCHED)){return false}if(typeof mode=="boolean"){return this._invokeParser(matched,WYMeditor.LEXER_MATCHED)}if(this._isModeEnd(mode)){if(!this._invokeParser(matched,WYMeditor.LEXER_EXIT)){return false}return this._mode.leave()}if(this._isSpecialMode(mode)){this._mode.enter(this._decodeSpecial(mode));if(!this._invokeParser(matched,WYMeditor.LEXER_SPECIAL)){return false}return this._mode.leave()}this._mode.enter(mode);return this._invokeParser(matched,WYMeditor.LEXER_ENTER)};WYMeditor.Lexer.prototype._isModeEnd=function(mode){return mode==="__exit"};WYMeditor.Lexer.prototype._isSpecialMode=function(mode){return mode.substring(0,1)=="_"};WYMeditor.Lexer.prototype._decodeSpecial=function(mode){return mode.substring(1)};WYMeditor.Lexer.prototype._invokeParser=function(content,is_match){if(content===""){return true}var current=this._mode.getCurrent();var handler=this._mode_handlers[current];var result=this._parser[handler](content,is_match);return result};WYMeditor.Lexer.prototype._reduce=function(raw){var matched=this._regexes[this._mode.getCurrent()].match(raw);var match=matched[1];var action=matched[0];if(action){var unparsed_character_count=raw.indexOf(match);var unparsed=raw.substr(0,unparsed_character_count);raw=raw.substring(unparsed_character_count+match.length);return[raw,unparsed,match,action]}return true};WYMeditor.XhtmlLexer=function(parser){jQuery.extend(this,new WYMeditor.Lexer(parser,"Text"));this.mapHandler("Text","Text");this.addTokens();this.init();return this};WYMeditor.XhtmlLexer.prototype.init=function(){};WYMeditor.XhtmlLexer.prototype.addTokens=function(){this.addCommentTokens("Text");this.addScriptTokens("Text");this.addCssTokens("Text");this.addTagTokens("Text")};WYMeditor.XhtmlLexer.prototype.addCommentTokens=function(scope){this.addEntryPattern("<!--",scope,"Comment");this.addExitPattern("-->","Comment")};WYMeditor.XhtmlLexer.prototype.addScriptTokens=function(scope){this.addEntryPattern("<script",scope,"Script");this.addExitPattern("</script>","Script")};WYMeditor.XhtmlLexer.prototype.addCssTokens=function(scope){this.addEntryPattern("<style",scope,"Css");this.addExitPattern("</style>","Css")};WYMeditor.XhtmlLexer.prototype.addTagTokens=function(scope){this.addSpecialPattern("<\\s*[a-z0-9:-]+\\s*/>",scope,"SelfClosingTag");this.addSpecialPattern("<\\s*[a-z0-9:-]+\\s*>",scope,"OpeningTag");this.addEntryPattern("<[a-z0-9:-]+"+"[\\/ \\>]+",scope,"OpeningTag");this.addInTagDeclarationTokens("OpeningTag");this.addSpecialPattern("</\\s*[a-z0-9:-]+\\s*>",scope,"ClosingTag")};WYMeditor.XhtmlLexer.prototype.addInTagDeclarationTokens=function(scope){this.addSpecialPattern("\\s+",scope,"Ignore");this.addAttributeTokens(scope);this.addExitPattern("/>",scope);this.addExitPattern(">",scope)};WYMeditor.XhtmlLexer.prototype.addAttributeTokens=function(scope){this.addSpecialPattern("\\s*[a-z-_0-9]*:?[a-z-_0-9]+\\s*(?==)\\s*",scope,"TagAttributes");this.addEntryPattern('=\\s*"',scope,"DoubleQuotedAttribute");this.addPattern('\\\\"',"DoubleQuotedAttribute");this.addExitPattern('"',"DoubleQuotedAttribute");this.addEntryPattern("=\\s*'",scope,"SingleQuotedAttribute");this.addPattern("\\\\'","SingleQuotedAttribute");this.addExitPattern("'","SingleQuotedAttribute");this.addSpecialPattern("=\\s*[^>\\s]*",scope,"UnquotedAttribute")};WYMeditor.XhtmlParser=function(Listener,mode){mode=mode||"Text";this._Lexer=new WYMeditor.XhtmlLexer(this);this._Listener=Listener;this._mode=mode;this._matches=[];this._last_match="";this._current_match="";return this};WYMeditor.XhtmlParser.prototype.parse=function(raw){this._Lexer.parse(this.beforeParsing(raw));return this.afterParsing(this._Listener.getResult())};WYMeditor.XhtmlParser.prototype.beforeParsing=function(raw){if(raw.match(/class="MsoNormal"/)||raw.match(/ns = "urn:schemas-microsoft-com/)){this._Listener.avoidStylingTagsAndAttributes()}return this._Listener.beforeParsing(raw)};WYMeditor.XhtmlParser.prototype.afterParsing=function(parsed){if(this._Listener._avoiding_tags_implicitly){this._Listener.allowStylingTagsAndAttributes()}return this._Listener.afterParsing(parsed)};WYMeditor.XhtmlParser.prototype.Ignore=function(match,state){return true};WYMeditor.XhtmlParser.prototype.Text=function(text){this._Listener.addContent(text);return true};WYMeditor.XhtmlParser.prototype.Comment=function(match,status){return this._addNonTagBlock(match,status,"addComment")};WYMeditor.XhtmlParser.prototype.Script=function(match,status){return this._addNonTagBlock(match,status,"addScript")};WYMeditor.XhtmlParser.prototype.Css=function(match,status){return this._addNonTagBlock(match,status,"addCss")};WYMeditor.XhtmlParser.prototype._addNonTagBlock=function(match,state,type){switch(state){case WYMeditor.LEXER_ENTER:this._non_tag=match;break;case WYMeditor.LEXER_UNMATCHED:this._non_tag+=match;break;case WYMeditor.LEXER_EXIT:switch(type){case"addComment":this._Listener.addComment(this._non_tag+match);break;case"addScript":this._Listener.addScript(this._non_tag+match);break;case"addCss":this._Listener.addCss(this._non_tag+match);break;default:break}break;default:break}return true};WYMeditor.XhtmlParser.prototype.SelfClosingTag=function(match,state){var result=this.OpeningTag(match,state);var tag=this.normalizeTag(match);return this.ClosingTag(match,state)};WYMeditor.XhtmlParser.prototype.OpeningTag=function(match,state){switch(state){case WYMeditor.LEXER_ENTER:this._tag=this.normalizeTag(match);this._tag_attributes={};break;case WYMeditor.LEXER_SPECIAL:this._callOpenTagListener(this.normalizeTag(match));break;case WYMeditor.LEXER_EXIT:this._callOpenTagListener(this._tag,this._tag_attributes);break;default:break}return true};WYMeditor.XhtmlParser.prototype.ClosingTag=function(match,state){this._callCloseTagListener(this.normalizeTag(match));return true};WYMeditor.XhtmlParser.prototype._callOpenTagListener=function(tag,attributes){attributes=attributes||{};this.autoCloseUnclosedBeforeNewOpening(tag);if(this._Listener.isBlockTag(tag)){this._Listener._tag_stack.push(tag);this._Listener.fixNestingBeforeOpeningBlockTag(tag,attributes);this._Listener.openBlockTag(tag,attributes);this._increaseOpenTagCounter(tag)}else if(this._Listener.isInlineTag(tag)){this._Listener.inlineTag(tag,attributes)}else{this._Listener.openUnknownTag(tag,attributes);this._increaseOpenTagCounter(tag)}this._Listener.last_tag=tag;this._Listener.last_tag_opened=true;this._Listener.last_tag_attributes=attributes};WYMeditor.XhtmlParser.prototype._callCloseTagListener=function(tag){if(this._decreaseOpenTagCounter(tag)){this.autoCloseUnclosedBeforeTagClosing(tag);if(this._Listener.isBlockTag(tag)){var expected_tag=this._Listener._tag_stack.pop();if(expected_tag===false){return}else if(expected_tag!=tag){tag=expected_tag}this._Listener.closeBlockTag(tag)}}else{if(!this._Listener.isInlineTag(tag)){this._Listener.closeUnopenedTag(tag)}}this._Listener.last_tag=tag;this._Listener.last_tag_opened=false};WYMeditor.XhtmlParser.prototype._increaseOpenTagCounter=function(tag){this._Listener._open_tags[tag]=this._Listener._open_tags[tag]||0;this._Listener._open_tags[tag]++};WYMeditor.XhtmlParser.prototype._decreaseOpenTagCounter=function(tag){if(this._Listener._open_tags[tag]){this._Listener._open_tags[tag]--;if(this._Listener._open_tags[tag]===0){this._Listener._open_tags[tag]=undefined}return true}return false};WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeNewOpening=function(new_tag){this._autoCloseUnclosed(new_tag,false)};WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeTagClosing=function(tag){this._autoCloseUnclosed(tag,true)};WYMeditor.XhtmlParser.prototype._autoCloseUnclosed=function(new_tag,closing){closing=closing||false;if(this._Listener._open_tags){for(var tag in this._Listener._open_tags){var counter=this._Listener._open_tags[tag];if(counter>0&&this._Listener.shouldCloseTagAutomatically(tag,new_tag,closing)){this._callCloseTagListener(tag,true)}}}};WYMeditor.XhtmlParser.prototype.getTagReplacements=function(){return this._Listener.getTagReplacements()};WYMeditor.XhtmlParser.prototype.normalizeTag=function(tag){tag=tag.replace(/^([\s<\/>]*)|([\s<\/>]*)$/gm,"").toLowerCase();var tags=this._Listener.getTagReplacements();if(tags[tag]){return tags[tag]}return tag};WYMeditor.XhtmlParser.prototype.TagAttributes=function(match,state){if(WYMeditor.LEXER_SPECIAL==state){this._current_attribute=match}return true};WYMeditor.XhtmlParser.prototype.DoubleQuotedAttribute=function(match,state){if(WYMeditor.LEXER_UNMATCHED==state){this._tag_attributes[this._current_attribute]=match}return true};WYMeditor.XhtmlParser.prototype.SingleQuotedAttribute=function(match,state){if(WYMeditor.LEXER_UNMATCHED==state){this._tag_attributes[this._current_attribute]=match}return true};WYMeditor.XhtmlParser.prototype.UnquotedAttribute=function(match,state){this._tag_attributes[this._current_attribute]=match.replace(/^=/,"");return true};WYMeditor.XhtmlSaxListener=function(){this.output="";this.helper=new WYMeditor.XmlHelper;this._open_tags={};this.validator=WYMeditor.XhtmlValidator;this._tag_stack=[];this.avoided_tags=[];this._insert_before_closing=[];this._insert_after_closing=[];this._last_node_was_text=false;this._insideTagToRemove=false;this._lastTagRemoved=false;this._extraLIClosingTags=0;this._removedTagStackIndex=0;this.entities={"&nbsp;":"&#160;","&iexcl;":"&#161;","&cent;":"&#162;","&pound;":"&#163;","&curren;":"&#164;","&yen;":"&#165;","&brvbar;":"&#166;","&sect;":"&#167;","&uml;":"&#168;","&copy;":"&#169;","&ordf;":"&#170;","&laquo;":"&#171;","&not;":"&#172;","&shy;":"&#173;","&reg;":"&#174;","&macr;":"&#175;","&deg;":"&#176;","&plusmn;":"&#177;","&sup2;":"&#178;","&sup3;":"&#179;","&acute;":"&#180;","&micro;":"&#181;","&para;":"&#182;","&middot;":"&#183;","&cedil;":"&#184;","&sup1;":"&#185;","&ordm;":"&#186;","&raquo;":"&#187;","&frac14;":"&#188;","&frac12;":"&#189;","&frac34;":"&#190;","&iquest;":"&#191;","&Agrave;":"&#192;","&Aacute;":"&#193;","&Acirc;":"&#194;","&Atilde;":"&#195;","&Auml;":"&#196;","&Aring;":"&#197;","&AElig;":"&#198;","&Ccedil;":"&#199;","&Egrave;":"&#200;","&Eacute;":"&#201;","&Ecirc;":"&#202;","&Euml;":"&#203;","&Igrave;":"&#204;","&Iacute;":"&#205;","&Icirc;":"&#206;","&Iuml;":"&#207;","&ETH;":"&#208;","&Ntilde;":"&#209;","&Ograve;":"&#210;","&Oacute;":"&#211;","&Ocirc;":"&#212;","&Otilde;":"&#213;","&Ouml;":"&#214;","&times;":"&#215;","&Oslash;":"&#216;","&Ugrave;":"&#217;","&Uacute;":"&#218;","&Ucirc;":"&#219;","&Uuml;":"&#220;","&Yacute;":"&#221;","&THORN;":"&#222;","&szlig;":"&#223;","&agrave;":"&#224;","&aacute;":"&#225;","&acirc;":"&#226;","&atilde;":"&#227;","&auml;":"&#228;","&aring;":"&#229;","&aelig;":"&#230;","&ccedil;":"&#231;","&egrave;":"&#232;","&eacute;":"&#233;","&ecirc;":"&#234;","&euml;":"&#235;","&igrave;":"&#236;","&iacute;":"&#237;","&icirc;":"&#238;","&iuml;":"&#239;","&eth;":"&#240;","&ntilde;":"&#241;","&ograve;":"&#242;","&oacute;":"&#243;","&ocirc;":"&#244;","&otilde;":"&#245;","&ouml;":"&#246;","&divide;":"&#247;","&oslash;":"&#248;","&ugrave;":"&#249;","&uacute;":"&#250;","&ucirc;":"&#251;","&uuml;":"&#252;","&yacute;":"&#253;","&thorn;":"&#254;","&yuml;":"&#255;","&OElig;":"&#338;","&oelig;":"&#339;","&Scaron;":"&#352;","&scaron;":"&#353;","&Yuml;":"&#376;","&fnof;":"&#402;","&circ;":"&#710;","&tilde;":"&#732;","&Alpha;":"&#913;","&Beta;":"&#914;","&Gamma;":"&#915;","&Delta;":"&#916;","&Epsilon;":"&#917;","&Zeta;":"&#918;","&Eta;":"&#919;","&Theta;":"&#920;","&Iota;":"&#921;","&Kappa;":"&#922;","&Lambda;":"&#923;","&Mu;":"&#924;","&Nu;":"&#925;","&Xi;":"&#926;","&Omicron;":"&#927;","&Pi;":"&#928;","&Rho;":"&#929;","&Sigma;":"&#931;","&Tau;":"&#932;","&Upsilon;":"&#933;","&Phi;":"&#934;","&Chi;":"&#935;","&Psi;":"&#936;","&Omega;":"&#937;","&alpha;":"&#945;","&beta;":"&#946;","&gamma;":"&#947;","&delta;":"&#948;","&epsilon;":"&#949;","&zeta;":"&#950;","&eta;":"&#951;","&theta;":"&#952;","&iota;":"&#953;","&kappa;":"&#954;","&lambda;":"&#955;","&mu;":"&#956;","&nu;":"&#957;","&xi;":"&#958;","&omicron;":"&#959;","&pi;":"&#960;","&rho;":"&#961;","&sigmaf;":"&#962;","&sigma;":"&#963;","&tau;":"&#964;","&upsilon;":"&#965;","&phi;":"&#966;","&chi;":"&#967;","&psi;":"&#968;","&omega;":"&#969;","&thetasym;":"&#977;","&upsih;":"&#978;","&piv;":"&#982;","&ensp;":"&#8194;","&emsp;":"&#8195;","&thinsp;":"&#8201;","&zwnj;":"&#8204;","&zwj;":"&#8205;","&lrm;":"&#8206;","&rlm;":"&#8207;","&ndash;":"&#8211;","&mdash;":"&#8212;","&lsquo;":"&#8216;","&rsquo;":"&#8217;","&sbquo;":"&#8218;","&ldquo;":"&#8220;","&rdquo;":"&#8221;","&bdquo;":"&#8222;","&dagger;":"&#8224;","&Dagger;":"&#8225;","&bull;":"&#8226;","&hellip;":"&#8230;","&permil;":"&#8240;","&prime;":"&#8242;","&Prime;":"&#8243;","&lsaquo;":"&#8249;","&rsaquo;":"&#8250;","&oline;":"&#8254;","&frasl;":"&#8260;","&euro;":"&#8364;","&image;":"&#8465;","&weierp;":"&#8472;","&real;":"&#8476;","&trade;":"&#8482;","&alefsym;":"&#8501;","&larr;":"&#8592;","&uarr;":"&#8593;","&rarr;":"&#8594;","&darr;":"&#8595;","&harr;":"&#8596;","&crarr;":"&#8629;","&lArr;":"&#8656;","&uArr;":"&#8657;","&rArr;":"&#8658;","&dArr;":"&#8659;","&hArr;":"&#8660;","&forall;":"&#8704;","&part;":"&#8706;","&exist;":"&#8707;","&empty;":"&#8709;","&nabla;":"&#8711;","&isin;":"&#8712;","&notin;":"&#8713;","&ni;":"&#8715;","&prod;":"&#8719;","&sum;":"&#8721;","&minus;":"&#8722;","&lowast;":"&#8727;","&radic;":"&#8730;","&prop;":"&#8733;","&infin;":"&#8734;","&ang;":"&#8736;","&and;":"&#8743;","&or;":"&#8744;","&cap;":"&#8745;","&cup;":"&#8746;","&int;":"&#8747;","&there4;":"&#8756;","&sim;":"&#8764;","&cong;":"&#8773;","&asymp;":"&#8776;","&ne;":"&#8800;","&equiv;":"&#8801;","&le;":"&#8804;","&ge;":"&#8805;","&sub;":"&#8834;","&sup;":"&#8835;","&nsub;":"&#8836;","&sube;":"&#8838;","&supe;":"&#8839;","&oplus;":"&#8853;","&otimes;":"&#8855;","&perp;":"&#8869;","&sdot;":"&#8901;","&lceil;":"&#8968;","&rceil;":"&#8969;","&lfloor;":"&#8970;","&rfloor;":"&#8971;","&lang;":"&#9001;","&rang;":"&#9002;","&loz;":"&#9674;","&spades;":"&#9824;","&clubs;":"&#9827;","&hearts;":"&#9829;","&diams;":"&#9830;"};this.block_tags=["a","abbr","acronym","address","area","b","base","bdo","big","blockquote","body","button","caption","cite","code","colgroup","dd","del","div","dfn","dl","dt","em","fieldset","form","head","h1","h2","h3","h4","h5","h6","html","i","iframe","ins","kbd","label","legend","li","map","noscript","object","ol","optgroup","option","p","param","pre","q","samp","script","select","small","span","strong","style","sub","sup","table","tbody","td","textarea","tfoot","th","thead","title","tr","tt","ul","var","extends"];this.inline_tags=["br","col","hr","img","input"];return this};WYMeditor.XhtmlSaxListener.prototype.shouldCloseTagAutomatically=function(tag,now_on_tag,closing){closing=closing||false;if(tag=="td"){if(closing&&now_on_tag=="tr"||!closing&&now_on_tag=="td"){return true}}else if(tag=="option"){if(closing&&now_on_tag=="select"||!closing&&now_on_tag=="option"){return true}}return false};WYMeditor.XhtmlSaxListener.prototype.beforeParsing=function(raw){this.output="";this._insert_before_closing=[];this._insert_after_closing=[];this._open_tags={};this._tag_stack=[];this._last_node_was_text=false;this._lastTagRemoved=false;this.last_tag=null;return raw};WYMeditor.XhtmlSaxListener.prototype.afterParsing=function(xhtml){xhtml=this.replaceNamedEntities(xhtml);xhtml=this.joinRepeatedEntities(xhtml);xhtml=this.removeEmptyTags(xhtml);xhtml=this.removeBrInPre(xhtml);return xhtml};WYMeditor.XhtmlSaxListener.prototype.replaceNamedEntities=function(xhtml){for(var entity in this.entities){xhtml=xhtml.replace(new RegExp(entity,"g"),this.entities[entity])}return xhtml};WYMeditor.XhtmlSaxListener.prototype.joinRepeatedEntities=function(xhtml){var tags="em|strong|sub|sup|acronym|pre|del|address";return xhtml.replace(new RegExp("</("+tags+")><\\1>",""),"").replace(new RegExp("(s*<("+tags+")>s*){2}(.*)(s*</\\2>s*){2}",""),"<$2>$3<$2>")};WYMeditor.XhtmlSaxListener.prototype.removeEmptyTags=function(xhtml){return xhtml.replace(new RegExp("<("+this.block_tags.join("|").replace(/\|td/,"").replace(/\|th/,"")+")>(<br />|&#160;|&nbsp;|\\s)*</\\1>","g"),"")};WYMeditor.XhtmlSaxListener.prototype.removeBrInPre=function(xhtml){var matches=xhtml.match(new RegExp("<pre[^>]*>(.*?)</pre>","gmi"));if(matches){for(var i=0;i<matches.length;i++){xhtml=xhtml.replace(matches[i],matches[i].replace(new RegExp("<br />","g"),String.fromCharCode(13,10)))}}return xhtml};WYMeditor.XhtmlSaxListener.prototype.getResult=function(){return this.output};WYMeditor.XhtmlSaxListener.prototype.getTagReplacements=function(){return{b:"strong",i:"em"}};WYMeditor.XhtmlSaxListener.prototype.getTagForStyle=function(style){if(/sub/.test(style)){return"sub"}else if(/super/.test(style)){return"sup"}else if(/bold/.test(style)){return"strong"}else if(/italic/.test(style)){return"em"}return false};WYMeditor.XhtmlSaxListener.prototype.addContent=function(text){if(this.last_tag&&this.last_tag=="li"){text=text.replace(/(\r|\n|\r\n)+$/g,"");text=text.replace(/(\r|\n|\r\n)+/g," ")}if(text.replace(/^\s+|\s+$/g,"").length>0){this._last_node_was_text=true}if(!this._insideTagToRemove){this.output+=text}};WYMeditor.XhtmlSaxListener.prototype.addComment=function(text){if(this.remove_comments||this._insideTagToRemove){return}this.output+=text};WYMeditor.XhtmlSaxListener.prototype.addScript=function(text){if(this.remove_scripts||this._insideTagToRemove){return}this.output+=text};WYMeditor.XhtmlSaxListener.prototype.addCss=function(text){if(this.remove_embeded_styles||this._insideTagToRemove){return}this.output+=text};WYMeditor.XhtmlSaxListener.prototype.openBlockTag=function(tag,attributes){this._last_node_was_text=false;if(this._insideTagToRemove){return}if(this._shouldRemoveTag(tag,attributes)){this._insideTagToRemove=true;this._removedTagStackIndex=this._tag_stack.length-1;return}attributes=this.validator.getValidTagAttributes(tag,attributes);attributes=this.removeUnwantedClasses(attributes);if(tag==="span"&&attributes.style){var new_tag=this.getTagForStyle(attributes.style);if(new_tag){tag=new_tag;this._tag_stack.pop();this._tag_stack.push(tag);attributes.style=""}}this.output+=this.helper.tag(tag,attributes,true);this._lastTagRemoved=false};WYMeditor.XhtmlSaxListener.prototype.inlineTag=function(tag,attributes){this._last_node_was_text=false;if(this._insideTagToRemove||this._shouldRemoveTag(tag,attributes)){return}attributes=this.validator.getValidTagAttributes(tag,attributes);attributes=this.removeUnwantedClasses(attributes);this.output+=this.helper.tag(tag,attributes);this._lastTagRemoved=false};WYMeditor.XhtmlSaxListener.prototype.openUnknownTag=function(tag,attributes){};WYMeditor.XhtmlSaxListener.prototype.closeBlockTag=function(tag){this._last_node_was_text=false;if(this._insideTagToRemove){if(this._tag_stack.length===this._removedTagStackIndex){this._insideTagToRemove=false}this._lastTagRemoved=true;return}this.output=this.output.replace(/<br \/>$/,"")+this._getClosingTagContent("before",tag)+"</"+tag+">"+this._getClosingTagContent("after",tag)};WYMeditor.XhtmlSaxListener.prototype.closeUnknownTag=function(tag){};WYMeditor.XhtmlSaxListener.prototype.closeUnopenedTag=function(tag){this._last_node_was_text=false;if(this._insideTagToRemove){return}if(tag==="li"&&this._extraLIClosingTags){this._extraLIClosingTags--}else{this.output+="</"+tag+">"}};WYMeditor.XhtmlSaxListener.prototype.avoidStylingTagsAndAttributes=function(){this.avoided_tags=["div","span"];this.validator.skiped_attributes=["style"];this.validator.skiped_attribute_values=["MsoNormal","main1"];this._avoiding_tags_implicitly=true};WYMeditor.XhtmlSaxListener.prototype.allowStylingTagsAndAttributes=function(){this.avoided_tags=[];this.validator.skiped_attributes=[];this.validator.skiped_attribute_values=[];this._avoiding_tags_implicitly=false};WYMeditor.XhtmlSaxListener.prototype.isBlockTag=function(tag){return!WYMeditor.Helper.contains(this.avoided_tags,tag)&&WYMeditor.Helper.contains(this.block_tags,tag)};WYMeditor.XhtmlSaxListener.prototype.isInlineTag=function(tag){return!WYMeditor.Helper.contains(this.avoided_tags,tag)&&WYMeditor.Helper.contains(this.inline_tags,tag)};WYMeditor.XhtmlSaxListener.prototype.insertContentAfterClosingTag=function(tag,content){this._insertContentWhenClosingTag("after",tag,content)};WYMeditor.XhtmlSaxListener.prototype.insertContentBeforeClosingTag=function(tag,content){this._insertContentWhenClosingTag("before",tag,content)};WYMeditor.XhtmlSaxListener.prototype.removeUnwantedClasses=function(attributes){var pattern,i;if(!attributes["class"]){return attributes}for(i=0;i<WYMeditor.CLASSES_REMOVED_BY_PARSER.length;++i){pattern=new RegExp("(^|\\s)"+WYMeditor.CLASSES_REMOVED_BY_PARSER[i]+"($|\\s)","gi");attributes["class"]=attributes["class"].replace(pattern,"$1")}attributes["class"]=attributes["class"].replace(/\s$/,"");return attributes};WYMeditor.XhtmlSaxListener.prototype.fixNestingBeforeOpeningBlockTag=function(tag,attributes){if(!this._last_node_was_text&&(tag=="ul"||tag=="ol")&&this.last_tag&&!this.last_tag_opened&&this.last_tag=="li"){if(this._lastTagRemoved){this._insideTagToRemove=true;this._removedTagStackIndex=this._tag_stack.length-1}else if(!this._shouldRemoveTag(tag,attributes)){this.output=this.output.replace(/<\/li>\s*$/,"");this.insertContentAfterClosingTag(tag,"</li>")}}else if((tag=="ul"||tag=="ol")&&this.last_tag&&this.last_tag_opened&&(this.last_tag=="ul"||this.last_tag=="ol")){if(!this._shouldRemoveTag(tag,attributes)){this.output+=this.helper.tag("li",{},true);this.insertContentAfterClosingTag(tag,"</li>")}this._last_node_was_text=false}else if(tag=="li"){if(this._tag_stack.length>=2){var closestOpenTag=this._tag_stack[this._tag_stack.length-2];if(closestOpenTag=="li"&&!this._shouldRemoveTag(tag,attributes)){this._open_tags.li-=1;if(this._open_tags.li===0){this._open_tags.li=undefined}this._tag_stack.splice(this._tag_stack.length-2,1);this._last_node_was_text=false;if(!this._insideTagToRemove){this.output+="</li>"}else if(this._tag_stack.length-1===this._removedTagStackIndex){this._insideTagToRemove=false;this._lastTagRemoved=true;this._extraLIClosingTags++}}}}};WYMeditor.XhtmlSaxListener.prototype._insertContentWhenClosingTag=function(position,tag,content){if(!this["_insert_"+position+"_closing"]){this["_insert_"+position+"_closing"]=[]}if(!this["_insert_"+position+"_closing"][tag]){this["_insert_"+position+"_closing"][tag]=[]}this["_insert_"+position+"_closing"][tag].push(content)};WYMeditor.XhtmlSaxListener.prototype._getClosingTagContent=function(position,tag){if(this["_insert_"+position+"_closing"]&&this["_insert_"+position+"_closing"][tag]&&this["_insert_"+position+"_closing"][tag].length>0){return this["_insert_"+position+"_closing"][tag].pop()}return""};WYMeditor.XhtmlSaxListener.prototype._shouldRemoveTag=function(tag,attributes){var classes;if(!attributes["class"]){return false}classes=attributes["class"].split(" ");if(jQuery.inArray(WYMeditor.EDITOR_ONLY_CLASS,classes)>-1){return true}return false};WYMeditor.WymCssLexer=function(parser,only_wym_blocks){only_wym_blocks=typeof only_wym_blocks=="undefined"?true:only_wym_blocks;jQuery.extend(this,new WYMeditor.Lexer(parser,only_wym_blocks?"Ignore":"WymCss"));this.mapHandler("WymCss","Ignore");if(only_wym_blocks===true){this.addEntryPattern("/\\*[<\\s]*WYMeditor[>\\s]*\\*/","Ignore","WymCss");this.addExitPattern("/\\*[</\\s]*WYMeditor[>\\s]*\\*/","WymCss")}this.addSpecialPattern("[\\sa-z1-6]*\\.[a-z-_0-9]+","WymCss","WymCssStyleDeclaration");this.addEntryPattern("/\\*","WymCss","WymCssComment");this.addExitPattern("\\*/","WymCssComment");this.addEntryPattern("{","WymCss","WymCssStyle");this.addExitPattern("}","WymCssStyle");this.addEntryPattern("/\\*","WymCssStyle","WymCssFeedbackStyle");this.addExitPattern("\\*/","WymCssFeedbackStyle");return this};WYMeditor.WymCssParser=function(){this._in_style=false;this._has_title=false;this.only_wym_blocks=true;this.css_settings={classesItems:[],editorStyles:[],dialogStyles:[]};return this};WYMeditor.WymCssParser.prototype.parse=function(raw,only_wym_blocks){only_wym_blocks=typeof only_wym_blocks=="undefined"?this.only_wym_blocks:only_wym_blocks;this._Lexer=new WYMeditor.WymCssLexer(this,only_wym_blocks);this._Lexer.parse(raw)};WYMeditor.WymCssParser.prototype.Ignore=function(match,state){return true};WYMeditor.WymCssParser.prototype.WymCssComment=function(text,status){if(text.match(/end[a-z0-9\s]*wym[a-z0-9\s]*/im)){return false}if(status==WYMeditor.LEXER_UNMATCHED){if(!this._in_style){this._has_title=true;this._current_item={title:WYMeditor.Helper.trim(text)}}else{if(this._current_item[this._current_element]){if(!this._current_item[this._current_element].expressions){this._current_item[this._current_element].expressions=[text]}else{this._current_item[this._current_element].expressions.push(text)}}}this._in_style=true}return true};WYMeditor.WymCssParser.prototype.WymCssStyle=function(match,status){if(status==WYMeditor.LEXER_UNMATCHED){match=WYMeditor.Helper.trim(match);if(match!==""){this._current_item[this._current_element].style=match}}else if(status==WYMeditor.LEXER_EXIT){this._in_style=false;this._has_title=false;this.addStyleSetting(this._current_item)}return true};WYMeditor.WymCssParser.prototype.WymCssFeedbackStyle=function(match,status){if(status==WYMeditor.LEXER_UNMATCHED){this._current_item[this._current_element].feedback_style=match.replace(/^([\s\/\*]*)|([\s\/\*]*)$/gm,"")}return true};WYMeditor.WymCssParser.prototype.WymCssStyleDeclaration=function(match){match=match.replace(/^([\s\.]*)|([\s\.*]*)$/gm,"");var tag="";if(match.indexOf(".")>0){var parts=match.split(".");this._current_element=parts[1];tag=parts[0]}else{this._current_element=match}if(!this._has_title){this._current_item={title:(!tag?"":tag.toUpperCase()+": ")+this._current_element};this._has_title=true}if(!this._current_item[this._current_element]){this._current_item[this._current_element]={name:this._current_element}}if(tag){if(!this._current_item[this._current_element].tags){this._current_item[this._current_element].tags=[tag]}else{this._current_item[this._current_element].tags.push(tag)}}return true};WYMeditor.WymCssParser.prototype.addStyleSetting=function(style_details){for(var name in style_details){var details=style_details[name];if(typeof details=="object"&&name!="title"){this.css_settings.classesItems.push({name:WYMeditor.Helper.trim(details.name),title:style_details.title,expr:WYMeditor.Helper.trim((details.expressions||details.tags).join(", "))});if(details.feedback_style){this.css_settings.editorStyles.push({name:"."+WYMeditor.Helper.trim(details.name),css:details.feedback_style})}if(details.style){this.css_settings.dialogStyles.push({name:"."+WYMeditor.Helper.trim(details.name),css:details.style})}}}};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//




;
