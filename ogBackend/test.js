var natural = require("natural");
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

var ruleSet = new natural.RuleSet('EN');

var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
let sentence = "Hello, my name is Pragadeesh";
sentence = sentence.split(' ');
console.log(tagger.tag(sentence));