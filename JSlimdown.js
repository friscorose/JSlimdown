/*
 * JSlimdown - A very basic regex-based Markdown renderer.
 *
 * - Headers - Links - Bold - Emphasis - Deletions - Quotes
 * - Inline code - Blockquotes - Ordered/unordered lists - Horizontal rules
 *
 * Author: Frisco Rose
 * License: MIT
 *
 * JS code inspired by Johnny Broadway's Slimdown gist at
 * Website: https://gist.github.com/jbroadway/2836900
 */
let JSlimdown = {
    'rules': {
        //protect escaped underscores and asterisks
        '\\\\_'                              : '&lowbar;',
        '\\\\\\*'                            : '&ast;',

        //header: ^#... -> '<h1>...</h1>', ^##... -> '<h2>...</h2>', etc.
        '^(#+)(.*)$'                         : ( match, grep1, grep2 ) => {
                return '<h'+grep1.length+'>'+grep2+'</h'+grep1.length+'>'; },

        //links
        '\\[([^\\[]+)\\]\\(([^\\)]+)\\)'     : '<a href="$2">$1</a>',

        //bold: **words** or __words__ -> '<strong>words</strong>'
        '(\\*\\*|__)(.*?)\\1'                : '<strong>$2</strong>',

        // emphasis: *words* or _words_ -> ' <em>words</em>' NB, leading space
        ' (_|\\*)(.*?)\\1'                   : ' <em>$2</em>',

        //del
        '\\~\\~(.*?)\\~\\~'                  : '<del>$1</del>',

        //quote
        '\\:\\"(.*?)\\"\\:'                  : '<q>$1</q>',

        //inline code
        '`(.*?)`'                            : '<code>$1</code>',

        //ul list: * ... -> <ul><li>...</li></ul> (one or more lines)
        '^[^\\S\\r\\n]*\\*(\ .*)'            : ( match, grep1 ) => {
                return '<ul><li>'+grep1+'</li>\n</ul>'; },

        //1st nested ul list: - ... -> <ul><li>...</li></ul> (one or more lines)
        '^[^\\S\\r\\n]*-(\ .*)'              : ( match, grep1 ) => {
                return '<u_l><li>'+grep1+'</li>\n</u_l>'; },

        //ol list: 1. stuff -> <ol><li>stuff</li></ol> (one or more lines)
        '^[^\\S\\r\\n]*[0-9]+\.(\ .*)'       : ( match, grep1 ) => {
                return '<ol><li>'+grep1+'</li>\n</ol>'; },

        //blockquotes
        '^(>+)(.*)'                          : ( match, grep1, grep2 ) => {
                return '<blockquote>'+grep2+'</blockquote>'; },

        //horizontal rule
        '^-{5,}'                             : "<hr />",

        //paragraphs
        '((?:[^\n][\n]?)+)'                  : ( match, grep1 ) => {
                if( /^<.*/.test(grep1) ) return grep1+'\n';
                else return '<p>'+grep1+'</p>\n'; },
        //pullback closing para tag
        '\\s*<\/p>'                          : "</p>",

        //fix extraneous contiguos close-open tags
        '<\/(u_l|ul|ol)>\\s?<\\1>'           : '',
        '<\/(blockquote)>\\s?<\\1>'          : '\n',

        //repatch single nested ul tags
        '</ul>\n<u_l>'                       : "\n<ul>",
        '</u_l>\n<ul>'                       : "</ul>\n",
    },
    'render': function( content ){
        Object.entries( this['rules'] ).forEach( rule => {
            content = content.replace( RegExp( rule[0], 'gm' ), rule[1] );
        });
        return content;
    }
}
