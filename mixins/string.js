// ==========================================================================
// SproutCore -- JavaScript Application Framework
// Copyright ©2006-2008, Sprout Systems, Inc. and contributors.
// Portions Copyright ©2008 Apple, Inc.  All rights reserved..
// ==========================================================================

// These are basic enhancements to the string class used throughout 
// SproutCore.
SC.STRING_TITLEIZE_REGEXP = (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g);

/**
  @namespace
  
  SproutCore implements a variety of enhancements to the built-in String 
  object that make it easy to perform common substitutions and conversions.
  
  Most of the utility methods defined here mirror those found in Prototype
  1.6.
  
  @since SproutCore 1.0
*/
SC.String = {
  
  // Interpolate string. looks for %@ or %@1; to control the order of params.
  /**
    Apply formatting options to the string.  This will look for occurrences
    of %@ in your string and substitute them with the arguments you pass into
    this method.  If you want to control the specific order of replacement, 
    you can add a number after the key as well to indicate which argument 
    you want to insert.  

    Ordered insertions are most useful when building loc strings where values
    you need to insert may appear in different orders.

    h3. Examples
    
    {{{
      "Hello %@ %@".fmt('John', 'Doe') => "Hello John Doe"
      "Hello %@2, %@1".fmt('John', 'Doe') => "Hello Doe, John"
    }}}
    
    @param args {Object...} optional arguments
    @returns {String} formatted string
  */
  fmt: function() {
    // first, replace any ORDERED replacements.
    var args = arguments;
    var idx  = 0; // the current index for non-numerical replacements
    return this.replace(/%@([0-9]+)?/g, function(s, argIndex) {
      argIndex = (argIndex) ? parseInt(argIndex,0)-1 : idx++ ;
      s =args[argIndex];
      return ((s===null) ? '(null)' : (s==undefined) ? '' : s).toString(); 
    }) ;
  },

  /**
    Localizes the string.  This will look up the reciever string as a key 
    in the current Strings hash.  If the key matches, the loc'd value will be
    used.  The resulting string will also be passed through fmt() to insert
    any variables.
    
    @param args {Object...} optional arguments to interpolate also
    @returns {String} the localized and formatted string.
  */
  loc: function() {
    // NB: This could be implemented as a wrapper to locWithDefault() but
    // it would add some overhead to deal with the arguments and adds stack
    // frames, so we are keeping the implementation separate.
    var str = SC.Locale.currentLocale.locWithDefault(this) || this;
    return str.fmt.apply(str,arguments) ;
  },

  /**
    Works just like loc() except that it will return the passed default 
    string if a matching key is not found.
    
    @param {String} def the default to return
    @param {Object...} args optional formatting arguments
    @returns {String} localized and formatted string
  */
  locWithDefault: function(def) {
    var str = SC.Locale.currentLocale.locWithDefault(def) || this;
    var args = SC.$A(arguments); args.shift(); // remove def param
    return str.fmt.apply(str,args) ;
  },
  
  /** 
    Capitalizes a string.

    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | My favorite items |
    | css-class-name | Css-class-name |
    | action_name | Action_name |
    | innerHTML | InnerHTML |

    @return {String} capitalized string
  */
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.slice(1) ;
  },
  
  /**
    Capitalizes every word in a string.  Unlike titleize, spaces or dashes 
    will remain in-tact.
    
    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | My Favorite Items |
    | css-class-name | Css-Class-Name |
    | action_name | Action_Name |
    | innerHTML | InnerHTML |

    @returns {String} capitalized string
  */
  capitalizeEach: function() {
    return this.replace(SC.STRING_TITLEIZE_REGEXP, 
      function(str,sep,character) { 
        return (character) ? (sep + character.toUpperCase()) : sep;
      }).capitalize() ;
  },

  /**
    Converts a string to a title.  This will decamelize the string, convert
    separators to spaces and capitalize every word.

    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | My Favorite Items |
    | css-class-name | Css Class Name |
    | action_name | Action Name |
    | innerHTML | Inner HTML |

    @return {String} titleized string.
  */
  titleize: function() {
    var ret = this.replace(/([a-z])([A-Z])/g,'$1_$2'); // decamelize
    return ret.replace(SC.STRING_TITLEIZE_REGEXP, 
      function(str,separater,character) { 
        return (character) ? (' ' + character.toUpperCase()) : ' ';
      }).capitalize() ;
  },
  
  /**
    Camelizes a string.  This will take any words separated by spaces, dashes
    or underscores and convert them into camelCase.
    
    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | myFavoriteItems |
    | css-class-name | cssClassName |
    | action_name | actionName |
    | innerHTML | innerHTML |

    @returns {String} camelized string
  */
  camelize: function() {
    var ret = this.replace(SC.STRING_TITLEIZE_REGEXP, 
      function(str,separater,character) { 
        return (character) ? character.toUpperCase() : '' ;
      }) ;
    var first = ret.charAt(0), lower = first.toLowerCase() ;
    return (first !== lower) ? (lower + ret.slice(1)) : ret ;
  },

  
  /**
    Converts the string into a class name.  This method will camelize your 
    string and then capitalize the first letter.
    
    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | MyFavoriteItems |
    | css-class-name | CssClassName |
    | action_name | ActionName |
    | innerHTML | InnerHtml |

    @returns {String}
  */
  classify: function() {
    var ret = this.replace(SC.STRING_TITLEIZE_REGEXP, 
      function(str,separater,character) { 
        return (character) ? character.toUpperCase() : '' ;
      }) ;
    var first = ret.charAt(0), upper = first.toUpperCase() ;
    return (first !== upper) ? (upper + ret.slice(1)) : ret ;
  },
  
  /**
    Converts a camelized string into all lower case separated by underscores.
    
    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | my favorite items |
    | css-class-name | css-class-name |
    | action_name | action_name |
    | innerHTML | inner_html |

    @returns {String} the decamelized string.
  */
  decamelize: function() { 
    return this.replace(/([a-z])([A-Z])/g,'$1_$2').toLowerCase();
  },

  /**
    Converts a camelized string or a string with spaces or underscores into
    a string with components separated by dashes.
    
    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | my-favorite-items |
    | css-class-name | css-class-name |
    | action_name | action-name |
    | innerHTML | inner-html |

    @returns {String} the dasherized string.
  */
  dasherize: function() {
    return this.decamelize().replace(/[ _]/g,'-') ;  
  },
  
  /**
    Converts a camelized string or a string with dashes or underscores into
    a string with components separated by spaces.
    
    h2. Examples
    
    | *Input String* | *Output String* |
    | my favorite items | my favorite items |
    | css-class-name | css class name |
    | action_name | action name |
    | innerHTML | inner html |

    @returns {String} the humanized string.
  */
  humanize: function() {
    return this.decamelize().replace(/[-_]/g,' ') ;
  },
  
  /**
    Removes any extra whitespace from the edges of the strings. This method is 
    also aliased as strip().
    
    @returns {String} the trimmed string
  */
  trim: function () {
    return this.replace(/^\s+|\s+$/g,"");
  },
  
  /** Splits the string into words, separated by spaces.  */
  w: function() { return this.split(' '); }
    
} ;

SC.String.strip = SC.String.trim; // convenience alias.

// Apply SC.String mixin to built-in String object
SC.mixin(String.prototype, SC.String) ;
